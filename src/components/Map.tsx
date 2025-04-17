import { useEffect, useRef } from "react";
import { Alert } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type MapProps = {
  alerts?: Alert[];
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  className?: string;
};

const Map = ({ alerts, currentLocation, className }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const defaultCenter: [number, number] = [76.8739735, 30.8778122]; // Longitude comes first in MapLibre

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap Contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: currentLocation ? [currentLocation.longitude, currentLocation.latitude] : defaultCenter,
      zoom: 14
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl());

    // Add current location marker
    if (currentLocation) {
      const marker = new maplibregl.Marker({
        color: '#3b82f6',
      })
        .setLngLat([currentLocation.longitude, currentLocation.latitude])
        .setPopup(new maplibregl.Popup().setHTML('<p>Your current location</p>'))
        .addTo(map.current);
    }

    // Add alert markers
    alerts?.forEach((alert) => {
      const color = alert.status === 'active' ? '#ef4444' : '#6b7280';
      const marker = new maplibregl.Marker({
        color: color,
      })
        .setLngLat([alert.location.longitude, alert.location.latitude])
        .setPopup(
          new maplibregl.Popup().setHTML(`
            <div class="text-sm">
              <p class="font-semibold">${alert.status === 'active' ? 'Active Alert' : 'Past Alert'}</p>
              <p class="text-gray-600">${new Date(alert.timestamp).toLocaleString()}</p>
            </div>
          `)
        )
        .addTo(map.current);
    });

    return () => {
      map.current?.remove();
    };
  }, [currentLocation, alerts]);

  return (
    <div className={cn("relative rounded-lg overflow-hidden bg-gray-100 border h-[400px]", className)}>
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default Map;
