export default function MovieDetailSkeleton() {
  return (
    <div className="movie-detail-page">
      <div className="back-link skeleton" style={{ width: 80, height: 16 }} />

      <div className="movie-detail-top">
        <div className="movie-poster skeleton" />

        <div className="movie-info">
          <div className="skeleton" style={{ width: "60%", height: 28 }} />
          <div className="skeleton" style={{ width: "40%", height: 16, marginTop: 10 }} />
          <div className="skeleton" style={{ width: "90%", height: 80, marginTop: 20 }} />
        </div>
      </div>
    </div>
  );
}