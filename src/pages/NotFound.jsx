import { Link, useNavigate } from 'react-router-dom';
import { fieldBackground } from 'asciify-engine/kit';
import { useKit } from '../components/useKit';
import { EVENT } from '../data/event';

const NotFound = () => {
  const navigate = useNavigate();
  // 404 drawn large in characters that scatter under the cursor.
  const [artRef, lost] = useKit((el) => fieldBackground(el, { preset: 'notFound', text: '404' }));

  // Break the numerals apart from the button and let them re-form, then go home.
  const goHome = async (event) => {
    event.preventDefault();
    await lost.current?.scatter(event.currentTarget);
    navigate('/');
  };

  return (
    <>
      <title>{`Page not found · RISE ${EVENT.year}`}</title>
      <section className="lost" aria-labelledby="lost-title">
        <div ref={artRef} className="lost__art" />
        <div className="container lost__copy">
          <h1 id="lost-title">Page not found</h1>
          <p className="muted">That page doesn't exist. It may have moved, or the link may be mistyped.</p>
          <Link to="/" className="btn btn-primary" onClick={goHome}><span className="btn__label">Go home</span></Link>
        </div>
      </section>
    </>
  );
};

export default NotFound;
