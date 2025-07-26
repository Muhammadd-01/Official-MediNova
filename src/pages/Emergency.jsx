import { useState, useContext, useEffect, useRef } from "react"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import {
  Phone,
  Ambulance,
  Hospital,
  ChevronDown,
  ChevronUp,
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
  const [location, setLocation] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [routeGeoJSON, setRouteGeoJSON] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [mapStyle, setMapStyle] = useState("https://api.maptiler.com/maps/basic-v2/style.json?key=YOUR_MAPTILER_KEY")
  const [destination, setDestination] = useState(null)
  const lastLocationRef = useRef(null)

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

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const newLocation = [longitude, latitude]
        if (!lastLocationRef.current || getDistance(lastLocationRef.current, newLocation) > 100) {
          setLocation(newLocation)
          lastLocationRef.current = newLocation
        }
      },
      (err) => {
        console.error("Geolocation error:", err)
        alert("Location access denied.")
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  useEffect(() => {
    if (!location) return

    const pitch = mapStyle.includes("satellite") ? 0 : mapStyle.includes("2d") ? 0 : 60
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: mapStyle.replace("?key=YOUR_MAPTILER_KEY", ""), // Replace with actual key in production
      center: location,
      zoom: 15,
      pitch,
      bearing: 0,
    })
    mapInstanceRef.current = map

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
      <option value="https://api.maptiler.com/maps/basic-v2/style.json?key=YOUR_MAPTILER_KEY&2d=true">2D View</option>
      <option value="https://api.maptiler.com/maps/basic-v2/style.json?key=YOUR_MAPTILER_KEY">3D View</option>
      <option value="https://api.maptiler.com/maps/satellite/style.json?key=YOUR_MAPTILER_KEY">Satellite View</option>
    `
    styleToggle.onchange = (e) => setMapStyle(e.target.value)
    map.getContainer().appendChild(styleToggle)

    new maplibregl.Marker({ color: "blue" })
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
        setHospitals(json.elements)

        json.elements.forEach((h) => {
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
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error)
        alert("Failed to load hospitals. Please try again.")
      }
    }

    fetchHospitals()

    map.on("load", () => {
      map.addLayer({
        id: "3d-buildings",
        source: "openmaptiles",
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 14,
        paint: {
          "fill-extrusion-color": [
            "case",
            ["==", ["get", "building"], "commercial"], "#FFD700",
            ["==", ["get", "building"], "residential"], "#D3D3D3",
            ["==", ["get", "building"], "hospital"], "#FF6347",
            "#A9A9A9"
          ],
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.8,
          "fill-extrusion-ambient-occlusion-intensity": 0.4,
          "fill-extrusion-ambient-occlusion-radius": 4
        },
      })

      if (routeGeoJSON) {
        if (map.getSource("route")) {
          map.getSource("route").setData(routeGeoJSON)
        } else {
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

        if (routeInfo) {
          const popup = new maplibregl.Popup()
            .setLngLat(location)
            .setHTML(`
              <div style="font-family: Arial; padding: 10px; max-height: 200px; overflow-y: auto;">
                <strong>Route to ${routeInfo.name}</strong><br/>
                <strong>Car:</strong> ${routeInfo.car?.distance / 1000} km, ${Math.round(routeInfo.car?.duration / 60)} min<br/>
                <strong>Bike:</strong> ${routeInfo.bike?.distance / 1000} km, ${Math.round(routeInfo.bike?.duration / 60)} min<br/>
                <strong>Foot:</strong> ${routeInfo.foot?.distance / 1000} km, ${Math.round(routeInfo.foot?.duration / 60)} min<br/>
                <strong>Directions (Car):</strong><br/>
                <ol style="list-style: decimal; margin-left: 15px;">
                  ${routeInfo.directions?.["driving-car"]?.map(step => `<li>${step.instruction}</li>`).join('') || "No directions available"}
                </ol>
              </div>
            `)
            .addTo(map)
        }
      }
    })

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [location, routeGeoJSON, routeInfo, mapStyle])

  useEffect(() => {
    if (!location || !destination || !mapInstanceRef.current) return
    window.getRoute(destination[0], destination[1], routeInfo?.name || "Hospital/Clinic")
  }, [location])

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
          <div ref={mapRef} className="h-[500px] rounded-lg shadow-lg" />
          {routeInfo && (
            <div className="mt-4 text-center">
              <p><strong>Route to {routeInfo.name}</strong></p>
              <p>Car: {routeInfo.car?.distance / 1000} km, {Math.round(routeInfo.car?.duration / 60)} min</p>
              <p>Bike: {routeInfo.bike?.distance / 1000} km, {Math.round(routeInfo.bike?.duration / 60)} min</p>
              <p>Foot: {routeInfo.foot?.distance / 1000} km, {Math.round(routeInfo.foot?.duration / 60)} min</p>
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