import { useEffect } from 'react';

function useEscapeKey(handler) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        handler();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handler]);
}

export default useEscapeKey;
