import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { background, ditherGradient, drift, estuary, ocean } from 'asciify-engine/kit';
import Photo from '../components/Photo';
import SectionHead from '../components/SectionHead';
import { scrambleOnHover } from '../components/scramble';
import { textClear } from '../components/textClear';
import { useDecodeHeading } from '../components/useDecodeHeading';
import { EVENT } from '../data/event';
import { GALLERY } from '../data/photos';

const PROGRAM = [
  {
    title: 'Live demos',
    text: 'Teams run their robots on the expo floor, from legged platforms to student-built rovers, and the people who built them are there to explain how they work.',
    link: { to: '/expo', label: 'About the expo' },
  },
  {
    title: 'Booths and networking',
    text: 'Every participating team, lab, and company gets a table and poster space. Companies and research groups also host networking sessions with students during RISE and that week.',
    link: { to: '/expo', label: 'Exhibiting at RISE' },
  },
  {
    title: 'Talks and panels',
    text: 'Research groups and companies present their work, and speakers from research and industry take questions from the audience.',
    link: { to: '/speakers', label: 'Speakers' },
  },
  {
    title: 'Workshops',
    text: `Hands-on sessions run with other Purdue clubs and sponsoring companies, on ${EVENT.day} and during the week of the event.`,
    link: { to: '/workshops', label: 'Workshops' },
  },
  {
    title: 'Technical challenges',
    text: 'Short, interview-style problems in hardware, electrical, or software, solved against a time limit. Top performers win prizes.',
    link: { to: '/workshops#challenges', label: 'How challenges work' },
  },
];

const HISTORY = [
  { year: '2023', title: 'The first RISE', text: 'More than 200 students, faculty, and researchers came to the first expo.' },
  { year: '2024', title: 'RISE 2', text: 'Attendance passed 500, with over 100 participants from five universities.' },
  { year: '2025', title: 'Fall mini-expo', text: 'A smaller event in the fall, between full expos.' },
];

// Confirmed figures from past events and the FAQ.
const FIGURES = [
  { value: '200+', label: 'Attendees at the first RISE, 2023' },
  { value: '500+', label: 'Attendees at RISE 2, 2024' },
  { value: '5', label: 'Universities with participants, 2024' },
  { value: 'Free', label: 'To attend' },
];

// Ocean interlude: three sharks of different sizes, a hammerhead and two
// schools of small fish.
const OCEAN_CREATURES = [
  { kind: 'shark' },
  { kind: 'shark', size: 0.7 },
  { kind: 'shark', size: 0.5 },
  { kind: 'hammerhead', size: 0.85 },
  { kind: 'school', count: 24 },
  { kind: 'school', count: 16 },
];

