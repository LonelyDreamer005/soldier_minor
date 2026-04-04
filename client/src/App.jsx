import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SoldierCard from './components/SoldierCard';
import LiveStatusCard from './components/LiveStatusCard';
import BPMGraph from './components/BPMGraph';
import AlertsPanel from './components/AlertsPanel';
import soldiers from './data/soldiers';
import './App.css';

const SOLDIER = soldiers[0]; // currently single soldier, extend here for multi
const POLL_MS = 1000;
const NO_SIGNAL_THRESHOLD_MS = 5000;
const MAX_ALERTS = 10;
const FAIL_THRESHOLD = 3;

function getStatus(bpm, lastSeenMs) {
  if (!bpm || Date.now() - lastSeenMs > NO_SIGNAL_THRESHOLD_MS) return 'NO_SIGNAL';
  if (bpm > 100) return 'HIGH';
  if (bpm < 50)  return 'LOW';
  return 'NORMAL';
}

function buildAlert(bpm, status, timestamp) {
  const messages = {
    HIGH: `Elevated heart rate detected for ${SOLDIER.id}`,
    LOW:  `Low heart rate detected for ${SOLDIER.id}`,
  };
  return { type: status, bpm, message: messages[status], timestamp };
}

export default function App() {
  const [latestBpm, setLatestBpm]   = useState(null);
  const [history, setHistory]       = useState([]);
  const [alerts, setAlerts]         = useState([]);
  const [status, setStatus]         = useState('NO_SIGNAL');
  const [connLost, setConnLost]     = useState(false);

  const lastSeenRef  = useRef(0);
  const failCountRef = useRef(0);
  const prevStatus   = useRef('NO_SIGNAL');

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch('/latest');
        if (!res.ok) throw new Error('bad response');
        const json = await res.json();
        failCountRef.current = 0;
        setConnLost(false);

        if (json.data) {
          const { bpm, timestamp } = json.data;
          lastSeenRef.current = new Date(timestamp).getTime();
          setLatestBpm(bpm);
        }
      } catch {
        failCountRef.current += 1;
        if (failCountRef.current >= FAIL_THRESHOLD) setConnLost(true);
      }
    }

    async function fetchHistory() {
      try {
        const res = await fetch('/history');
        if (!res.ok) return;
        const json = await res.json();
        setHistory(json.data || []);
      } catch { /* silent */ }
    }

    fetchLatest();
    fetchHistory();
    const latestId  = setInterval(fetchLatest,  POLL_MS);
    const historyId = setInterval(fetchHistory, POLL_MS * 3);
    return () => { clearInterval(latestId); clearInterval(historyId); };
  }, []);

  // Derive status and generate alerts
  useEffect(() => {
    const newStatus = getStatus(latestBpm, lastSeenRef.current);
    setStatus(newStatus);

    if ((newStatus === 'HIGH' || newStatus === 'LOW') && newStatus !== prevStatus.current) {
      const alert = buildAlert(latestBpm, newStatus, new Date().toISOString());
      setAlerts(prev => [alert, ...prev].slice(0, MAX_ALERTS));
    }
    prevStatus.current = newStatus;
  }, [latestBpm]);

  return (
    <div id="app-root">
      <Header />
      <main className="app-wrapper">
        {connLost && (
          <div className="connection-banner" role="alert">
            ⚠ CONNECTION LOST — UNABLE TO REACH SERVER
          </div>
        )}

        <div className="top-grid">
          <SoldierCard soldier={SOLDIER} />
          <LiveStatusCard bpm={latestBpm} status={status} />
        </div>

        <BPMGraph history={history} status={status} />
        <AlertsPanel alerts={alerts} />
      </main>
    </div>
  );
}
