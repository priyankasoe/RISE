import { useEffect } from 'react';
import { decode } from 'asciify-engine/kit';

// Decode headline, resolved into the real type without a cut.
// The kit's own settle: 'text' swaps the last character frame for the HTML
// text in a single frame. Here the decode runs with settle: 'glyphs' (the
// final character frame holds), the HTML text fades in exactly underneath it
// while that frame fades out, then the field is released. Both layers use the
// same font, size and line breaks, so nothing moves.
const RESOLVE_MS = 600;

export function useDecodeHeading(ref, duration = 800) {
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let handle = null;
    let cancelled = false;
    const timers = [];
    const finish = () => {
      el.classList.remove('is-decoding', 'is-resolving');
      handle?.destroy();
      handle = null;
    };

    // Hide the text until the field takes over, so it never flashes first.
    el.classList.add('is-decoding');
    // Measure only after the web fonts load: the field draws the heading where
    // the browser laid it out, in its own font.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      handle = decode(el, {
        duration,
        trigger: 'manual',
        settle: 'glyphs',
        replayOnHover: false,
        lazy: false,
        look: { hover: 'none' },
      });
      if (!handle.supported) { finish(); return; }
      handle.replay();
      timers.push(setTimeout(() => el.classList.add('is-resolving'), duration));
      timers.push(setTimeout(finish, duration + RESOLVE_MS));
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      finish();
    };
  }, [ref, duration]);
}
