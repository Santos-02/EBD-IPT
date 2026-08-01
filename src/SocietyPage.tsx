import { FaArrowLeft, FaSchool } from 'react-icons/fa';

type Props = {
  society: string;
  onBack: () => void;
};

export default function SocietyPage({ society, onBack }: Props) {
  return (
    <div>
      <button onClick={onBack} className="back-button" style={{ marginBottom: 20 }}>
        <FaArrowLeft style={{ marginRight: 8 }} /> Back
      </button>

      <div className="society-header" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div className="card-logo">
          <FaSchool size={96} />
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{society}</h2>
          <p style={{ marginTop: 6, color: '#666' }}>Welcome to the {society} society page.</p>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        {/* Put society-specific content here (members, classes, schedule, etc.) */}
        <p>This is a placeholder page for the {society} society. Add any society-specific information here.</p>
      </div>
    </div>
  );
}
