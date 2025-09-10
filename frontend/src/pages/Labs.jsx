import { useContext, useState } from "react";
import { DarkModeContext } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import {
  Microscope,
  TestTube2,
  Droplet,
  Activity,
  Syringe,
  X,
} from "lucide-react";

function Labs() {
  const { darkMode } = useContext(DarkModeContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    test: "",
    date: "",
    time: "",
    payment: "COD",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    bankName: "",
    accountNumber: "",
    transactionId: "",
  });

  const handleBook = (testName) => {
    setSelectedTest(testName);
    setFormData((prev) => ({ ...prev, test: testName }));
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `✅ Booking Confirmed!\n\nPatient: ${formData.name}\nTest: ${formData.test}\nPayment Method: ${formData.payment}`
    );
    setIsModalOpen(false);
  };

  const bgColor = darkMode ? "bg-[#0A2A43]" : "bg-gray-50";
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-gray-800";
  const cardBg = darkMode
    ? "bg-[#081F5C]/70 backdrop-blur-md"
    : "bg-white/80 backdrop-blur-md";
  const hoverColor = darkMode
    ? "hover:bg-[#0A2A43]/70"
    : "hover:bg-gray-100/80";

  const tests = [
    { name: "Complete Blood Count (CBC)", price: "PKR 1,500", time: "24 hrs" },
    { name: "Blood Sugar (Fasting)", price: "PKR 700", time: "6 hrs" },
    { name: "Liver Function Test (LFT)", price: "PKR 2,000", time: "24 hrs" },
    { name: "Kidney Function Test (KFT)", price: "PKR 2,200", time: "24 hrs" },
    { name: "Thyroid Profile (T3, T4, TSH)", price: "PKR 3,000", time: "48 hrs" },
    { name: "Vitamin D Test", price: "PKR 2,500", time: "48 hrs" },
    { name: "Vitamin B12 Test", price: "PKR 2,200", time: "48 hrs" },
    { name: "Lipid Profile", price: "PKR 2,800", time: "24 hrs" },
    { name: "HbA1c (Diabetes Test)", price: "PKR 1,800", time: "24 hrs" },
    { name: "COVID-19 PCR", price: "PKR 6,000", time: "12 hrs" },
    { name: "Dengue NS1 Antigen", price: "PKR 2,000", time: "24 hrs" },
    { name: "Malaria Parasite Smear", price: "PKR 1,500", time: "24 hrs" },
    { name: "Chest X-Ray", price: "PKR 1,200", time: "6 hrs" },
    { name: "Ultrasound Abdomen", price: "PKR 3,500", time: "Same Day" },
    { name: "MRI Brain", price: "PKR 15,000", time: "48 hrs" },
  ];

  return (
    <div className={`${bgColor} min-h-screen py-16`}>
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className={`text-5xl font-extrabold mb-4 ${textColor}`}>
            MediNova Diagnostic Labs
          </h1>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Trusted diagnostic services with accuracy, speed, and care. Book
            your medical tests and pay securely online.
          </p>
        </div>

        {/* Tests Table */}
        <div className="mt-10">
          <h2 className={`text-3xl font-bold mb-6 text-center ${textColor}`}>
            Available Lab Tests
          </h2>
          <div className="overflow-x-auto rounded-2xl shadow-xl">
            <table
              className={`w-full border-collapse text-sm md:text-base rounded-2xl overflow-hidden ${cardBg}`}
            >
              <thead>
                <tr
                  className={`${
                    darkMode ? "bg-[#0A2A43]" : "bg-gray-100"
                  } text-left`}
                >
                  <th className="px-4 py-3">Test Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Reporting Time</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test, i) => (
                  <tr
                    key={i}
                    className={`border-b ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <td className="px-4 py-3">{test.name}</td>
                    <td className="px-4 py-3">{test.price}</td>
                    <td className="px-4 py-3">{test.time}</td>
                    <td className="px-4 py-3 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBook(test.name)}
                        className="px-4 py-2 rounded-xl bg-[#00C2CB] text-white font-semibold shadow-md hover:bg-[#0097A7] transition"
                      >
                        Book
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`${cardBg} rounded-2xl p-8 max-w-lg w-full shadow-2xl relative`}
              >
                {/* Close button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                  <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center">
                  Book Your Test
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Patient Info */}
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                  <div className="flex gap-3">
                    <input
                      type="number"
                      name="age"
                      placeholder="Age"
                      required
                      value={formData.age}
                      onChange={handleChange}
                      className="w-1/2 px-4 py-2 border rounded-xl"
                    />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-1/2 px-4 py-2 border rounded-xl"
                    >
                      <option value="">Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                  <input
                    type="text"
                    name="test"
                    value={selectedTest}
                    readOnly
                    className="w-full px-4 py-2 border rounded-xl bg-gray-100 cursor-not-allowed"
                  />
                  <div className="flex gap-3">
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-1/2 px-4 py-2 border rounded-xl"
                    />
                    <input
                      type="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-1/2 px-4 py-2 border rounded-xl"
                    />
                  </div>

                  {/* Payment options */}
                  <select
                    name="payment"
                    value={formData.payment}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl"
                  >
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="Card">Credit/Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>

                  {/* Conditional Payment Details */}
                  {formData.payment === "Card" && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-xl"
                        required
                      />
                      <div className="flex gap-3">
                        <input
                          type="text"
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          className="w-1/2 px-4 py-2 border rounded-xl"
                          required
                        />
                        <input
                          type="password"
                          name="cardCVV"
                          placeholder="CVV"
                          value={formData.cardCVV}
                          onChange={handleChange}
                          className="w-1/2 px-4 py-2 border rounded-xl"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {formData.payment === "Bank Transfer" && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="bankName"
                        placeholder="Bank Name"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-xl"
                        required
                      />
                      <input
                        type="text"
                        name="accountNumber"
                        placeholder="Account Number"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-xl"
                        required
                      />
                      <input
                        type="text"
                        name="transactionId"
                        placeholder="Transaction ID"
                        value={formData.transactionId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-xl"
                        required
                      />
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full py-3 bg-[#00C2CB] text-white font-semibold rounded-xl shadow-lg hover:bg-[#0097A7]"
                  >
                    Confirm Booking
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Labs;
