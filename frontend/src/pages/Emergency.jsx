import { useState, useContext, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Ambulance,
  Hospital,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Search,
  X,
  Satellite,
} from "lucide-react";
import { DarkModeContext } from "../App";
import Header from "../components/Header";
import maplibregl from "maplibre-gl";
import axios from "axios";
import "maplibre-gl/dist/maplibre-gl.css";

const orsApiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjgyNGUwMDBmYzBiNTQxODRiNDczYTIwY2Q3YjIxYWQ2IiwiaCI6Im11cm11cjY0In0=";
const mapboxKey = process.env.REACT_APP_MAPBOX_KEY || "";

function EmergencyGuide({ title, steps }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const cardBg = darkMode
    ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB] hover:bg-[#0A2A43]/50"
    : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62] hover:bg-white/50";

  return (
    <motion.div className="mb-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex justify-between items-center w-full p-4 rounded-[40px] ${cardBg} shadow-md transition-all duration-500 backdrop-blur-2xl border-none outline-none`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </motion.button>
      {isExpanded && (
        <motion.ol
          className={`list-decimal list-inside mt-2 p-4 rounded-[40px] space-y-1 text-sm ${cardBg} shadow-md transition-all duration-500 backdrop-blur-2xl border-none outline-none`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </motion.ol>
      )}
    </motion.div>
  );
}

