import { useContext, useState, useMemo, useEffect } from "react";
import { DarkModeContext } from "../App";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutModal from "../components/CheckoutModal"; // Import the self-contained modal
import {
  Droplet, Microscope, Activity, Syringe, TestTube2,
  FileText, Search, ChevronLeft, ChevronRight, CheckCircle, X,
} from "lucide-react";

function Labs() {
  const { darkMode } = useContext(DarkModeContext);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const reportsPerPage = 5;

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const cardBg = darkMode ? "bg-[#0A2A43]/20 backdrop-blur-[10px] border border-white/20" : "bg-white/20 backdrop-blur-md border border-gray-200";
  const hoverCard = "hover:shadow-2xl hover:scale-105 transition-all duration-300";
  const inputBg = darkMode ? "bg-[#0A2A43]/40 border-white/10 text-[#FDFBFB]" : "bg-white/40 border-[#0A3D62]/10 text-[#0A3D62]";

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${reportsPerPage}`);
        const data = await response.json();
        setReports(data);
        setTotalReports(100);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, [currentPage]);

  // Filtered reports
  const filteredReports = useMemo(() => 
    reports.filter((report) => report.title.toLowerCase().includes(searchQuery.toLowerCase())),
  [reports, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(totalReports / reportsPerPage);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  // Open modal
  const handleOpenModal = (test) => setSelectedTest(test);

  // Close modal
  const handleCloseModal = () => setSelectedTest(null);

  // Submit handler (simulates API - replace with real fetch)
  const handleSubmit = async (payload) => {
    console.log("Submit booking", payload);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true; // Success
  };

  // Success handler
  const handleSuccess = (details) => {
    setBookingDetails(details);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tests = [
    { title: "Complete Blood Count (CBC)", desc: "Complete blood count with detailed analysis.", img: "https://cdn-icons-png.flaticon.com/512/2966/2966485.png", icon: <Droplet className="w-8 h-8 text-[#00C2CB]" />, price: 2500 },
    { title: "Urine Analysis", desc: "Detects urinary tract infections and kidney issues.", img: "https://cdn-icons-png.flaticon.com/512/2966/2966505.png", icon: <TestTube2 className="w-8 h-8 text-[#00C2CB]" />, price: 1500 },
    { title: "Pathology Biopsy", desc: "Microscopic examination of tissues for diagnosis.", img: "https://cdn-icons-png.flaticon.com/512/4320/4320371.png", icon: <Microscope className="w-8 h-8 text-[#00C2CB]" />, price: 5000 },
    { title: "Radiology (X-ray/CT/MRI)", desc: "Advanced imaging with modern radiology equipment.", img: "https://cdn-icons-png.flaticon.com/512/2966/2966533.png", icon: <Activity className="w-8 h-8 text-[#00C2CB]" />, price: 8000 },
    { title: "Vaccination", desc: "Protective immunization for adults and children.", img: "https://cdn-icons-png.flaticon.com/512/2966/2966481.png", icon: <Syringe className="w-8 h-8 text-[#00C2CB]" />, price: 2000 },
    { title: "COVID-19 PCR Test", desc: "Accurate COVID-19 testing with quick reporting.", img: "https://cdn-icons-png.flaticon.com/512/2785/2785819.png", icon: <Activity className="w-8 h-8 text-[#00C2CB]" />, price: 3500 },
    { title: "Liver Function Test (LFT)", desc: "Monitors liver health and enzyme levels.", img: "https://cdn-icons-png.flaticon.com/512/2779/2779762.png", icon: <Microscope className="w-8 h-8 text-[#00C2CB]" />, price: 3000 },
    { title: "Kidney Function Test (KFT)", desc: "Evaluates kidney performance and health.", img: "https://cdn-icons-png.flaticon.com/512/2779/2779752.png", icon: <Droplet className="w-8 h-8 text-[#00C2CB]" />, price: 2800 },
    { title: "Thyroid Profile", desc: "Checks thyroid hormone levels for imbalances.", img: "https://cdn-icons-png.flaticon.com/512/2779/2779771.png", icon: <Activity className="w-8 h-8 text-[#00C2CB]" />, price: 3200 },
    { title: "Cholesterol Test (Lipid Profile)", desc: "Measures cholesterol and heart risk factors.", img: "https://cdn-icons-png.flaticon.com/512/2966/2966499.png", icon: <TestTube2 className="w-8 h-8 text-[#00C2CB]" />, price: 2000 },
  ];

  return (
    <>
      <Header />
      <div className={`min-h-screen py-12 px-4 sm:px-8 lg:px-16 ${textColor} bg-transparent max-w-7xl mx-auto`}>
        {/* Coming Soon Heading with Looping Animation */}
        <motion.h1
          className={`text-6xl sm:text-7xl font-extrabold mb-12 text-center ${textColor} tracking-tight`}
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Coming Soon
        </motion.h1>

        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-teal-500">
          HealthSphere Diagnostic Labs
        </motion.h1>
        <p className={`text-center max-w-2xl mx-auto mb-10 text-base sm:text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
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
          <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className={`text-2xl font-bold mb-4 ${textColor}`}>
            Lab Reports
          </motion.h2>
          <p className={`text-sm mb-4 ${textColor}`}>Reports fetched by HealthSphere AI</p>
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
                <div className="mb-3"><FileText className="w-8 h-8 text-[#00C2CB]" /></div>
                <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>Report ID: {report.id} – {report.title}</h3>
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
              className={`flex items-center ${textColor} ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
              whileHover={{ scale: 1.05 }}
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Previous
            </motion.button>
            <span className={textColor}>Page {currentPage} of {totalPages}</span>
            <motion.button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center ${textColor} ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
              whileHover={{ scale: 1.05 }}
            >
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </motion.button>
          </div>
        </div>

        {/* Reusable Checkout Modal */}
        <CheckoutModal
          isOpen={!!selectedTest}
          onClose={handleCloseModal}
          itemTitle={selectedTest?.title}
          itemPrice={selectedTest?.price}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />

        {/* Success Notification (Labs-specific) */}
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
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>Thank you, {bookingDetails.name}! Your booking is received.</p>
                  <ul className={`text-sm ${textColor} mt-2 space-y-1`}>
                    <li><strong>Test:</strong> {bookingDetails.item}</li>
                    <li><strong>Payment:</strong> {bookingDetails.paymentMethod}</li>
                    <li><strong>Price:</strong> PKR {bookingDetails.price}</li>
                  </ul>
                </div>
                <motion.button onClick={() => setShowSuccess(false)} className="p-1 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30 transition-all duration-300" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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