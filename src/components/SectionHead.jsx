// Shared section heading: the title, an optional status tag after it, and an
// optional note beside it on wide screens.
const SectionHead = ({ title, id, tag, children }) => (
  <div className="section-head">
    <div>
      <h2 id={id}>{title}</h2>
      {tag && <p className="tag">{tag}</p>}
    </div>
    {children && <div className="section-head__note">{children}</div>}
  </div>
);

export default SectionHead;
