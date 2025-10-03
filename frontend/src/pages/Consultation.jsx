"use client";

import React, { useState, useContext, useEffect, useRef, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DoctorProfile from "../components/DoctorProfile";
import NurseProfile from "../components/NurseProfile";
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
  User,
  Phone,
  Mail,
  Calendar,
  Home,
  X,
  CreditCard,
  Building,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Loader2,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

// Mock Pakistani names for realistic CNIC auto-fill
const pakistaniNames = {
  male: [
    "Ahmed Raza", "Muhammad Ali", "Hassan Khan", "Usman Malik", "Bilal Ahmed",
    "Faisal Shah", "Omar Farooq", "Zain Abbas", "Asadullah Butt", "Hamza Siddiqui",
    "Saad Rehman", "Ibrahim Qureshi", "Yousuf Mirza", "Abdullah Khan", "Tahir Iqbal"
  ],
  female: [
    "Fatima Khan", "Ayesha Siddiqui", "Zainab Malik", "Maryam Ahmed", "Sana Raza",
    "Hina Shah", "Amna Farooq", "Sara Abbas", "Rabia Butt", "Mahnoor Rehman",
    "Iqra Qureshi", "Areeba Mirza", "Khadija Khan", "Bushra Iqbal", "Laiba Ali"
  ],
};

// Static list of Pakistani banks with details
const pakistaniBanks = [
  { name: "Habib Bank Limited (HBL)", details: "IBAN: PK60HBLT0000000012345678, SWIFT: HABBPKKA" },
  { name: "United Bank Limited (UBL)", details: "IBAN: PK70UBLP0000000023456789, SWIFT: UBPAKKAH" },
  { name: "Meezan Bank", details: "IBAN: PK36MEZAN0000000034567890, SWIFT: MEZNPKKA" },
  { name: "MCB Bank", details: "IBAN: PK40MCB0000000045678901, SWIFT: MUCBPKKA" },
  { name: "Allied Bank", details: "IBAN: PK50ABPA0000000056789012, SWIFT: ABPAPKKA" },
  { name: "National Bank of Pakistan (NBP)", details: "IBAN: PK30NBPA0000000067890123, SWIFT: NBPAPKKA" },
  { name: "Bank Alfalah", details: "IBAN: PK20ALFH0000000078901234, SWIFT: ALFHPKKA" },
  { name: "Standard Chartered Pakistan", details: "IBAN: PK10SCBL0000000089012345, SWIFT: SCBLPKKA" },
  { name: "BankIslami", details: "IBAN: PK25BKIS0000000090123456, SWIFT: BKISPKKA" },
  { name: "Faysal Bank", details: "IBAN: PK15FAYS0000000101234567, SWIFT: FAYSPKKA" },
];

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
  { to: "/medicine-suggestion", text: "Get personalized medicine suggestions", icon: "💊" },
  { to: "/articles", text: "Read our health articles", icon: "📰" },
  { to: "/pharmacy", text: "Explore our pharmacy services", icon: "🏥" },
];

// Unique specializations for filter
const uniqueSpecializations = [...new Set([...doctors, ...nurses].map(p => p.specialization))];

