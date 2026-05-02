type Props = {
  type: string;
  search: string;
  genres: string;
};

export default function EmptyState({ search, genres }: Props) {
  const hasFilters = search || genres;

  const genreText = genres
    ? `selected genres (${genres})`
    : "";

  const searchText = search
    ? `"${search}"`
    : "";

  return (
    <div
      style={{
        padding: "40px 20px",
        textAlign: "center",
        color: "#aaa",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: 10 }}>
        No movies found
      </h2>

      <p style={{ fontSize: 14, lineHeight: 1.6 }}>
        {hasFilters ? (
          <>
            No results for{" "}
            <span style={{ color: "#fff" }}>
              {searchText} {genreText}
            </span>
            <br />
            Try changing filters or search terms.
          </>
        ) : (
          <>No movies available in this category.</>
        )}
      </p>
    </div>
  );
}