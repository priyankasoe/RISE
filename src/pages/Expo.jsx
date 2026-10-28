import { swell } from 'asciify-engine/kit';
import PageHeader from '../components/PageHeader';
import SectionHead from '../components/SectionHead';
import { EVENT } from '../data/event';

const boothMail = `mailto:${EVENT.email}?subject=${encodeURIComponent(`RISE ${EVENT.year} booth`)}`;

const Expo = () => (
  <>
    <title>{`Expo · RISE ${EVENT.year}`}</title>
    <div className="opening">
      <PageHeader title="The expo floor" preset={swell}>
        <p>
          Most of RISE happens here: tables, posters, and live demos from student teams,
          research labs, and companies.
        </p>
      </PageHeader>

      <section className="section">
        <div className="container columns columns--divided">
          <div>
            <SectionHead title="For visitors" />
            <p>
              Walk the floor, watch robots run, and ask the people who built them how they work.
              Many exhibitors are student teams, so it's a good way to find a project to join.
            </p>
            <p>
              Companies and research groups have tables too. If you're looking for an internship
              or research position, bring a resume.
            </p>
          </div>

          <div>
            <SectionHead title="For exhibitors" />
            <p>
              Every participating organization gets a table and space for a poster. If you're
              bringing hardware that needs room to move, ask for demo space when you sign up.
            </p>
            <p>
              Companies and research groups can also request a presentation slot or a networking
              session with students, either on {EVENT.day} or during that week.
            </p>
          </div>
        </div>
      </section>
    </div>

    <section className="section section--raised" aria-labelledby="table-title">
      <div className="container">
        <SectionHead id="table-title" title="Getting a table" />
        <ol className="steps">
          <li>
            Email <a className="text-link" href={boothMail}>{EVENT.email}</a>.
          </li>
          <li>Include your organization's name and what you plan to show.</li>
          <li>If your hardware needs room to move, ask for demo space.</li>
        </ol>
        <p className="muted note">
          Participating teams, labs, and companies will be listed once they're confirmed.
        </p>
      </div>
    </section>
  </>
);

export default Expo;
