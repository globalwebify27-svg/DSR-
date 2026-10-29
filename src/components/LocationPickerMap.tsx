"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";

interface LocationPickerMapProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
  className?: string;
}

interface LeafletLatLng {
  lat: number;
  lng: number;
}

interface LeafletMouseEvent {
  latlng: LeafletLatLng;
}

interface LeafletMap {
  setView: (center: [number, number], zoom: number) => LeafletMap;
  flyTo: (center: [number, number], zoom: number, options?: { duration?: number }) => LeafletMap;
  on: (event: string, fn: (e: LeafletMouseEvent) => void) => void;
  remove: () => void;
  invalidateSize: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

interface LeafletMarker {
  addTo: (map: LeafletMap) => LeafletMarker;
  setLatLng: (latlng: [number, number] | LeafletLatLng) => LeafletMarker;
  getLatLng: () => LeafletLatLng;
  on: (event: string, fn: () => void) => void;
  remove: () => void;
}

interface LeafletDivIconOptions {
  className?: string;
  html?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
}

interface LeafletTileLayer {
  addTo: (map: LeafletMap) => LeafletTileLayer;
}

interface LeafletRoot {
  map: (element: HTMLElement, options?: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options?: Record<string, unknown>) => LeafletTileLayer;
  marker: (latlng: [number, number] | LeafletLatLng, options?: Record<string, unknown>) => LeafletMarker;
  divIcon: (options: LeafletDivIconOptions) => unknown;
}

function getGlobalLeaflet(): LeafletRoot | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { L?: LeafletRoot }).L;
}

