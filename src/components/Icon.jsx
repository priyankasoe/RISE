// Icons from src/assets/icons (Font Awesome Free, supplied with the project).
// The SVG files are inlined as they are, so they inherit the text colour
// (fill: currentColor, see .icon in index.css) and scale with the text.
// Decorative: the link or label beside each icon carries its accessible name.
import envelope from '../assets/icons/envelope.svg?raw';
import instagram from '../assets/icons/instagram.svg?raw';

const ICONS = { envelope, instagram };

const Icon = ({ name }) => (
  <span className="icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />
);

export default Icon;
