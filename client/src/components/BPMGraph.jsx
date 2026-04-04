import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import './BPMGraph.css';

const COLOR_MAP = {
  NORMAL: '#22c55e',
  HIGH:   '#ef4444',
  LOW:    '#3b82f6',
  NO_SIGNAL: '#6b7280',
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <div className="ct-bpm">{d.bpm} <span>BPM</span></div>
      <div className="ct-time">{d.timeLabel}</div>
    </div>
  );
}

export default function BPMGraph({ history, status }) {
  const color = COLOR_MAP[status] || COLOR_MAP.NO_SIGNAL;

  const data = history.map((r) => ({
    bpm: r.bpm,
    timeLabel: new Date(r.timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }),
  }));

  return (
    <div className="card graph-card">
      <div className="graph-header">
        <span className="graph-title">BPM HISTORY</span>
        <span className="graph-count">{history.length} readings</span>
      </div>
      <div className="graph-wrap">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#1e2d42" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Share Tech Mono' }}
              tickLine={false}
              axisLine={{ stroke: '#1e2d42' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[30, 200]}
              tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Share Tech Mono' }}
              tickLine={false}
              axisLine={false}
              width={34}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={1} label={{ value: '100', fill: '#ef4444', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
            <ReferenceLine y={50}  stroke="#3b82f6" strokeDasharray="6 4" strokeWidth={1} label={{ value: '50',  fill: '#3b82f6', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
            <Line
              type="monotone"
              dataKey="bpm"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
