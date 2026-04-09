import './HeartRateCard.css';

export default function TemperatureCard({ temperature }) {
  // Let's decide status based on temperature
  let status = 'NORMAL';
  if (temperature === null) status = 'NO_SIGNAL';
  else if (temperature > 37.5) status = 'HIGH';
  else if (temperature < 35.0) status = 'LOW';

  const STATUS_MAP = {
    NORMAL: { label: 'NORMAL', icon: '●', cls: 'status-normal', glow: 'glow-green' },
    HIGH: { label: 'HIGH', icon: '▲', cls: 'status-high', glow: 'glow-amber' },
    LOW: { label: 'LOW', icon: '▼', cls: 'status-low', glow: 'glow-blue' },
    NO_SIGNAL: { label: 'NO SIGNAL', icon: '◌', cls: 'status-none', glow: 'glow-grey' },
  };

  const s = STATUS_MAP[status];

  return (
    <div className={`card temp-card ${s.glow}`}>
      <div className="lc-header">
        <span className="lc-tag">BODY TEMPERATURE</span>
        <span className={`lc-badge ${s.cls}`}>{s.icon} {s.label}</span>
      </div>

      <div className="temp-content">
        <div className={`temp-value ${s.cls}`}>
          {temperature !== null ? temperature.toFixed(1) : '--'}
        </div>
        <div className="temp-unit">°C</div>
      </div>

      <div className="lc-footer">
        <div className="lc-range">
          <span className="lr-item low">▼ &lt;35.0</span>
          <span className="lr-item norm">● 36.5&#x2013;37.5</span>
          <span className="lr-item high">▲ &gt;37.5</span>
        </div>
      </div>

      {status === 'HIGH' && (
        <div className="temp-alert-bar temp-alert-amber">⚠ ELEVATED TEMPERATURE</div>
      )}
      {status === 'LOW' && (
        <div className="temp-alert-bar temp-alert-blue">⚠ LOW TEMPERATURE</div>
      )}
    </div>
  );
}
