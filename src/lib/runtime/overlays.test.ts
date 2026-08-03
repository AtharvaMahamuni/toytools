// @vitest-environment happy-dom
//
// The overlay triggers are the ONE piece of the search/help system that ships on every page, so
// they are asserted here rather than only in the browser e2e. attachOverlays wires document-level
// click and keydown listeners that lazy-import ../palette; the module is mocked so these tests
// prove the routing (which gesture opens which overlay, and which gestures are deliberately
// ignored) without pulling the real palette chunk in.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { openPaletteMock, openHelpMock } = vi.hoisted(() => ({
  openPaletteMock: vi.fn(),
  openHelpMock: vi.fn(),
}));

vi.mock('../palette', () => ({
  openPalette: openPaletteMock,
  openHelp: openHelpMock,
}));

import { attachOverlays } from './overlays';

// Listeners attach to document once; the dynamic import is cached after the first trigger.
attachOverlays();

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function key(init: KeyboardEventInit): KeyboardEvent {
  const e = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
  document.dispatchEvent(e);
  return e;
}

beforeEach(() => {
  document.body.innerHTML = '';
  openPaletteMock.mockClear();
  openHelpMock.mockClear();
});

afterEach(() => {
  // Nothing keeps focus between tests, but be explicit so isTyping() starts each test at <body>.
  (document.activeElement as HTMLElement | null)?.blur?.();
});

describe('attachOverlays — click routing', () => {
  it('opens the palette when a [data-palette-open] target is clicked', async () => {
    const btn = document.createElement('button');
    btn.setAttribute('data-palette-open', '');
    document.body.appendChild(btn);

    click(btn);

    await vi.waitFor(() => expect(openPaletteMock).toHaveBeenCalledTimes(1));
    expect(openHelpMock).not.toHaveBeenCalled();
  });

  it('routes a click on a descendant of the trigger via closest()', async () => {
    const btn = document.createElement('button');
    btn.setAttribute('data-palette-open', '');
    const icon = document.createElement('span');
    btn.appendChild(icon);
    document.body.appendChild(btn);

    click(icon);

    await vi.waitFor(() => expect(openPaletteMock).toHaveBeenCalledTimes(1));
  });

  it('opens the help sheet when a [data-shortcuts-open] target is clicked', async () => {
    const link = document.createElement('a');
    link.setAttribute('data-shortcuts-open', '');
    document.body.appendChild(link);

    click(link);

    await vi.waitFor(() => expect(openHelpMock).toHaveBeenCalledTimes(1));
    expect(openPaletteMock).not.toHaveBeenCalled();
  });

  it('ignores clicks on unrelated elements', async () => {
    const p = document.createElement('p');
    document.body.appendChild(p);

    click(p);

    await Promise.resolve();
    expect(openPaletteMock).not.toHaveBeenCalled();
    expect(openHelpMock).not.toHaveBeenCalled();
  });
});

describe('attachOverlays — keyboard routing', () => {
  it('opens the palette on Ctrl+K', async () => {
    key({ key: 'k', ctrlKey: true });
    await vi.waitFor(() => expect(openPaletteMock).toHaveBeenCalledTimes(1));
  });

  it('opens the palette on Cmd+K (case-insensitive key)', async () => {
    key({ key: 'K', metaKey: true });
    await vi.waitFor(() => expect(openPaletteMock).toHaveBeenCalledTimes(1));
  });

  it('opens the palette on Ctrl+K even while typing in a field', async () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    key({ key: 'k', ctrlKey: true });

    await vi.waitFor(() => expect(openPaletteMock).toHaveBeenCalledTimes(1));
  });

  it('opens the palette on "/" when not typing', async () => {
    key({ key: '/' });
    await vi.waitFor(() => expect(openPaletteMock).toHaveBeenCalledTimes(1));
  });

  it('opens the help sheet on "?" when not typing', async () => {
    key({ key: '?' });
    await vi.waitFor(() => expect(openHelpMock).toHaveBeenCalledTimes(1));
  });

  it('ignores "/" while typing in an input', async () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    key({ key: '/' });

    await Promise.resolve();
    expect(openPaletteMock).not.toHaveBeenCalled();
  });

  it('ignores "/" while a contenteditable is focused', async () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', 'true');
    document.body.appendChild(div);
    div.focus();

    key({ key: '/' });

    await Promise.resolve();
    expect(openPaletteMock).not.toHaveBeenCalled();
  });

  it('ignores a bare modifier chord that is not Ctrl/Cmd+K', () => {
    // metaKey set but key is not "k": the K branch is skipped, then the modifier guard returns.
    const e = key({ key: 'a', metaKey: true });
    expect(openPaletteMock).not.toHaveBeenCalled();
    expect(e.defaultPrevented).toBe(false);
  });

  it('ignores Ctrl+Shift+K (shift excludes the palette chord)', () => {
    key({ key: 'k', ctrlKey: true, shiftKey: true });
    expect(openPaletteMock).not.toHaveBeenCalled();
  });

  it('ignores an unrelated bare key', () => {
    key({ key: 'a' });
    expect(openPaletteMock).not.toHaveBeenCalled();
    expect(openHelpMock).not.toHaveBeenCalled();
  });
});
