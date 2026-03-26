import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, let the specific page handle it if they want, 
    // but by default we want to scroll to top on path change.
    if (!hash) {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }, 10);
    }
  }, [pathname, hash]);

  return null;
}
