import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (n) => String(n).padStart(2, '0');
  const timeStr = `${fmt(time.getHours())}:${fmt(time.getMinutes())}:${fmt(time.getSeconds())}`;
  const dateStr = time.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

  return (
    <header className="site-header">
      <div className="header-left">
        <div className="header-emblem">⬡</div>
        <div>
          <h1 className="header-title">SOLDIER HEALTH MONITORING SYSTEM</h1>
          <p className="header-sub">TACTICAL BIOMETRIC OPERATIONS · CLASSIFIED</p>
        </div>
      </div>
      <div className="header-right">
        <div className="header-clock">{timeStr}</div>
        <div className="header-date">{dateStr}</div>
        <div className="header-status-dot" title="System Online" />
        <button className="header-logout-btn" onClick={handleLogout}>LOGOUT</button>
      </div>
    </header>
  );
}
