import { constellation } from 'asciify-engine/kit';
import PageHeader from '../components/PageHeader';
import SectionHead from '../components/SectionHead';
import { EVENT } from '../data/event';

// Add confirmed speakers as { name, role, affiliation, bio }.
const SPEAKERS = [];

const Speakers = () => (
  <>
    <title>{`Speakers · RISE ${EVENT.year}`}</title>
    <div className="opening">
      <PageHeader title="Talks and panels" preset={constellation}>
        <p>
          {SPEAKERS.length > 0
            ? `Confirmed speakers for ${EVENT.day}.`
            : `Speakers and participating companies for ${EVENT.year} haven't been announced yet. We'll list them here as they're confirmed.`}
        </p>
      </PageHeader>

      <section className="section">
        <div className="container">
          {SPEAKERS.length > 0 ? (
            <>
              <SectionHead title="Speakers" />
              <ul className="people">
                {SPEAKERS.map((s) => (
                  <li key={s.name}>
                    <h3>{s.name}</h3>
                    <p className="people__role">{s.role}, {s.affiliation}</p>
                    {s.bio && <p>{s.bio}</p>}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="statement">
              <h2>Speakers are being confirmed</h2>
              <p className="tag">To be announced</p>
              <p>
                We'll post names here as they're confirmed, and share each announcement on
                Instagram at{' '}
                <a className="text-link" href={EVENT.instagram.url} target="_blank" rel="noreferrer">
                  {EVENT.instagram.handle}
                </a>.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>

    <section className="section section--rule">
      <div className="container split">
        <div>
          <SectionHead title="At past events" />
          <p>
            Previous RISE programs opened with welcome remarks and included roundtables and
            panels where speakers from research and industry took questions from students.
          </p>
        </div>
        <aside className="aside">
          <p className="meta">Want to speak?</p>
          <p>
            Email <a className="text-link" href={`mailto:${EVENT.email}`}>{EVENT.email}</a>{' '}
            with a short description of your talk.
          </p>
        </aside>
      </div>
    </section>
  </>
);

export default Speakers;
