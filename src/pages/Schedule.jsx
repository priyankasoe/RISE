import { capillary } from 'asciify-engine/kit';
import PageHeader from '../components/PageHeader';
import SectionHead from '../components/SectionHead';
import { EVENT } from '../data/event';

// Add confirmed sessions here, e.g. { time: '9:00 AM', title: 'Opening remarks', place: 'Room TBA' }.
// While this is empty the page shows the planned program without times.
const SCHEDULE = [];

const PLANNED = [
  'Opening remarks and keynote',
  'Expo floor: booths, posters, and live demos',
  'Faculty, research, and company presentations',
  'Technical challenges in hardware, electrical, and software',
  'Workshops',
  'Networking sessions with companies and labs',
  'Closing and challenge prizes',
];

const Schedule = () => (
  <>
    <title>{`Schedule · RISE ${EVENT.year}`}</title>
    <div className="opening">
      <PageHeader title="Schedule" preset={capillary} interactive>
        {SCHEDULE.length === 0 && (
          <p>
            Session times haven't been set yet. The full schedule will be posted here once
            it's final, and announced on Instagram at{' '}
            <a className="text-link" href={EVENT.instagram.url} target="_blank" rel="noreferrer">
              {EVENT.instagram.handle}
            </a>.
          </p>
        )}
      </PageHeader>

      <section className="section">
        <div className="container split">
          {SCHEDULE.length > 0 ? (
            <div>
              <SectionHead title="Sessions" />
              <ol className="timetable">
                {SCHEDULE.map((item) => (
                  <li key={`${item.time}-${item.title}`}>
                    <span className="timetable__time">{item.time}</span>
                    <span className="timetable__title">{item.title}</span>
                    {item.place && <span className="timetable__place">{item.place}</span>}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div>
              <SectionHead title="What's planned" tag="Provisional">
                <p>The day will include the following. Order, times and rooms are not final.</p>
              </SectionHead>
              <ul className="plain-list">
                {PLANNED.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="muted note">
                Some workshops and company events may take place earlier in the same week.
              </p>
            </div>
          )}

          <aside className="aside">
            <p className="meta">Where</p>
            <p>
              {EVENT.venue}<br />
              {EVENT.university}<br />
              {EVENT.address}
            </p>
            <p className="meta">When</p>
            <p><time dateTime={EVENT.isoDate}>{EVENT.date}</time></p>
            <a className="arrow-link" href={EVENT.mapUrl} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </aside>
        </div>
      </section>
    </div>
  </>
);

export default Schedule;
