"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Location {
  name: string;
  address?: string;
  latitude: string | number;
  longitude: string | number;
}

interface LocationMapProps {
  locations: Location[];
}

// Component to handle map bounds automatically
function SetBounds({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map(
          (loc) =>
            [
              typeof loc.latitude === "string"
                ? parseFloat(loc.latitude)
                : loc.latitude,
              typeof loc.longitude === "string"
                ? parseFloat(loc.longitude)
                : loc.longitude,
            ] as [number, number],
        ),
      );

      if (locations.length === 1) {
        map.setView(bounds.getCenter(), 15);
      } else {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [locations, map]);

  return null;
}

export function LocationMap({ locations }: LocationMapProps) {
  // Filter valid locations
  const validLocations = locations.filter(
    (loc) => loc.latitude && loc.longitude,
  );

  // Default center if no locations
  const defaultCenter: [number, number] = [6.9271, 79.8612]; // Colombo

  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <SetBounds locations={validLocations} />

        {validLocations.map((loc, idx) => {
          const lat =
            typeof loc.latitude === "string"
              ? parseFloat(loc.latitude)
              : loc.latitude;
          const lng =
            typeof loc.longitude === "string"
              ? parseFloat(loc.longitude)
              : loc.longitude;

          return (
            <Marker key={idx} position={[lat, lng]}>
              <Popup>
                <div className="text-center p-2">
                  <strong className="text-lg block mb-1 text-gray-900">
                    {loc.name || "Branch"}
                  </strong>
                  {loc.address && (
                    <p className="text-sm text-gray-600 mb-2">{loc.address}</p>
                  )}
                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#D4AF37] text-white px-3 py-1 rounded-lg hover:bg-[#B8962D] text-xs font-semibold inline-block transition-colors"
                  >
                    Directions →
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
