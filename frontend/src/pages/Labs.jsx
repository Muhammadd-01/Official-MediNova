import { useContext, useState } from "react";
import { DarkModeContext } from "../App";
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
  CreditCard,
  Landmark,
  Truck,
} from "lucide-react";

function Labs() {
  const { darkMode } = useContext(DarkModeContext);
  const [selectedTest, setSelectedTest] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-gray-800";
  const cardBg = darkMode ? "bg-[#081F5C]/90" : "bg-white/80";
  const hoverCard = darkMode ? "hover:bg-[#0A2A43]" : "hover:bg-gray-100";
  const borderColor = darkMode ? "border-white/10" : "border-gray-200";

  const tests = [
    {
      title: "Complete Blood Count (CBC)",
      desc: "Checks overall health and detects blood disorders.",
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
      desc: "Monitors liver health and detects related diseases.",
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
      title: "Cholesterol Test",
      desc: "Measures cholesterol and heart risk factors.",
      img: "https://cdn-icons-png.flaticon.com/512/2966/2966499.png",
      icon: <TestTube2 className="w-8 h-8 text-[#00C2CB]" />,
      price: 2000,
    },
  ];

  return (
    <div className="min-h-screen py-16 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-4xl font-bold mb-4 text-center ${textColor}`}
      >
        MediNova Diagnostic Labs
      </motion.h1>
      <p
        className={`text-center max-w-2xl mx-auto mb-12 text-lg ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Book your lab tests with ease — accurate results, professional care, and
        secure payment methods.
      </p>

      {/* Test Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tests.map((test, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedTest(test)}
            className={`${cardBg} ${hoverCard} border ${borderColor} rounded-2xl shadow-xl cursor-pointer p-6 text-center transition`}
          >
            <img
              src={test.img}
              alt={test.title}
              className="w-20 h-20 mx-auto mb-4"
            />
            <div className="flex justify-center mb-2">{test.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
            <p
              className={`text-sm mb-3 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {test.desc}
            </p>
            <p className="font-bold text-[#00C2CB]">PKR {test.price}</p>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedTest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className={`${cardBg} rounded-3xl p-8 max-w-2xl w-full shadow-2xl`}
            >
              <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>
                Book {selectedTest.title}
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex items-center border rounded-xl p-3 bg-white/10 md:col-span-2">
                  <User className="mr-2 text-[#00C2CB]" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-transparent focus:outline-none"
                    required
                  />
                </div>
                {/* Age & Gender */}
                <input
                  type="number"
                  placeholder="Age"
                  className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                  required
                />
                <select
                  className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                  required
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {/* Phone */}
                <div className="flex items-center border rounded-xl p-3 bg-white/10 md:col-span-2">
                  <Phone className="mr-2 text-[#00C2CB]" />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full bg-transparent focus:outline-none"
                    required
                  />
                </div>
                {/* Email */}
                <div className="flex items-center border rounded-xl p-3 bg-white/10 md:col-span-2">
                  <Mail className="mr-2 text-[#00C2CB]" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-transparent focus:outline-none"
                    required
                  />
                </div>
                {/* Date */}
                <div className="flex items-center border rounded-xl p-3 bg-white/10 md:col-span-2">
                  <Calendar className="mr-2 text-[#00C2CB]" />
                  <input
                    type="date"
                    className="w-full bg-transparent focus:outline-none"
                    required
                  />
                </div>
                {/* Address */}
                <div className="flex items-center border rounded-xl p-3 bg-white/10 md:col-span-2">
                  <Home className="mr-2 text-[#00C2CB]" />
                  <input
                    type="text"
                    placeholder="Address for sample collection"
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>

                {/* Payment Method */}
                <div className="md:col-span-2">
                  <label className={`block mb-2 ${textColor}`}>
                    Select Payment Method
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 ${
                        paymentMethod === "cod"
                          ? "bg-[#00C2CB]/30"
                          : "hover:bg-gray-200 dark:hover:bg-[#0A2A43]"
                      }`}
                    >
                      <Truck className="w-5 h-5 text-[#00C2CB]" />
                      Cash on Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 ${
                        paymentMethod === "card"
                          ? "bg-[#00C2CB]/30"
                          : "hover:bg-gray-200 dark:hover:bg-[#0A2A43]"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-[#00C2CB]" />
                      Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bank")}
                      className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 ${
                        paymentMethod === "bank"
                          ? "bg-[#00C2CB]/30"
                          : "hover:bg-gray-200 dark:hover:bg-[#0A2A43]"
                      }`}
                    >
                      <Landmark className="w-5 h-5 text-[#00C2CB]" />
                      Bank Transfer
                    </button>
                  </div>
                </div>

                {/* Conditional Payment Fields */}
                {paymentMethod === "card" && (
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Card Holder Name"
                      className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                    />
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                    />
                    <input
                      type="text"
                      placeholder="Expiry Date (MM/YY)"
                      className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                    />
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="md:col-span-2 grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Account Holder Name"
                      className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                    />
                    <input
                      type="text"
                      placeholder="IBAN / Account Number"
                      className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                    />
                    <input
                      type="text"
                      placeholder="Bank Name"
                      className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                    />
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <p className="md:col-span-2 text-sm text-gray-400">
                    💡 Cash will be collected at your doorstep after sample
                    collection.
                  </p>
                )}

                {/* Submit */}
                <div className="md:col-span-2 flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setSelectedTest(null)}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#00C2CB] text-white font-semibold hover:bg-[#0097A7] transition"
                  >
                    Confirm Booking (PKR {selectedTest.price})
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Labs;
