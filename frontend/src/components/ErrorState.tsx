type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div
      style={{
        padding: "60px 20px",
        textAlign: "center",
        color: "#aaa",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: 10 }}>
        TMDb unavailable
      </h2>

      <p style={{ marginBottom: 20, fontSize: 14 }}>
        {message || "Something went wrong while fetching data."}
      </p>

      <button
        onClick={onRetry}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid #333",
          background: "#1a1a1a",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}