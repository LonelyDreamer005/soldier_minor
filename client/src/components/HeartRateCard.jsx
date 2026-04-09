import './HeartRateCard.css';

const STATUS_MAP = {
  NORMAL: { label: 'NORMAL', icon: '●', cls: 'status-normal', glow: 'glow-green' },
  HIGH: { label: 'HIGH', icon: '▲', cls: 'status-high', glow: 'glow-red' },
  LOW: { label: 'LOW', icon: '▼', cls: 'status-low', glow: 'glow-blue' },
  NO_SIGNAL: { label: 'NO SIGNAL', icon: '◌', cls: 'status-none', glow: 'glow-grey' },
};

export default function HeartRateCard({ bpm, status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.NO_SIGNAL;

  return (
    <div className={`card hr-card ${s.glow}`}>
      <div className="lc-header">
        <span className="lc-tag">HEART RATE</span>
        <span className={`lc-badge ${s.cls}`}>{s.icon} {s.label}</span>
      </div>

      <div className="hr-content">
        <div className={`hr-value ${s.cls}`}>
          {bpm !== null ? bpm : '--'}
        </div>
        <div className="hr-unit">BPM</div>
      </div>

      <div className="lc-footer">
        <div className="lc-range">
          <span className="lr-item low">▼ &lt;50</span>
          <span className="lr-item norm">● 50&#x2013;100</span>
          <span className="lr-item high">▲ &gt;100</span>
        </div>
      </div>

      {status === 'HIGH' && (
        <div className="hr-alert-bar">⚠ ELEVATED HEART RATE</div>
      )}
      {status === 'LOW' && (
        <div className="hr-alert-bar hr-alert-blue">⚠ LOW HEART RATE</div>
      )}
    </div>
  );
}
