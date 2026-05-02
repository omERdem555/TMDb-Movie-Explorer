export default function SimilarMoviesSkeleton() {
  return (
    <div className="movie-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton">
          <div className="poster-skeleton" />
        </div>
      ))}
    </div>
  );
}