const Home = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const oceanRef = useRef(null);
  const programRef = useRef(null);
  const archiveRef = useRef(null);
  const bandRef = useRef(null);
  useDecodeHeading(titleRef);

  // Each effect has its own place on the page, mounted once:
  // hero (decode + Estuary), the ocean interlude and the call-to-action glow.
  useEffect(() => {
    const heroClear = textClear(heroRef.current);
    const heroField = background(heroRef.current, {
      preset: estuary,
      clear: heroClear.read,
      clearPadding: 8,
      clearSoftness: 32,
      ink: '--ascii-ink',
    });
    // Program items: the title scrambles locally on hover, nothing else moves.
    const titles = scrambleOnHover(programRef.current.querySelectorAll('h3'));
    // The archive opens with a field of drifting characters, densest at its top
    // edge and dissolving downward into the section (masked in CSS).
    const archiveField = background(archiveRef.current, {
      preset: drift,
      cursor: false,
      ink: '--ascii-ink-quiet',
      opacity: 0.7,
    });
    const sea = ocean(oceanRef.current, {
      creatures: OCEAN_CREATURES,
      ink: '--ascii-ink-strong',
      // Off: random coloured tiles (an option the docs don't list yet).
      accents: false,
      label: 'An ocean seen from above: three sharks, a hammerhead and schools of fish',
    });
    // A low glow from the bottom edge, in the site's blues, under the band copy.
    const glow = ditherGradient(bandRef.current, {
      colors: ['--rule-strong', '--accent', '--accent-hover'],
      lights: [{ x: 0.64, y: 1.18, radius: 0.36, aspect: 0.4, strength: 0.7 }],
    });
    return () => {
      heroField.destroy();
      heroClear.destroy();
      sea.destroy();
      titles.forEach((t) => t.destroy());
      archiveField.destroy();
      glow.destroy();
    };
  }, []);

  return (
    <>
      <title>{`RISE ${EVENT.year} · ${EVENT.name} at Purdue`}</title>

      <section ref={heroRef} className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="hero__kicker">{EVENT.edition} at {EVENT.university}</p>
            <h1 ref={titleRef} id="hero-title">Robotics &amp; Intelligent Systems Expo</h1>
            <p className="hero__lede">
              Student teams, research labs, and companies bring their robots to Purdue for
              a day of live demos, talks, workshops, and technical challenges.
            </p>

            <dl className="facts">
              <div>
                <dt>Date</dt>
                <dd><time dateTime={EVENT.isoDate}>{EVENT.date}</time></dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>{EVENT.venue}</dd>
              </div>
              <div>
                <dt>Campus</dt>
                <dd>{EVENT.university}<span className="facts__sub">{EVENT.city}</span></dd>
              </div>
            </dl>

            <div className="actions">
              <a href="#program" className="btn btn-primary"><span className="btn__label">What's planned</span></a>
              <Link to="/sponsors" className="btn btn-outline"><span className="btn__label">Exhibit or sponsor</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="about-title">
        <div className="container about">
          <div>
            <SectionHead id="about-title" title="A robotics expo run by Purdue students" />
            <p className="lead">
              RISE is organized by the {EVENT.organizer}. Student teams, research labs,
              and companies bring the robots and research they're working on, and visitors
              get to see that work up close and talk with the people who built it.
            </p>
            <p>
              You don't need to study robotics to come. Past events drew students and
              faculty from across STEM, teams from other universities, and families
              from the community.
            </p>
            <p>{EVENT.day} will be the third full RISE.</p>
          </div>

          <dl className="figures">
            {FIGURES.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="program" className="section section--rule" aria-labelledby="program-title">
        <div className="container">
          <SectionHead id="program-title" title="What happens at RISE" tag="Times TBA">
            <p>
              Session times for {EVENT.day} are still being set. This is what the day is built
              around. <Link to="/schedule" className="text-link">Schedule updates</Link>
            </p>
          </SectionHead>

          <ul ref={programRef} className="program-list">
            {PROGRAM.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <Link to={p.link.to} className="arrow-link">{p.link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section ref={archiveRef} className="section archive" aria-labelledby="past-title">
        <div className="container">
          <SectionHead id="past-title" title="RISE so far" />

          <ol className="timeline">
            {HISTORY.map((h) => (
              <li key={h.year}>
                <span className="timeline__year">{h.year}</span>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </li>
            ))}
          </ol>

          {GALLERY.length > 0 && (
            <>
              <div className="gallery">
                {GALLERY.map((photo, i) => (
                  <Photo key={photo.src} photo={photo} className={i === 0 ? 'gallery__main' : undefined} />
                ))}
              </div>
              <p className="caption">Photos from previous RISE events.</p>
            </>
          )}
        </div>
      </section>

      {/* A wordless interlude before the close: the ocean answers the pointer
          and clicks on its own, so it carries no instructions. */}
      <div ref={oceanRef} className="ocean-stage" />

      <section ref={bandRef} className="band" aria-labelledby="band-title">
        <div className="container band__inner">
          <div>
            <h2 id="band-title">Bring your team, lab, or company</h2>
            <p>
              Exhibitors get a table and poster space. Sponsors can also host talks,
              workshops, and technical challenges. We're putting together the {EVENT.year} lineup now.
            </p>
          </div>
          <div className="actions">
            <Link to="/sponsors" className="btn btn-primary"><span className="btn__label">Sponsorship details</span></Link>
            <a href={`mailto:${EVENT.email}`} className="btn btn-outline"><span className="btn__label">Email the organizers</span></a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