export function LocationPickerMap({
  latitude,
  longitude,
  onLocationSelect,
  className = "",
}: LocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  // Stable callback ref to avoid re-binding map events on every render
  const onSelectRef = useRef(onLocationSelect);
  useEffect(() => {
    onSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Initial center: if coordinates provided use them, otherwise default to Ranchi (23.3441, 85.3096)
  const defaultCenter: [number, number] = [
    latitude ?? 23.3441,
    longitude ?? 85.3096,
  ];
  const hasCoords = typeof latitude === "number" && typeof longitude === "number";

  // Create custom marker SVG icon
  const createMarkerIcon = useCallback((L: LeafletRoot) => {
    return L.divIcon({
      className: "dsr-custom-map-pin",
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: grab;">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#FF5722" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.35)); transform: translateY(-12px);">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3.2" fill="#FFFFFF"></circle>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, []);

  // Load Leaflet CSS and JS
  useEffect(() => {
    let isCancelled = false;

    const loadLeafletAssets = async () => {
      if (typeof window === "undefined") return;

      // 1. Ensure Leaflet CSS is present
      if (!document.getElementById("leaflet-css-bundle")) {
        const link = document.createElement("link");
        link.id = "leaflet-css-bundle";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // 2. Load Leaflet JS
      const getLeaflet = (): Promise<LeafletRoot> => {
        const existingL = getGlobalLeaflet();
        if (existingL) {
          return Promise.resolve(existingL);
        }
        return new Promise((resolve, reject) => {
          const existing = document.getElementById("leaflet-js-bundle");
          if (existing) {
            existing.addEventListener("load", () => {
              const loadedL = getGlobalLeaflet();
              if (loadedL) resolve(loadedL);
              else reject(new Error("Leaflet unavailable after load"));
            });
            existing.addEventListener("error", () => reject(new Error("Failed to load map library")));
            return;
          }
          const script = document.createElement("script");
          script.id = "leaflet-js-bundle";
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.async = true;
          script.onload = () => {
            const loadedL = getGlobalLeaflet();
            if (loadedL) resolve(loadedL);
            else reject(new Error("Leaflet unavailable"));
          };
          script.onerror = () => reject(new Error("Failed to load map library"));
          document.body.appendChild(script);
        });
      };

      try {
        const L = await getLeaflet();
        if (isCancelled || !containerRef.current) return;

        // Clean up previous instance if any
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(containerRef.current, {
          center: defaultCenter,
          zoom: hasCoords ? 16 : 12,
          scrollWheelZoom: false, // Prevent page scroll entrapment
          zoomControl: false, // Custom zoom buttons provided below
        });

        // Add OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        }).addTo(map);

        mapInstanceRef.current = map;

        // Custom marker pin
        const pinIcon = createMarkerIcon(L);

        // If coordinates already exist, place the pin
        if (typeof latitude === "number" && typeof longitude === "number") {
          const initialLat = latitude;
          const initialLng = longitude;
          const marker = L.marker([initialLat, initialLng], {
            icon: pinIcon,
            draggable: true,
          }).addTo(map);

          marker.on("dragend", () => {
            const pos = marker.getLatLng();
            onSelectRef.current(pos.lat, pos.lng);
          });

          markerRef.current = marker;
        }

        // On map click, place or move marker
        map.on("click", (e: LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            const marker = L.marker([lat, lng], {
              icon: pinIcon,
              draggable: true,
            }).addTo(map);

            marker.on("dragend", () => {
              const pos = marker.getLatLng();
              onSelectRef.current(pos.lat, pos.lng);
            });

            markerRef.current = marker;
          }

          onSelectRef.current(lat, lng);
        });

        // Ensure tiles fit properly
        setTimeout(() => {
          if (!isCancelled && mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 150);

        setIsLoading(false);
      } catch (err: unknown) {
        if (!isCancelled) {
          console.error("Leaflet load error:", err);
          setLoadError("Unable to load map tiles. Please check your connection.");
          setIsLoading(false);
        }
      }
    };

    loadLeafletAssets();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker position and center map when latitude/longitude props change externally
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof latitude !== "number" || typeof longitude !== "number") return;

    const lat = latitude;
    const lng = longitude;

    const L = getGlobalLeaflet();
    if (!L) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const pinIcon = createMarkerIcon(L);
      const marker = L.marker([lat, lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onSelectRef.current(pos.lat, pos.lng);
      });

      markerRef.current = marker;
    }

    map.flyTo([lat, lng], 16, { duration: 0.8 });
  }, [latitude, longitude, createMarkerIcon]);

  // Handle Locate Me button click
  const handleLocateMe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude: lat, longitude: lng } = pos.coords;
        onSelectRef.current(lat, lng);
      },
      (error) => {
        setLocating(false);
        alert(error.message || "Failed to retrieve your current location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div className={`relative w-full rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F8F9FA] ${className}`}>
      {/* Map DOM Container */}
      <div ref={containerRef} className="w-full h-48 sm:h-52 z-0" />

      {/* Top Status Banner */}
      <div className="absolute top-2 left-2 z-10 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-[#E5E7EB] flex items-center gap-1.5 text-[11px] text-[#171923]">
          {hasCoords ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-[#171923]">Pinned:</span>
              <span className="text-[#737784] font-mono text-[10px]">
                {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
              </span>
            </>
          ) : (
            <>
              <MapPin className="w-3 h-3 text-[#FF5722]" />
              <span className="text-[#4B5563] font-medium">Click map to pin exact location</span>
            </>
          )}
        </div>
      </div>

      {/* Map Action Controls (Top-Right) */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating}
          title="Locate my position"
          className="w-7 h-7 bg-white hover:bg-gray-50 text-[#171923] rounded-md shadow-xs border border-[#E5E7EB] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
        >
          <Navigation className={`w-3.5 h-3.5 text-[#FF5722] ${locating ? "animate-spin" : ""}`} />
        </button>

        <div className="bg-white rounded-md shadow-xs border border-[#E5E7EB] flex flex-col overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-7 h-7 hover:bg-gray-50 text-[#171923] font-bold text-xs flex items-center justify-center border-b border-[#E5E7EB] transition-colors cursor-pointer"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-7 h-7 hover:bg-gray-50 text-[#171923] font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
          >
            &minus;
          </button>
        </div>
      </div>

      {/* Bottom Hint */}
      {hasCoords && (
        <div className="absolute bottom-1.5 left-2 z-10 pointer-events-none">
          <span className="bg-white/90 backdrop-blur-2xs px-2 py-0.5 rounded text-[10px] text-[#737784] border border-[#E5E7EB]">
            💡 Drag pin or click anywhere to adjust
          </span>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-[#F8F9FA] flex flex-col items-center justify-center gap-2 text-[#737784]">
          <Loader2 className="w-5 h-5 text-[#FF5722] animate-spin" />
          <span className="text-xs font-medium">Loading interactive map...</span>
        </div>
      )}

      {/* Error Overlay */}
      {loadError && !isLoading && (
        <div className="absolute inset-0 z-20 bg-red-50/90 flex flex-col items-center justify-center p-3 text-center">
          <p className="text-xs text-red-600 font-medium mb-1">{loadError}</p>
          <span className="text-[11px] text-[#737784]">
            You can still capture GPS or type place name manually.
          </span>
        </div>
      )}
    </div>
  );
}
