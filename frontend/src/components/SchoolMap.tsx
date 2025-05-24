"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Map, NavigationControl } from "maplibre-gl-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface AdvancedSchoolMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  schoolName?: string;
}

export default function AdvancedSchoolMap({
  latitude,
  longitude,
  zoom = 15,
  schoolName = "School Location",
}: AdvancedSchoolMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const leafletMap = L.map(mapContainer.current).setView(
      [latitude, longitude],
      zoom,
    );

    // Add MapLibre layer
    const maplibreLayer = new Map({
      style: "https://demotiles.maplibre.org/style.json", // Free style
    });
    maplibreLayer.addTo(leafletMap);

    // Add navigation control
    L.control.addTo(leafletMap);

    // Add marker
    L.marker([latitude, longitude]).addTo(leafletMap).bindPopup(schoolName);

    map.current = leafletMap;

    return () => {
      leafletMap.remove();
    };
  }, [latitude, longitude, zoom, schoolName]);

  return (
    <div
      ref={mapContainer}
      className="h-full w-full overflow-hidden rounded-lg border"
    />
  );
}
