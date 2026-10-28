import { wordmark } from 'asciify-engine/kit';
import { EVENT } from '../data/event';
import Icon from './Icon';
import { useKit } from './useKit';

// The close of every page: RISE in characters, with its 3, as the one brand
// mark, and the essentials beside it. The word gathers out of scattered pieces
// as it scrolls into view, scatters as it leaves, and trails under the cursor.
const Footer = () => {
  const [markRef] = useKit((el) =>
    wordmark(el, {
      assemble: 'scroll',
      font: '"Space Mono", monospace',
      fontWeight: 700,
      artHeight: 360,
      ink: '--ascii-ink-strong',
      label: 'RISE',
      look: { cellSize: Math.min(7, Math.max(4, el.clientWidth / 150)) },
    }),
  );

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <p className="visually-hidden">RISE 3</p>
          {/* The kit sets a short word at a fixed size in the middle of a wide
              canvas; this frame crops the empty sides so the frame is the word. */}
          <div className="site-footer__frame">
            <p ref={markRef} className="site-footer__mark" aria-hidden="true">RISE</p>
          </div>
          <span className="site-footer__num" aria-hidden="true">3</span>
        </div>

        <div className="site-footer__info">
          <p className="site-footer__event">
            <time dateTime={EVENT.isoDate}>{EVENT.date}</time><br />
            {EVENT.venue}, {EVENT.university}<br />
            {EVENT.city}
          </p>
          <ul className="site-footer__links">
            <li><a className="icon-link" href={`mailto:${EVENT.email}`}><Icon name="envelope" />{EVENT.email}</a></li>
            <li><a className="icon-link" href={EVENT.instagram.url} target="_blank" rel="noreferrer"><Icon name="instagram" />Instagram {EVENT.instagram.handle}</a></li>
          </ul>
          <p className="site-footer__org">Organized by the {EVENT.organizer}.</p>
        </div>
      </div>

      <div className="container site-footer__base">
        <p>© {EVENT.year} {EVENT.name}</p>
      </div>
    </footer>
  );
};

export default Footer;
