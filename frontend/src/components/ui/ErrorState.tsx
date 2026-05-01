type Props = {
  message: string;
};

export default function ErrorState({ message }: Props) {
  return (
    <div
      style={{
        padding: 40,
        textAlign: "center",
        color: "#ff6b6b",
      }}
    >
      <h2>Something went wrong</h2>
      <p>{message}</p>
    </div>
  );
}