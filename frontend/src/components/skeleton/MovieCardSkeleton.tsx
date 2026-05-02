export default function MovieCardSkeleton() {
  return (
    <div className="movie-card skeleton">
      <div className="poster-skeleton" />
      <div className="text-skeleton title" />
      <div className="text-skeleton sub" />
    </div>
  );
}