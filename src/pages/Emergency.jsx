import { useState, useContext, useEffect, useRef } from "react"
import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"
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
  MoreVertical,
} from "lucide-react"
import { DarkModeContext } from "../App"
import maplibregl from "maplibre-gl"
import axios from "axios"
import "maplibre-gl/dist/maplibre-gl.css"

const orsApiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjgyNGUwMDBmYzBiNTQxODRiNDczYTIwY2Q3YjIxYWQ2IiwiaCI6Im11cm11cjY0In0="
const mapTilerKey = process.env.REACT_APP_MAPTILER_KEY || "" // Set in .env or replace with your MapTiler API key

function EmergencyGuide({ title, steps }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { darkMode } = useContext(DarkModeContext)

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex justify-between items-center w-full p-4 rounded-lg ${
          darkMode ? "bg-[#0A2A43] text-[#FDFBFB]" : "bg-red-100 text-[#1E3A8A]"
        }`}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isExpanded && (
        <ol
          className={`list-decimal list-inside mt-2 p-4 rounded-lg space-y-1 text-sm ${
            darkMode ? "bg-[#0A2A43] text-[#FDFBFB]" : "bg-white text-[#1E3A8A]"
          }`}
        >
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  )
}

const MapStyleSwitcher = ({ mapStyle, setMapStyle, mapInstanceRef, routeGeoJSON, userMarkerRef, setIsMapLoaded, setStyleLoading, destination, routeInfo }) => {
  const { darkMode } = useContext(DarkModeContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getMapStyle = (style) => {
    if (style === "satellite") {
      if (mapTilerKey) {
        return {
          version: 8,
          sources: {
            satellite: {
              type: "raster",
              tiles: [`https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=${mapTilerKey}`],
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
      }
      return {
        version: 8,
        sources: {
          satellite: {
            type: "raster",
            tiles: ["https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}"],
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
    }
    if (mapTilerKey) {
      return `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapTilerKey}`
    }
    return {
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
    }
  }

  const handleStyleChange = (newStyle) => {
    setMapStyle(newStyle)
    setIsMapLoaded(false)
    setStyleLoading(true)
    setIsMenuOpen(false)
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.setStyle(getMapStyle(newStyle))
        mapInstanceRef.current.once("style.load", () => {
          mapInstanceRef.current.setPitch(newStyle === "3d" ? 60 : 0)
          if (newStyle === "3d") {
            mapInstanceRef.current.addSource("maplibre-terrain", {
              type: "raster-dem",
              tiles: ["https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.png"],
              tileSize: 256,
            })
            mapInstanceRef.current.setTerrain({ source: "maplibre-terrain", exaggeration: 1.5 })
          }
          mapInstanceRef.current.resize()
          mapInstanceRef.current.triggerRepaint()
          setIsMapLoaded(true)
          setStyleLoading(false)
          if (routeGeoJSON) {
            mapInstanceRef.current.addSource("route", {
              type: "geojson",
              data: routeGeoJSON,
            })
            mapInstanceRef.current.addLayer({
              id: "route-line",
              type: "line",
              source: "route",
              paint: {
                "line-color": "#1E90FF",
                "line-width": 5,
                "line-opacity": 0.8,
              },
            })
          }
          if (userMarkerRef.current) {
            userMarkerRef.current.addTo(mapInstanceRef.current)
          }
          if (destination && routeInfo) {
            mapInstanceRef.current.easeTo({
              center: destination,
              zoom: 15,
              duration: 1000,
            })
          }
        })
      } catch (error) {
        console.error("Error switching map style:", error)
        mapInstanceRef.current.setStyle({
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
        })
        setIsMapLoaded(true)
        setStyleLoading(false)
      }
    }
  }

  return (
    <motion.div
      className={`absolute top-4 left-4 z-10 rounded-full p-1 ${
        darkMode ? "bg-[#0A2A43]/80" : "bg-white/80"
      } backdrop-blur-sm shadow-md`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`p-2 rounded-full ${
          darkMode ? "text-[#0A2A43] hover:bg-[#1E3A8A]/50" : "text-[#1E3A8A] hover:bg-[#1E3A8A]/50"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-expanded={isMenuOpen}
        aria-label="Toggle map style menu"
      >
        <MoreVertical className="w-5 h-5" />
      </motion.button>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.ul
            className={`absolute top-16 left-4 w-32 rounded-lg shadow-lg overflow-hidden ${
              darkMode ? "bg-[#0A2A43] border-gray-600" : "bg-white border-gray-300"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {["2d", "3d", "satellite"].map((style) => (
              <motion.li
                key={style}
                onClick={() => handleStyleChange(style)}
                className={`p-3 text-sm font-medium cursor-pointer ${
                  mapStyle === style
                    ? darkMode
                      ? "bg-[#1E3A8A] text-white"
                      : "bg-[#1E3A8A] text-white"
                    : darkMode
                    ? "text-[#0A2A43] hover:bg-[#1E3A8A]/50 hover:text-white"
                    : "text-[#1E3A8A] hover:bg-[#1E3A8A]/50 hover:text-white"
                }`}
                whileHover={{ backgroundColor: darkMode ? "#1E3A8A" : "#F3F4F6" }}
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
  )
}

function Emergency() {
  const { darkMode } = useContext(DarkModeContext)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const userMarkerRef = useRef(null)
  const [location, setLocation] = useState(null)
  const [heading, setHeading] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [routeGeoJSON, setRouteGeoJSON] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [mapStyle, setMapStyle] = useState("2d")
  const [destination, setDestination] = useState(null)
  const [isTracking, setIsTracking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [styleLoading, setStyleLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [isSearchActive, setIsSearchActive] = useState(false)
  const lastLocationRef = useRef(null)
  const lastSpokenStepRef = useRef(-1)
  const lastUpdateTimeRef = useRef(0)
  const lastDistanceUpdateRef = useRef(0)
  const lastClosestIndexRef = useRef(0)

  const emergencyServices = [
    { name: "Edhi Ambulance", phone: "115", icon: Ambulance },
    { name: "Chhipa Ambulance", phone: "1020", icon: Ambulance },
    { name: "Rescue 1122", phone: "1122", icon: Hospital },
    { name: "Police Emergency", phone: "15", icon: Phone },
    { name: "Fire Brigade", phone: "16", icon: Phone },
    { name: "Bomb Disposal", phone: "1717", icon: Phone },
    { name: "Poison Control", phone: "(021) 99215718", icon: Phone },
  ]

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
  }

  const getDistance = (loc1, loc2) => {
    const toRad = (x) => (x * Math.PI) / 180
    const R = 6371e3
    const lat1 = loc1[1], lon1 = loc1[0], lat2 = loc2[1], lon2 = loc2[0]
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getBearing = (loc1, loc2) => {
    const toRad = (x) => (x * Math.PI) / 180
    const toDeg = (x) => (x * 180) / Math.PI
    const lat1 = toRad(loc1[1]), lon1 = toRad(loc1[0])
    const lat2 = toRad(loc2[1]), lon2 = toRad(loc2[0])
    const dLon = lon2 - lon1
    const y = Math.sin(dLon) * Math.cos(lat2)
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
    return (toDeg(Math.atan2(y, x)) + 360) % 360
  }

  const speakDirection = (text) => {
    if (isMuted) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.volume = 1.0
    window.speechSynthesis.speak(utterance)
  }

  const cancelRoute = () => {
    window.speechSynthesis.cancel() // Stop any active speech
    setDestination(null)
    setRouteGeoJSON(null)
    setRouteInfo(null)
    setIsTracking(false)
    if (mapInstanceRef.current && mapInstanceRef.current.getSource("route")) {
      mapInstanceRef.current.removeLayer("route-line")
      mapInstanceRef.current.removeSource("route")
    }
    if (mapInstanceRef.current && location) {
      mapInstanceRef.current.easeTo({
        center: location,
        zoom: 15,
        duration: 1000,
      })
    }
  }

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now()
        if (now - lastUpdateTimeRef.current < 15000) return
        const { latitude, longitude, heading } = pos.coords
        const newLocation = [longitude, latitude]
        if (!lastLocationRef.current || getDistance(lastLocationRef.current, newLocation) > 150) {
          setLocation(newLocation)
          if (heading !== null) setHeading(heading)
          lastLocationRef.current = newLocation
          lastUpdateTimeRef.current = now
        }
      },
      (err) => {
        console.error("Geolocation error:", err)
        alert("Location access denied. Please enable location services.")
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  useEffect(() => {
    if (!location || !mapRef.current) return

    const initializeMap = () => {
      if (!mapRef.current || !document.body.contains(mapRef.current)) {
        console.error("Map container is not available or not in DOM")
        setIsMapLoaded(false)
        return
      }

      let map
      try {
        map = new maplibregl.Map({
          container: mapRef.current,
          style: mapTilerKey
            ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapTilerKey}`
            : {
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
              },
          center: location,
          zoom: 15,
          pitch: mapStyle === "3d" ? 60 : 0,
          bearing: 0,
          attributionControl: false,
        })
        mapInstanceRef.current = map

        map.on("error", (e) => {
          console.error("Map error:", e.error)
          if (e.error.message.includes("403") || e.error.message.includes("openmaptiles")) {
            console.warn("Tile source error, attempting fallback")
            if (mapStyle === "satellite") {
              map.setStyle({
                version: 8,
                sources: {
                  satellite: {
                    type: "raster",
                    tiles: ["https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}"],
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
              })
            } else {
              map.setStyle({
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
              })
            }
            setIsMapLoaded(true)
            setStyleLoading(false)
          }
        })

        map.on("load", () => {
          setIsMapLoaded(true)
          setStyleLoading(false)
          map.resize()
          map.triggerRepaint()

          if (mapStyle === "3d") {
            map.addSource("maplibre-terrain", {
              type: "raster-dem",
              tiles: ["https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.png"],
              tileSize: 256,
            })
            map.setTerrain({ source: "maplibre-terrain", exaggeration: 1.5 })
          }

          map.addControl(new maplibregl.NavigationControl(), "top-right")
          map.addControl(
            new maplibregl.GeolocateControl({
              positionOptions: { enableHighAccuracy: true },
              trackUserLocation: true,
            })
          )

          userMarkerRef.current = new maplibregl.Marker({ color: "blue" })
            .setLngLat(location)
            .setPopup(new maplibregl.Popup().setText("You are here"))
            .addTo(map)

          const fetchHospitals = async () => {
            const [lon, lat] = location
            const query = `
[out:json][timeout:25];
(
  node["amenity"="hospital"](around:10000,${lat},${lon});
  node["amenity"="clinic"](around:10000,${lat},${lon});
);
out body;`
            try {
              const res = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                body: query,
              })
              if (!res.ok) throw new Error(`HTTP error ${res.status}`)
              const json = await res.json()
              const sortedHospitals = json.elements
                .map(h => ({
                  ...h,
                  distance: getDistance([lon, lat], [h.lon, h.lat])
                }))
                .sort((a, b) => a.distance - b.distance)
              setHospitals(sortedHospitals)

              sortedHospitals.forEach((h) => {
                const el = document.createElement("div")
                el.className = "hospital-marker"
                el.style.backgroundColor = "red"
                el.style.width = "12px"
                el.style.height = "12px"
                el.style.borderRadius = "50%"

                new maplibregl.Marker(el)
                  .setLngLat([h.lon, h.lat])
                  .setPopup(
                    new maplibregl.Popup().setHTML(`
                      <strong>${h.tags.name || "Hospital/Clinic"}</strong><br/>
                      <button onclick="window.getRoute(${h.lon}, ${h.lat}, '${h.tags.name || "Hospital/Clinic"}')">Lock & Route</button>
                    `)
                  )
                  .addTo(map)
              })

              window.getRoute = async (lon, lat, name) => {
                setDestination([lon, lat])
                setIsTracking(false)
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.easeTo({
                    center: [lon, lat],
                    zoom: 15,
                    duration: 1000,
                  })
                }
                const modes = ["driving-car", "cycling-regular", "foot-walking"]
                const routeData = {}
                const directions = {}
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
                    )
                    routeData[mode] = response.data
                    directions[mode] = response.data.features[0]?.properties.segments[0]?.steps || []
                  } catch (error) {
                    console.error(`Error fetching ${mode} route:`, error.message)
                  }
                }
                setRouteGeoJSON(routeData["driving-car"])
                setRouteInfo({
                  name,
                  car: routeData["driving-car"]?.features[0]?.properties.segments[0],
                  bike: routeData["cycling-regular"]?.features[0]?.properties.segments[0],
                  foot: routeData["foot-walking"]?.features[0]?.properties.segments[0],
                  directions,
                })
                lastSpokenStepRef.current = -1
                lastDistanceUpdateRef.current = 0

                if (mapInstanceRef.current && routeData["driving-car"]) {
                  if (mapInstanceRef.current.getSource("route")) {
                    mapInstanceRef.current.getSource("route").setData(routeData["driving-car"])
                  } else {
                    mapInstanceRef.current.addSource("route", {
                      type: "geojson",
                      data: routeData["driving-car"],
                    })
                    mapInstanceRef.current.addLayer({
                      id: "route-line",
                      type: "line",
                      source: "route",
                      paint: {
                        "line-color": "#1E90FF",
                        "line-width": 5,
                        "line-opacity": 0.8,
                      },
                    })
                  }
                }
              }
            } catch (error) {
              console.error("Error fetching hospitals:", error)
              alert("Failed to load hospitals: " + error.message)
            }
          }

          fetchHospitals()
          if (destination && routeInfo && routeGeoJSON) {
            map.easeTo({
              center: destination,
              zoom: 15,
              duration: 1000,
            })
            map.addSource("route", {
              type: "geojson",
              data: routeGeoJSON,
            })
            map.addLayer({
              id: "route-line",
              type: "line",
              source: "route",
              paint: {
                "line-color": "#1E90FF",
                "line-width": 5,
                "line-opacity": 0.8,
              },
            })
          }
        })
      } catch (error) {
        console.error("Map initialization error:", error)
        setIsMapLoaded(true)
        setStyleLoading(false)
        mapInstanceRef.current = new maplibregl.Map({
          container: mapRef.current,
          style: {
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
          },
          center: location,
          zoom: 15,
          attributionControl: false,
        })
      }
    }

    const observer = new MutationObserver(() => {
      if (mapRef.current && document.body.contains(mapRef.current)) {
        const timeout = setTimeout(initializeMap, 500)
        observer.disconnect()
        return () => clearTimeout(timeout)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      setIsMapLoaded(false)
      setStyleLoading(false)
      observer.disconnect()
    }
  }, [location, mapStyle])

  useEffect(() => {
    if (!location || !mapInstanceRef.current) return

    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat(location)
      if (isTracking) {
        userMarkerRef.current.remove()
        const arrowEl = document.createElement("div")
        arrowEl.style.width = "24px"
        arrowEl.style.height = "24px"
        arrowEl.style.backgroundColor = "blue"
        arrowEl.style.clipPath = "polygon(50% 0%, 100% 100%, 0% 100%)"
        arrowEl.style.border = "1px solid white"
        let arrowHeading = heading
        if (arrowHeading === null && routeGeoJSON && routeGeoJSON.features[0].geometry.coordinates.length > 1) {
          const nextPoint = routeGeoJSON.features[0].geometry.coordinates[1]
          arrowHeading = getBearing(location, nextPoint)
        }
        if (arrowHeading !== null) {
          arrowEl.style.transform = `rotate(${arrowHeading}deg)`
        }
        userMarkerRef.current = new maplibregl.Marker(arrowEl)
          .setLngLat(location)
          .addTo(mapInstanceRef.current)
      } else if (!isTracking && userMarkerRef.current.getElement().style.clipPath) {
        userMarkerRef.current.remove()
        userMarkerRef.current = new maplibregl.Marker({ color: "blue" })
          .setLngLat(location)
          .setPopup(new maplibregl.Popup().setText("You are here"))
          .addTo(mapInstanceRef.current)
      }
    }

    if (!destination) return

    const distanceToDest = getDistance(location, destination)
    if (distanceToDest < 50) {
      speakDirection("You have arrived at your destination.")
      window.speechSynthesis.cancel()
      setDestination(null)
      setRouteGeoJSON(null)
      setRouteInfo(null)
      setIsTracking(false)
      if (mapInstanceRef.current.getSource("route")) {
        mapInstanceRef.current.removeLayer("route-line")
        mapInstanceRef.current.removeSource("route")
      }
      return
    }

    if (isTracking) {
      mapInstanceRef.current.easeTo({
        center: location,
        zoom: 16,
        duration: 1000,
      })

      window.getRoute(destination[0], destination[1], routeInfo?.name || "Hospital/Clinic")

      const now = Date.now()
      if (now - lastDistanceUpdateRef.current > 30000) {
        const distanceKm = (distanceToDest / 1000).toFixed(2)
        speakDirection(`${distanceKm} kilometers to your destination.`)
        lastDistanceUpdateRef.current = now
      }

      if (routeGeoJSON && routeGeoJSON.features[0].geometry.coordinates.length > 1) {
        const coords = routeGeoJSON.features[0].geometry.coordinates
        let closestIndex = 0
        let minDistance = getDistance(location, coords[0])
        for (let i = 1; i < coords.length; i++) {
          const dist = getDistance(location, coords[i])
          if (dist < minDistance) {
            minDistance = dist
            closestIndex = i
          }
        }
        if (Math.abs(closestIndex - lastClosestIndexRef.current) > 2) {
          const trimmedCoords = coords.slice(closestIndex)
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
          }
          if (mapInstanceRef.current.getSource("route")) {
            mapInstanceRef.current.getSource("route").setData(trimmedGeoJSON)
          }
          lastClosestIndexRef.current = closestIndex
        }
      }

      if (routeInfo?.directions?.["driving-car"] && !isMuted) {
        const steps = routeInfo.directions["driving-car"]
        steps.forEach((step, index) => {
          if (index <= lastSpokenStepRef.current) return
          const stepCoord = routeGeoJSON.features[0].geometry.coordinates[step.way_points[0]]
          const distance = getDistance(location, stepCoord)
          if (distance < 150) {
            speakDirection(step.instruction)
            lastSpokenStepRef.current = index
          }
        })
      }
    }
  }, [location, heading, isTracking, destination, routeInfo, routeGeoJSON])

  useEffect(() => {
    if (!searchQuery) {
      setSearchSuggestions([])
      return
    }
    const filtered = hospitals
      .filter(h => 
        (h.tags.name || "Hospital/Clinic").toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5)
    setSearchSuggestions(filtered)
  }, [searchQuery, hospitals])

  const handleSearchSelect = (lon, lat, name) => {
    setSearchQuery("")
    setSearchSuggestions([])
    setIsSearchActive(false)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.easeTo({
        center: [lon, lat],
        zoom: 15,
        duration: 1000,
      })
    }
    window.getRoute(lon, lat, name)
  }

  return (
    <>
      <Helmet>
        <title>Emergency Services - MediCare</title>
        <meta name="description" content="Emergency guides & live map with nearby hospitals/clinics." />
      </Helmet>

      <div className={`max-w-5xl mx-auto px-4 py-8 ${darkMode ? "text-[#FDFBFB]" : "text-[#1E3A8A]"}`}>
        <motion.h1 className="text-3xl font-bold mb-6 text-center">Emergency Services</motion.h1>

        <motion.p className="text-xl mb-8 text-center">
          Call emergency numbers. Use guides & location map below.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {emergencyServices.map((s) => (
            <motion.div
              key={s.name}
              className={`p-6 rounded-lg shadow-md text-center ${
                darkMode ? "bg-[#0A2A43] text-[#FDFBFB]" : "bg-white text-[#1E3A8A]"
              }`}
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
        </div>

        <motion.h2 className="text-2xl font-semibold mb-4">Emergency Guides</motion.h2>
        {Object.entries(emergencyGuides).map(([k, g]) => (
          <EmergencyGuide key={k} title={g.title} steps={g.steps} />
        ))}

        <motion.div className="mt-12">
          <h2 className="text-2xl mb-4 text-center">Nearby Hospitals & Clinics</h2>
          <div className="relative mb-4 sticky top-0 z-20" role="search">
            <motion.div
              className={`flex items-center rounded-full overflow-hidden ${
                darkMode ? "bg-[#0A2A43]/80" : "bg-white/80"
              } backdrop-blur-sm shadow-md`}
              initial={{ width: isSearchActive ? "100%" : 40 }}
              animate={{ width: isSearchActive ? "100%" : 40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.button
                onClick={() => setIsSearchActive(!isSearchActive)}
                className="p-3"
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
                    className={`flex-1 p-3 bg-transparent focus:outline-none ${
                      darkMode ? "text-[#FDFBFB] placeholder-gray-400" : "text-[#1E3A8A] placeholder-gray-500"
                    }`}
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
                  className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg overflow-hidden ${
                    darkMode ? "bg-[#0A2A43] text-[#0A2A43] border-gray-600" : "bg-white text-[#1E3A8A] border-gray-300"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {searchSuggestions.map((h) => (
                    <motion.li
                      key={h.id}
                      onClick={() => handleSearchSelect(h.lon, h.lat, h.tags.name || "Hospital/Clinic")}
                      className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                        darkMode ? "text-[#0A2A43]" : "text-[#1E3A8A]"
                      }`}
                      whileHover={{ backgroundColor: darkMode ? "#1E3A8A" : "#F3F4F6" }}
                    >
                      {h.tags.name || "Hospital/Clinic"} ({(h.distance / 1000).toFixed(2)} km)
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <div
            ref={mapRef}
            className="h-[600px] w-full min-h-[600px] max-w-full rounded-lg shadow-lg bg-gray-200 dark:bg-gray-800 relative z-0 overflow-hidden"
          >
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#1E3A8A]"></div>
                {styleLoading && (
                  <p className={`mt-4 ${darkMode ? "text-[#FDFBFB]" : "text-[#1E3A8A]"}`}>Switching style...</p>
                )}
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
            />
          </div>
          {routeInfo && (
            <div className={`mt-4 text-center ${darkMode ? "text-[#0A2A43]" : "text-[#1E3A8A]"}`}>
              <p><strong>Route to {routeInfo.name}</strong></p>
              <p>Car: {(routeInfo.car?.distance / 1000).toFixed(2)} km, {Math.round(routeInfo.car?.duration / 60)} min</p>
              <p>Bike: {(routeInfo.bike?.distance / 1000).toFixed(2)} km, {Math.round(routeInfo.bike?.duration / 60)} min</p>
              <p>Foot: {(routeInfo.foot?.distance / 1000).toFixed(2)} km, {Math.round(routeInfo.foot?.duration / 60)} min</p>
              <div className="mt-2 flex justify-center space-x-4">
                <button
                  onClick={() => setIsTracking(!isTracking)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode ? "bg-[#1E3A8A] text-[#FDFBFB]" : "bg-[#1E3A8A] text-white"
                  } hover:bg-opacity-80`}
                >
                  {isTracking ? "Stop Tracking" : "Start Tracking"}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode ? "bg-[#1E3A8A] text-[#FDFBFB]" : "bg-[#1E3A8A] text-white"
                  } hover:bg-opacity-80`}
                >
                  {isMuted ? <VolumeX className="inline mr-2" /> : <Volume2 className="inline mr-2" />}
                  {isMuted ? "Unmute Voice" : "Mute Voice"}
                </button>
                <button
                  onClick={cancelRoute}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode ? "bg-red-600 text-[#FDFBFB]" : "bg-red-600 text-white"
                  } hover:bg-opacity-80`}
                >
                  Cancel Route
                </button>
              </div>
              <div className="mt-2">
                <strong>Directions (Car):</strong>
                <ol className="list-decimal list-inside">
                  {routeInfo.directions?.["driving-car"]?.map((step, i) => (
                    <li key={i}>{step.instruction}</li>
                  )) || <li>No directions available</li>}
                </ol>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}

export default Emergency