import './LiveStatusCard.css';

const STATUS_MAP = {
  NORMAL:    { label: 'NORMAL',    icon: '●', cls: 'status-normal', glow: 'glow-green' },
  HIGH:      { label: 'HIGH',      icon: '▲', cls: 'status-high',   glow: 'glow-red'   },
  LOW:       { label: 'LOW',       icon: '▼', cls: 'status-low',    glow: 'glow-blue'  },
  NO_SIGNAL: { label: 'NO SIGNAL', icon: '◌', cls: 'status-none',   glow: 'glow-grey'  },
};

export default function LiveStatusCard({ bpm, status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.NO_SIGNAL;

  return (
    <div className={`card live-card ${s.glow}`}>
      <div className="lc-header">
        <span className="lc-tag">LIVE BIOMETRICS</span>
        <span className={`lc-badge ${s.cls}`}>{s.icon} {s.label}</span>
      </div>

      <div className="lc-bpm-wrap">
        <div className={`lc-bpm ${s.cls}`}>
          {bpm !== null ? bpm : '--'}
        </div>
        <div className="lc-bpm-unit">BPM</div>
      </div>

      <div className="lc-footer">
        <div className="lc-range">
          <span className="lr-item low">▼ LOW &lt;50</span>
          <span className="lr-item norm">● NORMAL 50–100</span>
          <span className="lr-item high">▲ HIGH &gt;100</span>
        </div>
      </div>

      {status === 'HIGH' && (
        <div className="lc-alert-bar">⚠ ELEVATED HEART RATE — MONITOR SOLDIER</div>
      )}
      {status === 'LOW' && (
        <div className="lc-alert-bar lc-alert-blue">⚠ LOW HEART RATE — CHECK CONDITION</div>
      )}
    </div>
  );
}
