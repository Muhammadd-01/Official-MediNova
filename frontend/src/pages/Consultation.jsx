"use client";

import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DoctorProfile from "../components/DoctorProfile";
import NurseProfile from "../components/NurseProfile";
import { DarkModeContext } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Dummy Doctors
const doctors = [
  { id: 1, name: "Dr. John Doe", specialization: "Cardiologist", availability: "Mon, Wed, Fri", phone: "+1 (555) 123-4567", gender: "male", experience: 12, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 2, name: "Dr. Ali Raza", specialization: "Dermatologist", availability: "Tue, Thu, Sat", phone: "+1 (555) 234-5678", gender: "male", experience: 8, image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 3, name: "Dr. Ayesha Khan", specialization: "Pediatrician", availability: "Mon, Tue, Wed", phone: "+1 (555) 345-6789", gender: "female", experience: 6, image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&h=300&q=80" },
];

// Dummy Nurses
const nurses = [
  { id: 1, name: "Nurse Fatima", specialization: "Pediatric Care", phone: "+1 (555) 888-9999", gender: "female", experience: 5, image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 2, name: "Nurse Bilal", specialization: "Elderly Care", phone: "+1 (555) 777-2222", gender: "male", experience: 7, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&h=300&q=80" },
];

// Related Services
const relatedServices = [
  { to: "/medicine-suggestion", text: "Get personalized medicine suggestions", icon: "💊" },
  { to: "/articles", text: "Read our health articles", icon: "📰" },
  { to: "/pharmacy", text: "Explore our pharmacy services", icon: "🏥" },
];

function Consultation() {
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [showNurseModal, setShowNurseModal] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);

  // Nurse form states
  const [hours, setHours] = useState(1);
  const [nurseDate, setNurseDate] = useState("");
  const [nurseName, setNurseName] = useState("");
  const [nursePhone, setNursePhone] = useState("");
  const [nurseAddress, setNurseAddress] = useState("");

  // Doctor form states
  const [appointmentDate, setAppointmentDate] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");

  // Filters
  const [genderFilter, setGenderFilter] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [minExperience, setMinExperience] = useState("");

  // Nurse booking result
  const [nurseBooked, setNurseBooked] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [userLocation, setUserLocation] = useState([24.8607, 67.0011]); // Default Karachi coords

  const { darkMode } = useContext(DarkModeContext);

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const cardBg = darkMode
    ? "bg-[#0A2A43]/40 backdrop-blur-2xl border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 backdrop-blur-2xl border border-[#0A3D62]/10 text-[#0A3D62]";

  // Filtering logic
  const filterProfiles = (list) =>
    list.filter((p) =>
      (genderFilter ? p.gender === genderFilter : true) &&
      (specializationFilter ? p.specialization.toLowerCase().includes(specializationFilter.toLowerCase()) : true) &&
      (minExperience ? p.experience >= parseInt(minExperience) : true)
    );

  const filteredDoctors = filterProfiles(doctors);
  const filteredNurses = filterProfiles(nurses);

  // 💰 Nurse pricing logic
  const baseRate = 1000; // PKR per hour
  const totalCost = baseRate * hours;

  // 📍 Get user location for map
  useEffect(() => {
    if (nurseBooked && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          console.warn("Location access denied, using default location.");
        }
      );
    }
  }, [nurseBooked]);

  return (
    <>
      <Helmet>
        <title>Consultation | MediNova</title>
      </Helmet>

      <Header />

      <div className="mx-auto px-4 sm:px-6 py-16">
        {/* Title */}
        <motion.h1 className={`text-4xl sm:text-5xl font-bold mb-12 text-center ${textColor}`}>
          Book a Consultation or Home Nurse
        </motion.h1>

        {/* Filters */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 p-6 rounded-3xl ${cardBg}`}>
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="p-3 rounded-xl border focus:outline-none">
            <option value="">Filter by Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="text" placeholder="Filter by Specialization" value={specializationFilter} onChange={(e) => setSpecializationFilter(e.target.value)} className="p-3 rounded-xl border focus:outline-none" />
          <input type="number" placeholder="Min Experience (years)" value={minExperience} onChange={(e) => setMinExperience(e.target.value)} className="p-3 rounded-xl border focus:outline-none" />
        </div>

        {/* Doctor Cards */}
        <h2 className={`text-3xl font-semibold mb-6 ${textColor}`}>Available Doctors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredDoctors.map((doctor) => (
            <DoctorProfile key={doctor.id} doctor={doctor} onBookAppointment={() => { setSelectedDoctor(doctor); setShowDoctorModal(true); }} />
          ))}
        </div>

        {/* Nurse Cards */}
        <h2 className={`text-3xl font-semibold mb-6 ${textColor}`}>Available Nurses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredNurses.map((nurse) => (
            <NurseProfile key={nurse.id} nurse={nurse} onBookNurse={() => { setSelectedNurse(nurse); setShowNurseModal(true); }} />
          ))}
        </div>

        {/* Show Nurse Map after booking */}
        {nurseBooked && (
          <div className="mb-16">
            <h3 className={`text-2xl font-bold mb-4 ${textColor}`}>
              Nurse {selectedNurse?.name} is on the way 🚑
            </h3>
            <p className={`mb-4 ${textColor}`}>Estimated arrival time: {arrivalTime} minutes</p>
            <MapContainer center={userLocation} zoom={13} className="h-96 w-full rounded-3xl shadow-lg z-0">
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={userLocation}>
                <Popup>Your Location</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Related Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedServices.map((service, idx) => (
            <motion.div key={idx} className={`p-6 rounded-[40px] ${cardBg} shadow-md flex items-center space-x-4`}>
              <span className="text-4xl">{service.icon}</span>
              <Link to={service.to} className={`text-lg sm:text-xl font-semibold ${textColor}`}>
                {service.text}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Doctor Booking Modal */}
      <AnimatePresence>
        {showDoctorModal && selectedDoctor && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={`p-6 sm:p-8 rounded-[40px] ${cardBg} shadow-xl max-w-md w-full`}
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>Book Appointment with {selectedDoctor.name}</h2>
              <p className="mb-4">Specialization: {selectedDoctor.specialization}</p>

              <label className="block mb-3">
                <span className={`${textColor} font-medium`}>Your Name:</span>
                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)}
                  className="w-full mt-2 p-3 rounded-xl border focus:outline-none" required />
              </label>
              <label className="block mb-3">
                <span className={`${textColor} font-medium`}>Phone:</span>
                <input type="tel" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full mt-2 p-3 rounded-xl border focus:outline-none" required />
              </label>
              <label className="block mb-3">
                <span className={`${textColor} font-medium`}>Email:</span>
                <input type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full mt-2 p-3 rounded-xl border focus:outline-none" required />
              </label>
              <label className="block mb-3">
                <span className={`${textColor} font-medium`}>Appointment Date:</span>
                <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full mt-2 p-3 rounded-xl border focus:outline-none" required />
              </label>

              <div className="flex justify-between gap-4 mt-6">
                <motion.button onClick={() => setShowDoctorModal(false)} className="px-6 py-3 rounded-xl bg-gray-500 text-white">Cancel</motion.button>
                <motion.button onClick={() => {
                  if (!patientName || !patientPhone || !patientEmail || !appointmentDate) {
                    alert("Please fill all fields ❌");
                    return;
                  }
                  setShowDoctorModal(false);
                  alert("Doctor appointment booked ✅");
                }} className="px-6 py-3 rounded-xl bg-[#0A3D62] text-white">Confirm</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nurse Booking Modal */}
      <AnimatePresence>
        {showNurseModal && selectedNurse && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={`p-6 sm:p-8 rounded-[40px] ${cardBg} shadow-xl max-w-md w-full`}
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>Book Nurse {selectedNurse.name}</h2>
              <p className="mb-4">Specialization: {selectedNurse.specialization}</p>

              <label className="block mb-3">
                <span className={`${textColor} font-medium`}>Your Name:</span>
                <input type="text" value={nurseName} onChange={(e) => setNurseName(e.target.value)}
                  className="w-full mt-2 p-3 rounded-xl border focus:outline-none" required />
              </label>
              <label className="block mb-3">
                <span className={`${textColor} font-medium`}>Phone:</span>
                <input type="tel" value={nursePhone} onChange={(e) => setNursePhone(e.target.value)}
                  className="w-full mt-2 p-3 rounded-xl border focus:outline-none" required />
              </label>
              <label className="block mb-3">
                <span className={`${textColor} font-medium`}>Address:</span>
                <textarea value={nurseAddress} onChange={(e) => setNurseAddress(e.target.value)}
                  className="w-full mt-2 p-3 rounded-xl border focus:outline-none" required />
              </label>
              <label className="block mb-3">
                <span className={`${textColor} font-medium`}>Duration (Hours):</span>
                <input type="number" min="1" value={hours} onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full mt-2 p-3 rounded-xl border focus:outline-none" required />
              </label>
              <label className="block mb-3">
                <span className={`${textColor} font-medium`}>Date:</span>
                <input type="date" value={nurseDate} onChange={(e) => setNurseDate(e.target.value)}
                  className="w-full mt-2 p-3 rounded-xl border focus:outline-none" required />
              </label>

              <p className={`mt-4 mb-6 text-lg font-semibold ${textColor}`}>
                Total Cost: <span className="text-green-400">{totalCost} PKR</span>
              </p>

              <div className="flex justify-between gap-4">
                <motion.button onClick={() => setShowNurseModal(false)} className="px-6 py-3 rounded-xl bg-gray-500 text-white">Cancel</motion.button>
                <motion.button onClick={() => {
                  if (!nurseName || !nursePhone || !nurseAddress || !hours || !nurseDate) {
                    alert("Please fill all fields ❌");
                    return;
                  }
                  setShowNurseModal(false);
                  setNurseBooked(true);
                  setArrivalTime(Math.floor(Math.random() * 30) + 15); // Random 15–45 min ETA
                }} className="px-6 py-3 rounded-xl bg-[#0A3D62] text-white">Confirm</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default Consultation;
