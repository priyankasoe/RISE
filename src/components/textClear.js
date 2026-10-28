// A text-shaped clear map for a kit background (asciify-engine 4.32.2+): the
// field goes quiet only right behind each line of copy and keeps flowing
// round it, instead of stopping at one big rectangle round the whole block.
// Rects are re-measured only after scroll, resize or a font load.
const SELECTOR = 'h1, h2, p, dt, dd, .btn, [role="tab"]';

export function textClear(host, selector = SELECTOR) {
  let rects = [];
  let dirty = true;
  const range = document.createRange();

  const read = () => {
    if (!dirty) return rects;
    dirty = false;
    rects = [...host.querySelectorAll(selector)].flatMap((el) => {
      if (el.matches('.btn, [role="tab"]')) return [el.getBoundingClientRect()];
      range.selectNodeContents(el);
      return [...range.getClientRects()];
    });
    return rects;
  };

  const mark = () => { dirty = true; };
  addEventListener('scroll', mark, { passive: true, capture: true });
  const resize = new ResizeObserver(mark);
  resize.observe(document.body);
  document.fonts?.addEventListener('loadingdone', mark);

  return {
    read,
    destroy() {
      removeEventListener('scroll', mark, { capture: true });
      resize.disconnect();
      document.fonts?.removeEventListener('loadingdone', mark);
    },
  };
}
