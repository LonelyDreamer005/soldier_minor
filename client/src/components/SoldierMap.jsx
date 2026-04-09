import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useCallback } from 'react';

// Fix for default marker icon in Leaflet + Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function ResizeMap({ isExpanded }) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 400); // Wait for CSS transition
  }, [isExpanded, map]);
  return null;
}

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function SoldierMap({ location, soldierName }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const position = location ? [location.lat, location.lng] : [17.3850, 78.4867];

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    if (isExpanded) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded]);

  return (
    <div 
      className={`map-card card ${isExpanded ? 'is-expanded' : ''}`}
      onClick={!isExpanded ? toggleExpand : undefined}
    >
      <div className="card-header">
        <h3 className="card-title">
          {isExpanded ? 'TACTICAL GEOSPATIAL VIEW' : 'LIVE LOCATION'}
        </h3>
        <div className="card-header-actions">
          <span className="coord-box">
            {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'SIGNAL SEARCHING...'}
          </span>
          {isExpanded && (
            <button className="map-close-btn" onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}>
              ✕ CLOSE
            </button>
          )}
        </div>
      </div>
      
      {!isExpanded && (
        <div className="map-expand-hint">
          <span>⤢ CLICK TO EXPAND TACTICAL VIEW</span>
        </div>
      )}

      <div className="map-container-wrapper">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={isExpanded}
          zoomControl={isExpanded}
          style={{ height: '100%', width: '100%', borderRadius: '8px', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={position} />
          <ResizeMap isExpanded={isExpanded} />
          <Marker position={position}>
            <Popup>
              {soldierName} <br /> Current Position
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
