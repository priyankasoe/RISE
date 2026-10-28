import { decode } from 'asciify-engine/kit';

// Scrambling links (asciify components.md): the text rests as plain HTML and,
// when the pointer enters, flips through other alphabets and lands back on the
// word. hover: 'none' turns off the field's own trail so the site-wide cursor
// trail is the only pointer effect. Returns one handle per element; call
// destroy() on each when unmounting.
export function scrambleOnHover(elements, duration = 600) {
  return [...elements].map((el) =>
    decode(el, { scramble: true, trigger: 'manual', settle: 'text', duration, look: { cellSize: 3, hover: 'none' } }),
  );
}
