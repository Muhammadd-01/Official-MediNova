import { useContext, useState, useEffect, useRef } from "react";
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
} from "lucide-react";

function Labs() {
  const { darkMode } = useContext(DarkModeContext);

  // Modal / form state
  const [selectedTest, setSelectedTest] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(""); // "cod" | "card" | "bank"
  const [banks, setBanks] = useState([]);
  const [bankQuery, setBankQuery] = useState("");
  const [cnicVerified, setCnicVerified] = useState(null);
  const [loadingBanks, setLoadingBanks] = useState(false);

  // Form data
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

  // List of tests
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

  // Fetch banks
  useEffect(() => {
    async function fetchBanks() {
      setLoadingBanks(true);
      try {
        const urlsToTry = [
          "https://api.first.org/data/v1/banks",
          "https://raw.githubusercontent.com/iamsaqlain/pakistan-banks/master/banks.json",
        ];

        let data = null;
        for (const url of urlsToTry) {
          try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const json = await res.json();
            if (json?.data && Array.isArray(json.data)) {
              data = json.data;
            } else if (Array.isArray(json)) {
              data = json;
            } else if (json?.data && typeof json.data === "object") {
              data = Object.values(json.data);
            } else if (Array.isArray(json?.banks)) {
              data = json.banks;
            }
            if (data) break;
          } catch (e) {}
        }

        if (!data || data.length === 0) {
          data = [
            { name: "Habib Bank Limited (HBL)" },
            { name: "United Bank Limited (UBL)" },
            { name: "Meezan Bank" },
            { name: "MCB Bank" },
            { name: "Allied Bank" },
            { name: "National Bank of Pakistan (NBP)" },
            { name: "Bank Alfalah" },
            { name: "Standard Chartered PK" },
            { name: "BankIslami" },
            { name: "Faysal Bank" },
          ];
        }

        setBanks(data);
      } catch (err) {
        setBanks([
          { name: "Habib Bank Limited (HBL)" },
          { name: "United Bank Limited (UBL)" },
          { name: "Meezan Bank" },
          { name: "MCB Bank" },
          { name: "Allied Bank" },
          { name: "National Bank of Pakistan (NBP)" },
        ]);
      } finally {
        setLoadingBanks(false);
      }
    }

    fetchBanks();
  }, []);

  // CNIC verification
  const verifyCNIC = (cnic) => {
    const digitsOnly = String(cnic || "").replace(/\D/g, "");
    if (digitsOnly.length === 13) {
      setCnicVerified(true);
    } else {
      setCnicVerified(false);
    }
  };

  const filteredBanks = banks.filter((b) =>
    (b?.name || String(b))
      .toLowerCase()
      .includes(bankQuery.trim().toLowerCase())
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (name === "cnic") verifyCNIC(value);
    if (name === "bankName") setBankQuery(value);
  };

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
    setBankQuery("");
    setTimeout(() => {
      if (modalContentRef.current) modalContentRef.current.scrollTop = 0;
    }, 0);
  };

  const handleCloseModal = () => setSelectedTest(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      alert("Please complete required fields (name, phone, date).");
      return;
    }

    if (paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cardCVV || !formData.cardExpiry) {
        alert("Please provide complete card details.");
        return;
      }
      // Basic card number validation (16 digits)
      const cardNumberDigits = formData.cardNumber.replace(/\D/g, "");
      if (cardNumberDigits.length !== 16) {
        alert("Card number must be 16 digits.");
        return;
      }
      // Basic CVV validation (3-4 digits)
      const cvvDigits = formData.cardCVV.replace(/\D/g, "");
      if (cvvDigits.length < 3 || cvvDigits.length > 4) {
        alert("CVV must be 3 or 4 digits.");
        return;
      }
      // Basic expiry validation (MM/YY)
      const expiryRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
      if (!expiryRegex.test(formData.cardExpiry)) {
        alert("Card expiry must be in MM/YY format.");
        return;
      }
    }

    if (paymentMethod === "bank") {
      if (!formData.bankName || !formData.accountNumber || !formData.transactionId) {
        alert("Please fill all bank transfer details.");
        return;
      }
    }

    if (cnicVerified !== true) {
      const ok = confirm(
        "CNIC not verified. Do you want to continue without CNIC verification?"
      );
      if (!ok) return;
    }

    const bookingPayload = {
      test: selectedTest.title,
      price: selectedTest.price,
      ...formData,
      paymentMethod,
    };

    console.log("Submit booking", bookingPayload);
    alert(
      `Booking received ✅\n\n${formData.name}\nTest: ${selectedTest.title}\nPayment: ${paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "card" ? "Credit/Debit Card" : "Bank Transfer"}`
    );
    setSelectedTest(null);
  };

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

        {/* Grid of cards */}
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
              {/* Overlay */}
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleCloseModal}
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Details */}
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
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cnic">
                        CNIC
                      </label>
                      <div className="relative">
                        <ShieldCheck
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                            cnicVerified === true
                              ? "text-green-500"
                              : cnicVerified === false
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
                        />
                        {cnicVerified !== null && (
                          <span
                            id="cnic-status"
                            className={`text-xs mt-1 block ${
                              cnicVerified ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {cnicVerified ? "CNIC Verified" : "Invalid CNIC"}
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
                        className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
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
                        />
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
                          className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                          required
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="address">
                        Address
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-4 w-5 h-5 text-[#00C2CB]" />
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

                  {/* Payment Method Selection */}
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

                  {/* Payment Fields */}
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
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardNumber">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleFormChange}
                            className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="1234 5678 9012 3456"
                            required
                            aria-required="true"
                          />
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
                            />
                          </div>
                        </div>
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
                          <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleFormChange}
                            className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="Search for a bank"
                            required
                            aria-required="true"
                            aria-autocomplete="list"
                          />
                          {bankQuery && (
                            <motion.ul
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`absolute z-10 w-full mt-1 rounded-[20px] ${cardBg} shadow-lg max-h-40 overflow-y-auto`}
                            >
                              {loadingBanks ? (
                                <li className={`p-3 text-sm ${textColor}`}>Loading banks...</li>
                              ) : filteredBanks.length > 0 ? (
                                filteredBanks.map((b, i) => (
                                  <motion.li
                                    key={i}
                                    onClick={() => {
                                      setFormData((p) => ({ ...p, bankName: b.name || String(b) }));
                                      setBankQuery("");
                                    }}
                                    className={`p-3 text-sm cursor-pointer ${textColor} hover:bg-[#00C2CB]/20`}
                                    whileHover={{ backgroundColor: darkMode ? "#00C2CB/30" : "#00C2CB/20" }}
                                  >
                                    {b.name || String(b)}
                                  </motion.li>
                                ))
                              ) : (
                                <li className={`p-3 text-sm ${textColor}`}>No banks found</li>
                              )}
                            </motion.ul>
                          )}
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="accountNumber">
                            Account Number *
                          </label>
                          <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleFormChange}
                            className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none`}
                            placeholder="Enter account number"
                            required
                            aria-required="true"
                          />
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
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <div className="flex justify-center mt-6">
                    <motion.button
                      type="submit"
                      className={`px-6 py-3 rounded-[20px] bg-[#00C2CB] text-white hover:bg-[#0097A7] focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Confirm Booking
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Labs;