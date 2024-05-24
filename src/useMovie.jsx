import { useEffect, useState } from "react";

export function useMovie(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  const KEY = "d4fe1350";

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error("Check your internet connection!");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movies not found!");
          setMovies(data.Search);
        } catch (err) {
          console.log(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
      return () => controller.abort();
    },
    [query]
  );
  return { isLoading, movies, error };
}
