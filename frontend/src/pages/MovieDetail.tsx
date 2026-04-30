import { useParams } from "react-router-dom";

export default function MovieDetail() {
  const { id } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Movie Detail Page</h1>
      <p>Movie ID: {id}</p>
    </div>
  );
}