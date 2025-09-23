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

  // Liquid glass effect classes
  const cardBg = darkMode
    ? "bg-[#0A2A43]/20 backdrop-blur-[10px] border border-white/20"
    : "bg-white/20 backdrop-blur-md border border-gray-200";
  const hoverCard = "hover:shadow-2xl hover:scale-105 transition-all duration-300";

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

  const handleCloseModal = () => setSelectedTest(null);

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
        alert("Please fill bank transfer details.");
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
                className={`${
                  darkMode
                    ? "bg-[#0A2A43]/20 backdrop-blur-[12px] border border-white/20"
                    : "bg-white/20 backdrop-blur-md border border-gray-200"
                } relative rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto`}
              >
                {/* Modal header & form ... same as before */}
                {/* Paste all the form content from your original code here */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Labs;
