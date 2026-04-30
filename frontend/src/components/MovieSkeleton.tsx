export default function MovieSkeleton() {
  return (
    <div
      style={{
        borderRadius: 10,
        overflow: "hidden",
        background: "#1a1a1a",
        animation: "pulse 1.5s infinite",
      }}
    >
      {/* poster skeleton */}
      <div
        style={{
          width: "100%",
          aspectRatio: "2 / 3",
          background: "#2a2a2a",
        }}
      />

      {/* text skeleton */}
      <div style={{ padding: 10 }}>
        <div
          style={{
            height: 12,
            width: "80%",
            background: "#2a2a2a",
            marginBottom: 8,
            borderRadius: 4,
          }}
        />

        <div
          style={{
            height: 10,
            width: "100%",
            background: "#2a2a2a",
            borderRadius: 4,
          }}
        />
      </div>

      {/* animation keyframes */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}