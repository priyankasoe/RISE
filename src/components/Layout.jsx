import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cursorTrail } from 'asciify-engine/kit';
import Navbar from './Navbar';
import Footer from './Footer';
import { useFoldFit } from './useFoldFit';
import { scrambleOnHover } from './scramble';

// Elements with their own pointer work: the page trail stays quiet over them.
const OWN_POINTER = '.hero, .ocean-stage, .page-header--interactive, .site-footer__brand, .lost__art, .venue-globe__art, .lab-stage';

const Layout = ({ children }) => {
  const { pathname, hash } = useLocation();
  useFoldFit(pathname);

  // React Router keeps the old scroll position between pages and ignores
  // #hash targets, so handle both here.
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  // One pointer system for the whole site: a trail of characters behind the
  // content (z-index -1), drawn on the page ground and through transparent
  // fields. Off on touch screens and under reduced motion (the kit decides).
  useEffect(() => {
    const trail = cursorTrail({ style: 'trail', ink: '--ascii-ink-quiet', zIndex: -1, cellSize: 9, skip: OWN_POINTER });
    return () => trail.destroy();
  }, []);

  // Button labels scramble on hover, the same way the header links do.
  useEffect(() => {
    const labels = scrambleOnHover(document.querySelectorAll('main .btn__label'));
    return () => labels.forEach((l) => l.destroy());
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
