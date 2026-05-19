import { useEffect, useState } from "react";

function getMatchState(query) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia(query).matches;
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => getMatchState(query));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    function handleChange(event) {
      setMatches(event.matches);
    }

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

export default useMediaQuery;
