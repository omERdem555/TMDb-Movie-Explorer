export default function CastSkeleton() {
  return (
    <div className="cast-card">
      <div
        style={{
          width: "100%",
          aspectRatio: "2 / 3",
          borderRadius: 10,
          background: "#222",
          animation: "pulse 1.2s infinite ease-in-out",
        }}
      />

      <div
        style={{
          height: 10,
          marginTop: 6,
          background: "#222",
          borderRadius: 4,
          animation: "pulse 1.2s infinite ease-in-out",
        }}
      />

      <div
        style={{
          height: 8,
          marginTop: 4,
          width: "70%",
          background: "#1a1a1a",
          borderRadius: 4,
          animation: "pulse 1.2s infinite ease-in-out",
        }}
      />
    </div>
  );
}