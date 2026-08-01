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

      <div className="UPA">
          <button
            key={societies[0].id}
            className="class-card"
            onClick={() => onSelect(societies[0].id)}
            aria-label={`Open ${societies[0].title} society page`}
          >
            <div className="card-logo">
              <FaSchool size={64} />
            </div>
            <div className="card-title">{societies[0].title}</div>
          </button>
      </div>

            <div className="UPA">
          <button
            key={societies[1].id}
            className="class-card"
            onClick={() => onSelect(societies[1].id)}
            aria-label={`Open ${societies[1].title} society page`}
          >
            <div className="card-logo">
              <FaSchool size={64} />
            </div>
            <div className="card-title">{societies[1].title}</div>
          </button>
      </div>

            <div className="UPA">
          <button
            key={societies[2].id}
            className="class-card"
            onClick={() => onSelect(societies[2].id)}
            aria-label={`Open ${societies[2].title} society page`}
          >
            <div className="card-logo">
              <FaSchool size={64} />
            </div>
            <div className="card-title">{societies[2].title}</div>
          </button>
      </div>

            <div className="UPA">
          <button
            key={societies[3].id}
            className="class-card"
            onClick={() => onSelect(societies[3].id)}
            aria-label={`Open ${societies[3].title} society page`}
          >
            <div className="card-logo">
              <FaSchool size={64} />
            </div>
            <div className="card-title">{societies[3].title}</div>
          </button>
      </div>
    </div>
  );
}