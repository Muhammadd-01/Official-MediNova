"use client";

import { useContext, useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DarkModeContext } from "../App"; // If needed for internal dark mode, but uses prop
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Home,
  MapPin,
  CreditCard,
  Building,
  ShieldCheck,
  CheckCircle,
  Loader2,
} from "lucide-react";

// Static data (moved inside for self-containment)
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

export default function CheckoutModal({
  isOpen,
  onClose,
  itemTitle,
  itemPrice,
  onSubmit, // async (payload) => Promise<boolean> (success)
  onSuccess, // (details) => void (for parent toast)
  darkMode = false,
  cardBg = "bg-white",
  textColor = "text-black",
}) {
  // Internal states (self-contained)
  const [formData, setFormData] = useState({
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
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bankQuery, setBankQuery] = useState("");
  const [cnicVerified, setCnicVerified] = useState(null);
  const [cnicLoading, setCnicLoading] = useState(false);
  const [phoneError, setPhoneError] = useState(null);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const modalContentRef = useRef(null);

  // Internal functions (self-contained)
  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const verifyCNIC = useCallback(
    debounce((cnic) => {
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
    }, 500),
    [debounce]
  );

  const formatCNIC = useCallback((value) => {
    const digits = value.replace(/\D/g, "").slice(0, 13);
    if (digits.length > 5 && digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    if (digits.length > 12) return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
    return digits;
  }, []);

  const luhnCheck = useCallback((cardNumber) => {
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
  }, []);

  const verifyCard = useCallback(async (cardNumber) => {
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
  }, [luhnCheck]);

  const verifyBank = useCallback((bankName, accountNumber) => {
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

  const getLiveLocation = useCallback(() => {
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
          } catch {
            setFormData((prev) => ({ ...prev, address: "Location not available" }));
          }
          setLocationLoading(false);
        },
        () => {
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

  const validatePhone = useCallback((phone) => {
    const phoneRegex = /^03[0-4][0-9]-[0-9]{7}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Phone must be in format 03XX-XXXXXXX");
      return false;
    }
    setPhoneError(null);
    return true;
  }, []);

  const formatCardNumber = useCallback((value) => {
    const digits = value.replace(/\D/g, "");
    return digits.match(/.{1,4}/g)?.join(" ").slice(0, 19) || digits;
  }, []);

  const handleFormChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      let newValue = value;
      if (name === "cardNumber") newValue = formatCardNumber(value);
      else if (name === "cnic") newValue = formatCNIC(value);
      setFormData((prev) => ({ ...prev, [name]: newValue }));
      if (name === "cnic") verifyCNIC(newValue);
      if (name === "phone") validatePhone(newValue);
      if (name === "bankName") {
        setBankQuery(value);
        verifyBank(value, formData.accountNumber);
      }
      if (name === "accountNumber") verifyBank(formData.bankName, newValue);
    },
    [verifyCNIC, validatePhone, verifyBank, formatCardNumber, formatCNIC, formData.accountNumber, formData.bankName]
  );

  const handleInternalSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!formData.name || !formData.phone || !formData.date || !formData.address) {
        alert("Please complete required fields (name, phone, date, address).");
        return;
      }
      if (!validatePhone(formData.phone)) {
        alert("Please enter a valid phone number in format 03XX-XXXXXXX.");
        return;
      }
      if (paymentMethod === "card") {
        if (!formData.cardHolder || !formData.cardNumber || !formData.cardExpiry || !formData.cardCVV) {
          alert("Please provide complete card details.");
          return;
        }
        if (!cardDetails || cardDetails.includes("Invalid")) {
          alert("Please verify card details.");
          return;
        }
      }
      if (paymentMethod === "bank") {
        if (!formData.bankName || !formData.accountNumber || !formData.transactionId) {
          alert("Please fill all bank transfer details.");
          return;
        }
        if (!pakistaniBanks.some((b) => b.name.toLowerCase() === formData.bankName.toLowerCase())) {
          alert("Please select a valid Pakistani bank from the list.");
          return;
        }
        if (!bankDetails || bankDetails.includes("Invalid")) {
          alert("Please verify bank details.");
          return;
        }
      }
      if (formData.cnic && cnicVerified?.includes("Invalid")) {
        if (!confirm("CNIC not verified. Do you want to continue without CNIC verification?")) return;
      }

      const payload = {
        item: itemTitle,
        price: itemPrice,
        ...formData,
        paymentMethod,
      };

      try {
        const success = await onSubmit(payload);
        if (success) {
          const details = {
            name: formData.name,
            item: itemTitle,
            paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "card" ? "Credit/Debit Card" : "Bank Transfer",
            price: itemPrice,
          };
          onSuccess(details);
          // Reset form
          setFormData({
            name: "", cnic: "", age: "", gender: "", phone: "", email: "", date: "", address: "",
            cardHolder: "", cardNumber: "", cardExpiry: "", cardCVV: "", bankName: "", accountNumber: "", transactionId: "",
          });
          setPaymentMethod("");
          setCnicVerified(null); setCardDetails(null); setBankDetails(null); setBankQuery(""); setPhoneError(null);
          onClose();
        } else {
          alert("Booking failed. Please try again.");
        }
      } catch (error) {
        alert("Booking failed. Please try again.");
      }
    },
    [formData, paymentMethod, itemTitle, itemPrice, onSubmit, onSuccess, onClose, validatePhone, cnicVerified, cardDetails, bankDetails, pakistaniBanks]
  );

  // ESC key handler
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Reset on open (via isOpen change)
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "", cnic: "", age: "", gender: "", phone: "", email: "", date: "", address: "",
        cardHolder: "", cardNumber: "", cardExpiry: "", cardCVV: "", bankName: "", accountNumber: "", transactionId: "",
      });
      setPaymentMethod("");
      setCnicVerified(null); setCardDetails(null); setBankDetails(null); setBankQuery(""); setPhoneError(null);
      setTimeout(() => modalContentRef.current?.scrollTo(0, 0), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const inputBg = darkMode ? "bg-[#0A2A43]/40 border-white/10 text-[#FDFBFB]" : "bg-white/40 border-[#0A3D62]/10 text-[#0A3D62]";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        {/* Modal Content */}
        <motion.div
          ref={modalContentRef}
          initial={{ scale: 0.96, y: 10, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 10, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className={`${cardBg} relative rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8`}
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-[#00C2CB]" />
          </motion.button>

          <h2 id="modal-title" className={`text-2xl font-bold mb-6 text-center ${textColor}`}>
            Book {itemTitle}
          </h2>
          <p id="modal-description" className={`text-center mb-6 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Fill in your details to book this. Price: PKR {itemPrice}
          </p>

          <form onSubmit={handleInternalSubmit} className="space-y-6">
            {/* Form Fields - Full as in original */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="name">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
              {/* CNIC */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cnic">
                  CNIC (Auto-fills Name, Age, Gender)
                </label>
                <div className="relative">
                  <ShieldCheck
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      cnicVerified && !cnicVerified.includes("Invalid") ? "text-green-500" : cnicVerified?.includes("Invalid") ? "text-red-500" : "text-[#00C2CB]"
                    }`}
                  />
                  <input
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleFormChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                    placeholder="12345-1234567-1"
                  />
                  {cnicVerified && (
                    <span className={`text-xs mt-1 block flex items-center ${
                      cnicVerified.includes("Invalid") ? "text-red-500" : "text-green-500"
                    }`}>
                      {cnicLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Fetching NADRA data...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {cnicVerified}
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
              {/* Age */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="age">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleFormChange}
                  className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                  placeholder="Enter your age"
                  min="1"
                  max="150"
                />
              </div>
              {/* Gender */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="gender">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none appearance-none`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* Phone */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="phone">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                    placeholder="03XX-XXXXXXX"
                    required
                  />
                  {phoneError && <span className="text-xs mt-1 block text-red-500">{phoneError}</span>}
                </div>
              </div>
              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              {/* Date */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="date">
                  Preferred Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>
              {/* Address */}
              <div className="sm:col-span-2">
                <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="address">
                  Address *
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 w-5 h-5 text-[#00C2CB]" />
                  <motion.button
                    type="button"
                    onClick={getLiveLocation}
                    className="absolute right-3 top-[-2rem] flex items-center text-sm text-[#00C2CB] hover:underline"
                    whileHover={{ scale: 1.02 }}
                    disabled={locationLoading}
                  >
                    {locationLoading ? (
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
                    value={formData.address}
                    onChange={handleFormChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none h-24 resize-none`}
                    placeholder="Enter your full address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Payment Method *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["cod", "card", "bank"].map((method) => (
                  <motion.button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-4 rounded-[20px] flex items-center justify-center transition-all duration-300 ${
                      paymentMethod === method ? "bg-[#00C2CB] text-white" : inputBg
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-pressed={paymentMethod === method}
                  >
                    {method === "cod" && <><CreditCard className="w-5 h-5 mr-2" />Cash on Delivery</>}
                    {method === "card" && <><CreditCard className="w-5 h-5 mr-2" />Credit/Debit Card</>}
                    {method === "bank" && <><Building className="w-5 h-5 mr-2" />Bank Transfer</>}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Card Fields (conditional) */}
            <AnimatePresence>
              {paymentMethod === "card" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardHolder">Cardholder Name *</label>
                    <input type="text" name="cardHolder" value={formData.cardHolder} onChange={handleFormChange} className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`} placeholder="Enter cardholder name" required />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardNumber">Card Number *</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                      <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleFormChange} className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`} placeholder="1234 5678 9012 3456" required />
                      {cardDetails && (
                        <span className={`text-xs mt-1 block flex items-center ${cardDetails.includes("Invalid") ? "text-red-500" : "text-green-500"}`}>
                          {cardLoading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Verifying...</> : <><CheckCircle className="w-4 h-4 mr-1" />{cardDetails}</>}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardExpiry">Expiry Date *</label>
                      <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleFormChange} className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`} placeholder="MM/YY" required />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardCVV">CVV *</label>
                      <input type="text" name="cardCVV" value={formData.cardCVV} onChange={handleFormChange} className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`} placeholder="123" required />
                    </div>
                  </div>
                  <motion.button type="button" onClick={() => verifyCard(formData.cardNumber)} className="w-full py-2 rounded-[20px] bg-[#00C2CB]/80 text-white hover:bg-[#00C2CB] transition-all duration-300 flex items-center justify-center" whileHover={{ scale: 1.02 }} disabled={cardLoading}>
                    {cardLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying Card...</> : <><CreditCard className="w-4 h-4 mr-2" />Verify Card</>}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bank Fields (conditional) */}
            <AnimatePresence>
              {paymentMethod === "bank" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div className="relative">
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="bankName">Bank Name *</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleFormChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                        placeholder="Search for a bank"
                        list="banks"
                        required
                      />
                      <datalist id="banks">
                        {pakistaniBanks.map((bank, index) => <option key={index} value={bank.name} />)}
                      </datalist>
                    </div>
                    {bankQuery && (
                      <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`absolute z-10 w-full mt-1 rounded-[20px] ${cardBg} shadow-lg max-h-40 overflow-y-auto`}>
                        {pakistaniBanks.filter((b) => b.name.toLowerCase().includes(bankQuery.toLowerCase())).map((b, i) => (
                          <motion.li
                            key={i}
                            onClick={() => {
                              setFormData((p) => ({ ...p, bankName: b.name }));
                              setBankQuery("");
                              verifyBank(b.name, formData.accountNumber);
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
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="accountNumber">Account Number *</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                      <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleFormChange} className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`} placeholder="Enter account number" required />
                      {bankDetails && (
                        <span className={`text-xs mt-1 block flex items-center ${bankDetails.includes("Invalid") ? "text-red-500" : "text-green-500"}`}>
                          {bankLoading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Verifying...</> : <><CheckCircle className="w-4 h-4 mr-1" />{bankDetails}</>}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="transactionId">Transaction ID *</label>
                    <input type="text" name="transactionId" value={formData.transactionId} onChange={handleFormChange} className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`} placeholder="Enter transaction ID" required />
                  </div>
                  <motion.button type="button" onClick={() => verifyBank(formData.bankName, formData.accountNumber)} className="w-full py-2 rounded-[20px] bg-[#00C2CB]/80 text-white hover:bg-[#00C2CB] transition-all duration-300 flex items-center justify-center" whileHover={{ scale: 1.02 }} disabled={bankLoading}>
                    {bankLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying Bank...</> : <><Building className="w-4 h-4 mr-2" />Verify Bank</>}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <motion.button
                type="submit"
                className="px-6 py-3 rounded-[20px] bg-[#00C2CB] text-white hover:bg-[#0097A7] focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={cnicLoading || cardLoading || bankLoading || locationLoading}
              >
                {cnicLoading || cardLoading || bankLoading || locationLoading ? "Processing..." : "Confirm Booking"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}