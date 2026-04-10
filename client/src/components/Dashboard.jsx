import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Header from './Header';
import SoldierCard from './SoldierCard';
import HeartRateCard from './HeartRateCard';
import TemperatureCard from './TemperatureCard';
import BPMGraph from './BPMGraph';
import SoldierMap from './SoldierMap';
import AlertsPanel from './AlertsPanel';
import soldiers from '../data/soldiers';
import '../App.css';

const SOLDIER = soldiers[0];
const NO_SIGNAL_THRESHOLD_MS = 10000; // Increased to 10s for real hardware
const MAX_ALERTS = 10;
const MAX_HISTORY = 50;

function getStatus(bpm, lastSeenMs) {
  if (!bpm || Date.now() - lastSeenMs > NO_SIGNAL_THRESHOLD_MS) return 'NO_SIGNAL';
  if (bpm > 100) return 'HIGH';
  if (bpm < 50) return 'LOW';
  return 'NORMAL';
}

function buildAlert(bpm, status, timestamp) {
  const messages = {
    HIGH: `Elevated heart rate detected for ${SOLDIER.id}`,
    LOW: `Low heart rate detected for ${SOLDIER.id}`,
  };
  return { type: status, bpm, message: messages[status], timestamp };
}

export default function Dashboard() {
  const [latestBpm, setLatestBpm] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [location, setLocation] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [status, setStatus] = useState('NO_SIGNAL');
  const [connLost, setConnLost] = useState(false);
  const [lastSeen, setLastSeen] = useState(0);

  const prevStatus = useRef('NO_SIGNAL');
  const socketRef = useRef(null);

  useEffect(() => {
    // 1. Initial Data Fetch
    async function initFetch() {
      try {
        const hRes = await fetch(`http://localhost:5000/api/history?soldierId=${SOLDIER.id}`);
        const hJson = await hRes.json();
        const data = hJson.data || [];
        setHistory(data);

        if (data.length > 0) {
          const latest = data[data.length - 1];
          setLatestBpm(latest.bpm);
          setTemperature(latest.temperature);
          setLocation(latest.location);
          setLastSeen(new Date(latest.timestamp).getTime());
        }
      } catch (err) {
        console.error('Initial fetch failed:', err);
        setConnLost(true);
      }
    }
    initFetch();

    // 2. Setup WebSocket
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket');
      setConnLost(false);
    });

    socketRef.current.on('disconnect', () => {
      console.warn('Disconnected from WebSocket');
      setConnLost(true);
    });

    socketRef.current.on('telemetryUpdate', (reading) => {
      if (reading.soldierId !== SOLDIER.id) return;

      setLatestBpm(reading.bpm);
      setTemperature(reading.temperature);
      setLocation(reading.location);
      setLastSeen(new Date(reading.timestamp).getTime());

      setHistory(prev => {
        const next = [...prev, reading];
        if (next.length > MAX_HISTORY) return next.slice(1);
        return next;
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Update Status and Alerts based on latest tracking
  useEffect(() => {
    const newStatus = getStatus(latestBpm, lastSeen);
    setStatus(newStatus);

    if ((newStatus === 'HIGH' || newStatus === 'LOW') && newStatus !== prevStatus.current) {
      const alert = buildAlert(latestBpm, newStatus, new Date().toISOString());
      setAlerts(prev => [alert, ...prev].slice(0, MAX_ALERTS));
    }
    prevStatus.current = newStatus;

    // Tick signal status every 1s
    const tick = setInterval(() => {
      setStatus(getStatus(latestBpm, lastSeen));
    }, 1000);
    return () => clearInterval(tick);
  }, [latestBpm, lastSeen]);

  return (
    <div id="app-root">
      <Header />
      <main className="app-wrapper">
        {connLost && (
          <div className="connection-banner" role="alert">
            ⚠ CONNECTION LOST — RECONNECTING TO HARDWARE PIPELINE...
          </div>
        )}

        <div className="top-grid">
          <SoldierCard soldier={SOLDIER} />
          <HeartRateCard bpm={latestBpm} status={status} />
          <TemperatureCard temperature={temperature} />
        </div>

        <div className="telemetry-grid">
          <BPMGraph history={history} status={status} />
          <SoldierMap location={location} soldierName={SOLDIER.name} />
        </div>

        <AlertsPanel alerts={alerts} />
      </main>
    </div>
  );
}