function MapStyleSwitcher({ mapStyle, setMapStyle, mapInstanceRef, routeGeoJSON, userMarkerRef, setIsMapLoaded, setStyleLoading, destination, routeInfo, setTileLoadStatus }) {
  const { darkMode } = useContext(DarkModeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardBg = darkMode
    ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB] hover:bg-[#0A2A43]/50"
    : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62] hover:bg-white/50";

  const defaultStyle = {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "",
      },
    },
    layers: [
      {
        id: "osm-tiles",
        type: "raster",
        source: "osm",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };

  const googleStyle = {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "",
      },
      vector: {
        type: "vector",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.pbf"],
        minzoom: 0,
        maxzoom: 14,
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: { "background-color": darkMode ? "#0A2A43" : "#F5F5F5" },
      },
      {
        id: "land",
        type: "fill",
        source: "vector",
        "source-layer": "landuse",
        filter: ["==", "class", "park"],
        paint: {
          "fill-color": "#34C759",
          "fill-opacity": 0.6,
        },
      },
      {
        id: "water",
        type: "fill",
        source: "vector",
        "source-layer": "water",
        paint: {
          "fill-color": "#A1C2F1",
          "fill-opacity": 0.8,
        },
      },
      {
        id: "roads",
        type: "line",
        source: "vector",
        "source-layer": "roads",
        paint: {
          "line-color": "#4285F4",
          "line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 15, 3],
          "line-opacity": 0.9,
        },
      },
      {
        id: "road-labels",
        type: "symbol",
        source: "vector",
        "source-layer": "roads",
        minzoom: 12,
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": darkMode ? "#FFFFFF" : "#333333",
          "text-halo-color": darkMode ? "#000000" : "#FFFFFF",
          "text-halo-width": 1,
        },
      },
      {
        id: "buildings",
        type: "fill-extrusion",
        source: "vector",
        "source-layer": "buildings",
        minzoom: 12,
        paint: {
          "fill-extrusion-color": "#E8ECEF",
          "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 12, 0, 15, ["get", "height", 10]],
          "fill-extrusion-opacity": 0.7,
        },
      },
      {
        id: "building-labels",
        type: "symbol",
        source: "vector",
        "source-layer": "buildings",
        minzoom: 14,
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Arial Unicode MS Bold"],
          "text-size": 10,
        },
        paint: {
          "text-color": darkMode ? "#FFFFFF" : "#333333",
          "text-halo-color": darkMode ? "#000000" : "#FFFFFF",
          "text-halo-width": 1,
        },
      },
    ],
  };

  const getMapStyle = (style) => {
    if (style === "satellite") {
      return {
        version: 8,
        sources: {
          satellite: {
            type: "raster",
            tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
            tileSize: 256,
            attribution: "",
          },
        },
        layers: [
          {
            id: "satellite-tiles",
            type: "raster",
            source: "satellite",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      };
    }
    return style === "3d" ? googleStyle : mapboxKey ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${mapboxKey}` : defaultStyle;
  };

  const handleStyleChange = (newStyle) => {
    setMapStyle(newStyle);
    setIsMapLoaded(false);
    setStyleLoading(true);
    setTileLoadStatus("loading");
    setIsMenuOpen(false);

    if (mapInstanceRef.current) {
      try {
        const map = mapInstanceRef.current;
        const styleConfig = getMapStyle(newStyle);

        map.setStyle(styleConfig);

        const tileLoadTimeout = setTimeout(() => {
          if ((newStyle === "satellite" || newStyle === "3d") && (!map.isStyleLoaded() || !map.areTilesLoaded())) {
            console.warn(`${newStyle} tiles failed to load, switching to OpenStreetMap`);
            setTileLoadStatus("failed");
            map.setStyle(defaultStyle);
            setIsMapLoaded(true);
            setStyleLoading(false);
          }
        }, 8000);

        map.once("style.load", () => {
          clearTimeout(tileLoadTimeout);
          if (newStyle === "3d") {
            map.setPitch(60);
            try {
              map.addSource("mapzen-terrain", {
                type: "raster-dem",
                tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
                tileSize: 256,
                encoding: "terrarium",
                maxzoom: 15,
              });
              map.setTerrain({
                source: "mapzen-terrain",
                exaggeration: 1.2,
              });
              map.setLight({
                anchor: "viewport",
                color: "#FFFFFF",
                intensity: 0.3,
                position: [1.15, 210, 30],
              });
              map.addLayer({
                id: "sky",
                type: "sky",
                paint: {
                  "sky-type": "gradient",
                  "sky-color-stops": [[0, "#D1E5FB"], [1, "#FFFFFF"]],
                },
              });
              console.log("3D terrain loaded successfully with Google Maps style");
            } catch (terrainError) {
              console.error("Failed to load 3D terrain:", terrainError);
              setTileLoadStatus("terrain-failed");
              map.setPitch(0);
            }
          } else {
            map.setPitch(0);
            if (map.getSource("mapzen-terrain")) {
              map.setTerrain(null);
              map.removeSource("mapzen-terrain");
            }
          }
          map.resize();
          map.triggerRepaint();
          setIsMapLoaded(true);
          setStyleLoading(false);
          setTileLoadStatus(newStyle === "3d" && map.getTerrain() ? "success" : newStyle === "satellite" && map.isStyleLoaded() && map.areTilesLoaded() ? "success" : "failed");

          // Re-add route and markers
          if (routeGeoJSON) {
            map.addSource("route", {
              type: "geojson",
              data: routeGeoJSON,
            });
            map.addLayer({
              id: "route-line",
              type: "line",
              source: "route",
              paint: {
                "line-color": "#4285F4",
                "line-width": 5,
                "line-opacity": 0.8,
              },
            });
          }
          if (userMarkerRef.current) {
            userMarkerRef.current.addTo(map);
          }
          if (destination && routeInfo) {
            map.easeTo({
              center: destination,
              zoom: 15,
              duration: 1000,
            });
          }
        });

        map.on("error", (e) => {
          console.error("Map style error:", e.error);
          setTileLoadStatus("failed");
          map.setStyle(defaultStyle);
          setIsMapLoaded(true);
          setStyleLoading(false);
        });
      } catch (error) {
        console.error("Error switching map style:", error);
        mapInstanceRef.current.setStyle(defaultStyle);
        setIsMapLoaded(true);
        setStyleLoading(false);
        setTileLoadStatus("failed");
      }
    }
  };

  return (
    <motion.div
      className={`absolute top-4 left-4 z-10 rounded-[40px] p-1 ${cardBg} backdrop-blur-2xl shadow-md transition-all duration-500 border-none outline-none`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`px-3 py-2 rounded-[40px] flex items-center justify-center text-sm font-medium ${cardBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-500 backdrop-blur-2xl border-none outline-none`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-expanded={isMenuOpen}
        aria-label={`Current map style: ${mapStyle === "2d" ? "2D" : mapStyle === "3d" ? "3D" : "Satellite"}`}
      >
        {mapStyle === "satellite" ? (
          <Satellite className="w-5 h-5" />
        ) : (
          mapStyle.toUpperCase()
        )}
      </motion.button>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.ul
            className={`absolute top-16 left-4 w-32 rounded-[40px] shadow-lg overflow-hidden ${cardBg} backdrop-blur-2xl transition-all duration-500 border-none outline-none`}
            initial={{ opacity: 0, scaleY: 0, transformOrigin: "top" }}
            animate={{ opacity: 1, scaleY: 1, transformOrigin: "top" }}
            exit={{ opacity: 0, scaleY: 0, transformOrigin: "top" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {["2d", "3d", "satellite"].map((style) => (
              <motion.li
                key={style}
                onClick={() => handleStyleChange(style)}
                className={`p-3 text-sm font-medium cursor-pointer ${mapStyle === style ? "bg-[#00C2CB] text-white" : `${cardBg} backdrop-blur-2xl transition-all duration-500`}`}
                whileHover={{ backgroundColor: darkMode ? "#00C2CB" : "#E5E7EB" }}
                role="menuitem"
                aria-label={`Switch to ${style === "2d" ? "2D" : style === "3d" ? "3D" : "Satellite"} view`}
              >
                {style === "2d" ? "2D" : style === "3d" ? "3D" : "Satellite"}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Emergency() {
  const { darkMode } = useContext(DarkModeContext);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [mapStyle, setMapStyle] = useState("2d");
  const [destination, setDestination] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [styleLoading, setStyleLoading] = useState(false);
  const [tileLoadStatus, setTileLoadStatus] = useState("loading");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const lastLocationRef = useRef(null);
  const lastSpokenStepRef = useRef(-1);
  const lastUpdateTimeRef = useRef(0);
  const lastDistanceUpdateRef = useRef(0);
  const lastClosestIndexRef = useRef(0);

  const cardBg = darkMode
    ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB] hover:bg-[#0A2A43]/50"
    : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62] hover:bg-white/50";

  const emergencyServices = [
    { name: "Edhi Ambulance", phone: "115", icon: Ambulance },
    { name: "Chhipa Ambulance", phone: "1020", icon: Ambulance },
    { name: "Rescue 1122", phone: "1122", icon: Hospital },
    { name: "Police Emergency", phone: "15", icon: Phone },
    { name: "Fire Brigade", phone: "16", icon: Phone },
    { name: "Bomb Disposal", phone: "1717", icon: Phone },
    { name: "Poison Control", phone: "(021) 99215718", icon: Phone },
  ];

  const emergencyGuides = {
    cpr: {
      title: "How to Perform CPR",
      steps: [
        "Ensure scene safety.",
        "Tap & shout.",
        "Call 911.",
        "Check breathing.",
        "30 compressions + 2 breaths cycles.",
      ],
    },
    choking: {
      title: "Help Choking Person",
      steps: [
        "Ask if choking.",
        "5 back blows.",
        "5 abdominal thrusts.",
        "Repeat or start CPR.",
      ],
    },
    bleeding: {
      title: "Stop Severe Bleeding",
      steps: [
        "Wear gloves.",
        "Press on wound.",
        "Add layers.",
        "Elevate limb.",
        "Tourniquet if needed.",
        "Call emergency services.",
      ],
    },
  };

  const getDistance = (loc1, loc2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371e3;
    const lat1 = loc1[1], lon1 = loc1[0], lat2 = loc2[1], lon2 = loc2[0];
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getBearing = (loc1, loc2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const toDeg = (x) => (x * 180) / Math.PI;
    const lat1 = toRad(loc1[1]), lon1 = toRad(loc1[0]);
    const lat2 = toRad(loc2[1]), lon2 = toRad(loc2[0]);
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  };

  const speakDirection = (text) => {
    if (isMuted) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const cancelRoute = () => {
    window.speechSynthesis.cancel();
    setDestination(null);
    setRouteGeoJSON(null);
    setRouteInfo(null);
    setIsTracking(false);
    if (mapInstanceRef.current && mapInstanceRef.current.getSource("route")) {
      mapInstanceRef.current.removeLayer("route-line");
      mapInstanceRef.current.removeSource("route");
    }
    if (mapInstanceRef.current && location) {
      mapInstanceRef.current.easeTo({
        center: location,
        zoom: 15,
        duration: 1000,
      });
    }
  };

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastUpdateTimeRef.current < 15000) return;
        const { latitude, longitude, heading } = pos.coords;
        const newLocation = [longitude, latitude];
        if (!lastLocationRef.current || getDistance(lastLocationRef.current, newLocation) > 150) {
          setLocation(newLocation);
          if (heading !== null) setHeading(heading);
          lastLocationRef.current = newLocation;
          lastUpdateTimeRef.current = now;
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Location access denied. Please enable location services.");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!location || !mapRef.current) return;

    const defaultStyle = {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "",
        },
      },
      layers: [
        {
          id: "osm-tiles",
          type: "raster",
          source: "osm",
          minzoom: 0,
          maxzoom: 22,
        },
      ],
    };

    const googleStyle = {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "",
        },
        vector: {
          type: "vector",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.pbf"],
          minzoom: 0,
          maxzoom: 14,
        },
      },
      layers: [
        {
          id: "background",
          type: "background",
          paint: { "background-color": darkMode ? "#0A2A43" : "#F5F5F5" },
        },
        {
          id: "land",
          type: "fill",
          source: "vector",
          "source-layer": "landuse",
          filter: ["==", "class", "park"],
          paint: {
            "fill-color": "#34C759",
            "fill-opacity": 0.6,
          },
        },
        {
          id: "water",
          type: "fill",
          source: "vector",
          "source-layer": "water",
          paint: {
            "fill-color": "#A1C2F1",
            "fill-opacity": 0.8,
          },
        },
        {
          id: "roads",
          type: "line",
          source: "vector",
          "source-layer": "roads",
          paint: {
            "line-color": "#4285F4",
            "line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 15, 3],
            "line-opacity": 0.9,
          },
        },
        {
          id: "road-labels",
          type: "symbol",
          source: "vector",
          "source-layer": "roads",
          minzoom: 12,
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: {
            "text-color": darkMode ? "#FFFFFF" : "#333333",
            "text-halo-color": darkMode ? "#000000" : "#FFFFFF",
            "text-halo-width": 1,
          },
        },
        {
          id: "buildings",
          type: "fill-extrusion",
          source: "vector",
          "source-layer": "buildings",
          minzoom: 12,
          paint: {
            "fill-extrusion-color": "#E8ECEF",
            "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 12, 0, 15, ["get", "height", 10]],
            "fill-extrusion-opacity": 0.7,
          },
        },
        {
          id: "building-labels",
          type: "symbol",
          source: "vector",
          "source-layer": "buildings",
          minzoom: 14,
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Arial Unicode MS Bold"],
            "text-size": 10,
          },
          paint: {
            "text-color": darkMode ? "#FFFFFF" : "#333333",
            "text-halo-color": darkMode ? "#000000" : "#FFFFFF",
            "text-halo-width": 1,
          },
        },
      ],
    };

    const initializeMap = () => {
      if (!mapRef.current || !document.body.contains(mapRef.current)) {
        console.error("Map container is not available or not in DOM");
        setIsMapLoaded(false);
        return;
      }

      let map;
      try {
        map = new maplibregl.Map({
          container: mapRef.current,
          style: mapStyle === "satellite"
            ? {
                version: 8,
                sources: {
                  satellite: {
                    type: "raster",
                    tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
                    tileSize: 256,
                    attribution: "",
                  },
                },
                layers: [
                  {
                    id: "satellite-tiles",
                    type: "raster",
                    source: "satellite",
                    minzoom: 0,
                    maxzoom: 22,
                  },
                ],
              }
            : mapStyle === "3d"
            ? googleStyle
            : mapboxKey
            ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${mapboxKey}`
            : defaultStyle,
          center: location,
          zoom: 15,
          pitch: mapStyle === "3d" ? 60 : 0,
          bearing: 0,
          attributionControl: false,
        });
        mapInstanceRef.current = map;

        // Style map controls
        const nav = new maplibregl.NavigationControl();
        map.addControl(nav, "top-right");
        const navEl = nav._container;
        navEl.className = `rounded-full bg-white shadow-md p-1`;

        const geo = new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true });
        map.addControl(geo, "top-right");
        const geoEl = geo._container;
        geoEl.className = `rounded-full bg-white shadow-md p-1 mt-2`;

        const tileLoadTimeout = setTimeout(() => {
          if ((mapStyle === "satellite" || mapStyle === "3d") && (!map.isStyleLoaded() || !map.areTilesLoaded())) {
            console.warn(`Initial ${mapStyle} tiles failed to load, switching to OpenStreetMap`);
            setTileLoadStatus("failed");
            map.setStyle(defaultStyle);
            setIsMapLoaded(true);
            setStyleLoading(false);
          }
        }, 8000);

        map.on("error", (e) => {
          console.error("Map error:", e.error);
          setTileLoadStatus("failed");
          map.setStyle(defaultStyle);
          setIsMapLoaded(true);
          setStyleLoading(false);
        });

        map.on("load", () => {
          clearTimeout(tileLoadTimeout);
          setIsMapLoaded(true);
          setStyleLoading(false);
          setTileLoadStatus((mapStyle === "satellite" || mapStyle === "3d") && map.isStyleLoaded() && map.areTilesLoaded() ? "success" : "failed");

          if (mapStyle === "3d") {
            try {
              map.addSource("mapzen-terrain", {
                type: "raster-dem",
                tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
                tileSize: 256,
                encoding: "terrarium",
                maxzoom: 15,
              });
              map.setTerrain({
                source: "mapzen-terrain",
                exaggeration: 1.2,
              });
              map.setLight({
                anchor: "viewport",
                color: "#FFFFFF",
                intensity: 0.3,
                position: [1.15, 210, 30],
              });
              map.addLayer({
                id: "sky",
                type: "sky",
                paint: {
                  "sky-type": "gradient",
                  "sky-color-stops": [[0, "#D1E5FB"], [1, "#FFFFFF"]],
                },
              });
              console.log("3D terrain loaded successfully with Google Maps style");
            } catch (terrainError) {
              console.error("Failed to load 3D terrain:", terrainError);
              setTileLoadStatus("terrain-failed");
              map.setPitch(0);
            }
          }

          map.resize();
          map.triggerRepaint();

          userMarkerRef.current = new maplibregl.Marker({
            element: (() => {
              const el = document.createElement("div");
              el.className = "user-marker";
              el.innerHTML = `
                <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 8.837 12 24 12 24s12-15.163 12-24C24 5.373 18.627 0 12 0z" fill="#4285F4"/>
                  <circle cx="12" cy="12" r="6" fill="white"/>
                </svg>
              `;
              el.style.animation = "drop 0.5s ease-out";
              return el;
            })(),
          })
            .setLngLat(location)
            .setPopup(new maplibregl.Popup().setText("You are here"))
            .addTo(map);

          const fetchHospitals = async () => {
            const [lon, lat] = location;
            const query = `
[out:json][timeout:25];
(
  node["amenity"="hospital"](around:10000,${lat},${lon});
  node["amenity"="clinic"](around:10000,${lat},${lon});
);
out body;`;
            try {
              const res = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                body: query,
              });
              if (!res.ok) throw new Error(`HTTP error ${res.status}`);
              const json = await res.json();
              const sortedHospitals = json.elements
                .map(h => ({
                  ...h,
                  distance: getDistance([lon, lat], [h.lon, h.lat])
                }))
                .sort((a, b) => a.distance - b.distance);
              setHospitals(sortedHospitals);

              sortedHospitals.forEach((h) => {
                const el = document.createElement("div");
                el.className = "hospital-marker";
                el.innerHTML = `
                  <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 8.837 12 24 12 24s12-15.163 12-24C24 5.373 18.627 0 12 0z" fill="#DB4437"/>
                    <circle cx="12" cy="12" r="6" fill="white"/>
                  </svg>
                `;
                el.style.animation = "drop 0.5s ease-out";

                new maplibregl.Marker({ element: el })
                  .setLngLat([h.lon, h.lat])
                  .setPopup(
                    new maplibregl.Popup().setHTML(`
                      <div class="bg-white p-3 rounded-lg shadow-md max-w-xs">
                        <strong class="text-sm font-semibold text-[#333333]">${h.tags.name || "Hospital/Clinic"}</strong><br/>
                        <p class="text-xs text-[#666666]">Distance: ${(h.distance / 1000).toFixed(2)} km</p>
                        <button 
                          onclick="window.getRoute(${h.lon}, ${h.lat}, '${h.tags.name || "Hospital/Clinic"}')"
                          class="bg-[#00C2CB] text-white px-3 py-1 rounded-[20px] mt-2 hover:bg-[#0097A7] transition-all duration-300 text-xs"
                        >
                          Directions
                        </button>
                      </div>
                    `)
                  )
                  .addTo(map);
              });

              window.getRoute = async (lon, lat, name) => {
                setDestination([lon, lat]);
                setIsTracking(false);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.easeTo({
                    center: [lon, lat],
                    zoom: 15,
                    duration: 1000,
                  });
                }
                const modes = ["driving-car", "cycling-regular", "foot-walking"];
                const routeData = {};
                const directions = {};
                for (const mode of modes) {
                  try {
                    const response = await axios.post(
                      `https://api.openrouteservice.org/v2/directions/${mode}/geojson`,
                      { coordinates: [location, [lon, lat]] },
                      {
                        headers: {
                          Authorization: orsApiKey,
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    routeData[mode] = response.data;
                    directions[mode] = response.data.features[0]?.properties.segments[0]?.steps || [];
                  } catch (error) {
                    console.error(`Error fetching ${mode} route:`, error.message);
                  }
                }
                setRouteGeoJSON(routeData["driving-car"]);
                setRouteInfo({
                  name,
                  car: routeData["driving-car"]?.features[0]?.properties.segments[0],
                  bike: routeData["cycling-regular"]?.features[0]?.properties.segments[0],
                  foot: routeData["foot-walking"]?.features[0]?.properties.segments[0],
                  directions,
                });
                lastSpokenStepRef.current = -1;
                lastDistanceUpdateRef.current = 0;

                if (mapInstanceRef.current && routeData["driving-car"]) {
                  if (mapInstanceRef.current.getSource("route")) {
                    mapInstanceRef.current.getSource("route").setData(routeData["driving-car"]);
                  } else {
                    mapInstanceRef.current.addSource("route", {
                      type: "geojson",
                      data: routeData["driving-car"],
                    });
                    mapInstanceRef.current.addLayer({
                      id: "route-line",
                      type: "line",
                      source: "route",
                      paint: {
                        "line-color": "#4285F4",
                        "line-width": 5,
                        "line-opacity": 0.8,
                      },
                    });
                  }
                }
              };
            } catch (error) {
              console.error("Error fetching hospitals:", error);
              alert("Failed to load hospitals: " + error.message);
            }
          };

          fetchHospitals();
          if (destination && routeInfo && routeGeoJSON) {
            map.easeTo({
              center: destination,
              zoom: 15,
              duration: 1000,
            });
            map.addSource("route", {
              type: "geojson",
              data: routeGeoJSON,
            });
            map.addLayer({
              id: "route-line",
              type: "line",
              source: "route",
              paint: {
                "line-color": "#4285F4",
                "line-width": 5,
                "line-opacity": 0.8,
              },
            });
          }
        });
      } catch (error) {
        console.error("Map initialization error:", error);
        setIsMapLoaded(true);
        setStyleLoading(false);
        setTileLoadStatus("failed");
        mapInstanceRef.current = new maplibregl.Map({
          container: mapRef.current,
          style: defaultStyle,
          center: location,
          zoom: 15,
          attributionControl: false,
        });
      }
    };

    const observer = new MutationObserver(() => {
      if (mapRef.current && document.body.contains(mapRef.current)) {
        const timeout = setTimeout(initializeMap, 500);
        observer.disconnect();
        return () => clearTimeout(timeout);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setIsMapLoaded(false);
      setStyleLoading(false);
      setTileLoadStatus("loading");
      observer.disconnect();
    };
  }, [location, mapStyle]);

  useEffect(() => {
    if (!location || !mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat(location);
      if (isTracking) {
        userMarkerRef.current.remove();
        const arrowEl = document.createElement("div");
        arrowEl.className = "user-arrow";
        arrowEl.innerHTML = `
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 8.837 12 24 12 24s12-15.163 12-24C24 5.373 18.627 0 12 0z" fill="#4285F4"/>
            <circle cx="12" cy="12" r="6" fill="white"/>
          </svg>
        `;
        arrowEl.style.animation = "drop 0.5s ease-out";
        let arrowHeading = heading;
        if (arrowHeading === null && routeGeoJSON && routeGeoJSON.features[0].geometry.coordinates.length > 1) {
          const nextPoint = routeGeoJSON.features[0].geometry.coordinates[1];
          arrowHeading = getBearing(location, nextPoint);
        }
        if (arrowHeading !== null) {
          arrowEl.style.transform = `rotate(${arrowHeading}deg)`;
        }
        userMarkerRef.current = new maplibregl.Marker({ element: arrowEl })
          .setLngLat(location)
          .addTo(mapInstanceRef.current);
      } else if (!isTracking && userMarkerRef.current.getElement().className.includes("user-arrow")) {
        userMarkerRef.current.remove();
        userMarkerRef.current = new maplibregl.Marker({
          element: (() => {
            const el = document.createElement("div");
            el.className = "user-marker";
            el.innerHTML = `
              <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 8.837 12 24 12 24s12-15.163 12-24C24 5.373 18.627 0 12 0z" fill="#4285F4"/>
                <circle cx="12" cy="12" r="6" fill="white"/>
              </svg>
            `;
            el.style.animation = "drop 0.5s ease-out";
            return el;
          })(),
        })
          .setLngLat(location)
          .setPopup(new maplibregl.Popup().setText("You are here"))
          .addTo(mapInstanceRef.current);
      }
    }

    if (!destination) return;

    const distanceToDest = getDistance(location, destination);
    if (distanceToDest < 50) {
      speakDirection("You have arrived at your destination.");
      window.speechSynthesis.cancel();
      setDestination(null);
      setRouteGeoJSON(null);
      setRouteInfo(null);
      setIsTracking(false);
      if (mapInstanceRef.current.getSource("route")) {
        mapInstanceRef.current.removeLayer("route-line");
        mapInstanceRef.current.removeSource("route");
      }
      return;
    }

    if (isTracking) {
      mapInstanceRef.current.easeTo({
        center: location,
        zoom: 16,
        duration: 1000,
      });

      window.getRoute(destination[0], destination[1], routeInfo?.name || "Hospital/Clinic");

      const now = Date.now();
      if (now - lastDistanceUpdateRef.current > 30000) {
        const distanceKm = (distanceToDest / 1000).toFixed(2);
        speakDirection(`${distanceKm} kilometers to your destination.`);
        lastDistanceUpdateRef.current = now;
      }

      if (routeGeoJSON && routeGeoJSON.features[0].geometry.coordinates.length > 1) {
        const coords = routeGeoJSON.features[0].geometry.coordinates;
        let closestIndex = 0;
        let minDistance = getDistance(location, coords[0]);
        for (let i = 1; i < coords.length; i++) {
          const dist = getDistance(location, coords[i]);
          if (dist < minDistance) {
            minDistance = dist;
            closestIndex = i;
          }
        }
        if (Math.abs(closestIndex - lastClosestIndexRef.current) > 2) {
          const trimmedCoords = coords.slice(closestIndex);
          const trimmedGeoJSON = {
            ...routeGeoJSON,
            features: [
              {
                ...routeGeoJSON.features[0],
                geometry: {
                  ...routeGeoJSON.features[0].geometry,
                  coordinates: trimmedCoords,
                },
              },
            ],
          };
          if (mapInstanceRef.current.getSource("route")) {
            mapInstanceRef.current.getSource("route").setData(trimmedGeoJSON);
          }
          lastClosestIndexRef.current = closestIndex;
        }
      }

      if (routeInfo?.directions?.["driving-car"] && !isMuted) {
        const steps = routeInfo.directions["driving-car"];
        steps.forEach((step, index) => {
          if (index <= lastSpokenStepRef.current) return;
          const stepCoord = routeGeoJSON.features[0].geometry.coordinates[step.way_points[0]];
          const distance = getDistance(location, stepCoord);
          if (distance < 150) {
            speakDirection(step.instruction);
            lastSpokenStepRef.current = index;
          }
        });
      }
    }
  }, [location, heading, isTracking, destination, routeInfo, routeGeoJSON]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchSuggestions([]);
      return;
    }
    const filtered = hospitals
      .filter(h => 
        (h.tags.name || "Hospital/Clinic").toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
    setSearchSuggestions(filtered);
  }, [searchQuery, hospitals]);

  const handleSearchSelect = (lon, lat, name) => {
    setSearchQuery("");
    setSearchSuggestions([]);
    setIsSearchActive(false);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.easeTo({
        center: [lon, lat],
        zoom: 15,
        duration: 1000,
      });
    }
    window.getRoute(lon, lat, name);
  };

  const handleRetryStyle = () => {
    setMapStyle(mapStyle); // Trigger reload of current style
  };

  useEffect(() => {
    if (tileLoadStatus === "failed" || tileLoadStatus === "terrain-failed") {
      const timer = setTimeout(() => setTileLoadStatus("success"), 5000);
      return () => clearTimeout(timer);
    }
  }, [tileLoadStatus]);

  return (
    <>
      <style>
        {`
          @keyframes drop {
            0% { transform: translateY(-100px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      <Header />
      <Helmet>
        <title>Emergency Services - MediCare</title>
        <meta name="description" content="Emergency guides & live map with nearby hospitals/clinics." />
      </Helmet>

      <div className="mx-auto px-4 py-8 max-w-5xl">
        {/* Coming Soon Heading with Looping Animation */}
        <motion.h1
          className="text-6xl sm:text-7xl font-extrabold mb-12 text-center text-[#0A3D62] dark:text-[#FDFBFB] tracking-tight"
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Coming Soon
        </motion.h1>

        <motion.h1
          className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-teal-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Emergency Services
        </motion.h1>

        <motion.p
          className="text-xl mb-8 text-center text-[#0A3D62] dark:text-[#FDFBFB]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Call emergency numbers. Use guides & location map below.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {emergencyServices.map((s) => (
            <motion.div
              key={s.name}
              className={`p-6 rounded-[40px] shadow-md text-center ${cardBg} transition-all duration-500 backdrop-blur-2xl border-none outline-none`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <s.icon className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{s.name}</h2>
              <p>
                <a href={`tel:${s.phone}`} className="hover:underline">
                  {s.phone}
                </a>
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.h2
          className="text-2xl font-semibold mb-4 text-[#0A3D62] dark:text-[#FDFBFB]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Emergency Guides
        </motion.h2>
        {Object.entries(emergencyGuides).map(([k, g]) => (
          <EmergencyGuide key={k} title={g.title} steps={g.steps} />
        ))}

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl mb-4 text-center text-[#0A3D62] dark:text-[#FDFBFB]">Nearby Hospitals & Clinics</h2>
          <div className="relative mb-4 sticky top-0 z-20" role="search">
            <motion.div
              className={`flex items-center rounded-[40px] overflow-hidden ${cardBg} backdrop-blur-2xl shadow-md transition-all duration-500 border-none outline-none`}
              initial={{ width: isSearchActive ? "100%" : 40 }}
              animate={{ width: isSearchActive ? "100%" : 40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.button
                onClick={() => setIsSearchActive(!isSearchActive)}
                className={`p-3 rounded-[40px] ${cardBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-500 backdrop-blur-2xl border-none outline-none`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isSearchActive ? "Close search" : "Open search"}
              >
                {isSearchActive ? (
                  <X className="w-5 h-5 text-gray-500" />
                ) : (
                  <Search className="w-5 h-5 text-gray-500" />
                )}
              </motion.button>
              <AnimatePresence>
                {isSearchActive && (
                  <motion.input
                    key="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hospitals or clinics..."
                    className={`flex-1 p-3 bg-transparent focus:outline-none rounded-[40px] border-none ${cardBg} placeholder-gray-400 focus:ring-2 focus:ring-[#00C2CB] transition-all duration-500 backdrop-blur-2xl`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    aria-label="Search hospitals or clinics"
                  />
                )}
              </AnimatePresence>
            </motion.div>
            <AnimatePresence>
              {searchSuggestions.length > 0 && isSearchActive && (
                <motion.ul
                  key="search-suggestions"
                  className={`absolute z-10 w-full mt-1 rounded-[40px] shadow-lg overflow-hidden ${cardBg} backdrop-blur-2xl transition-all duration-500 border-none outline-none`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {searchSuggestions.map((h) => (
                    <motion.li
                      key={h.id}
                      onClick={() => handleSearchSelect(h.lon, h.lat, h.tags.name || "Hospital/Clinic")}
                      className={`p-3 cursor-pointer ${cardBg} backdrop-blur-2xl transition-all duration-500`}
                      whileHover={{ backgroundColor: darkMode ? "#00C2CB" : "#E5E7EB" }}
                    >
                      {h.tags.name || "Hospital/Clinic"} ({(h.distance / 1000).toFixed(2)} km)
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isMapLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              ref={mapRef}
              className={`h-[600px] w-full min-h-[600px] max-w-full rounded-[40px] shadow-lg bg-gray-200 dark:bg-gray-800 relative z-0 overflow-hidden border-none outline-none`}
            >
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#00C2CB]"></div>
                  {styleLoading && (
                    <p className={`mt-4 ${cardBg} p-3 rounded-[40px] backdrop-blur-2xl transition-all duration-500 text-[#0A3D62] dark:text-[#FDFBFB]`}>Switching style...</p>
                  )}
                </div>
              )}
              {(tileLoadStatus === "failed" || tileLoadStatus === "terrain-failed") && (
                <div className={`absolute top-4 right-4 z-10 p-3 rounded-[20px] bg-teal-600 ${darkMode ? "text-[#FDFBFB]" : "text-white"} backdrop-blur-2xl shadow-md transition-all duration-500 border-none outline-none flex items-center space-x-2`}>
                  <span>{tileLoadStatus === "terrain-failed" ? "3D terrain failed, using 2D" : "Map style failed, using fallback"}</span>
                  <motion.button
                    onClick={handleRetryStyle}
                    className="px-2 py-1 bg-white/20 rounded-[20px] text-sm hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    Retry
                  </motion.button>
                </div>
              )}
              <MapStyleSwitcher
                mapStyle={mapStyle}
                setMapStyle={setMapStyle}
                mapInstanceRef={mapInstanceRef}
                routeGeoJSON={routeGeoJSON}
                userMarkerRef={userMarkerRef}
                setIsMapLoaded={setIsMapLoaded}
                setStyleLoading={setStyleLoading}
                destination={destination}
                routeInfo={routeInfo}
                setTileLoadStatus={setTileLoadStatus}
              />
            </div>
          </motion.div>
          {routeInfo && (
            <motion.div
              className={`mt-4 p-6 rounded-[40px] shadow-md ${cardBg} backdrop-blur-2xl transition-all duration-500 border-none outline-none`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <p><strong>Route to {routeInfo.name}</strong></p>
              <p>Car: {(routeInfo.car?.distance / 1000).toFixed(2)} km, {Math.round(routeInfo.car?.duration / 60)} min</p>
              <p>Bike: {(routeInfo.bike?.distance / 1000).toFixed(2)} km, {Math.round(routeInfo.bike?.duration / 60)} min</p>
              <p>Foot: {(routeInfo.foot?.distance / 1000).toFixed(2)} km, {Math.round(routeInfo.foot?.duration / 60)} min</p>
              <div className="mt-2 flex justify-center space-x-4">
                <motion.button
                  onClick={() => setIsTracking(!isTracking)}
                  className={`px-4 py-2 rounded-[40px] ${darkMode ? "bg-[#00C2CB] text-[#FDFBFB]" : "bg-[#00C2CB] text-white"} hover:bg-[#0097A7] focus:ring-2 focus:ring-[#00C2CB] backdrop-blur-2xl transition-all duration-500`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isTracking ? "Stop Tracking" : "Start Tracking"}
                </motion.button>
                <motion.button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-4 py-2 rounded-[40px] ${darkMode ? "bg-[#00C2CB] text-[#FDFBFB]" : "bg-[#00C2CB] text-white"} hover:bg-[#0097A7] focus:ring-2 focus:ring-[#00C2CB] backdrop-blur-2xl transition-all duration-500`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted ? <VolumeX className="inline mr-2" /> : <Volume2 className="inline mr-2" />}
                  {isMuted ? "Unmute Voice" : "Mute Voice"}
                </motion.button>
                <motion.button
                  onClick={cancelRoute}
                  className={`px-4 py-2 rounded-[40px] bg-teal-600 ${darkMode ? "text-[#FDFBFB]" : "text-white"} hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 backdrop-blur-2xl transition-all duration-500`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Cancel Route
                </motion.button>
              </div>
              <div className="mt-2">
                <strong>Directions (Car):</strong>
                <ol className="list-decimal list-inside">
                  {routeInfo.directions?.["driving-car"]?.map((step, i) => (
                    <li key={i}>{step.instruction}</li>
                  )) || <li>No directions available</li>}
                </ol>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default Emergency;