function Consultation() {
  const { darkMode } = useContext(DarkModeContext);

  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [showNurseModal, setShowNurseModal] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);

  // Success notification for nurse booking
  const [showNurseSuccess, setShowNurseSuccess] = useState(false);
  const [nurseBookingDetails, setNurseBookingDetails] = useState(null);

  // Shared states for modals (duplicated for doctor and nurse to avoid complexity)
  // For Doctor
  const [doctorFormData, setDoctorFormData] = useState({
    name: "",
    cnic: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    date: "",
    address: "",
    cardHolder: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    bankName: "",
    accountNumber: "",
    transactionId: "",
  });
  const [doctorPaymentMethod, setDoctorPaymentMethod] = useState("");
  const [doctorBankQuery, setDoctorBankQuery] = useState("");
  const [doctorCnicVerified, setDoctorCnicVerified] = useState(null);
  const [doctorCnicLoading, setDoctorCnicLoading] = useState(false);
  const [doctorPhoneError, setDoctorPhoneError] = useState(null);
  const [doctorLocationLoading, setDoctorLocationLoading] = useState(false);
  const [doctorCardLoading, setDoctorCardLoading] = useState(false);
  const [doctorCardDetails, setDoctorCardDetails] = useState(null);
  const [doctorBankLoading, setDoctorBankLoading] = useState(false);
  const [doctorBankDetails, setDoctorBankDetails] = useState(null);

  // For Nurse
  const [nurseFormData, setNurseFormData] = useState({
    name: "",
    cnic: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    date: "",
    address: "",
    hours: 1,
    cardHolder: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    bankName: "",
    accountNumber: "",
    transactionId: "",
  });
  const [nursePaymentMethod, setNursePaymentMethod] = useState("");
  const [nurseBankQuery, setNurseBankQuery] = useState("");
  const [nurseCnicVerified, setNurseCnicVerified] = useState(null);
  const [nurseCnicLoading, setNurseCnicLoading] = useState(false);
  const [nursePhoneError, setNursePhoneError] = useState(null);
  const [nurseLocationLoading, setNurseLocationLoading] = useState(false);
  const [nurseCardLoading, setNurseCardLoading] = useState(false);
  const [nurseCardDetails, setNurseCardDetails] = useState(null);
  const [nurseBankLoading, setNurseBankLoading] = useState(false);
  const [nurseBankDetails, setNurseBankDetails] = useState(null);

  // Nurse booking result
  const [nurseBooked, setNurseBooked] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [userLocation, setUserLocation] = useState([24.8607, 67.0011]); // Default Karachi coords
  const [nurseLocation, setNurseLocation] = useState(null); // For live tracking

  // Separate Filters for Doctors
  const [doctorGenderFilter, setDoctorGenderFilter] = useState("");
  const [doctorSpecializationFilter, setDoctorSpecializationFilter] = useState("");
  const [doctorMinExperience, setDoctorMinExperience] = useState("");
  const [doctorAvailabilityFilter, setDoctorAvailabilityFilter] = useState("");
  const [doctorSortFilter, setDoctorSortFilter] = useState("");

  // Separate Filters for Nurses
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

  const doctorModalContentRef = useRef(null);
  const nurseModalContentRef = useRef(null);

  // 💰 Doctor pricing logic (fixed)
  const doctorPrice = 2000; // PKR fixed for consultation

  // 💰 Nurse pricing logic
  const baseRate = 1000; // PKR per hour
  const nurseTotalCost = baseRate * nurseFormData.hours;

  // 📍 Get user location for map
  useEffect(() => {
    if (nurseBooked && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          // Simulate nurse start location near user
          setNurseLocation([pos.coords.latitude + 0.05, pos.coords.longitude + 0.05]);
        },
        () => {
          console.warn("Location access denied, using default location.");
          // Simulate nurse start location
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
      }, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [nurseBooked, nurseLocation, userLocation]);

  // Debounced CNIC verification (shared function)
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const verifyCNIC = useCallback(
    (cnic, setCnicVerified, setCnicLoading, setFormData) => {
      const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
      if (cnicRegex.test(cnic)) {
        setCnicLoading(true);
        setTimeout(() => {
          const digitsOnly = cnic.replace(/-/g, "");
          const hash = parseInt(digitsOnly.slice(0, 6)) % 15;
          const gender = parseInt(digitsOnly.slice(-1)) % 2 === 0 ? "Female" : "Male";
          const birthYear = 1945 + (parseInt(digitsOnly.slice(6, 8)) % 61);
          const age = 2025 - birthYear;
          const name = gender === "Male" ? pakistaniNames.male[hash] : pakistaniNames.female[hash];
          setFormData((prev) => ({ ...prev, name, gender, age: age.toString() }));
          setCnicVerified(`Data loaded from NADRA: ${name}, ${gender}, Age ${age}`);
          setCnicLoading(false);
        }, 2000);
      } else {
        setCnicVerified("Invalid CNIC format");
        setCnicLoading(false);
      }
    },
    []
  );

  const doctorVerifyCNICDebounced = useMemo(() => debounce((cnic) => verifyCNIC(cnic, setDoctorCnicVerified, setDoctorCnicLoading, setDoctorFormData), 500), []);
  const nurseVerifyCNICDebounced = useMemo(() => debounce((cnic) => verifyCNIC(cnic, setNurseCnicVerified, setNurseCnicLoading, setNurseFormData), 500), []);

  // Format CNIC input
  const formatCNIC = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 13);
    if (digits.length > 5 && digits.length <= 12) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    if (digits.length > 12) {
      return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
    }
    return digits;
  };

  // Card verification with binlist.net
  const verifyCard = useCallback(async (cardNumber, setCardDetails, setCardLoading) => {
    const digitsOnly = cardNumber.replace(/\D/g, "");
    if (digitsOnly.length >= 6) {
      setCardLoading(true);
      try {
        const bin = digitsOnly.slice(0, 6);
        const response = await fetch(`https://lookup.binlist.net/${bin}`);
        if (response.ok) {
          const data = await response.json();
          const details = `${data.bank?.name || "Unknown Bank"}, ${data.type || "Unknown Type"}, ${data.country?.name || "Unknown Country"}`;
          setCardDetails(`Card verified: ${details}`);
        } else {
          const isValid = luhnCheck(digitsOnly);
          setCardDetails(isValid ? "Card verified (Luhn): Valid card number" : "Invalid card number");
        }
      } catch {
        const isValid = luhnCheck(digitsOnly);
        setCardDetails(isValid ? "Card verified (Luhn): Valid card number" : "Invalid card number");
      }
      setCardLoading(false);
    } else {
      setCardDetails("Invalid card number");
      setCardLoading(false);
    }
  }, []);

  // Luhn algorithm
  const luhnCheck = (cardNumber) => {
    let sum = 0;
    let isEven = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  // Bank verification
  const verifyBank = useCallback((bankName, accountNumber, setBankDetails, setBankLoading) => {
    const digitsOnly = accountNumber.replace(/\D/g, "");
    if (digitsOnly.length >= 12 && digitsOnly.length <= 16) {
      setBankLoading(true);
      setTimeout(() => {
        const bank = pakistaniBanks.find((b) => b.name.toLowerCase() === bankName.toLowerCase());
        if (bank) {
          setBankDetails(`Account verified: ${bank.name}, ${bank.details}`);
        } else {
          setBankDetails("Invalid bank or account number");
        }
        setBankLoading(false);
      }, 2000);
    } else {
      setBankDetails("Invalid bank or account number");
      setBankLoading(false);
    }
  }, []);

  // Location fetching
  const getLiveLocation = useCallback((setFormData, setLocationLoading) => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            const address = data.display_name || "Current Location";
            setFormData((prev) => ({ ...prev, address }));
          } catch (error) {
            console.error("Location API error:", error);
            setFormData((prev) => ({ ...prev, address: "Location not available" }));
          }
          setLocationLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setFormData((prev) => ({ ...prev, address: "Location access denied" }));
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      alert("Geolocation not supported by this browser.");
      setLocationLoading(false);
    }
  }, []);

  // Phone validation
  const validatePhone = useCallback((phone, setPhoneError) => {
    const phoneRegex = /^03[0-4][0-9]-[0-9]{7}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Phone must be in format 03XX-XXXXXXX");
      return false;
    }
    setPhoneError(null);
    return true;
  }, []);

  // Card number formatting
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    const formatted = digits.match(/.{1,4}/g)?.join(" ").slice(0, 19) || digits;
    return formatted;
  };

  const handleDoctorFormChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      let newValue = value;
      if (name === "cardNumber") {
        newValue = formatCardNumber(value);
      } else if (name === "cnic") {
        newValue = formatCNIC(value);
      }
      setDoctorFormData((prev) => ({ ...prev, [name]: newValue }));
      if (name === "cnic") doctorVerifyCNICDebounced(newValue);
      if (name === "phone") validatePhone(newValue, setDoctorPhoneError);
      if (name === "bankName") {
        setDoctorBankQuery(value);
        verifyBank(value, doctorFormData.accountNumber, setDoctorBankDetails, setDoctorBankLoading);
      }
      if (name === "accountNumber") {
        verifyBank(doctorFormData.bankName, newValue, setDoctorBankDetails, setDoctorBankLoading);
      }
    },
    [doctorFormData, doctorVerifyCNICDebounced, validatePhone, verifyBank]
  );

  const handleNurseFormChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      let newValue = value;
      if (name === "cardNumber") {
        newValue = formatCardNumber(value);
      } else if (name === "cnic") {
        newValue = formatCNIC(value);
      } else if (name === "hours") {
        newValue = Number(value);
      }
      setNurseFormData((prev) => ({ ...prev, [name]: newValue }));
      if (name === "cnic") nurseVerifyCNICDebounced(newValue);
      if (name === "phone") validatePhone(newValue, setNursePhoneError);
      if (name === "bankName") {
        setNurseBankQuery(value);
        verifyBank(value, nurseFormData.accountNumber, setNurseBankDetails, setNurseBankLoading);
      }
      if (name === "accountNumber") {
        verifyBank(nurseFormData.bankName, newValue, setNurseBankDetails, setNurseBankLoading);
      }
    },
    [nurseFormData, nurseVerifyCNICDebounced, validatePhone, verifyBank]
  );

  const handleOpenDoctorModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
    setDoctorFormData({
      name: "",
      cnic: "",
      age: "",
      gender: "",
      phone: "",
      email: "",
      date: "",
      address: "",
      cardHolder: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVV: "",
      bankName: "",
      accountNumber: "",
      transactionId: "",
    });
    setDoctorPaymentMethod("");
    setDoctorBankQuery("");
    setDoctorCnicVerified(null);
    setDoctorCardDetails(null);
    setDoctorBankDetails(null);
    setDoctorCnicLoading(false);
    setDoctorPhoneError(null);
    setTimeout(() => {
      if (doctorModalContentRef.current) doctorModalContentRef.current.scrollTop = 0;
    }, 0);
  };

  const handleOpenNurseModal = (nurse) => {
    setSelectedNurse(nurse);
    setShowNurseModal(true);
    setNurseFormData({
      name: "",
      cnic: "",
      age: "",
      gender: "",
      phone: "",
      email: "",
      date: "",
      address: "",
      hours: 1,
      cardHolder: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVV: "",
      bankName: "",
      accountNumber: "",
      transactionId: "",
    });
    setNursePaymentMethod("");
    setNurseBankQuery("");
    setNurseCnicVerified(null);
    setNurseCardDetails(null);
    setNurseBankDetails(null);
    setNurseCnicLoading(false);
    setNursePhoneError(null);
    setTimeout(() => {
      if (nurseModalContentRef.current) nurseModalContentRef.current.scrollTop = 0;
    }, 0);
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    if (!doctorFormData.name || !doctorFormData.phone || !doctorFormData.date) {
      alert("Please complete required fields (name, phone, date).");
      return;
    }
    if (!validatePhone(doctorFormData.phone, setDoctorPhoneError)) {
      alert("Please enter a valid phone number in format 03XX-XXXXXXX.");
      return;
    }
    if (doctorPaymentMethod === "card") {
      if (!doctorFormData.cardNumber || !doctorFormData.cardCVV || !doctorFormData.cardExpiry || !doctorFormData.cardHolder) {
        alert("Please provide complete card details.");
        return;
      }
      if (!doctorCardDetails || doctorCardDetails.includes("Invalid")) {
        alert("Please verify card details.");
        return;
      }
    }
    if (doctorPaymentMethod === "bank") {
      if (!doctorFormData.bankName || !doctorFormData.accountNumber || !doctorFormData.transactionId) {
        alert("Please fill all bank transfer details.");
        return;
      }
      if (!pakistaniBanks.some((b) => b.name.toLowerCase() === doctorFormData.bankName.toLowerCase())) {
        alert("Please select a valid Pakistani bank from the list.");
        return;
      }
      if (!doctorBankDetails || doctorBankDetails.includes("Invalid")) {
        alert("Please verify bank details.");
        return;
      }
    }
    if (doctorFormData.cnic && doctorCnicVerified && doctorCnicVerified.includes("Invalid")) {
      const ok = confirm("CNIC not verified. Do you want to continue without CNIC verification?");
      if (!ok) return;
    }
    // Simulate booking
    console.log("Doctor booking:", { doctor: selectedDoctor.name, ...doctorFormData, paymentMethod: doctorPaymentMethod });
    alert("Doctor appointment booked ✅");
    setShowDoctorModal(false);
  };

  const handleNurseSubmit = (e) => {
    e.preventDefault();
    if (!nurseFormData.name || !nurseFormData.phone || !nurseFormData.date || !nurseFormData.hours || !nurseFormData.address) {
      alert("Please complete required fields (name, phone, date, hours, address).");
      return;
    }
    if (!validatePhone(nurseFormData.phone, setNursePhoneError)) {
      alert("Please enter a valid phone number in format 03XX-XXXXXXX.");
      return;
    }
    if (nursePaymentMethod === "card") {
      if (!nurseFormData.cardNumber || !nurseFormData.cardCVV || !nurseFormData.cardExpiry || !nurseFormData.cardHolder) {
        alert("Please provide complete card details.");
        return;
      }
      if (!nurseCardDetails || nurseCardDetails.includes("Invalid")) {
        alert("Please verify card details.");
        return;
      }
    }
    if (nursePaymentMethod === "bank") {
      if (!nurseFormData.bankName || !nurseFormData.accountNumber || !nurseFormData.transactionId) {
        alert("Please fill all bank transfer details.");
        return;
      }
      if (!pakistaniBanks.some((b) => b.name.toLowerCase() === nurseFormData.bankName.toLowerCase())) {
        alert("Please select a valid Pakistani bank from the list.");
        return;
      }
      if (!nurseBankDetails || nurseBankDetails.includes("Invalid")) {
        alert("Please verify bank details.");
        return;
      }
    }
    if (nurseFormData.cnic && nurseCnicVerified && nurseCnicVerified.includes("Invalid")) {
      const ok = confirm("CNIC not verified. Do you want to continue without CNIC verification?");
      if (!ok) return;
    }
    // Simulate booking
    console.log("Nurse booking:", { nurse: selectedNurse.name, ...nurseFormData, paymentMethod: nursePaymentMethod });
    // Send notification to nurse's phone (SMS link)
    const smsBody = encodeURIComponent(`New booking from ${nurseFormData.name} at ${nurseFormData.address} for ${nurseFormData.hours} hours on ${nurseFormData.date}. Total cost: ${nurseTotalCost} PKR.`);
    window.location.href = `sms:${selectedNurse.phone}?body=${smsBody}`;
    // Send email notification to nurse's email and provided emails
    const emailBody = encodeURIComponent(`New nurse booking notification for ${selectedNurse.name}.\nUser Details:\nName: ${nurseFormData.name}\nPhone: ${nurseFormData.phone}\nEmail: ${nurseFormData.email}\nAddress: ${nurseFormData.address}\nHours: ${nurseFormData.hours}\nDate: ${nurseFormData.date}\nTotal Cost: ${nurseTotalCost} PKR\nPayment Method: ${nursePaymentMethod}`);
    window.open(`mailto:${selectedNurse.email}?subject=Nurse Booking Notification&body=${emailBody}`, '_blank');
    window.open(`mailto:muhammadaffan1445@gmail.com?subject=Nurse Booking Notification&body=${emailBody}`, '_blank');
    window.open(`mailto:affan.work05@gmail.com?subject=Nurse Booking Notification&body=${emailBody}`, '_blank');
    setShowNurseModal(false);
    setNurseBooked(true);
    setArrivalTime(Math.floor(Math.random() * 30) + 15); // Random 15–45 min ETA
    // Show success notification
    setNurseBookingDetails({
      name: nurseFormData.name,
      nurse: selectedNurse.name,
      paymentMethod: 
        nursePaymentMethod === "cod"
          ? "Cash on Delivery"
          : nursePaymentMethod === "card"
          ? "Credit/Debit Card"
          : "Bank Transfer",
      price: nurseTotalCost,
      hours: nurseFormData.hours,
      date: nurseFormData.date,
      address: nurseFormData.address,
    });
    setShowNurseSuccess(true);
    setTimeout(() => setShowNurseSuccess(false), 3000);
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
      filtered.sort((a, b) => b.name.localeCompare(a.name));
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
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  };

  const filteredDoctors = filterAndSortDoctors(doctors);
  const filteredNurses = filterAndSortNurses(nurses);

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

        {/* Show Nurse Map after booking with live tracking */}
        {nurseBooked && (
          <div className="mb-16">
            <h3 className={`text-2xl font-bold mb-4 ${textColor}`}>
              Nurse {selectedNurse?.name} is on the way 🚑
            </h3>
            <p className={`mb-4 ${textColor}`}>Estimated arrival time: {arrivalTime} minutes</p>
            <p className={`mb-4 ${textColor}`}>Contact Nurse: {selectedNurse?.name} - Phone: {selectedNurse?.phone} - Specialization: {selectedNurse?.specialization}</p>
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

      {/* Doctor Booking Modal (like Labs) */}
      <AnimatePresence>
        {showDoctorModal && selectedDoctor && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDoctorModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              ref={doctorModalContentRef}
              initial={{ scale: 0.96, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 10, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={`${cardBg} relative rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8`}
              role="dialog"
              aria-labelledby="doctor-modal-title"
              aria-describedby="doctor-modal-description"
            >
              <motion.button
                onClick={() => setShowDoctorModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-[#00C2CB]" />
              </motion.button>
              <h2
                id="doctor-modal-title"
                className={`text-2xl font-bold mb-6 text-center ${textColor}`}
              >
                Book Appointment with {selectedDoctor.name}
              </h2>
              <p
                id="doctor-modal-description"
                className={`text-center mb-6 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Specialization: {selectedDoctor.specialization}. Price: PKR {doctorPrice}
              </p>
              <form onSubmit={handleDoctorSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="name">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                      <input
                        type="text"
                        name="name"
                        value={doctorFormData.name}
                        onChange={handleDoctorFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cnic">
                      CNIC (Auto-fills Name, Age, Gender)
                    </label>
                    <div className="relative">
                      <ShieldCheck
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          doctorCnicVerified && !doctorCnicVerified.includes("Invalid")
                            ? "text-green-500"
                            : doctorCnicVerified && doctorCnicVerified.includes("Invalid")
                            ? "text-red-500"
                            : "text-[#00C2CB]"
                        }`}
                      />
                      <input
                        type="text"
                        name="cnic"
                        value={doctorFormData.cnic}
                        onChange={handleDoctorFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                        placeholder="12345-1234567-1"
                      />
                      {doctorCnicVerified && (
                        <span
                          className={`text-xs mt-1 block flex items-center ${
                            doctorCnicVerified.includes("Invalid") ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {doctorCnicLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              Fetching NADRA data...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {doctorCnicVerified}
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="age">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={doctorFormData.age}
                      onChange={handleDoctorFormChange}
                      className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                      placeholder="Enter your age"
                      min="1"
                      max="150"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="gender">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={doctorFormData.gender}
                      onChange={handleDoctorFormChange}
                      className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none appearance-none`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="phone">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                      <input
                        type="tel"
                        name="phone"
                        value={doctorFormData.phone}
                        onChange={handleDoctorFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                        placeholder="03XX-XXXXXXX"
                        required
                      />
                      {doctorPhoneError && (
                        <span className="text-xs mt-1 block text-red-500">{doctorPhoneError}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="email">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                      <input
                        type="email"
                        name="email"
                        value={doctorFormData.email}
                        onChange={handleDoctorFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="date">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                      <input
                        type="date"
                        name="date"
                        value={doctorFormData.date}
                        onChange={handleDoctorFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none appearance-none`}
                        required
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="address">
                      Address
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 w-5 h-5 text-[#00C2CB]" />
                      <motion.button
                        type="button"
                        onClick={() => getLiveLocation(setDoctorFormData, setDoctorLocationLoading)}
                        className={`absolute right-3 top-[-2rem] flex items-center text-sm text-[#00C2CB] hover:underline`}
                        whileHover={{ scale: 1.02 }}
                        disabled={doctorLocationLoading}
                      >
                        {doctorLocationLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Getting location...
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4 mr-2" />
                            Get my location
                          </>
                        )}
                      </motion.button>
                      <textarea
                        name="address"
                        value={doctorFormData.address}
                        onChange={handleDoctorFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none h-24 resize-none`}
                        placeholder="Enter your full address"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setDoctorPaymentMethod("cod")}
                      className={`p-4 rounded-[20px] ${
                        doctorPaymentMethod === "cod" ? "bg-[#00C2CB] text-white" : inputBg
                      } flex items-center justify-center transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Cash on Delivery
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setDoctorPaymentMethod("card")}
                      className={`p-4 rounded-[20px] ${
                        doctorPaymentMethod === "card" ? "bg-[#00C2CB] text-white" : inputBg
                      } flex items-center justify-center transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Credit/Debit Card
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setDoctorPaymentMethod("bank")}
                      className={`p-4 rounded-[20px] ${
                        doctorPaymentMethod === "bank" ? "bg-[#00C2CB] text-white" : inputBg
                      } flex items-center justify-center transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Building className="w-5 h-5 mr-2" />
                      Bank Transfer
                    </motion.button>
                  </div>
                </div>
                <AnimatePresence>
                  {doctorPaymentMethod === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardHolder">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          name="cardHolder"
                          value={doctorFormData.cardHolder}
                          onChange={handleDoctorFormChange}
                          className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                          placeholder="Enter cardholder name"
                          required
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardNumber">
                          Card Number *
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                          <input
                            type="text"
                            name="cardNumber"
                            value={doctorFormData.cardNumber}
                            onChange={handleDoctorFormChange}
                            className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                          {doctorCardDetails && (
                            <span
                              className={`text-xs mt-1 block flex items-center ${
                                doctorCardDetails.includes("Invalid") ? "text-red-500" : "text-green-500"
                              }`}
                            >
                              {doctorCardLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  Verifying...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  {doctorCardDetails}
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardExpiry">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={doctorFormData.cardExpiry}
                            onChange={handleDoctorFormChange}
                            className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardCVV">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cardCVV"
                            value={doctorFormData.cardCVV}
                            onChange={handleDoctorFormChange}
                            className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                      <motion.button
                        type="button"
                        onClick={() => verifyCard(doctorFormData.cardNumber, setDoctorCardDetails, setDoctorCardLoading)}
                        className={`w-full py-2 rounded-[20px] bg-[#00C2CB]/80 text-white hover:bg-[#00C2CB] transition-all duration-300 flex items-center justify-center`}
                        whileHover={{ scale: 1.02 }}
                        disabled={doctorCardLoading}
                      >
                        {doctorCardLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verifying Card...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Verify Card
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                  {doctorPaymentMethod === "bank" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="bankName">
                          Bank Name *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                          <input
                            type="text"
                            name="bankName"
                            value={doctorFormData.bankName}
                            onChange={handleDoctorFormChange}
                            className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="Search for a bank"
                            required
                            list="banks"
                          />
                          <datalist id="banks">
                            {pakistaniBanks.map((bank, index) => (
                              <option key={index} value={bank.name} />
                            ))}
                          </datalist>
                        </div>
                        {doctorBankQuery && (
                          <motion.ul
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`absolute z-10 w-full mt-1 rounded-[20px] ${cardBg} shadow-lg max-h-40 overflow-y-auto`}
                          >
                            {pakistaniBanks
                              .filter((b) => b.name.toLowerCase().includes(doctorBankQuery.toLowerCase()))
                              .map((b, i) => (
                                <motion.li
                                  key={i}
                                  onClick={() => {
                                    setDoctorFormData((p) => ({ ...p, bankName: b.name }));
                                    setDoctorBankQuery("");
                                    verifyBank(b.name, doctorFormData.accountNumber, setDoctorBankDetails, setDoctorBankLoading);
                                  }}
                                  className={`p-3 text-sm cursor-pointer ${textColor} hover:bg-[#00C2CB]/20 flex items-center`}
                                  whileHover={{ backgroundColor: darkMode ? "#00C2CB/30" : "#00C2CB/20" }}
                                >
                                  <Building className="w-4 h-4 mr-2 text-[#00C2CB]" />
                                  {b.name}
                                </motion.li>
                              ))}
                          </motion.ul>
                        )}
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="accountNumber">
                          Account Number *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                          <input
                            type="text"
                            name="accountNumber"
                            value={doctorFormData.accountNumber}
                            onChange={handleDoctorFormChange}
                            className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="Enter account number"
                            required
                          />
                          {doctorBankDetails && (
                            <span
                              className={`text-xs mt-1 block flex items-center ${
                                doctorBankDetails.includes("Invalid") ? "text-red-500" : "text-green-500"
                              }`}
                            >
                              {doctorBankLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  Verifying...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  {doctorBankDetails}
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="transactionId">
                          Transaction ID *
                        </label>
                        <input
                          type="text"
                          name="transactionId"
                          value={doctorFormData.transactionId}
                          onChange={handleDoctorFormChange}
                          className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                          placeholder="Enter transaction ID"
                          required
                        />
                      </div>
                      <motion.button
                        type="button"
                        onClick={() => verifyBank(doctorFormData.bankName, doctorFormData.accountNumber, setDoctorBankDetails, setDoctorBankLoading)}
                        className={`w-full py-2 rounded-[20px] bg-[#00C2CB]/80 text-white hover:bg-[#00C2CB] transition-all duration-300 flex items-center justify-center`}
                        whileHover={{ scale: 1.02 }}
                        disabled={doctorBankLoading}
                      >
                        {doctorBankLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verifying Bank...
                          </>
                        ) : (
                          <>
                            <Building className="w-4 h-4 mr-2" />
                            Verify Bank
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-center mt-6">
                  <motion.button
                    type="submit"
                    className={`px-6 py-3 rounded-[20px] bg-[#00C2CB] text-white hover:bg-[#0097A7] focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 disabled:opacity-50`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={doctorCnicLoading || doctorCardLoading || doctorBankLoading || doctorLocationLoading}
                  >
                    {doctorCnicLoading || doctorCardLoading || doctorBankLoading || doctorLocationLoading
                      ? "Processing..."
                      : "Confirm Booking"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nurse Booking Modal (like Labs, with hours and cost) */}
      <AnimatePresence>
        {showNurseModal && selectedNurse && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowNurseModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              ref={nurseModalContentRef}
              initial={{ scale: 0.96, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 10, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={`${cardBg} relative rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8`}
              role="dialog"
              aria-labelledby="nurse-modal-title"
              aria-describedby="nurse-modal-description"
            >
              <motion.button
                onClick={() => setShowNurseModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-[#00C2CB]" />
              </motion.button>
              <h2
                id="nurse-modal-title"
                className={`text-2xl font-bold mb-6 text-center ${textColor}`}
              >
                Book Nurse {selectedNurse.name}
              </h2>
              <p
                id="nurse-modal-description"
                className={`text-center mb-6 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Specialization: {selectedNurse.specialization}. Total Cost: PKR {nurseTotalCost} (Base: {baseRate} PKR/hour)
              </p>
              <form onSubmit={handleNurseSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="name">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                      <input
                        type="text"
                        name="name"
                        value={nurseFormData.name}
                        onChange={handleNurseFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cnic">
                      CNIC (Auto-fills Name, Age, Gender)
                    </label>
                    <div className="relative">
                      <ShieldCheck
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          nurseCnicVerified && !nurseCnicVerified.includes("Invalid")
                            ? "text-green-500"
                            : nurseCnicVerified && nurseCnicVerified.includes("Invalid")
                            ? "text-red-500"
                            : "text-[#00C2CB]"
                        }`}
                      />
                      <input
                        type="text"
                        name="cnic"
                        value={nurseFormData.cnic}
                        onChange={handleNurseFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                        placeholder="12345-1234567-1"
                      />
                      {nurseCnicVerified && (
                        <span
                          className={`text-xs mt-1 block flex items-center ${
                            nurseCnicVerified.includes("Invalid") ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {nurseCnicLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              Fetching NADRA data...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {nurseCnicVerified}
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="age">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={nurseFormData.age}
                      onChange={handleNurseFormChange}
                      className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                      placeholder="Enter your age"
                      min="1"
                      max="150"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="gender">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={nurseFormData.gender}
                      onChange={handleNurseFormChange}
                      className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none appearance-none`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="phone">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                      <input
                        type="tel"
                        name="phone"
                        value={nurseFormData.phone}
                        onChange={handleNurseFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                        placeholder="03XX-XXXXXXX"
                        required
                      />
                      {nursePhoneError && (
                        <span className="text-xs mt-1 block text-red-500">{nursePhoneError}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="email">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                      <input
                        type="email"
                        name="email"
                        value={nurseFormData.email}
                        onChange={handleNurseFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="date">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                      <input
                        type="date"
                        name="date"
                        value={nurseFormData.date}
                        onChange={handleNurseFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none appearance-none`}
                        required
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="hours">
                      Duration (Hours) *
                    </label>
                    <input
                      type="number"
                      name="hours"
                      min="1"
                      value={nurseFormData.hours}
                      onChange={handleNurseFormChange}
                      className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="address">
                      Address *
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 w-5 h-5 text-[#00C2CB]" />
                      <motion.button
                        type="button"
                        onClick={() => getLiveLocation(setNurseFormData, setNurseLocationLoading)}
                        className={`absolute right-3 top-[-2rem] flex items-center text-sm text-[#00C2CB] hover:underline`}
                        whileHover={{ scale: 1.02 }}
                        disabled={nurseLocationLoading}
                      >
                        {nurseLocationLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Getting location...
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4 mr-2" />
                            Get my location
                          </>
                        )}
                      </motion.button>
                      <textarea
                        name="address"
                        value={nurseFormData.address}
                        onChange={handleNurseFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none h-24 resize-none`}
                        placeholder="Enter your full address"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setNursePaymentMethod("cod")}
                      className={`p-4 rounded-[20px] ${
                        nursePaymentMethod === "cod" ? "bg-[#00C2CB] text-white" : inputBg
                      } flex items-center justify-center transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Cash on Delivery
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setNursePaymentMethod("card")}
                      className={`p-4 rounded-[20px] ${
                        nursePaymentMethod === "card" ? "bg-[#00C2CB] text-white" : inputBg
                      } flex items-center justify-center transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Credit/Debit Card
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setNursePaymentMethod("bank")}
                      className={`p-4 rounded-[20px] ${
                        nursePaymentMethod === "bank" ? "bg-[#00C2CB] text-white" : inputBg
                      } flex items-center justify-center transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Building className="w-5 h-5 mr-2" />
                      Bank Transfer
                    </motion.button>
                  </div>
                </div>
                <AnimatePresence>
                  {nursePaymentMethod === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardHolder">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          name="cardHolder"
                          value={nurseFormData.cardHolder}
                          onChange={handleNurseFormChange}
                          className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                          placeholder="Enter cardholder name"
                          required
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardNumber">
                          Card Number *
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                          <input
                            type="text"
                            name="cardNumber"
                            value={nurseFormData.cardNumber}
                            onChange={handleNurseFormChange}
                            className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                          {nurseCardDetails && (
                            <span
                              className={`text-xs mt-1 block flex items-center ${
                                nurseCardDetails.includes("Invalid") ? "text-red-500" : "text-green-500"
                              }`}
                            >
                              {nurseCardLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  Verifying...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  {nurseCardDetails}
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardExpiry">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={nurseFormData.cardExpiry}
                            onChange={handleNurseFormChange}
                            className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardCVV">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cardCVV"
                            value={nurseFormData.cardCVV}
                            onChange={handleNurseFormChange}
                            className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                      <motion.button
                        type="button"
                        onClick={() => verifyCard(nurseFormData.cardNumber, setNurseCardDetails, setNurseCardLoading)}
                        className={`w-full py-2 rounded-[20px] bg-[#00C2CB]/80 text-white hover:bg-[#00C2CB] transition-all duration-300 flex items-center justify-center`}
                        whileHover={{ scale: 1.02 }}
                        disabled={nurseCardLoading}
                      >
                        {nurseCardLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verifying Card...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Verify Card
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                  {nursePaymentMethod === "bank" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="bankName">
                          Bank Name *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                          <input
                            type="text"
                            name="bankName"
                            value={nurseFormData.bankName}
                            onChange={handleNurseFormChange}
                            className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="Search for a bank"
                            required
                            list="banks"
                          />
                          <datalist id="banks">
                            {pakistaniBanks.map((bank, index) => (
                              <option key={index} value={bank.name} />
                            ))}
                          </datalist>
                        </div>
                        {nurseBankQuery && (
                          <motion.ul
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`absolute z-10 w-full mt-1 rounded-[20px] ${cardBg} shadow-lg max-h-40 overflow-y-auto`}
                          >
                            {pakistaniBanks
                              .filter((b) => b.name.toLowerCase().includes(nurseBankQuery.toLowerCase()))
                              .map((b, i) => (
                                <motion.li
                                  key={i}
                                  onClick={() => {
                                    setNurseFormData((p) => ({ ...p, bankName: b.name }));
                                    setNurseBankQuery("");
                                    verifyBank(b.name, nurseFormData.accountNumber, setNurseBankDetails, setNurseBankLoading);
                                  }}
                                  className={`p-3 text-sm cursor-pointer ${textColor} hover:bg-[#00C2CB]/20 flex items-center`}
                                  whileHover={{ backgroundColor: darkMode ? "#00C2CB/30" : "#00C2CB/20" }}
                                >
                                  <Building className="w-4 h-4 mr-2 text-[#00C2CB]" />
                                  {b.name}
                                </motion.li>
                              ))}
                          </motion.ul>
                        )}
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="accountNumber">
                          Account Number *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                          <input
                            type="text"
                            name="accountNumber"
                            value={nurseFormData.accountNumber}
                            onChange={handleNurseFormChange}
                            className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="Enter account number"
                            required
                          />
                          {nurseBankDetails && (
                            <span
                              className={`text-xs mt-1 block flex items-center ${
                                nurseBankDetails.includes("Invalid") ? "text-red-500" : "text-green-500"
                              }`}
                            >
                              {nurseBankLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  Verifying...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  {nurseBankDetails}
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="transactionId">
                          Transaction ID *
                        </label>
                        <input
                          type="text"
                          name="transactionId"
                          value={nurseFormData.transactionId}
                          onChange={handleNurseFormChange}
                          className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                          placeholder="Enter transaction ID"
                          required
                        />
                      </div>
                      <motion.button
                        type="button"
                        onClick={() => verifyBank(nurseFormData.bankName, nurseFormData.accountNumber, setNurseBankDetails, setNurseBankLoading)}
                        className={`w-full py-2 rounded-[20px] bg-[#00C2CB]/80 text-white hover:bg-[#00C2CB] transition-all duration-300 flex items-center justify-center`}
                        whileHover={{ scale: 1.02 }}
                        disabled={nurseBankLoading}
                      >
                        {nurseBankLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verifying Bank...
                          </>
                        ) : (
                          <>
                            <Building className="w-4 h-4 mr-2" />
                            Verify Bank
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-center mt-6">
                  <motion.button
                    type="submit"
                    className={`px-6 py-3 rounded-[20px] bg-[#00C2CB] text-white hover:bg-[#0097A7] focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 disabled:opacity-50`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={nurseCnicLoading || nurseCardLoading || nurseBankLoading || nurseLocationLoading}
                  >
                    {nurseCnicLoading || nurseCardLoading || nurseBankLoading || nurseLocationLoading
                      ? "Processing..."
                      : "Confirm Booking"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nurse Success Notification */}
      <AnimatePresence>
        {showNurseSuccess && nurseBookingDetails && (
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
                <h3 className={`text-lg font-bold ${textColor}`}>Nurse Booking Confirmed ✅</h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                  Thank you, {nurseBookingDetails.name}! Your booking with {nurseBookingDetails.nurse} is received.
                </p>
                <ul className={`text-sm ${textColor} mt-2 space-y-1`}>
                  <li><strong>Hours:</strong> {nurseBookingDetails.hours}</li>
                  <li><strong>Date:</strong> {nurseBookingDetails.date}</li>
                  <li><strong>Address:</strong> {nurseBookingDetails.address}</li>
                  <li><strong>Payment:</strong> {nurseBookingDetails.paymentMethod}</li>
                  <li><strong>Price:</strong> PKR {nurseBookingDetails.price}</li>
                </ul>
              </div>
              <motion.button
                onClick={() => setShowNurseSuccess(false)}
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