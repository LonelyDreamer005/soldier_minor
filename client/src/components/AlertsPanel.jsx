import './AlertsPanel.css';

function relTime(ts) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

const ALERT_STYLES = {
  HIGH: { icon: '▲', cls: 'alert-high', label: 'HIGH BPM' },
  LOW:  { icon: '▼', cls: 'alert-low',  label: 'LOW BPM'  },
};

export default function AlertsPanel({ alerts }) {
  return (
    <div className="card alerts-card">
      <div className="alerts-header">
        <span className="alerts-title">ALERTS LOG</span>
        <span className="alerts-count">{alerts.length} / 10</span>
      </div>

      {alerts.length === 0 ? (
        <div className="alerts-clear">✅ All Clear — No anomalies detected</div>
      ) : (
        <ul className="alerts-list">
          {alerts.map((a, i) => {
            const style = ALERT_STYLES[a.type] || ALERT_STYLES.HIGH;
            return (
              <li key={i} className={`alert-item ${style.cls}`}>
                <span className="ai-icon">{style.icon}</span>
                <div className="ai-body">
                  <span className="ai-label">{style.label}</span>
                  <span className="ai-msg">{a.message}</span>
                </div>
                <div className="ai-meta">
                  <span className="ai-bpm">{a.bpm} BPM</span>
                  <span className="ai-time">{relTime(a.timestamp)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
