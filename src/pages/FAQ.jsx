import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { EVENT } from '../data/event';

const Email = () => <a className="text-link" href={`mailto:${EVENT.email}`}>{EVENT.email}</a>;

const FAQS = [
  {
    q: 'When and where is RISE?',
    a: <>{EVENT.date}, at {EVENT.venue} on the {EVENT.university} campus in {EVENT.city}. Session times will be on the <Link className="text-link" to="/schedule">schedule</Link> once they're set.</>,
  },
  {
    q: 'Who can attend?',
    a: <>RISE is open to Purdue students and faculty, and to visitors from other universities and industry. You don't need to study robotics or engineering to come.</>,
  },
  {
    q: 'Does it cost anything?',
    a: <>No. Attending RISE is free.</>,
  },
  {
    q: 'Do I need to register?',
    a: <>There's no registration form right now. If that changes, we'll post it here and on Instagram at <a className="text-link" href={EVENT.instagram.url} target="_blank" rel="noreferrer">{EVENT.instagram.handle}</a>.</>,
  },
  {
    q: 'What should I bring?',
    a: <>A resume (printed or on your phone) if you want to talk with companies, and a laptop if you plan to try the software challenges.</>,
  },
  {
    q: 'How can my company, lab, or team get a booth?',
    a: <>Email <Email /> with your organization's name and what you'd like to show. The <Link className="text-link" to="/sponsors">sponsors page</Link> covers what companies can do at RISE.</>,
  },
];

const FAQ = () => (
  <>
    <title>{`FAQ · RISE ${EVENT.year}`}</title>
    <div className="opening">
      <PageHeader title="Questions" />

      <section className="section">
        <div className="container split">
          <div className="faq">
            {FAQS.map((item, i) => (
              <details key={item.q} open={i === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <aside className="aside">
            <p className="meta">Something else?</p>
            <p>Email <Email /> and someone from the organizing team will get back to you.</p>
          </aside>
        </div>
      </section>
    </div>
  </>
);

export default FAQ;
