import { useEffect } from "react";
import { FaSchool } from 'react-icons/fa';

type Props = {
  onSelect: (society: string) => void;
};

export default function Classes({ onSelect }: Props) {
  useEffect(() => {
    // placeholder if future data loading is necessary (e.g., from Supabase)
  }, []);

  const societies = [
    { id: "UPA", title: "UPA" },
    { id: "UMP", title: "UMP" },
    { id: "UPH", title: "UPH" },
    { id: "SAF", title: "SAF" },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Classes</h1>

      <div className="classes-grid">
        {societies.map((s) => (
          <button
            key={s.id}
            className="class-card"
            onClick={() => onSelect(s.id)}
            aria-label={`Open ${s.title} society page`}
          >
            <div className="card-logo">
              <FaSchool size={64} />
            </div>
            <div className="card-title">{s.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
}