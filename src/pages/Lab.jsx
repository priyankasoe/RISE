import { useEffect, useRef, useState } from 'react';
import { beam, buttonLoading, morphField, odometer, skeleton, statusOrb, swipeDeck, tabs } from 'asciify-engine/kit';
import { useKit } from '../components/useKit';
import './Lab.css';
import { EVENT } from '../data/event';
import { GALLERY } from '../data/photos';

// Developer-only component lab (/lab, not linked, noindex). It runs the Asciify
// patterns the public site has no real use for yet, so they can be checked and
// tuned. Every action here is simulated and labelled as such.

// Placeholder frames, drawn white on black, until real event photos exist.
const DRAWN = [
  (pen, w, h, now) => {
    // A turning wireframe cube
    const t = now / 1600;
    const s = Math.min(w, h) * 0.28;
    const pts = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z])));
    const p = pts.map(([x, y, z]) => {
      const x1 = x * Math.cos(t) - z * Math.sin(t);
      const z1 = x * Math.sin(t) + z * Math.cos(t);
      const y1 = y * Math.cos(t * 0.7) - z1 * Math.sin(t * 0.7);
      return [w / 2 + x1 * s, h / 2 + y1 * s];
    });
    pen.strokeStyle = '#fff';
    pen.lineWidth = Math.max(2, s / 18);
    pts.forEach((a, i) => pts.forEach((b, j) => {
      if (j > i && a.filter((v, k) => v !== b[k]).length === 1) {
        pen.beginPath(); pen.moveTo(...p[i]); pen.lineTo(...p[j]); pen.stroke();
      }
    }));
  },
  (pen, w, h) => {
    // Concentric rings
    const g = pen.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
    g.addColorStop(0, '#fff'); g.addColorStop(1, '#000');
    pen.fillStyle = g; pen.fillRect(0, 0, w, h);
  },
  (pen, w, h) => {
    // A bar graph
    for (let i = 0; i < 9; i++) {
      const bh = h * (0.2 + 0.7 * Math.abs(Math.sin(i * 1.7)));
      pen.fillStyle = `rgb(${120 + i * 15},${120 + i * 15},${120 + i * 15})`;
      pen.fillRect((w / 9) * i + 6, h - bh, w / 9 - 12, bh);
    }
  },
];

// Placeholder card images, drawn once into data URLs.
function placeholderCards() {
  return ['Card one', 'Card two', 'Card three', 'Card four'].map((label, i) => {
    const c = document.createElement('canvas');
    c.width = 480; c.height = 320;
    const pen = c.getContext('2d');
    const g = pen.createLinearGradient(0, 0, 480, 320);
    g.addColorStop(0, ['#0f1f38', '#16294a', '#0a1628', '#2a4a7a'][i]);
    g.addColorStop(1, ['#3cb4ff', '#7ccbff', '#2a4a7a', '#e8f0fc'][i]);
    pen.fillStyle = g; pen.fillRect(0, 0, 480, 320);
    pen.fillStyle = '#fff'; pen.font = '600 40px sans-serif'; pen.fillText(label, 32, 280);
    return { src: c.toDataURL('image/png'), alt: `Placeholder: ${label}` };
  });
}

const TAB_DEMO = ['Live demos', 'Booths', 'Talks', 'Workshops', 'Challenges'];

