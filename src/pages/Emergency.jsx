import { useState, useContext, useEffect, useRef } from "react"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import {
  Phone,
  Ambulance,
  Hospital,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Search,
} from "lucide-react"
import { DarkModeContext } from "../App"
import maplibregl from "maplibre-gl"
import axios from "axios"
import "maplibre-gl/dist/maplibre-gl.css"

const orsApiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjgyNGUwMDBmYzBiNTQxODRiNDczYTIwY2Q3YjIxYWQ2IiwiaCI6Im11cm11cjY0In0="

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
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState([])
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
    const R = 6371e3 // Earth's radius in meters
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

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now()
        if (now - lastUpdateTimeRef.current < 15000) return // Throttle to 15 seconds
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

  const getMapTileUrl = (style) => {
    switch (style) {
      case "3d":
      case "2d":
        return "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      case "satellite":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      default:
        return "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    }
  }

  useEffect(() => {
    if (!location || !mapRef.current) return

    const initializeMap = () => {
      let map
      try {
        map = new maplibregl.Map({
          container: mapRef.current,
          style: {
            version: 8,
            sources: {
              osm: {
                type: "raster",
                tiles: [getMapTileUrl(mapStyle)],
                tileSize: 256,
                attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
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
        })
        mapInstanceRef.current = map

        map.on("error", (e) => {
          console.error("Map error:", e.error)
          alert(`Failed to load map tiles for ${mapStyle} mode. Please try again or check console for details.`)
        })

        map.on("load", () => {
          setIsMapLoaded(true)
          map.resize()
          map.triggerRepaint()
        })
      } catch (error) {
        console.error("Map initialization error:", error)
        alert("Failed to initialize map. Please refresh the page.")
        return
      }

      map.addControl(new maplibregl.NavigationControl(), "top-right")
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        })
      )

      const styleToggle = document.createElement("select")
      styleToggle.className = "absolute top-2 left-2 p-2 bg-white rounded shadow z-10"
      styleToggle.innerHTML = `
        <option value="2d" ${mapStyle === "2d" ? "selected" : ""}>2D View</option>
        <option value="3d" ${mapStyle === "3d" ? "selected" : ""}>3D View</option>
        <option value="satellite" ${mapStyle === "satellite" ? "selected" : ""}>Satellite View</option>
      `
      styleToggle.onchange = (e) => {
        const newStyle = e.target.value
        setMapStyle(newStyle)
        setIsMapLoaded(false)
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setStyle({
            version: 8,
            sources: {
              osm: {
                type: "raster",
                tiles: [getMapTileUrl(newStyle)],
                tileSize: 256,
                attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
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
          mapInstanceRef.current.once("style.load", () => {
            mapInstanceRef.current.setPitch(newStyle === "3d" ? 60 : 0)
            mapInstanceRef.current.resize()
            mapInstanceRef.current.triggerRepaint()
            setIsMapLoaded(true)
            // Re-add route layer if exists
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
            // Re-add user marker
            if (userMarkerRef.current) {
              userMarkerRef.current.addTo(mapInstanceRef.current)
            }
          })
        }
      }
      map.getContainer().appendChild(styleToggle)

      // Initialize user marker
      userMarkerRef.current = new maplibregl.Marker({ color: "blue" })
        .setLngLat(location)
        .setPopup(new maplibregl.Popup().setText("You are here"))
        .addTo(map)

      const fetchHospitals = async () => {
        const [lon, lat] = location
        const query = `
[out:json][timeout:25];
(
  node["amenity"="hospital"](around:5000,${lat},${lon});
  node["amenity"="clinic"](around:5000,${lat},${lon});
);
out body;`
        try {
          const res = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query,
          })
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
            // Center map on selected hospital/clinic
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

            // Add route layer immediately
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
          alert("Failed to load hospitals. Please try again.")
        }
      }

      fetchHospitals()
    }

    const timeout = setTimeout(initializeMap, 200)
    return () => {
      clearTimeout(timeout)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      setIsMapLoaded(false)
    }
  }, [location, mapStyle])

  useEffect(() => {
    if (!location || !mapInstanceRef.current) return

    // Update user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat(location)
      if (isTracking) {
        // Switch to arrow marker
        userMarkerRef.current.remove()
        const arrowEl = document.createElement("div")
        arrowEl.style.width = "24px"
        arrowEl.style.height = "24px"
        arrowEl.style.backgroundColor = "blue"
        arrowEl.style.clipPath = "polygon(50% 0%, 100% 100%, 0% 100%)"
        arrowEl.style.border = "1px solid white"
        let arrowHeading = heading
        if (arrowHeading === null && routeGeoJSON && routeGeoJSON.features[0].geometry.coordinates.length > 1) {
          // Use route direction if heading is unavailable
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
        // Switch back to blue marker
        userMarkerRef.current.remove()
        userMarkerRef.current = new maplibregl.Marker({ color: "blue" })
          .setLngLat(location)
          .setPopup(new maplibregl.Popup().setText("You are here"))
          .addTo(mapInstanceRef.current)
      }
    }

    if (!destination) return

    // Check if arrived at destination
    const distanceToDest = getDistance(location, destination)
    if (distanceToDest < 50) {
      speakDirection("You have arrived at your destination.")
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
        zoom: 16, // Closer zoom for navigation
        duration: 1000,
      })

      // Update route dynamically
      window.getRoute(destination[0], destination[1], routeInfo?.name || "Hospital/Clinic")

      // Periodic distance update (every 30 seconds)
      const now = Date.now()
      if (now - lastDistanceUpdateRef.current > 30000) {
        const distanceKm = (distanceToDest / 1000).toFixed(2)
        speakDirection(`${distanceKm} kilometers to your destination.`)
        lastDistanceUpdateRef.current = now
      }

      // Trim route line to show only remaining path
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
        // Only update if closest point has changed significantly
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

      // Voice guidance for navigation steps
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

  // Handle search suggestions
  useEffect(() => {
    if (!searchQuery) {
      setSearchSuggestions([])
      return
    }
    const filtered = hospitals
      .filter(h => 
        (h.tags.name || "Hospital/Clinic").toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5) // Limit to 5 suggestions
    setSearchSuggestions(filtered)
  }, [searchQuery, hospitals])

  const handleSearchSelect = (lon, lat, name) => {
    setSearchQuery("")
    setSearchSuggestions([])
    // Center map on selected hospital/clinic
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
          <div className="relative mb-4">
            <div className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospitals or clinics..."
                className={`w-full p-2 pr-10 rounded-lg ${
                  darkMode ? "bg-[#0A2A43] text-[#FDFBFB]" : "bg-white text-[#1E3A8A]"
                }`}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>
            {searchSuggestions.length > 0 && (
              <ul className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg ${
                darkMode ? "bg-[#0A2A43] text-[#FDFBFB]" : "bg-white text-[#1E3A8A]"
              }`}>
                {searchSuggestions.map((h) => (
                  <li
                    key={h.id}
                    onClick={() => handleSearchSelect(h.lon, h.lat, h.tags.name || "Hospital/Clinic")}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {h.tags.name || "Hospital/Clinic"} ({(h.distance / 1000).toFixed(2)} km)
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            ref={mapRef}
            className="h-[600px] w-full min-h-[600px] max-w-full rounded-lg shadow-lg bg-gray-200 dark:bg-gray-800 relative z-0 overflow-hidden"
          >
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#1E3A8A]"></div>
              </div>
            )}
          </div>
          {routeInfo && (
            <div className="mt-4 text-center">
              <p><strong>Route to {routeInfo.name}</strong></p>
              <p>Car: {routeInfo.car?.distance / 1000} km, {Math.round(routeInfo.car?.duration / 60)} min</p>
              <p>Bike: {routeInfo.bike?.distance / 1000} km, {Math.round(routeInfo.bike?.duration / 60)} min</p>
              <p>Foot: {routeInfo.foot?.distance / 1000} km, {Math.round(routeInfo.foot?.duration / 60)} min</p>
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