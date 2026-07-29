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
import { submitFeedback } from '@lib/feedback/submit';
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
  const preview = form.querySelector<HTMLElement>('[data-preview]');
  const honeypot = form.querySelector<HTMLInputElement>('[data-honeypot]');
  const captureRow = form.querySelector<HTMLElement>('[data-capture-row]');
  const captureToggle = form.querySelector<HTMLInputElement>('[data-capture-toggle]');
  const captureLabel = form.querySelector<HTMLElement>('[data-capture-label]');
  const submitButton = form.querySelector<HTMLButtonElement>('[data-submit]');

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

  async function onSubmit(event: SubmitEvent): Promise<void> {
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

    if (submitButton) submitButton.disabled = true;
    status.textContent = 'Sending…';
    status.className = 'feedback-status';

    const result = await submitFeedback(input, env, { honeypot: honeypot?.value });

    if (submitButton) submitButton.disabled = false;
    status.textContent = result.message;
    status.classList.add(
      result.outcome === 'invalid' || result.outcome === 'error' ? 'is-error' : 'is-done',
    );

    if (result.outcome === 'invalid') {
      showErrors(result.validation.errors);
      return;
    }

    clearErrors();

    // Preview mode is what local development and E2E runs get: the email is composed and
    // shown, and nothing leaves the browser.
    if (preview) {
      if (result.outcome === 'preview') {
        preview.textContent = `Subject: ${result.subject}\n\n${result.body}`;
        preview.classList.remove('is-hidden');
      } else {
        preview.classList.add('is-hidden');
      }
    }

    if (result.outcome === 'sent' || result.outcome === 'trapped') {
      const keep = currentType();
      form.reset();
      // A native reset restores the hidden input without going through the segmented
      // control's setter, so the pills would desync. Reassigning also keeps the person on
      // the type they just used, which is friendlier than snapping back to the default.
      if (typeInput) typeInput.value = keep;
      clearCapture();
      applyType();
    }
  }

  typeInput?.addEventListener('change', applyType);
  form.addEventListener('submit', event => {
    void onSubmit(event as SubmitEvent);
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
