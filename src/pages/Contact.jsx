import { useEffect, useRef, useState } from 'react';
import { buttonLoading, globe, ripple } from 'asciify-engine/kit';
import PageHeader from '../components/PageHeader';
import { useKit } from '../components/useKit';
import { EVENT } from '../data/event';
import Icon from '../components/Icon';

const STEWART_CENTER = { lat: 40.4249, lon: -86.9126 };

const Contact = () => {
  const [globeRef, earth] = useKit((el) =>
    globe(el, {
      ink: '--accent',
      lon: STEWART_CENTER.lon,
      points: [STEWART_CENTER],
      label: `Globe of dots marking ${EVENT.venue} at ${EVENT.university}, ${EVENT.city}`,
    }),
  );

  // Copy the email address: the label cycles through characters while the
  // clipboard write runs, then lands on Copied (with a check) or Retry.
  const statusRef = useRef(null);
  const [copyRef, copyButton] = useKit((el) => buttonLoading(el, { announce: statusRef.current }));
  const resetTimer = useRef(0);
  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copyEmail = async () => {
    const b = copyButton.current;
    clearTimeout(resetTimer.current);
    b?.start('Copying');
    try {
      await navigator.clipboard.writeText(EVENT.email);
      b?.succeed('Copied');
    } catch {
      b?.fail('Retry');
    }
    resetTimer.current = setTimeout(() => copyButton.current?.reset('Copy'), 2400);
  };

  // The message box. There's no server, so sending opens the visitor's email
  // app with the message already written to the organizers; the page says so.
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const send = (e) => {
    e.preventDefault();
    const subject = `RISE ${EVENT.year} question from ${form.name}`;
    const body = `${form.message}\n\n${form.name}\n${form.email}`;
    window.location.href = `mailto:${EVENT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <title>{`Contact · RISE ${EVENT.year}`}</title>
      <PageHeader title="Get in touch" preset={ripple} interactive>
        <p>Questions about attending, exhibiting, speaking, or sponsoring? Write to the organizing team.</p>
      </PageHeader>

      <section className="section contact" aria-label="Contact">
        <div className="container contact__grid">
          <form className="message-form" onSubmit={send} aria-label="Message the organizers">
            <div className="message-form__row">
              <label>
                <span>Name</span>
                <input type="text" name="name" autoComplete="name" required value={form.name} onChange={set('name')} />
              </label>
              <label>
                <span>Email</span>
                <input type="email" name="email" autoComplete="email" required value={form.email} onChange={set('email')} />
              </label>
            </div>
            <label>
              <span>Message</span>
              <textarea name="message" rows="4" required value={form.message} onChange={set('message')} />
            </label>
            <div className="message-form__send">
              <button type="submit" className="btn btn-primary"><span className="btn__label">Send message</span></button>
              <p className="message-form__note">Opens your email app, ready to send.</p>
            </div>
          </form>

          <div className="contact__side-wrap">
          <div className="contact__side">
            <figure className="venue-globe">
              <div ref={globeRef} className="venue-globe__art" />
              <figcaption>
                <button type="button" className="switch-button" onClick={() => earth.current?.rotateTo(STEWART_CENTER.lon)}>
                  Purdue
                </button>
                <a className="arrow-link" href={EVENT.mapUrl} target="_blank" rel="noreferrer">
                  {EVENT.venue}
                </a>
              </figcaption>
            </figure>

            <dl className="contact-details">
              <div>
                <dt>Email</dt>
                <dd>
                  <a className="text-link icon-link" href={`mailto:${EVENT.email}`}><Icon name="envelope" />{EVENT.email}</a>
                  <button ref={copyRef} type="button" className="btn btn-small" onClick={copyEmail}>Copy</button>
                  <span ref={statusRef} className="visually-hidden" aria-live="polite" />
                </dd>
              </div>
              <div>
                <dt>Instagram</dt>
                <dd>
                  <a className="text-link icon-link" href={EVENT.instagram.url} target="_blank" rel="noreferrer">
                    <Icon name="instagram" />
                    {EVENT.instagram.handle}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Organizer</dt>
                <dd>{EVENT.organizer}</dd>
              </div>
            </dl>
          </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
