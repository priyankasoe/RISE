import { useEffect, useRef } from 'react';

// Mounts one Asciify kit handle on the returned ref's element once, and
// destroys it on unmount. handle.current is there for methods (scatter, rotateTo…).
export function useKit(mount) {
  const ref = useRef(null);
  const handle = useRef(null);
  useEffect(() => {
    const h = mount(ref.current);
    handle.current = h;
    return () => {
      handle.current = null;
      h.destroy();
    };
    // Mount once; later changes go through handle.current.update().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, handle];
}
