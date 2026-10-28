import { useEffect } from 'react';

// First-viewport rule, measured: when a page opens, nothing should be cut in
// half by the bottom of the first screen. On pages with an `.opening`, find the
// item the fold cuts through; if it only overhangs a little, tighten the
// opening's own spacing so it fits; otherwise start that item (and anything on
// the same row) just below the fold. A heading with none of its content on
// screen counts as cut, so the first screen ends on a complete
// item. Nothing is hidden or clipped. Re-measured on resize and font load.
const ITEMS = 'h1, h2, h3, p, li, dt, dd, summary, .btn, figure, .arrow-link';
const MAX_TIGHTEN = 48; // px of spacing the opening may give up
const GAP = 12;         // breathing room left above the fold
const HEADING_ROOM = 60; // a heading needs this much of its content showing

// The element that moves as one piece: climb from the cut element until its
// parent is a list or a grid/flex group of several items.
function itemOf(el, root) {
  let item = el;
  while (item.parentElement && item.parentElement !== root) {
    const parent = item.parentElement;
    const display = getComputedStyle(parent).display;
    const groups = /^(UL|OL|DL)$/.test(parent.tagName) || ((display.includes('grid') || display.includes('flex')) && parent.children.length > 1);
    if (groups) break;
    item = parent;
  }
  return item;
}

export function useFoldFit(key) {
  useEffect(() => {
    const opening = document.querySelector('main .opening');
    if (!opening) return undefined;
    const main = opening.closest('main');
    let moved = [];
    let frame = 0;

    const reset = () => {
      moved.forEach((el) => el.style.removeProperty('margin-top'));
      moved = [];
      opening.style.removeProperty('--fold-tighten');
    };

    const findCut = (fold) => [...main.querySelectorAll(ITEMS)].find((el) => {
      if (el.closest('details:not([open])') && !el.matches('summary')) return false;
      const b = el.getBoundingClientRect();
      if (!b.height) return false;
      if (b.top < fold - 2 && b.bottom > fold + 2) return true;
      // a heading that fits but has none of its content under it on screen
      return /^H[1-3]$/.test(el.tagName) && b.top < fold && b.bottom + HEADING_ROOM > fold;
    });

    const fit = () => {
      reset();
      if (window.scrollY > 0) return; // only lay out the first screen at the top
      const fold = window.innerHeight;
      let cut = findCut(fold);
      if (!cut) return;
      // 1. A small overhang: tighten the opening's spacing so the item fits
      const overhang = cut.getBoundingClientRect().bottom - fold + GAP;
      if (cut.closest('.opening') && overhang <= MAX_TIGHTEN) {
        opening.style.setProperty('--fold-tighten', `${Math.ceil(overhang)}px`);
        cut = findCut(fold);
        if (!cut) return;
        opening.style.removeProperty('--fold-tighten');
      }
      // 2. Otherwise start the cut item (and its row) just below the fold
      const item = itemOf(cut, main);
      const top = item.getBoundingClientRect().top;
      // move the whole row: siblings that start on the same line
      const row = [...(item.parentElement?.children ?? [item])].filter(
        (el) => Math.abs(el.getBoundingClientRect().top - top) < 4,
      );
      const push = Math.ceil(fold - top + GAP);
      row.forEach((el) => {
        const current = parseFloat(getComputedStyle(el).marginTop) || 0;
        el.style.marginTop = `${current + push}px`;
        moved.push(el);
      });
    };

    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(fit); };
    document.fonts?.ready.then(schedule);
    schedule();
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
      reset();
    };
  }, [key]);
}
