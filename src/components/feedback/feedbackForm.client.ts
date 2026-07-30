// Browser behaviour for the feedback form.
//
// A bundled module rather than an inline script, so it imports the tested core in
// src/lib/feedback/ instead of reimplementing validation and email composition in untyped
// inline JavaScript. (The is:inline rule applies to tool widgets; page components on this
// project use a real module, the same way SmartInput does.)
//
// Everything here is DOM glue. Every decision it makes lives in the pure modules.

import {
  DEFAULT_FEEDBACK_TYPE,
  FEEDBACK_TYPES,
  MAX_CAPTURED_INPUT,
  type FeedbackType,
} from '@lib/feedback/config';
import { FORM_FIELD_ORDER, type FeedbackInput } from '@lib/feedback/templates';
import { describeEnvironment } from '@lib/feedback/environment';
import { prepareFeedback } from '@lib/feedback/deliver';
import { APP_VERSION } from '@lib/version';
// Imported for its enhancement pass, not just its side effect: the segmented control has to
// be live before we prefill it from the URL, or assigning the value would not repaint the
// pills. Enhancement is idempotent, so calling it early is free.
import { initAll as enhanceSmartInputs } from '@components/inputs/smartInput.client';

const CAPTURE_KEY = 'toytools.feedback.capture';

/** Short aliases so a hand-written link can say `?type=new` instead of `?type=new-tool`. */
const TYPE_ALIASES: Record<string, FeedbackType> = {
  new: 'new-tool',
  idea: 'new-tool',
  improvement: 'improve',
  bug: 'bug',
  feedback: 'general',
};

function resolveType(raw: string | null): FeedbackType | null {
  if (!raw) return null;
  const value = raw.trim().toLowerCase();
  if (FEEDBACK_TYPES.some(type => type.id === value)) return value as FeedbackType;
  return TYPE_ALIASES[value] ?? null;
}

/** slug → [display name, may we offer to attach their input?] */
type ToolIndex = Record<string, [string, 0 | 1]>;

interface Capture {
  slug: string;
  value: string;
}

function readToolIndex(root: Document): ToolIndex {
  const el = root.querySelector('[data-feedback-tools]');
  if (!el?.textContent) return {};
  try {
    return JSON.parse(el.textContent) as ToolIndex;
  } catch {
    return {};
  }
}

