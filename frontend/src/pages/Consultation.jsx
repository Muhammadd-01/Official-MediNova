"use client";

import React, { useState, useContext, useEffect, useRef, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DoctorProfile from "../components/DoctorProfile";
import NurseProfile from "../components/NurseProfile";
import CheckoutModal from "../components/CheckoutModal"; // Reusable modal
import { DarkModeContext } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Droplet,
  Microscope,
  Activity,
  Syringe,
  TestTube2,
  CheckCircle,
  MapPin,
  Loader2,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Expanded Dummy Doctors
// const doctors = [
//   { id: 1, name: "Dr. John Doe", specialization: "Cardiologist", availability: "Mon, Wed, Fri", phone: "+1 (555) 123-4567", gender: "male", experience: 12, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&h=300&q=80" },
//   { id: 2, name: "Dr. Ali Raza", specialization: "Dermatologist", availability: "Tue, Thu, Sat", phone: "+1 (555) 234-5678", gender: "male", experience: 8, image: "https://images.unsplash.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// }];

// Expanded Dummy Doctors
const doctors = [
  { id: 1, name: "Dr. John Doe", specialization: "Cardiologist", availability: "Mon, Wed, Fri", phone: "+1 (555) 123-4567", gender: "male", experience: 12, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 2, name: "Dr. Ali Raza", specialization: "Dermatologist", availability: "Tue, Thu, Sat", phone: "+1 (555) 234-5678", gender: "male", experience: 8, image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 3, name: "Dr. Ayesha Khan", specialization: "Pediatrician", availability: "Mon, Tue, Wed", phone: "+1 (555) 345-6789", gender: "female", experience: 6, image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 4, name: "Dr. Sarah Ahmed", specialization: "Neurologist", availability: "Wed, Fri, Sun", phone: "+1 (555) 456-7890", gender: "female", experience: 10, image: "https://images.unsplash.com/photo-1559839744-140feadb6ac9?auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 5, name: "Dr. Imran Malik", specialization: "Orthopedist", availability: "Mon, Thu, Sat", phone: "+1 (555) 567-8901", gender: "male", experience: 15, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 6, name: "Dr. Nadia Butt", specialization: "Gynecologist", availability: "Tue, Wed, Fri", phone: "+1 (555) 678-9012", gender: "female", experience: 9, image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&h=300&q=80" },
];

// Expanded Dummy Nurses with emails
const nurses = [
  { id: 1, name: "Nurse Fatima", specialization: "Pediatric Care", phone: "+1 (555) 888-9999", gender: "female", experience: 5, image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=300&h=300&q=80", email: "muhammadaffan1445@gmail.com" },
  { id: 2, name: "Nurse Bilal", specialization: "Elderly Care", phone: "+1 (555) 777-2222", gender: "male", experience: 7, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&h=300&q=80", email: "affan.work05@gmail.com" },
  { id: 3, name: "Nurse Sana", specialization: "Post-Op Care", phone: "+1 (555) 666-3333", gender: "female", experience: 4, image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=300&h=300&q=80", email: "muhammadaffan1445@gmail.com" },
  { id: 4, name: "Nurse Ahmed", specialization: "Home Health", phone: "+1 (555) 555-4444", gender: "male", experience: 6, image: "https://images.unsplash.com/photo-1622253692010-333a67d55f5f?auto=format&fit=crop&w=300&h=300&q=80", email: "muhammadaffan1445@gmail.com" },
  { id: 5, name: "Nurse Mariam", specialization: "Wound Care", phone: "+1 (555) 444-5555", gender: "female", experience: 8, image: "https://images.unsplash.com/photo-1589696493703-0d6d4f7e4f89?auto=format&fit=crop&w=300&h=300&q=80", email: "muhammadaffan1445@gmail.com" },
];

// Related Services
const relatedServices = [
  { to: "/HealthBot", text: "Get personalized medicine suggestions", icon: "💊" },
  { to: "/articles", text: "Read our health articles", icon: "📰" },
  { to: "/pharmacy", text: "Explore our pharmacy services", icon: "🏥" },
];

// Unique specializations for filter
const uniqueSpecializations = [...new Set([...doctors, ...nurses].map(p => p.specialization))];

function Consultation() {
  const { darkMode } = useContext(DarkModeContext);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "doctor", "nurse", or "lab"
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [nurseBooked, setNurseBooked] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [userLocation, setUserLocation] = useState([24.8607, 67.0011]); // Default Karachi coords
  const [nurseLocation, setNurseLocation] = useState(null); // For live tracking

  // Filters for Doctors
  const [doctorGenderFilter, setDoctorGenderFilter] = useState("");
  const [doctorSpecializationFilter, setDoctorSpecializationFilter] = useState("");
  const [doctorMinExperience, setDoctorMinExperience] = useState("");
  const [doctorAvailabilityFilter, setDoctorAvailabilityFilter] = useState("");
  const [doctorSortFilter, setDoctorSortFilter] = useState("");

  // Filters for Nurses
  const [nurseGenderFilter, setNurseGenderFilter] = useState("");
  const [nurseSpecializationFilter, setNurseSpecializationFilter] = useState("");
  const [nurseMinExperience, setNurseMinExperience] = useState("");
  const [nurseAvailabilityFilter, setNurseAvailabilityFilter] = useState("");
  const [nurseSortFilter, setNurseSortFilter] = useState("");

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const cardBg = darkMode
    ? "bg-[#0A2A43]/40 backdrop-blur-2xl border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 backdrop-blur-2xl border border-[#0A3D62]/10 text-[#0A3D62]";
  const inputBg = darkMode
    ? "bg-[#0A2A43]/40 border-white/10 text-[#FDFBFB]"
    : "bg-white/40 border-[#0A3D62]/10 text-[#0A3D62]";

  // Pricing logic
  const doctorPrice = 2000; // PKR for doctor consultation
  const baseRate = 1000; // PKR per hour for nurse

  // Get user location for map
  useEffect(() => {
    if (nurseBooked && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          setNurseLocation([pos.coords.latitude + 0.05, pos.coords.longitude + 0.05]);
        },
        () => {
          console.warn("Location access denied, using default location.");
          setNurseLocation([24.8607 + 0.05, 67.0011 + 0.05]);
        }
      );
    }
  }, [nurseBooked]);

  // Simulate live tracking
  useEffect(() => {
    if (nurseBooked && nurseLocation && userLocation) {
      const interval = setInterval(() => {
        setNurseLocation((prev) => {
          if (!prev) return null;
          const latDiff = userLocation[0] - prev[0];
          const lonDiff = userLocation[1] - prev[1];
          const newLat = prev[0] + latDiff * 0.1;
          const newLon = prev[1] + lonDiff * 0.1;
          if (Math.abs(latDiff) < 0.001 && Math.abs(lonDiff) < 0.001) {
            clearInterval(interval);
            return userLocation;
          }
          return [newLat, newLon];
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [nurseBooked, nurseLocation, userLocation]);

  // Modal open handlers
  const handleOpenDoctorModal = (doctor) => {
    setSelectedItem(doctor);
    setModalType("doctor");
    setShowModal(true);
  };

  const handleOpenNurseModal = (nurse) => {
    setSelectedItem(nurse);
    setModalType("nurse");
    setShowModal(true);
  };

  // Submit handler for modal
  const handleSubmit = async (payload) => {
    try {
      if (modalType === "doctor") {
        console.log("Doctor booking:", { doctor: selectedItem.name, ...payload });
        setBookingDetails({
          name: payload.name,
          item: selectedItem.name,
          paymentMethod: payload.paymentMethod === "cod" ? "Cash on Delivery" : payload.paymentMethod === "card" ? "Credit/Debit Card" : "Bank Transfer",
          price: doctorPrice,
          date: payload.date,
          time: payload.time,
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        return true;
      } else if (modalType === "nurse") {
        const totalCost = baseRate * (payload.hours || 1);
        console.log("Nurse booking:", { nurse: selectedItem.name, ...payload });
        const smsBody = encodeURIComponent(`New booking from ${payload.name} at ${payload.address} for ${payload.hours} hours on ${payload.date} at ${payload.time}. Total cost: ${totalCost} PKR.`);
        window.location.href = `sms:${selectedItem.phone}?body=${smsBody}`;
        const emailBody = encodeURIComponent(`New nurse booking notification for ${selectedItem.name}.\nUser Details:\nName: ${payload.name}\nPhone: ${payload.phone}\nEmail: ${payload.email}\nAddress: ${payload.address}\nHours: ${payload.hours}\nDate: ${payload.date}\nTime: ${payload.time}\nTotal Cost: ${totalCost} PKR\nPayment Method: ${payload.paymentMethod}`);
        window.open(`mailto:${selectedItem.email}?subject=Nurse Booking Notification&body=${emailBody}`, '_blank');
        window.open(`mailto:muhammadaffan1445@gmail.com?subject=Nurse Booking Notification&body=${emailBody}`, '_blank');
        window.open(`mailto:affan.work05@gmail.com?subject=Nurse Booking Notification&body=${emailBody}`, '_blank');
        setNurseBooked(true);
        setArrivalTime(Math.floor(Math.random() * 30) + 15);
        setBookingDetails({
          name: payload.name,
          item: selectedItem.name,
          paymentMethod: payload.paymentMethod === "cod" ? "Cash on Delivery" : payload.paymentMethod === "card" ? "Credit/Debit Card" : "Bank Transfer",
          price: totalCost,
          hours: payload.hours,
          date: payload.date,
          time: payload.time,
          address: payload.address,
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Booking error:", error);
      return false;
    }
  };

  // Success handler
  const handleSuccess = (details) => {
    setBookingDetails(details);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Filtering and sorting logic for doctors
  const filterAndSortDoctors = (list) => {
    let filtered = list.filter((p) =>
      (doctorGenderFilter ? p.gender === doctorGenderFilter : true) &&
      (doctorSpecializationFilter ? p.specialization === doctorSpecializationFilter : true) &&
      (doctorMinExperience ? p.experience >= parseInt(doctorMinExperience) : true) &&
      (doctorAvailabilityFilter ? p.availability.toLowerCase().includes(doctorAvailabilityFilter.toLowerCase()) : true)
    );

    if (doctorSortFilter === "experience_desc") {
      filtered.sort((a, b) => b.experience - a.experience);
    } else if (doctorSortFilter === "experience_asc") {
      filtered.sort((a, b) => a.experience - b.experience);
    } else if (doctorSortFilter === "name_asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (doctorSortFilter === "name_desc") {
      filtered.sort((a, b) => b.name.localeCompare(b.name));
    }

    return filtered;
  };

  // Filtering and sorting logic for nurses
  const filterAndSortNurses = (list) => {
    let filtered = list.filter((p) =>
      (nurseGenderFilter ? p.gender === nurseGenderFilter : true) &&
      (nurseSpecializationFilter ? p.specialization === nurseSpecializationFilter : true) &&
      (nurseMinExperience ? p.experience >= parseInt(nurseMinExperience) : true) &&
      (nurseAvailabilityFilter ? p.availability.toLowerCase().includes(nurseAvailabilityFilter.toLowerCase()) : true)
    );

    if (nurseSortFilter === "experience_desc") {
      filtered.sort((a, b) => b.experience - a.experience);
    } else if (nurseSortFilter === "experience_asc") {
      filtered.sort((a, b) => a.experience - b.experience);
    } else if (nurseSortFilter === "name_asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (nurseSortFilter === "name_desc") {
      filtered.sort((a, b) => b.name.localeCompare(b.name));
    }

    return filtered;
  };

  const filteredDoctors = filterAndSortDoctors(doctors);
  const filteredNurses = filterAndSortNurses(nurses);

  return (
    <>
      <Helmet>
        <title>Consultation | HealthSphere</title>
      </Helmet>

      <Header />

      <div className="mx-auto px-4 sm:px-6 py-16">
        {/* Coming Soon Heading with Looping Animation */}
        <motion.h1
          className={`text-6xl sm:text-7xl font-extrabold mb-12 text-center ${textColor} tracking-tight`}
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Coming Soon
        </motion.h1>

        {/* Title */}
        <motion.h1 className={`text-4xl sm:text-5xl font-bold mb-12 text-center ${textColor}`}>
          Book a Consultation or Home Nurse
        </motion.h1>

        {/* Doctor Filters */}
        <h3 className={`text-2xl font-semibold mb-4 ${textColor}`}>Doctor Filters</h3>
        <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-6 rounded-3xl ${cardBg}`}>
          <select value={doctorGenderFilter} onChange={(e) => setDoctorGenderFilter(e.target.value)} className={`p-3 rounded-xl ${inputBg} focus:outline-none appearance-none`}>
            <option value="">Filter by Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select value={doctorSpecializationFilter} onChange={(e) => setDoctorSpecializationFilter(e.target.value)} className={`p-3 rounded-xl ${inputBg} focus:outline-none appearance-none`}>
            <option value="">Filter by Specialization</option>
            {uniqueSpecializations.map((spec, idx) => (
              <option key={idx} value={spec}>{spec}</option>
            ))}
          </select>
          <input type="number" placeholder="Min Experience (years)" value={doctorMinExperience} onChange={(e) => setDoctorMinExperience(e.target.value)} className={`p-3 rounded-xl ${inputBg} focus:outline-none`} />
          <input type="text" placeholder="Filter by Availability (e.g., Mon)" value={doctorAvailabilityFilter} onChange={(e) => setDoctorAvailabilityFilter(e.target.value)} className={`p-3 rounded-xl ${inputBg} focus:outline-none`} />
          <select value={doctorSortFilter} onChange={(e) => setDoctorSortFilter(e.target.value)} className={`p-3 rounded-xl ${inputBg} focus:outline-none appearance-none`}>
            <option value="">Sort By</option>
            <option value="experience_desc">Experience (High to Low)</option>
            <option value="experience_asc">Experience (Low to High)</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </select>
        </div>

        {/* Doctor Cards */}
        <h2 className={`text-3xl font-semibold mb-6 ${textColor}`}>Available Doctors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredDoctors.map((doctor) => (
            <DoctorProfile key={doctor.id} doctor={doctor} onBookAppointment={() => handleOpenDoctorModal(doctor)} />
          ))}
        </div>

        {/* Nurse Filters */}
        <h3 className={`text-2xl font-semibold mb-4 ${textColor}`}>Nurse Filters</h3>
        <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-6 rounded-3xl ${cardBg}`}>
          <select value={nurseGenderFilter} onChange={(e) => setNurseGenderFilter(e.target.value)} className={`p-3 rounded-xl ${inputBg} focus:outline-none appearance-none`}>
            <option value="">Filter by Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select value={nurseSpecializationFilter} onChange={(e) => setNurseSpecializationFilter(e.target.value)} className={`p-3 rounded-xl ${inputBg} focus:outline-none appearance-none`}>
            <option value="">Filter by Specialization</option>
            {uniqueSpecializations.map((spec, idx) => (
              <option key={idx} value={spec}>{spec}</option>
            ))}
          </select>
          <input type="number" placeholder="Min Experience (years)" value={nurseMinExperience} onChange={(e) => setNurseMinExperience(e.target.value)} className={`p-3 rounded-xl ${inputBg} focus:outline-none`} />
          <input type="text" placeholder="Filter by Availability (e.g., Mon)" value={nurseAvailabilityFilter} onChange={(e) => setNurseAvailabilityFilter(e.target.value)} className={`p-3 rounded-xl ${inputBg} focus:outline-none`} />
          <select value={nurseSortFilter} onChange={(e) => setNurseSortFilter(e.target.value)} className={`p-3 rounded-xl ${inputBg} focus:outline-none appearance-none`}>
            <option value="">Sort By</option>
            <option value="experience_desc">Experience (High to Low)</option>
            <option value="experience_asc">Experience (Low to High)</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </select>
        </div>

        {/* Nurse Cards */}
        <h2 className={`text-3xl font-semibold mb-6 ${textColor}`}>Available Nurses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredNurses.map((nurse) => (
            <NurseProfile key={nurse.id} nurse={nurse} onBookNurse={() => handleOpenNurseModal(nurse)} />
          ))}
        </div>

        {/* Nurse Map after booking */}
        {nurseBooked && (
          <div className="mb-16">
            <h3 className={`text-2xl font-bold mb-4 ${textColor}`}>
              Nurse {selectedItem?.name} is on the way 🚑
            </h3>
            <p className={`mb-4 ${textColor}`}>Estimated arrival time: {arrivalTime} minutes</p>
            <p className={`mb-4 ${textColor}`}>Contact Nurse: {selectedItem?.name} - Phone: {selectedItem?.phone} - Specialization: {selectedItem?.specialization}</p>
            <MapContainer center={userLocation} zoom={13} className="h-96 w-full rounded-3xl shadow-lg z-0">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={userLocation}>
                <Popup>Your Location</Popup>
              </Marker>
              {nurseLocation && (
                <Marker position={nurseLocation} icon={L.icon({ iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x-red.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                  <Popup>Nurse Location</Popup>
                </Marker>
              )}
              {nurseLocation && (
                <Polyline positions={[nurseLocation, userLocation]} color="blue" />
              )}
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

      {/* Reusable Checkout Modal */}
      <CheckoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        itemTitle={modalType === "doctor" ? `Appointment with ${selectedItem?.name}` : modalType === "nurse" ? `Nurse ${selectedItem?.name}` : "Lab Test"}
        itemPrice={modalType === "doctor" ? doctorPrice : modalType === "nurse" ? baseRate * (bookingDetails?.hours || 1) : 0}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        darkMode={darkMode}
        cardBg={cardBg}
        textColor={textColor}
        showTiming={modalType === "doctor" || modalType === "nurse"} // Show timing for doctor/nurse
        showHours={modalType === "nurse"} // Show hours for nurse only
      />

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && bookingDetails && (
          <motion.div
            className={`fixed top-4 right-4 z-50 w-full max-w-sm p-6 rounded-[20px] ${cardBg} shadow-2xl`}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-[#00C2CB] mr-3" />
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${textColor}`}>
                  {modalType === "doctor" ? "Doctor Appointment" : "Nurse Booking"} Confirmed ✅
                </h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                  Thank you, {bookingDetails.name}! Your {modalType === "doctor" ? "appointment" : "booking"} with {bookingDetails.item} is confirmed.
                </p>
                <ul className={`text-sm ${textColor} mt-2 space-y-1`}>
                  {modalType === "nurse" && <li><strong>Hours:</strong> {bookingDetails.hours}</li>}
                  <li><strong>Date:</strong> {bookingDetails.date}</li>
                  {bookingDetails.time && <li><strong>Time:</strong> {bookingDetails.time}</li>}
                  {modalType === "nurse" && <li><strong>Address:</strong> {bookingDetails.address}</li>}
                  <li><strong>Payment:</strong> {bookingDetails.paymentMethod}</li>
                  <li><strong>Price:</strong> PKR {bookingDetails.price}</li>
                </ul>
              </div>
              <motion.button
                onClick={() => setShowSuccess(false)}
                className="p-1 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close notification"
              >
                <X className="w-5 h-5 text-[#00C2CB]" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Consultation;