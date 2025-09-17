import { useState, useEffect } from 'react';

/**
 * Custom hook for media queries
 * @param {string} query - CSS media query string
 * @returns {boolean} Whether the media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    
    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // Legacy browsers
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [matches, query]);

  return matches;
};
