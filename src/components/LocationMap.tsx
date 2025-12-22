'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapProps {
    latitude: number;
    longitude: number;
    locationName?: string;
    address?: string;
}

export function LocationMap({ latitude, longitude, locationName = 'Our Location', address }: LocationMapProps) {
    // Default to Nugegoda, Sri Lanka if no coordinates provided
    const lat = latitude || 6.8649;
    const lng = longitude || 79.8997;

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <MapContainer
                center={[lat, lng]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        <div className="text-center p-2">
                            <strong className="text-lg block mb-1">{locationName}</strong>
                            {address && <p className="text-sm text-gray-600">{address}</p>}
                            <a
                                href={`https://www.google.com/maps?q=${lat},${lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#D4AF37] hover:underline text-sm mt-2 inline-block"
                            >
                                Open in Google Maps →
                            </a>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
