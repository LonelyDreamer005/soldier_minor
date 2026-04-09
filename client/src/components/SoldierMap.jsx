import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

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

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function SoldierMap({ location, soldierName }) {
  const position = location ? [location.lat, location.lng] : [17.3850, 78.4867];

  return (
    <div className="map-card card">
      <div className="card-header">
        <h3 className="card-title">LIVE LOCATION</h3>
        <span className="coord-box">
          {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'SIGNAL SEARCHING...'}
        </span>
      </div>
      <div className="map-container-wrapper">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '300px', width: '100%', borderRadius: '8px', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // Using a dark themed map would be better for premium look
          />
          <ChangeView center={position} />
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
