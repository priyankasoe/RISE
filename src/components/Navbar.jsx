import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../data/event';
import { scrambleOnHover } from './scramble';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const navRef = useRef(null);

  // Links rest as plain HTML and scramble through other alphabets on hover.
  useEffect(() => {
    const links = scrambleOnHover(navRef.current.querySelectorAll('a'), 700);
    return () => links.forEach((l) => l.destroy());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link to="/" className="wordmark" onClick={close} aria-label="RISE 3 home">
          RISE<span className="wordmark__num">3</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isOpen}
          aria-controls="site-nav"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>

        <nav ref={navRef} id="site-nav" className={`site-nav${isOpen ? ' is-open' : ''}`} aria-label="Main">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} onClick={close}>{link.name}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
