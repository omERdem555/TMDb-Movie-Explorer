import { useEffect } from "react";
import { fetchMovies } from "./api/movies.api";

function App() {
  useEffect(() => {
    fetchMovies("popular", 1).then((res) => {
      console.log("API TEST:", res);
    });
  }, []);

  return <div>Movie App</div>;
}

export default App;