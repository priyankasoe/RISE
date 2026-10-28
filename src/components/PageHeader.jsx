import { useEffect, useRef } from 'react';
import { background } from 'asciify-engine/kit';
import { textClear } from './textClear';
import { useDecodeHeading } from './useDecodeHeading';

// Page opening: the title decodes in once. Pages that pass a preset get that
// Asciify field behind their header; with interactive set, the field answers
// the pointer itself (clicks, drops, lit veins) instead of the site-wide trail.
const PageHeader = ({ title, preset, interactive = false, children }) => {
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  useDecodeHeading(titleRef);

  useEffect(() => {
    const clear = preset ? textClear(headerRef.current) : null;
    const bg = preset
      ? background(headerRef.current, {
        preset,
        clear: clear.read,
        clearPadding: 6,
        clearSoftness: 28,
        cursor: interactive,
        // Interactive fields are the point of their header, so they draw in the
        // strong ink; the text-shaped clear keeps them off the copy.
        ink: interactive ? '--ascii-ink-strong' : '--ascii-ink',
        opacity: interactive ? 0.9 : 0.6,
      })
      : null;
    return () => {
      bg?.destroy();
      clear?.destroy();
    };
  }, [preset, interactive]);

  const classes = ['page-header', preset && 'page-header--field', interactive && 'page-header--interactive'].filter(Boolean).join(' ');

  return (
    <header ref={headerRef} className={classes}>
      <div className="container page-header__copy">
        <h1 ref={titleRef}>{title}</h1>
        {children && <div className="page-header__intro">{children}</div>}
      </div>
    </header>
  );
};

export default PageHeader;
