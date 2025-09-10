import { useContext, useState } from "react";
import { DarkModeContext } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Microscope, Activity, Syringe, TestTube2 } from "lucide-react";

function Labs() {
  const { darkMode } = useContext(DarkModeContext);
  const [selectedTest, setSelectedTest] = useState(null);

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-gray-800";
  const cardBg = darkMode ? "bg-[#081F5C]/90" : "bg-white/80";
  const hoverCard = darkMode ? "hover:bg-[#0A2A43]" : "hover:bg-gray-100";
  const borderColor = darkMode ? "border-white/10" : "border-gray-200";

  const tests = [
    {
      title: "Complete Blood Count (CBC)",
      desc: "Checks overall health and detects a variety of disorders.",
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
      desc: "Advanced imaging with latest radiology equipment.",
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
        Explore our wide range of medical tests with professional reporting,
        online booking, and secure payment options.
      </p>

      {/* Test Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tests.map((test, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.4 }}
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className={`${cardBg} rounded-3xl p-8 max-w-lg w-full shadow-2xl`}
            >
              <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>
                Book {selectedTest.title}
              </h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                  required
                />
                <select
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="cod">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="online">Online Banking</option>
                </select>
                <textarea
                  placeholder="Address for sample collection (optional)"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00C2CB]"
                ></textarea>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#00C2CB] text-white font-semibold hover:bg-[#0097A7] transition"
                >
                  Confirm Booking (PKR {selectedTest.price})
                </button>
              </form>
              <button
                onClick={() => setSelectedTest(null)}
                className="mt-4 w-full py-2 text-sm rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Labs;
