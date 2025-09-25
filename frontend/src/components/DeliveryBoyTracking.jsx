import React from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";

// Custom icons
const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Dynamically adjust map bounds
function ChangeMapView({ coords }) {
  const map = useMap();
  if (coords && coords.length > 0) {
    map.fitBounds(coords, { padding: [50, 50] });
  }
  return null;
}

function DeliveryBoyTracking({ data }) {
  const deliveryBoyLat = Number(data?.deliveryBoyLocation?.lat);
  const deliveryBoyLon = Number(data?.deliveryBoyLocation?.lon);
  const customerLat = Number(data?.customerLocation?.lat);
  const customerLon = Number(data?.customerLocation?.lon);

  // Safety check
  if (
    !deliveryBoyLat ||
    !deliveryBoyLon ||
    !customerLat ||
    !customerLon ||
    isNaN(deliveryBoyLat) ||
    isNaN(deliveryBoyLon) ||
    isNaN(customerLat) ||
    isNaN(customerLon)
  ) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gray-100 rounded-xl">
        <p className="text-gray-600">📍 Location not available</p>
      </div>
    );
  }

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={[deliveryBoyLat, deliveryBoyLon]}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Delivery Boy Marker */}
        <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyIcon}>
          <Popup>
            🚴 Delivery Boy <br />
            Lat: {deliveryBoyLat}, Lon: {deliveryBoyLon}
          </Popup>
        </Marker>

        {/* Customer Marker */}
        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
          <Popup>
            🏠 Customer <br />
            Lat: {customerLat}, Lon: {customerLon}
          </Popup>
        </Marker>

        {/* Route Line */}
        <Polyline positions={path} color="orange" weight={4} />

        {/* Auto fit map */}
        <ChangeMapView coords={path} />
      </MapContainer>
    </div>
  );
}

export default DeliveryBoyTracking;
