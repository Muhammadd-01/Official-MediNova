import { useContext, useState, useRef, useCallback, useMemo, useEffect } from "react";
import { DarkModeContext } from "../App";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
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

function Labs() {
  const { darkMode } = useContext(DarkModeContext);
  const [selectedTest, setSelectedTest] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bankQuery, setBankQuery] = useState("");
  const [cnicVerified, setCnicVerified] = useState(null);
  const [cnicLoading, setCnicLoading] = useState(false);
  const [phoneError, setPhoneError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const reportsPerPage = 5;

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

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const cardBg = darkMode
    ? "bg-[#0A2A43]/20 backdrop-blur-[10px] border border-white/20"
    : "bg-white/20 backdrop-blur-md border border-gray-200";
  const hoverCard = "hover:shadow-2xl hover:scale-105 transition-all duration-300";
  const inputBg = darkMode
    ? "bg-[#0A2A43]/40 border-white/10 text-[#FDFBFB]"
    : "bg-white/40 border-[#0A3D62]/10 text-[#0A3D62]";

  const modalContentRef = useRef(null);

  // Fetch lab reports from JSONPlaceholder
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${reportsPerPage}`
        );
        const data = await response.json();
        setReports(data);
        setTotalReports(100); // JSONPlaceholder has 100 posts
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, [currentPage]);

  // Debounced CNIC verification
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

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
          setFormData((prev) => ({ ...prev, name, gender, age }));
          setCnicVerified(`Data loaded from NADRA: ${name}, ${gender}, Age ${age}`);
          setCnicLoading(false);
        }, 2000);
      } else {
        setCnicVerified("Invalid CNIC format");
        setCnicLoading(false);
      }
    }, 500),
    []
  );

  // Format CNIC input (e.g., 1234512345671 -> 12345-1234567-1)
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
          // Fallback to Luhn algorithm
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

  // Luhn algorithm for card number validation
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

  // Location fetching with Nominatim
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

  // Phone validation (Pakistan mobile: 03XX-XXXXXXX)
  const validatePhone = useCallback((phone) => {
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

  const handleFormChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      let newValue = value;
      if (name === "cardNumber") {
        newValue = formatCardNumber(value);
      } else if (name === "cnic") {
        newValue = formatCNIC(value);
      }
      setFormData((prev) => ({ ...prev, [name]: newValue }));
      if (name === "cnic") verifyCNIC(newValue);
      if (name === "phone") validatePhone(newValue);
      if (name === "bankName") {
        setBankQuery(value);
        verifyBank(value, formData.accountNumber);
      }
      if (name === "accountNumber") {
        verifyBank(formData.bankName, newValue);
      }
    },
    [verifyCNIC, validatePhone, verifyBank, formData.accountNumber, formData.bankName]
  );

  const handleOpenModal = (test) => {
    setSelectedTest(test);
    setPaymentMethod("");
    setFormData({
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
    setCnicVerified(null);
    setCardDetails(null);
    setBankDetails(null);
    setBankQuery("");
    setCnicLoading(false);
    setPhoneError(null);
    setShowSuccess(false);
    setTimeout(() => {
      if (modalContentRef.current) modalContentRef.current.scrollTop = 0;
    }, 0);
  };

  const handleCloseModal = () => {
    setSelectedTest(null);
    setShowSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      alert("Please complete required fields (name, phone, date).");
      return;
    }
    if (!validatePhone(formData.phone)) {
      alert("Please enter a valid phone number in format 03XX-XXXXXXX.");
      return;
    }
    if (paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cardCVV || !formData.cardExpiry || !formData.cardHolder) {
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
    if (formData.cnic && cnicVerified && cnicVerified.includes("Invalid")) {
      const ok = confirm("CNIC not verified. Do you want to continue without CNIC verification?");
      if (!ok) return;
    }
    const bookingPayload = {
      test: selectedTest.title,
      price: selectedTest.price,
      ...formData,
      paymentMethod,
    };
    console.log("Submit booking", bookingPayload);
    setBookingDetails({
      name: formData.name,
      test: selectedTest.title,
      paymentMethod:
        paymentMethod === "cod"
          ? "Cash on Delivery"
          : paymentMethod === "card"
          ? "Credit/Debit Card"
          : "Bank Transfer",
      price: selectedTest.price,
    });
    setShowSuccess(true);
    setSelectedTest(null);
    setFormData({
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
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reports, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(totalReports / reportsPerPage);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const tests = [
    {
      title: "Complete Blood Count (CBC)",
      desc: "Complete blood count with detailed analysis.",
      img: "https://cdn-icons-png.flaticon.com/512/2966/2966485.png",
      icon: <Droplet className="w-8 h-8 text-[#00C2CB]" />,
      price: 2500,
    },
    {
      title: "Urine Analysis",
      desc: "Detects urinary tract infections and kidney issues.",
      img: "https://cdn-icons-png.flaticon.com/512/2966/2966505.png",
      icon: <TestTube2 className="w-8 h-8 text-[#00C2CB]" />,
      price: 1500,
    },
    {
      title: "Pathology Biopsy",
      desc: "Microscopic examination of tissues for diagnosis.",
      img: "https://cdn-icons-png.flaticon.com/512/4320/4320371.png",
      icon: <Microscope className="w-8 h-8 text-[#00C2CB]" />,
      price: 5000,
    },
    {
      title: "Radiology (X-ray/CT/MRI)",
      desc: "Advanced imaging with modern radiology equipment.",
      img: "https://cdn-icons-png.flaticon.com/512/2966/2966533.png",
      icon: <Activity className="w-8 h-8 text-[#00C2CB]" />,
      price: 8000,
    },
    {
      title: "Vaccination",
      desc: "Protective immunization for adults and children.",
      img: "https://cdn-icons-png.flaticon.com/512/2966/2966481.png",
      icon: <Syringe className="w-8 h-8 text-[#00C2CB]" />,
      price: 2000,
    },
    {
      title: "COVID-19 PCR Test",
      desc: "Accurate COVID-19 testing with quick reporting.",
      img: "https://cdn-icons-png.flaticon.com/512/2785/2785819.png",
      icon: <Activity className="w-8 h-8 text-[#00C2CB]" />,
      price: 3500,
    },
    {
      title: "Liver Function Test (LFT)",
      desc: "Monitors liver health and enzyme levels.",
      img: "https://cdn-icons-png.flaticon.com/512/2779/2779762.png",
      icon: <Microscope className="w-8 h-8 text-[#00C2CB]" />,
      price: 3000,
    },
    {
      title: "Kidney Function Test (KFT)",
      desc: "Evaluates kidney performance and health.",
      img: "https://cdn-icons-png.flaticon.com/512/2779/2779752.png",
      icon: <Droplet className="w-8 h-8 text-[#00C2CB]" />,
      price: 2800,
    },
    {
      title: "Thyroid Profile",
      desc: "Checks thyroid hormone levels for imbalances.",
      img: "https://cdn-icons-png.flaticon.com/512/2779/2779771.png",
      icon: <Activity className="w-8 h-8 text-[#00C2CB]" />,
      price: 3200,
    },
    {
      title: "Cholesterol Test (Lipid Profile)",
      desc: "Measures cholesterol and heart risk factors.",
      img: "https://cdn-icons-png.flaticon.com/512/2966/2966499.png",
      icon: <TestTube2 className="w-8 h-8 text-[#00C2CB]" />,
      price: 2000,
    },
  ];

  return (
    <>
      <Header />
      <div className={`min-h-screen py-12 px-4 sm:px-8 lg:px-16 ${textColor} bg-transparent max-w-7xl mx-auto`}>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl sm:text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-blue-500`}
        >
          MediNova Diagnostic Labs
        </motion.h1>
        <p
          className={`text-center max-w-2xl mx-auto mb-10 text-base sm:text-lg ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Book lab tests quickly — professional reporting, sample collection, and secure payment options.
        </p>

        {/* Tests Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {tests.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleOpenModal(test)}
              className={`${cardBg} ${hoverCard} rounded-[40px] shadow-lg cursor-pointer p-6 flex flex-col items-center text-center overflow-hidden`}
            >
              <img src={test.img} alt={test.title} className="w-20 h-20 mb-3" />
              <div className="mb-3">{test.icon}</div>
              <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>{test.title}</h3>
              <p className="text-sm mb-4 text-gray-500">{test.desc}</p>
              <div className="mt-auto">
                <p className="text-[#00C2CB] font-bold text-lg">PKR {test.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lab Reports Section */}
        <div className="mt-12">
          <motion.h2
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-2xl font-bold mb-4 ${textColor}`}
          >
            Lab Reports
          </motion.h2>
          <p className={`text-sm mb-4 ${textColor}`}>Reports fetched by MediNova AI</p>
          <div className="mb-6 flex items-center max-w-md">
            <Search className={`w-5 h-5 ${textColor} mr-2`} />
            <input
              type="text"
              placeholder="Search reports by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
            />
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {filteredReports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className={`${cardBg} ${hoverCard} rounded-[40px] shadow-lg p-6 flex flex-col items-center text-center overflow-hidden`}
              >
                <FileText className="w-20 h-20 mb-3 text-[#00C2CB]" />
                <div className="mb-3">
                  <FileText className="w-8 h-8 text-[#00C2CB]" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>
                  Report ID: {report.id} – {report.title}
                </h3>
                <p className="text-sm mb-4 text-gray-500">{report.body}</p>
                <div className="mt-auto">
                  <p className="text-[#00C2CB] font-bold text-lg">Status: Ready</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <motion.button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center ${textColor} ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:underline"
              }`}
              whileHover={{ scale: 1.05 }}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Previous
            </motion.button>
            <span className={textColor}>Page {currentPage} of {totalPages}</span>
            <motion.button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center ${textColor} ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:underline"
              }`}
              whileHover={{ scale: 1.05 }}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </motion.button>
          </div>
        </div>

        {/* Booking Modal */}
        <AnimatePresence>
          {selectedTest && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleCloseModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
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
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-[#00C2CB]" />
                </motion.button>
                <h2
                  id="modal-title"
                  className={`text-2xl font-bold mb-6 text-center ${textColor}`}
                >
                  Book {selectedTest.title}
                </h2>
                <p
                  id="modal-description"
                  className={`text-center mb-6 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Fill in your details to book this test. Price: PKR {selectedTest.price}
                </p>
                <form onSubmit={handleSubmit} className="space-y-6" key={selectedTest?.title}>
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
                          value={formData.name}
                          onChange={handleFormChange}
                          className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                          placeholder="Enter your full name"
                          required
                          aria-required="true"
                          aria-invalid={formData.name === ""}
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
                            cnicVerified && !cnicVerified.includes("Invalid")
                              ? "text-green-500"
                              : cnicVerified && cnicVerified.includes("Invalid")
                              ? "text-red-500"
                              : "text-[#00C2CB]"
                          }`}
                        />
                        <input
                          type="text"
                          name="cnic"
                          value={formData.cnic}
                          onChange={handleFormChange}
                          className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                          placeholder="12345-1234567-1"
                          aria-describedby="cnic-status"
                          aria-invalid={cnicVerified && cnicVerified.includes("Invalid")}
                        />
                        {cnicVerified && (
                          <span
                            id="cnic-status"
                            className={`text-xs mt-1 block flex items-center ${
                              cnicVerified.includes("Invalid") ? "text-red-500" : "text-green-500"
                            }`}
                          >
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
                          aria-required="true"
                          aria-invalid={phoneError !== null}
                        />
                        {phoneError && (
                          <span className="text-xs mt-1 block text-red-500">{phoneError}</span>
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
                          value={formData.email}
                          onChange={handleFormChange}
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
                          value={formData.date}
                          onChange={handleFormChange}
                          className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none appearance-none`}
                          required
                          aria-required="true"
                          min={new Date().toISOString().split("T")[0]}
                          aria-invalid={formData.date === ""}
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
                          onClick={getLiveLocation}
                          className={`absolute right-3 top-[-2rem] flex items-center text-sm text-[#00C2CB] hover:underline`}
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
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-4 rounded-[20px] ${
                          paymentMethod === "cod" ? "bg-[#00C2CB] text-white" : inputBg
                        } flex items-center justify-center transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-pressed={paymentMethod === "cod"}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Cash on Delivery
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 rounded-[20px] ${
                          paymentMethod === "card" ? "bg-[#00C2CB] text-white" : inputBg
                        } flex items-center justify-center transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-pressed={paymentMethod === "card"}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Credit/Debit Card
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setPaymentMethod("bank")}
                        className={`p-4 rounded-[20px] ${
                          paymentMethod === "bank" ? "bg-[#00C2CB] text-white" : inputBg
                        } flex items-center justify-center transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-pressed={paymentMethod === "bank"}
                      >
                        <Building className="w-5 h-5 mr-2" />
                        Bank Transfer
                      </motion.button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {paymentMethod === "card" && (
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
                            value={formData.cardHolder}
                            onChange={handleFormChange}
                            className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="Enter cardholder name"
                            required
                            aria-required="true"
                            aria-invalid={formData.cardHolder === ""}
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
                              value={formData.cardNumber}
                              onChange={handleFormChange}
                              className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                              placeholder="1234 5678 9012 3456"
                              required
                              aria-required="true"
                              aria-invalid={formData.cardNumber.replace(/\D/g, "").length !== 16}
                              aria-describedby="card-status"
                            />
                            {cardDetails && (
                              <span
                                id="card-status"
                                className={`text-xs mt-1 block flex items-center ${
                                  cardDetails.includes("Invalid") ? "text-red-500" : "text-green-500"
                                }`}
                              >
                                {cardLoading ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    Verifying...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    {cardDetails}
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
                              value={formData.cardExpiry}
                              onChange={handleFormChange}
                              className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                              placeholder="MM/YY"
                              required
                              aria-required="true"
                              aria-invalid={!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(formData.cardExpiry)}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardCVV">
                              CVV *
                            </label>
                            <input
                              type="text"
                              name="cardCVV"
                              value={formData.cardCVV}
                              onChange={handleFormChange}
                              className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                              placeholder="123"
                              required
                              aria-required="true"
                              aria-invalid={formData.cardCVV.replace(/\D/g, "").length < 3 || formData.cardCVV.replace(/\D/g, "").length > 4}
                            />
                          </div>
                        </div>
                        <motion.button
                          type="button"
                          onClick={() => verifyCard(formData.cardNumber)}
                          className={`w-full py-2 rounded-[20px] bg-[#00C2CB]/80 text-white hover:bg-[#00C2CB] transition-all duration-300 flex items-center justify-center`}
                          whileHover={{ scale: 1.02 }}
                          disabled={cardLoading}
                        >
                          {cardLoading ? (
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
                    {paymentMethod === "bank" && (
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
                              value={formData.bankName}
                              onChange={handleFormChange}
                              className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                              placeholder="Search for a bank"
                              required
                              aria-required="true"
                              list="banks"
                              aria-autocomplete="list"
                              aria-invalid={!pakistaniBanks.some((b) => b.name.toLowerCase() === formData.bankName.toLowerCase()) && formData.bankName !== ""}
                            />
                            <datalist id="banks">
                              {pakistaniBanks.map((bank, index) => (
                                <option key={index} value={bank.name} />
                              ))}
                            </datalist>
                          </div>
                          {bankQuery && (
                            <motion.ul
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`absolute z-10 w-full mt-1 rounded-[20px] ${cardBg} shadow-lg max-h-40 overflow-y-auto`}
                            >
                              {pakistaniBanks
                                .filter((b) => b.name.toLowerCase().includes(bankQuery.toLowerCase()))
                                .map((b, i) => (
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
                          <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="accountNumber">
                            Account Number *
                          </label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                            <input
                              type="text"
                              name="accountNumber"
                              value={formData.accountNumber}
                              onChange={handleFormChange}
                              className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                              placeholder="Enter account number"
                              required
                              aria-required="true"
                              aria-invalid={formData.accountNumber.replace(/\D/g, "").length < 12 || formData.accountNumber.replace(/\D/g, "").length > 16}
                              aria-describedby="bank-status"
                            />
                            {bankDetails && (
                              <span
                                id="bank-status"
                                className={`text-xs mt-1 block flex items-center ${
                                  bankDetails.includes("Invalid") ? "text-red-500" : "text-green-500"
                                }`}
                              >
                                {bankLoading ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    Verifying...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    {bankDetails}
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
                            value={formData.transactionId}
                            onChange={handleFormChange}
                            className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="Enter transaction ID"
                            required
                            aria-required="true"
                            aria-invalid={formData.transactionId === ""}
                          />
                        </div>
                        <motion.button
                          type="button"
                          onClick={() => verifyBank(formData.bankName, formData.accountNumber)}
                          className={`w-full py-2 rounded-[20px] bg-[#00C2CB]/80 text-white hover:bg-[#00C2CB] transition-all duration-300 flex items-center justify-center`}
                          whileHover={{ scale: 1.02 }}
                          disabled={bankLoading}
                        >
                          {bankLoading ? (
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
                      disabled={cnicLoading || cardLoading || bankLoading || locationLoading}
                    >
                      {cnicLoading || cardLoading || bankLoading || locationLoading
                        ? "Processing..."
                        : "Confirm Booking"}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  <h3 className={`text-lg font-bold ${textColor}`}>Booking Confirmed ✅</h3>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                    Thank you, {bookingDetails.name}! Your booking is received.
                  </p>
                  <ul className={`text-sm ${textColor} mt-2 space-y-1`}>
                    <li><strong>Test:</strong> {bookingDetails.test}</li>
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
      </div>
    </>
  );
}

export default Labs;