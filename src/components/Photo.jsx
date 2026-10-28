// Pass eager for the image in the first viewport; everything else lazy-loads.
const Photo = ({ photo, className = '', caption, eager = false }) => (
  <figure className={`photo ${className}`}>
    <img
      src={photo.src}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
    />
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
);

export default Photo;
