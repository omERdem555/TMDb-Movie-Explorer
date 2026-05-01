import { GENRES } from "../constants/genres";
import { useMemo } from "react";

type Props = {
  open: boolean;
  selectedGenres: string;
  onChangeGenres: (genres: string) => void;
};

export default function Sidebar({
  open,
  selectedGenres,
  onChangeGenres,
}: Props) {
  const selectedSet = useMemo(() => {
    return new Set(selectedGenres.split(",").filter(Boolean));
  }, [selectedGenres]);

  const toggleGenre = (id: number) => {
    const current = new Set(selectedSet);

    if (current.has(String(id))) {
      current.delete(String(id));
    } else {
      current.add(String(id));
    }

    onChangeGenres(Array.from(current).join(","));
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <h3 style={{ marginBottom: 12 }}>Genres</h3>

      {GENRES.map((g) => {
        const active = selectedSet.has(String(g.id));

        return (
          <label
            key={g.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={() => toggleGenre(g.id)}
            />
            {g.name}
          </label>
        );
      })}
    </aside>
  );
}