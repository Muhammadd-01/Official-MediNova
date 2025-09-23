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
  const cardBg = darkMode ? "bg-[#0A2A43]/80" : "bg-gray-50";
  const hoverCard = darkMode ? "hover:bg-[#0A2A43]/90" : "hover:bg-gray-100";
  const inputBg = darkMode ? "bg-[#0A2A43]/80 text-[#FDFBFB] border-none" : "bg-gray-50 text-[#0A3D62] border-none";

  const modalContentRef = useRef(null);

  // List of tests (cards)
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

  // Fetch banks (tries a couple of sources then fallbacks)
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
          } catch (e) {
            /* try next */
          }
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

  // CNIC (mock) verification
  const verifyCNIC = (cnic) => {
    const digitsOnly = String(cnic || "").replace(/\D/g, "");
    if (digitsOnly.length === 13) {
      setCnicVerified(true);
    } else {
      setCnicVerified(false);
    }
  };

  // Helpers: filtered banks for search
  const filteredBanks = banks.filter((b) =>
    (b?.name || String(b))
      .toLowerCase()
      .includes(bankQuery.trim().toLowerCase())
  );

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (name === "cnic") verifyCNIC(value);
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
    setTimeout(() => {
      if (modalContentRef.current) modalContentRef.current.scrollTop = 0;
    }, 0);
  };

  const handleCloseModal = () => {
    setSelectedTest(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      alert("Please complete required fields (name, phone, date).");
      return;
    }

    if (paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cardCVV || !formData.cardExpiry) {
        alert("Please provide card details.");
        return;
      }
    }
    if (paymentMethod === "bank") {
      if (!formData.bankName || !formData.accountNumber || !formData.transactionId) {
        alert("Please fill bank transfer details (select bank, account No, tx id).");
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
      `Booking received ✅\n\n${formData.name}\nTest: ${selectedTest.title}\nPayment: ${paymentMethod || "Not selected"}`
    );
    setSelectedTest(null);
  };

  return (
    <>
      <Header />
      <div className={`min-h-screen py-12 px-4 sm:px-8 lg:px-16 ${textColor} bg-transparent rounded-[40px] shadow-md transition-all duration-300 hover:shadow-xl max-w-7xl mx-auto border-none outline-none`}>
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
          Book lab tests quickly — professional reporting, sample collection, and
          secure payment options.
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
              className={`${cardBg} ${hoverCard} rounded-[40px] shadow-lg cursor-pointer p-6 flex flex-col items-center text-center transition-all duration-300 overflow-hidden border-none outline-none`}
            >
              <img src={test.img} alt={test.title} className="w-20 h-20 mb-3" />
              <div className="mb-3">{test.icon}</div>
              <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>{test.title}</h3>
              <p className="text-sm mb-4 text-gray-500">{test.desc}</p>
              <div className="mt-auto">
                <p className="text-[#00C2CB] font-bold text-lg">
                  PKR {test.price}
                </p>
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
            >
              {/* overlay */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleCloseModal}
              />

              {/* modal container */}
              <motion.div
                ref={modalContentRef}
                initial={{ scale: 0.96, y: 10, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.96, y: 10, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className={`${cardBg} relative rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto border-none outline-none`}
              >
                {/* header with X */}
                <div className={`flex items-center justify-between px-6 py-4 border-none outline-none`}>
                  <div>
                    <h3 className={`text-xl font-bold ${textColor}`}>
                      Book: {selectedTest.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Price: PKR {selectedTest.price} • Reporting time: Usually 24–48 hrs
                    </p>
                  </div>

                  <button
                    onClick={handleCloseModal}
                    className={`p-2 rounded-xl ${darkMode ? "hover:bg-[#0A2A43]/90" : "hover:bg-gray-100"}`}
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>

                {/* content */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full name */}
                    <div className="col-span-1 md:col-span-2">
                      <label className={`text-sm font-medium mb-1 block ${textColor}`}>Full Name *</label>
                      <div className="flex items-center rounded-xl p-2 bg-transparent border-none">
                        <User className="mr-2 text-[#00C2CB]" />
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          type="text"
                          placeholder="Full name"
                          className={`w-full bg-transparent outline-none px-2 py-1 ${textColor} placeholder-gray-400 focus:ring-2 focus:ring-[#00C2CB]`}
                          required
                        />
                      </div>
                    </div>

                    {/* CNIC */}
                    <div>
                      <label className={`text-sm font-medium mb-1 block ${textColor}`}>CNIC (13 digits)</label>
                      <div className="flex items-center rounded-xl p-2 bg-transparent border-none">
                        <ShieldCheck className="mr-2 text-[#00C2CB]" />
                        <input
                          name="cnic"
                          value={formData.cnic}
                          onChange={handleFormChange}
                          maxLength={13}
                          type="text"
                          placeholder="35202xxxxxxx"
                          className={`w-full bg-transparent outline-none px-2 py-1 ${textColor} placeholder-gray-400 focus:ring-2 focus:ring-[#00C2CB]`}
                          required
                        />
                        <div className="ml-2">
                          {cnicVerified === true && <span className="text-green-500 text-sm">Verified</span>}
                          {cnicVerified === false && <span className="text-red-400 text-sm">Invalid</span>}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        We perform a basic client-side CNIC format check. For real NADRA verification, integrate an official provider.
                      </p>
                    </div>

                    {/* Age */}
                    <div>
                      <label className={`text-sm font-medium mb-1 block ${textColor}`}>Age *</label>
                      <input
                        name="age"
                        value={formData.age}
                        onChange={handleFormChange}
                        type="number"
                        min={0}
                        placeholder="e.g. 34"
                        className={`w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#00C2CB] bg-transparent ${textColor} placeholder-gray-400`}
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className={`text-sm font-medium mb-1 block ${textColor}`}>Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleFormChange}
                        className={`w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#00C2CB] bg-transparent ${textColor} placeholder-gray-400`}
                        required
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Phone */}
                    <div className="col-span-1 md:col-span-2">
                      <label className={`text-sm font-medium mb-1 block ${textColor}`}>Phone *</label>
                      <div className="flex items-center rounded-xl p-2 bg-transparent border-none">
                        <Phone className="mr-2 text-[#00C2CB]" />
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          type="tel"
                          placeholder="+92 3xx xxxxxxx"
                          className={`w-full bg-transparent outline-none px-2 py-1 ${textColor} placeholder-gray-400 focus:ring-2 focus:ring-[#00C2CB]`}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-1 md:col-span-2">
                      <label className={`text-sm font-medium mb-1 block ${textColor}`}>Email *</label>
                      <div className="flex items-center rounded-xl p-2 bg-transparent border-none">
                        <Mail className="mr-2 text-[#00C2CB]" />
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          type="email"
                          placeholder="you@example.com"
                          className={`w-full bg-transparent outline-none px-2 py-1 ${textColor} placeholder-gray-400 focus:ring-2 focus:ring-[#00C2CB]`}
                          required
                        />
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <label className={`text-sm font-medium mb-1 block ${textColor}`}>Preferred Date *</label>
                      <div className="flex items-center rounded-xl p-2 bg-transparent border-none">
                        <Calendar className="mr-2 text-[#00C2CB]" />
                        <input
                          name="date"
                          value={formData.date}
                          onChange={handleFormChange}
                          type="date"
                          className={`w-full bg-transparent outline-none px-2 py-1 ${textColor} placeholder-gray-400 focus:ring-2 focus:ring-[#00C2CB]`}
                          required
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className={`text-sm font-medium mb-1 block ${textColor}`}>Address (for collection)</label>
                      <div className="flex items-center rounded-xl p-2 bg-transparent border-none">
                        <Home className="mr-2 text-[#00C2CB]" />
                        <input
                          name="address"
                          value={formData.address}
                          onChange={handleFormChange}
                          type="text"
                          placeholder="Street, city, area"
                          className={`w-full bg-transparent outline-none px-2 py-1 ${textColor} placeholder-gray-400 focus:ring-2 focus:ring-[#00C2CB]`}
                          required
                        />
                      </div>
                    </div>

                    {/* Payment method selector */}
                    <div className="md:col-span-2">
                      <label className={`text-sm font-medium mb-2 block ${textColor}`}>Payment Method *</label>
                      <div className="flex gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("cod")}
                          className={`flex-1 md:flex-none px-4 py-2 rounded-xl border-none flex items-center gap-2 justify-center ${paymentMethod === "cod" ? "bg-[#00C2CB] text-white" : `${darkMode ? "bg-[#0A2A43]/80 hover:bg-[#0A2A43]/90 text-[#FDFBFB]" : "bg-gray-50 hover:bg-gray-100 text-[#0A3D62]"}`} focus:ring-2 focus:ring-[#00C2CB]`}
                        >
                          <span>Cash on Delivery</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("card")}
                          className={`flex-1 md:flex-none px-4 py-2 rounded-xl border-none flex items-center gap-2 justify-center ${paymentMethod === "card" ? "bg-[#00C2CB] text-white" : `${darkMode ? "bg-[#0A2A43]/80 hover:bg-[#0A2A43]/90 text-[#FDFBFB]" : "bg-gray-50 hover:bg-gray-100 text-[#0A3D62]"}`} focus:ring-2 focus:ring-[#00C2CB]`}
                        >
                          <CreditCard /> Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("bank")}
                          className={`flex-1 md:flex-none px-4 py-2 rounded-xl border-none flex items-center gap-2 justify-center ${paymentMethod === "bank" ? "bg-[#00C2CB] text-white" : `${darkMode ? "bg-[#0A2A43]/80 hover:bg-[#0A2A43]/90 text-[#FDFBFB]" : "bg-gray-50 hover:bg-gray-100 text-[#0A3D62]"}`} focus:ring-2 focus:ring-[#00C2CB]`}
                        >
                          <Building /> Bank Transfer
                        </button>
                      </div>
                    </div>

                    {/* Conditional Payment Fields */}
                    {paymentMethod === "card" && (
                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className={`text-xs mb-1 block ${textColor}`}>Card Holder</label>
                          <input
                            name="cardHolder"
                            value={formData.cardHolder}
                            onChange={handleFormChange}
                            placeholder="Name on card"
                            className={`w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#00C2CB] bg-transparent ${textColor} placeholder-gray-400`}
                            required
                          />
                        </div>
                        <div>
                          <label className={`text-xs mb-1 block ${textColor}`}>Card Number</label>
                          <input
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleFormChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className={`w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#00C2CB] bg-transparent ${textColor} placeholder-gray-400`}
                            required
                          />
                        </div>
                        <div>
                          <label className={`text-xs mb-1 block ${textColor}`}>Expiry (MM/YY)</label>
                          <input
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleFormChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#00C2CB] bg-transparent ${textColor} placeholder-gray-400`}
                            required
                          />
                        </div>
                        <div>
                          <label className={`text-xs mb-1 block ${textColor}`}>CVV</label>
                          <input
                            name="cardCVV"
                            value={formData.cardCVV}
                            onChange={handleFormChange}
                            placeholder="3 digits"
                            maxLength={4}
                            className={`w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#00C2CB] bg-transparent ${textColor} placeholder-gray-400`}
                            required
                          />
                        </div>
                        <div className="md:col-span-2 text-sm text-gray-400">
                          Note: For production, integrate a PCI-compliant gateway (Stripe/Checkout) and tokenize card data. This UI is for demo only.
                        </div>
                      </div>
                    )}

                    {paymentMethod === "bank" && (
                      <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            className={`flex-1 p-3 rounded-xl border-none focus:ring-2 focus:ring-[#00C2CB] bg-transparent ${textColor} placeholder-gray-400`}
                            placeholder="Search bank (type & select)"
                            value={bankQuery}
                            onChange={(e) => setBankQuery(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setBankQuery("")}
                            className={`px-3 py-2 rounded-xl border-none ${darkMode ? "bg-[#0A2A43]/80 hover:bg-[#0A2A43]/90 text-[#FDFBFB]" : "bg-gray-50 hover:bg-gray-100 text-[#0A3D62]"} focus:ring-2 focus:ring-[#00C2CB]`}
                          >
                            Clear
                          </button>
                        </div>

                        <select
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleFormChange}
                          className={`w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#00C2CB] bg-transparent ${textColor} placeholder-gray-400`}
                          required
                        >
                          <option value="">Select Bank</option>
                          {loadingBanks ? (
                            <option>Loading banks...</option>
                          ) : filteredBanks.length === 0 ? (
                            <option>No banks found</option>
                          ) : (
                            filteredBanks.map((b, i) => (
                              <option key={i} value={b.name || b}>
                                {b.name || b}
                              </option>
                            ))
                          )}
                        </select>

                        <input
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleFormChange}
                          placeholder="Account / IBAN number"
                          className={`w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#00C2CB] bg-transparent ${textColor} placeholder-gray-400`}
                          required
                        />
                        <input
                          name="transactionId"
                          value={formData.transactionId}
                          onChange={handleFormChange}
                          placeholder="Transaction reference (TXID)"
                          className={`w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#00C2CB] bg-transparent ${textColor} placeholder-gray-400`}
                          required
                        />
                        <div className="text-sm text-gray-400">
                          Make the transfer to the selected bank and paste transaction ID here. We'll verify manually (or via bank API) and confirm booking.
                        </div>
                      </div>
                    )}

                    {paymentMethod === "cod" && (
                      <div className="md:col-span-2">
                        <div className={`p-3 rounded-xl border-none bg-transparent text-sm ${textColor}`}>
                          Cash on Collection - pay the technician at sample collection.
                        </div>
                      </div>
                    )}

                    {/* submit buttons */}
                    <div className="md:col-span-2 flex gap-3 justify-end mt-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className={`px-6 py-3 rounded-xl bg-red-500 ${darkMode ? "text-[#FDFBFB]" : "text-white"} hover:bg-red-600 focus:ring-2 focus:ring-red-500`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`px-6 py-3 rounded-xl bg-[#00C2CB] ${darkMode ? "text-[#FDFBFB]" : "text-white"} hover:bg-[#0097A7] focus:ring-2 focus:ring-[#00C2CB]`}
                      >
                        Confirm Booking (PKR {selectedTest.price})
                      </button>
                    </div>
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