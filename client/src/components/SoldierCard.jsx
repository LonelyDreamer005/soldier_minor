import './SoldierCard.css';

export default function SoldierCard({ soldier }) {
  if (!soldier) return null;
  const rows = [
    { label: 'SOLDIER ID',  value: soldier.id },
    { label: 'NAME',        value: soldier.name },
    { label: 'UNIT',        value: soldier.unit },
    { label: 'STATUS',      value: soldier.status },
    { label: 'LOCATION',    value: soldier.location },
  ];

  return (
    <div className="card soldier-card">
      <div className="sc-header">
        <span className="sc-tag">FIELD OPERATIVE</span>
        <span className="sc-id">{soldier.id}</span>
      </div>
      <div className="sc-avatar">
        <div className="sc-avatar-inner">
          {soldier.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
      </div>
      <table className="sc-table">
        <tbody>
          {rows.map(r => (
            <tr key={r.label}>
              <td className="sc-label">{r.label}</td>
              <td className="sc-value">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="sc-active-badge">● CONNECTED</div>
    </div>
  );
}
