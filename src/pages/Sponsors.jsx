import { beam } from 'asciify-engine/kit';
import PageHeader from '../components/PageHeader';
import SectionHead from '../components/SectionHead';
import { useKit } from '../components/useKit';
import { EVENT } from '../data/event';

// Add confirmed sponsors as { name, url, logo: '/images/sponsors/<file>' }.
const SPONSORS = [];

// Tier table from the "2026 RISE Sponsorship Opportunities" draft. An older
// packet lists different prices and benefits, so it stays hidden until
// organizers confirm these numbers. Set TIERS_CONFIRMED to true to publish it.
const TIERS_CONFIRMED = false;
const TIERS = ['Platinum ($5,000+)', 'Gold ($3,000)', 'Silver ($1,000)'];
const BENEFITS = [
  ['Booth space, with demo space on request', [true, true, true]],
  ['Logo on the website, Instagram, and event materials', [true, true, true]],
  ['Presentation room for a company talk', [true, true, true]],
  ['Private networking event during RISE or RISE week', [true, true, false]],
  ['Dedicated Instagram post and logo on event merchandise', [true, true, false]],
  ['"Workshop presented by" credit, with the option to run it', [true, true, false]],
  ['Logo on premium merchandise (shirts, banners, programs)', [true, false, false]],
  ['Networking event with ARC members during the academic year', [true, false, false]],
  ['"Technical challenge powered by" credit and prizes', [true, false, false]],
];

const WAYS = [
  { title: 'Exhibit', text: 'Get a table and poster space on the expo floor, plus room for a live demo if you need it.' },
  { title: 'Meet students', text: 'Talk with students at your booth or host a private networking session during RISE or that week.' },
  { title: 'Present', text: 'Give a company or research talk in a presentation room.' },
  { title: 'Run a workshop or challenge', text: 'Sponsor a hands-on workshop or technical challenge, and run it yourself if you want.' },
  { title: 'Be seen', text: 'Your logo on the website, on Instagram, and on event materials.' },
];

const mailto = `mailto:${EVENT.email}?subject=${encodeURIComponent(`RISE ${EVENT.year} sponsorship`)}`;

// Beam colours: the site's accent blues (the kit's own palettes add purple or teal).
const BEAM_BLUES = ['#3cb4ff', '#7ccbff', '#eaf1fc', '#3cb4ff'];

const Sponsors = () => {
  // Two turning arcs of blue dots inside the pricing panel's border.
  const [cardRef] = useKit((el) => beam(el, { palette: BEAM_BLUES, mode: 'rotate', grain: 'dots' }));

  return (
    <>
      <title>{`Sponsors · RISE ${EVENT.year}`}</title>
      <div className="opening">
        <PageHeader title="Sponsor RISE">
          <p>
            RISE is free to attend and run by students. Sponsorship pays for the event and puts
            your team in front of the students and researchers who come.
          </p>
        </PageHeader>

        {SPONSORS.length > 0 && (
          <section className="section">
            <div className="container">
              <SectionHead title={`${EVENT.year} sponsors`} />
              <ul className="logo-grid">
                {SPONSORS.map((s) => (
                  <li key={s.name}>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      <img src={s.logo} alt={s.name} loading="lazy" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className={`section${SPONSORS.length > 0 ? ' section--rule' : ''}`}>
          <div className="container split split--wide-aside">
            <div>
              <SectionHead title="What sponsors can do" />
              <dl className="tracks">
                {WAYS.map((w) => (
                  <div key={w.title}>
                    <dt>{w.title}</dt>
                    <dd>{w.text}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside ref={cardRef} className="beam-box">
              <h2 className="beam-box__title">Levels and pricing</h2>
              {!TIERS_CONFIRMED && <p className="tag">Being finalized</p>}
              {TIERS_CONFIRMED ? (
                <p>See the table below for what each level includes.</p>
              ) : (
                <p>
                  Sponsorship levels for {EVENT.year} are being finalized. Email us and we'll send the
                  current sponsorship packet.
                </p>
              )}
              <a className="btn btn-primary" href={mailto}><span className="btn__label">Email {EVENT.email}</span></a>
            </aside>
          </div>
        </section>
      </div>

      {TIERS_CONFIRMED && (
        <section className="section section--rule">
          <div className="container">
            <SectionHead title="Sponsorship levels" />
            <div className="table-scroll" role="region" aria-label="Sponsorship levels" tabIndex={0}>
              <table className="tiers">
                <thead>
                  <tr>
                    <th scope="col">Benefit</th>
                    {TIERS.map((t) => <th scope="col" key={t}>{t}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {BENEFITS.map(([name, included]) => (
                    <tr key={name}>
                      <th scope="row">{name}</th>
                      {included.map((yes, i) => (
                        <td key={TIERS[i]}>{yes ? 'Yes' : <span className="muted">No</span>}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Sponsors;
