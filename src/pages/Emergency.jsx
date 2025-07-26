// Emergency.jsx
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
  const [location, setLocation] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [routeGeoJSON, setRouteGeoJSON] = useState(null)

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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation([longitude, latitude])
      },
      () => alert("Location access denied."),
      { enableHighAccuracy: true }
    )
  }, [])

  useEffect(() => {
    if (!location) return

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: location,
      zoom: 14,
      pitch: 45,
    })

    map.addControl(new maplibregl.NavigationControl(), "top-right")
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      })
    )

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
              <button onclick="window.getRoute(${h.lon}, ${h.lat})">Lock & Route</button>
            `)
          )
          .addTo(map)
      })

      window.getRoute = async (lon, lat) => {
        const response = await axios.post(
          `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
          {
            coordinates: [location, [lon, lat]],
          },
          {
            headers: {
              Authorization: orsApiKey,
              "Content-Type": "application/json",
            },
          }
        )
        setRouteGeoJSON(response.data)
      }
    }

    fetchHospitals()

    map.on("load", () => {
      if (routeGeoJSON) {
        map.addSource("route", {
          type: "geojson",
          data: routeGeoJSON,
        })

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#FF0000",
            "line-width": 4,
          },
        })
      }
    })

    return () => map.remove()
  }, [location, routeGeoJSON])

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
        </motion.div>
      </div>
    </>
  )
}

export default Emergency