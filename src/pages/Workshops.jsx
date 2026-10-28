import { useEffect, useRef } from 'react';
import { morphField, shockwave } from 'asciify-engine/kit';
import PageHeader from '../components/PageHeader';
import SectionHead from '../components/SectionHead';
import { EVENT } from '../data/event';
import { TRACK_ART } from '../data/trackArt';

// Each track has its own drawing, rendered in characters by morphField:
// gears for mechanical work, traces for circuits, lines of code. Decorative.
const CHALLENGE_TRACKS = [
  { glyph: '[#]', name: 'Hardware', text: 'Mechanical and design problems.' },
  { glyph: '~/~', name: 'Electrical', text: 'Circuit debugging and reading schematics.' },
  { glyph: '>_', name: 'Software', text: 'Debugging and short programming tasks.' },
];

const Workshops = () => {
  const stripRef = useRef(null);

  useEffect(() => {
    const panels = [...stripRef.current.querySelectorAll('.tracks-strip__field')];
    const fields = panels.map((el, i) =>
      morphField(el, {
        sources: [TRACK_ART[i]],
        ink: '--accent',
        autoplay: false,
        fit: 'contain',
        look: { mark: 'glyph', cellSize: 8, hover: 'none' },
      }),
    );
    return () => fields.forEach((f) => f.destroy());
  }, []);

  return (
    <>
      <title>{`Workshops and challenges · RISE ${EVENT.year}`}</title>
      <div className="opening">
        <PageHeader title="Workshops and technical challenges" preset={shockwave} interactive>
          <p>Two ways to do more than watch: learn something hands-on, or test what you know.</p>
        </PageHeader>

        <section className="section">
          <div className="container split">
            <div>
              <SectionHead title="Workshops" tag="Being organized" />
              <p>
                We're organizing workshops with other Purdue clubs, held on {EVENT.day} and during
                the week of the event. Companies can sponsor a workshop and, if they'd like, run it
                themselves.
              </p>
            </div>
            <aside className="aside">
              <p className="meta">Status</p>
              <p>Topics and times will be posted once they're confirmed.</p>
            </aside>
          </div>
        </section>
      </div>

      <section id="challenges" className="section section--rule">
        <div className="container">
          <SectionHead title="Technical challenges">
            <p>
              Challenges are short, interview-style problems you solve within a time limit, like
              tracking down a bug or working through a design task. Top performers get prizes.
            </p>
            <p>Bring a laptop if you plan to try the software challenges.</p>
          </SectionHead>

          <ul ref={stripRef} className="tracks-strip">
            {CHALLENGE_TRACKS.map((t) => (
              <li key={t.name}>
                <div className="tracks-strip__field" aria-hidden="true" />
                <h3>
                  <span className="tracks-strip__glyph" aria-hidden="true">{t.glyph}</span>
                  {t.name}
                </h3>
                <p>{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Workshops;
