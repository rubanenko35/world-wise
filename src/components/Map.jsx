import styles from "./Map.module.css";
import {useNavigate, useSearchParams} from "react-router-dom";
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from "react-leaflet";
import {useEffect, useState} from "react";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import {useCities} from "../contexts/CitiesContext.jsx";
import {useGeolocation} from "../hooks/useGeolocation.js";
import Button from "./Button.jsx";
import {useUrlPosition} from "../hooks/useUrlPosition.js";

const defIcon = L.icon({
  iconUrl: icon, shadowUrl: iconShadow
});

function Map() {
  const {cities} = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { isLoading: isLoadingPosition, position: geolocationPosition, getPosition } = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition();


  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([mapLat, mapLng]);
    }
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition) {
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }
  }, [geolocationPosition])

  return <div className={styles.mapContainer}>
    <Button type='position' onClick={getPosition}>{ isLoadingPosition ? 'Loading...' : 'Use your position'}</Button>
    <MapContainer
      center={mapPosition}
      zoom={6}
      scrollWheelZoom={true}
      className={styles.map}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      {cities.map(item => (<Marker key={item.id} position={[item.position.lat, item.position.lng]} icon={defIcon}>
        <Popup>
          <span>{item.emoji}</span><span>{item.notes || 'No notes'}</span>
        </Popup>
      </Marker>))}

      <ChangeCenter position={mapPosition}/>
      <DetectClick/>
    </MapContainer>
  </div>;
}

function ChangeCenter({position}) {
  const map = useMap();
  map.setView(position);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      console.log(e.latlng);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    }
  })

  return null;
}

export default Map;