const Lab = () => {
  // Character tabs with an odometer figure (moved here from the home page)
  const tabsRef = useRef(null);
  const figureRef = useRef(null);
  const [tabIndex, setTabIndex] = useState(0);
  useEffect(() => {
    const figure = odometer(figureRef.current, { value: 1, format: (n) => String(n).padStart(2, '0') });
    const t = tabs(tabsRef.current, { panels: 'none', duration: 280, onChange: (i) => { figure.set(i + 1); setTabIndex(i); } });
    return () => { t.destroy(); figure.destroy(); };
  }, []);

  // Morphing hero: real photos when there are three or more, else drawn frames.
  const frames = GALLERY.length >= 3 ? GALLERY.map((p) => p.src) : DRAWN;
  const [frame, setFrame] = useState(1);
  const [morphRef, morph] = useKit((el) =>
    morphField(el, { sources: frames, ink: '#ffffff', hold: 3200, transition: 1000, onChange: (i) => setFrame(i + 1) }),
  );

  // Swipe cards
  const [cards] = useState(() => (GALLERY.length >= 2 ? GALLERY.map((p) => ({ src: p.src, alt: p.alt })) : placeholderCards()));
  const [lastSwipe, setLastSwipe] = useState('None yet');
  const [deckRef, deck] = useKit((el) =>
    swipeDeck(el, { threshold: 0.4, outset: 32, onSwipe: (dir, i) => setLastSwipe(`${dir > 0 ? 'Saved' : 'Passed'} card ${i + 1}`) }),
  );

  // Skeleton: resolves when a real request (the site's favicon) finishes.
  const skeletonRef = useRef(null);
  const [skeletonState, setSkeletonState] = useState('Loading');
  const loadSkeleton = async (s) => {
    setSkeletonState('Loading');
    try { await fetch(`/favicon.svg?lab=${Date.now()}`); } catch { /* resolves anyway */ }
    await s.resolve();
    setSkeletonState('Loaded');
  };
  const skel = useRef(null);
  useEffect(() => {
    const s = skeleton(skeletonRef.current, { shimmer: 1600, stagger: 60 });
    skel.current = s;
    loadSkeleton(s);
    return () => { skel.current = null; s.destroy(); };
  }, []);

  // Simulated deploy: status orb, button loading and border beam together.
  const statusRef = useRef(null);
  const [orbRef, orb] = useKit((el) => statusOrb(el, { ring: true, colourByState: true }));
  const [deployRef, deployButton] = useKit((el) => buttonLoading(el, { announce: statusRef.current }));
  const [cardRef, card] = useKit((el) => beam(el, { palette: ['#3cb4ff', '#7ccbff', '#eaf1fc', '#3cb4ff'], mode: 'progress' }));
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const simulate = (outcome) => {
    timers.current.forEach(clearTimeout);
    deployButton.current?.start('Deploying');
    orb.current?.loading();
    [0.2, 0.45, 0.7, 0.9].forEach((p, i) => timers.current.push(setTimeout(() => card.current?.progress(p), 300 * (i + 1))));
    timers.current.push(setTimeout(() => {
      if (outcome === 'error') {
        deployButton.current?.fail('Retry'); orb.current?.error(); card.current?.error();
      } else {
        deployButton.current?.succeed('Deployed');
        if (outcome === 'warning') orb.current?.warning(); else orb.current?.success();
        card.current?.success();
      }
    }, 1500));
  };

  return (
    <>
      <title>{`Component lab · RISE ${EVENT.year}`}</title>
      <meta name="robots" content="noindex" />

      <section className="section">
        <div className="container">
          <h1>Component lab</h1>
          <p className="lead">
            Developer-only. Asciify patterns the public site doesn't use yet. Every action on
            this page is simulated, and the images are placeholders until real event photos are
            added to <code>src/data/photos.js</code>.
          </p>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="lab-tabs">
        <div className="container">
          <h2 id="lab-tabs">Character tabs</h2>
          <div ref={tabsRef} className="char-tabs char-tabs--row" role="tablist" aria-label="Tab demo">
            <span className="char-tabs__thumb" aria-hidden="true" />
            {TAB_DEMO.map((label, i) => (
              <button key={label} type="button" role="tab" aria-selected={i === 0}>{label}</button>
            ))}
          </div>
          <p className="lab-figure"><span ref={figureRef}>01</span> {TAB_DEMO[tabIndex]}</p>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="lab-morph">
        <div className="container">
          <h2 id="lab-morph">Morphing hero</h2>
          <div ref={morphRef} className="lab-stage lab-stage--morph">
            <p className="lab-stage__counter">{frame}/{frames.length}</p>
          </div>
          <div className="actions lab-actions">
            <button type="button" className="btn btn-outline" onClick={() => morph.current?.next()}>
              <span className="btn__label">Next frame</span>
            </button>
          </div>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="lab-swipe">
        <div className="container">
          <h2 id="lab-swipe">Swipe cards</h2>
          <div className="lab-stage lab-stage--deck">
            <div ref={deckRef} className="lab-deck">
              {cards.map((c) => (
                <div key={c.src} data-card className="lab-deck__card"><img src={c.src} alt={c.alt} /></div>
              ))}
            </div>
          </div>
          <div className="actions lab-actions">
            <button type="button" className="btn btn-outline" onClick={() => deck.current?.next(-1)}>
              <span className="btn__label">Pass</span>
            </button>
            <button type="button" className="btn btn-primary" onClick={() => deck.current?.next(1)}>
              <span className="btn__label">Save</span>
            </button>
            <p className="meta" aria-live="polite">Last: {lastSwipe}</p>
          </div>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="lab-skeleton">
        <div className="container">
          <h2 id="lab-skeleton">Skeleton loader</h2>
          <article ref={skeletonRef} className="lab-post">
            <img data-block="photo" src="/favicon.svg" alt="The RISE favicon" width="96" height="96" />
            <div>
              <h3 data-block="text">A real request</h3>
              <p data-block="text">This card resolves when a request for the site's favicon finishes.</p>
            </div>
          </article>
          <div className="actions lab-actions">
            <button type="button" className="btn btn-outline" onClick={() => { skel.current?.reset(); loadSkeleton(skel.current); }}>
              <span className="btn__label">Reload</span>
            </button>
            <p className="meta" aria-live="polite">{skeletonState}</p>
          </div>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="lab-deploy">
        <div className="container">
          <h2 id="lab-deploy">Status orb, button loading and border beam</h2>
          <p className="muted">Simulated deploy. Nothing is deployed.</p>
          <div ref={cardRef} className="lab-deploy">
            <span ref={orbRef} className="lab-deploy__orb" />
            <div className="actions">
              <button ref={deployRef} type="button" className="btn btn-primary btn--mono" onClick={() => simulate('success')}>Deploy</button>
              <button type="button" className="btn btn-outline" onClick={() => simulate('warning')}>
                <span className="btn__label">Simulate warning</span>
              </button>
              <button type="button" className="btn btn-outline" onClick={() => simulate('error')}>
                <span className="btn__label">Simulate error</span>
              </button>
            </div>
            <p ref={statusRef} className="meta" aria-live="polite" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Lab;