/** The input the visitor had typed on the tool they came from, if they left one behind. */
function readCapture(): Capture | null {
  try {
    const raw = sessionStorage.getItem(CAPTURE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Capture>;
    if (typeof parsed?.slug !== 'string' || typeof parsed?.value !== 'string') return null;
    return { slug: parsed.slug, value: parsed.value.slice(0, MAX_CAPTURED_INPUT) };
  } catch {
    // Private browsing, or somebody else's JSON. Attaching input is a convenience.
    return null;
  }
}

function clearCapture(): void {
  try {
    sessionStorage.removeItem(CAPTURE_KEY);
  } catch {
    /* nothing to clean up */
  }
}

function list(el: HTMLElement, attribute: string): string[] {
  return (el.dataset[attribute] ?? '').split(' ').filter(Boolean);
}

export function initFeedbackForm(root: Document = document): void {
  const form = root.querySelector<HTMLFormElement>('[data-feedback-form]');
  if (!form) return;

  enhanceSmartInputs();

  const typeInput = root.querySelector<HTMLInputElement>('#feedback-f-type');
  const status = form.querySelector<HTMLElement>('[data-status]');
  const review = form.querySelector<HTMLElement>('[data-review]');
  const preview = form.querySelector<HTMLElement>('[data-preview]');
  const mailLink = form.querySelector<HTMLAnchorElement>('[data-mail-link]');
  const copyButton = form.querySelector<HTMLButtonElement>('[data-copy]');
  const addressSlot = form.querySelector<HTMLElement>('[data-address]');
  const captureRow = form.querySelector<HTMLElement>('[data-capture-row]');
  const captureToggle = form.querySelector<HTMLInputElement>('[data-capture-toggle]');
  const captureLabel = form.querySelector<HTMLElement>('[data-capture-label]');

  const wrappers = Array.from(form.querySelectorAll<HTMLElement>('[data-field]'));
  const control = (id: string) =>
    form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${id}"]`);

  const tools = readToolIndex(root);
  const capture = readCapture();

  const currentType = (): FeedbackType =>
    ((typeInput?.value || DEFAULT_FEEDBACK_TYPE) as FeedbackType);

  /** Show the questions this type asks, hide the rest, and move the optional markers. */
  function applyType(): void {
    const type = currentType();

    for (const wrapper of wrappers) {
      const shown = list(wrapper, 'shownFor').includes(type);
      // A class, never the hidden attribute: a display rule in the stylesheet would silently
      // override [hidden] and the field would come back.
      wrapper.classList.toggle('is-hidden', !shown);

      const required = list(wrapper, 'requiredFor').includes(type);
      wrapper.classList.toggle('is-required', required);

      const field = control(wrapper.dataset.field ?? '');
      if (field) field.required = shown && required;
    }

    // The reproduction opt-in is a bug-report affordance, and only when we actually have
    // something to attach from a tool that permits it.
    const eligible =
      type === 'bug' && !!capture && tools[capture.slug]?.[1] === 1;
    captureRow?.classList.toggle('is-hidden', !eligible);
    if (captureToggle && !eligible) captureToggle.checked = false;
    if (eligible && captureLabel && capture) {
      const name = tools[capture.slug]?.[0] ?? 'that tool';
      captureLabel.textContent = `Include what I typed into ${name}, so the problem can be reproduced`;
    }

    clearErrors();
  }

  function clearErrors(): void {
    for (const el of form.querySelectorAll<HTMLElement>('[data-error-for]')) {
      el.textContent = '';
    }
    for (const wrapper of wrappers) wrapper.classList.remove('has-error');
  }

  function showErrors(errors: Record<string, string>): void {
    clearErrors();
    let first: HTMLElement | null = null;
    for (const [id, message] of Object.entries(errors)) {
      const slot = form.querySelector<HTMLElement>(`[data-error-for="${id}"]`);
      if (slot) slot.textContent = message;
      const wrapper = wrappers.find(w => w.dataset.field === id);
      wrapper?.classList.add('has-error');
      if (!first) first = control(id) ?? wrapper ?? null;
    }
    first?.focus?.();
    first?.scrollIntoView?.({ block: 'center' });
  }

  function collect(): FeedbackInput {
    const values: Record<string, string> = {};
    for (const id of FORM_FIELD_ORDER) {
      values[id] = control(id)?.value ?? '';
    }
    const attach = captureToggle?.checked && !captureRow?.classList.contains('is-hidden');
    return {
      type: currentType(),
      values,
      capturedInput: attach && capture ? capture.value : undefined,
    };
  }

  /** Prefill from the link that brought them here. */
  function applyQuery(): void {
    const params = new URLSearchParams(window.location.search);

    const requested = resolveType(params.get('type'));
    if (requested && typeInput) {
      // The segmented control repaints its pills from its own value setter, so assigning
      // here is enough to move the selection.
      typeInput.value = requested;
    }

    const slug = params.get('tool');
    const toolField = control('tool');
    if (slug && toolField) {
      // Show the readable name, not the slug: it is what appears in the email subject, and
      // "Word Counter" is what they would have written themselves.
      toolField.value = tools[slug]?.[0] ?? slug;
    }

    // A search that found nothing is the clearest statement of an unmet need on the site,
    // so it arrives as the answer to "what are you trying to do?".
    const query = params.get('q');
    const goalField = control('goal');
    if (query && goalField && !goalField.value) {
      goalField.value = `I was looking for a tool to ${query}`;
    }
  }

  /** The full message text, held for the copy button after a successful compose. */
  let composedText = '';

  function onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (!status) return;

    const input = collect();
    const env = describeEnvironment({
      userAgent: navigator.userAgent,
      language: navigator.language,
      url: window.location.href,
      version: APP_VERSION,
      now: new Date(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const result = prepareFeedback(input, env);

    status.textContent = result.message;
    status.className = 'feedback-status';
    status.classList.add(result.outcome === 'invalid' ? 'is-error' : 'is-done');

    if (result.outcome === 'invalid') {
      showErrors(result.validation.errors);
      review?.classList.add('is-hidden');
      return;
    }

    clearErrors();

    // The message is shown as well as handed to the mail client, never instead of it. A mailto
    // link does nothing at all on a machine with no mail app configured, and it fails silently:
    // no error, no navigation, just a button that appears broken. The visible copy is what makes
    // that recoverable rather than a dead end.
    // The subject rides along in the copied text. Someone pasting into a blank email would
    // otherwise send a bare body, and the inbox filters key on the subject line.
    composedText = `Subject: ${result.composed.subject}\n\n${result.composed.body}`;
    if (preview) preview.textContent = composedText;
    if (mailLink) mailLink.href = result.composed.mailto;
    if (addressSlot) addressSlot.textContent = result.composed.address;
    if (copyButton) copyButton.textContent = 'Copy message';
    review?.classList.remove('is-hidden');

    // Now that it is folded into the message, drop the stashed input so a later visit to this
    // page cannot offer up something stale from a tool they have long since left.
    clearCapture();

    // Hand it to the mail client. Skipped under automation, where an unhandled mailto: would
    // either hang the run or bounce it out of the page; the link is still in the DOM for a test
    // to inspect, which is what tests/e2e/feedback.spec.ts asserts on.
    if (!navigator.webdriver) mailLink?.click();
  }

  async function onCopy(): Promise<void> {
    if (!composedText) return;
    try {
      await navigator.clipboard.writeText(composedText);
      if (copyButton) copyButton.textContent = 'Copied';
    } catch {
      // Clipboard access can be refused outright. Selecting the text is the fallback that
      // always works, and it is one keystroke from being copied.
      if (preview) {
        const range = document.createRange();
        range.selectNodeContents(preview);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      if (copyButton) copyButton.textContent = 'Select and copy';
    }
  }

  typeInput?.addEventListener('change', applyType);
  form.addEventListener('submit', event => {
    onSubmit(event as SubmitEvent);
  });
  copyButton?.addEventListener('click', () => {
    void onCopy();
  });

  applyQuery();
  applyType();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initFeedbackForm());
  } else {
    initFeedbackForm();
  }
}
