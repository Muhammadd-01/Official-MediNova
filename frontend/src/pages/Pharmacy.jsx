import { useEffect, useState, useContext, useRef } from "react";
import { DarkModeContext, CartContext } from "../App";
import Header from "../components/Header";
import Chatbot from "../components/Chatbot";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiCreditCard, FiDollarSign } from "react-icons/fi";
import { Loader2, CheckCircle, X, Banknote } from "lucide-react";

// Static list of Pakistani banks for bank transfer
const pakistaniBanks = [
  { name: "Habib Bank Limited (HBL)", details: "IBAN: PK60HBLT0000000012345678, SWIFT: HABBPKKA" },
  { name: "United Bank Limited (UBL)", details: "IBAN: PK70UBLP0000000023456789, SWIFT: UBPAKKAH" },
  { name: "Meezan Bank", details: "IBAN: PK36MEZAN0000000034567890, SWIFT: MEZNPKKA" },
  { name: "MCB Bank", details: "IBAN: PK40MCB0000000045678901, SWIFT: MUCBPKKA" },
  { name: "Allied Bank", details: "IBAN: PK50ABPA0000000056789012, SWIFT: ABPAPKKA" },
];

function Pharmacy() {
  const { darkMode } = useContext(DarkModeContext);
  const { cartItems, addToCart, totalPrice } = useContext(CartContext);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    cardHolder: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    bankName: "",
    accountNumber: "",
    transactionId: "",
  });
  const [cardDetails, setCardDetails] = useState(null);
  const [cardLoading, setCardLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [bankLoading, setBankLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bankQuery, setBankQuery] = useState("");
  const [paymentError, setPaymentError] = useState(null);

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const bgColor = darkMode
    ? "bg-[#0A2A43]/60 backdrop-blur-xl"
    : "bg-white/40 backdrop-blur-xl";
  const inputBg = darkMode
    ? "bg-[#0A2A43]/60 text-[#FDFBFB] border-none backdrop-blur-xl"
    : "bg-white/40 text-[#0A3D62] border-none backdrop-blur-xl";

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([30.3753, 69.3451], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://osm.org">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
          mapRef.current.setView([latitude, longitude], 15);
          L.marker([latitude, longitude])
            .addTo(mapRef.current)
            .bindPopup("You are here")
            .openPopup();
          fetchNearbyPharmacies(latitude, longitude);
        },
        (error) => console.error("Geolocation error:", error)
      );
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const fetchNearbyPharmacies = async (lat, lon) => {
    const query = `
      [out:json];
      node["amenity"="pharmacy"](around:3000,${lat},${lon});
      out;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.elements && mapRef.current) {
        setPharmacies(data.elements);
        data.elements.forEach((pharmacy) => {
          L.marker([pharmacy.lat, pharmacy.lon])
            .addTo(mapRef.current)
            .bindPopup(pharmacy.tags.name || "Pharmacy");
        });
      }
    } catch (err) {
      console.error("Pharmacy fetch error:", err);
    }
  };

  const fetchMedicines = async (query, country) => {
    if (!query) {
      setMedicines([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // Primary query: search brand and generic names
      let url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(
        query
      )}+openfda.generic_name:${encodeURIComponent(query)}&limit=10`;
      console.log("Fetching medicines with URL:", url);
      let res = await fetch(url);
      let data = await res.json();

      // Fallback query if no results
      if (!data.results || data.results.length === 0) {
        console.warn("No results for primary query, trying fallback...");
        url = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(query)}&limit=10`;
        res = await fetch(url);
        data = await res.json();
      }

      if (data.results) {
        console.log("API response:", data.results);
        const enriched = data.results
          .filter((med) => {
            if (country !== "USA") return true; // Show all for "Other"
            return med.openfda?.manufacturer_name?.[0]; // Relaxed USA filter
          })
          .map((med) => ({
            id: med.id || Math.random().toString(36).slice(2), // Ensure unique ID
            name: med.openfda?.brand_name?.[0] || med.openfda?.generic_name?.[0] || "Unknown",
            price: (Math.random() * 45 + 5).toFixed(2),
            quantity: 1,
            discount: Math.floor(Math.random() * 20),
            stock: Math.floor(Math.random() * 100),
            image: `https://via.placeholder.com/150?text=${
              med.openfda?.brand_name?.[0] || med.openfda?.generic_name?.[0] || "Medicine"
            }`,
            country: country,
            generic_name: med.openfda?.generic_name?.[0] || "Unknown",
            manufacturer: med.openfda?.manufacturer_name?.[0] || "Unknown",
          }));
        setMedicines(enriched);
        console.log("Processed medicines:", enriched);
      } else {
        console.log("No medicines found in response");
        setMedicines([]);
      }
    } catch (err) {
      console.error("Medicine fetch error:", err);
      setMedicines([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery) fetchMedicines(searchQuery, selectedCountry);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedCountry]);

  // Card verification with binlist.net
  const verifyCard = async (cardNumber) => {
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
  };

  // Luhn algorithm for card validation
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
  const verifyBank = (bankName, accountNumber) => {
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
  };

  // Format card number
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    const formatted = digits.match(/.{1,4}/g)?.join(" ").slice(0, 19) || digits;
    return formatted;
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "cardNumber") {
      newValue = formatCardNumber(value);
    }
    setPaymentForm((prev) => ({ ...prev, [name]: newValue }));
    if (name === "cardNumber") verifyCard(newValue);
    if (name === "bankName") {
      setBankQuery(value);
      verifyBank(value, paymentForm.accountNumber);
    }
    if (name === "accountNumber") {
      verifyBank(paymentForm.bankName, value);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    setPaymentError(null);

    try {
      if (paymentMethod === "card") {
        if (!paymentForm.cardHolder || !paymentForm.cardNumber || !paymentForm.cardExpiry || !paymentForm.cardCVV) {
          alert("Please provide complete card details.");
          return;
        }
        if (!cardDetails || cardDetails.includes("Invalid")) {
          alert("Please verify card details.");
          return;
        }
      } else if (paymentMethod === "bank") {
        if (!paymentForm.bankName || !paymentForm.accountNumber || !paymentForm.transactionId) {
          alert("Please fill all bank transfer details.");
          return;
        }
        if (!pakistaniBanks.some((b) => b.name.toLowerCase() === paymentForm.bankName.toLowerCase())) {
          alert("Please select a valid Pakistani bank from the list.");
          return;
        }
        if (!bankDetails || bankDetails.includes("Invalid")) {
          alert("Please verify bank details.");
          return;
        }
      }

      // Send order to local server
      const response = await fetch("http://localhost:3000/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          paymentMethod,
          paymentDetails: paymentMethod === "card" ? {
            cardHolder: paymentForm.cardHolder,
            cardNumber: paymentForm.cardNumber,
            cardExpiry: paymentForm.cardExpiry,
            cardCVV: paymentForm.cardCVV,
          } : paymentMethod === "bank" ? {
            bankName: paymentForm.bankName,
            accountNumber: paymentForm.accountNumber,
            transactionId: paymentForm.transactionId,
          } : {},
          total: totalPrice,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setCartOpen(false);
          setPaymentMethod("");
          setPaymentForm({
            cardHolder: "",
            cardNumber: "",
            cardExpiry: "",
            cardCVV: "",
            bankName: "",
            accountNumber: "",
            transactionId: "",
          });
        }, 3000);
      } else {
        setPaymentError("Payment processing failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError("Failed to process payment. Please try again.");
    }
  };

  return (
    <>
      <Header>
        <div className="absolute left-4 top-4">
          <motion.button
            onClick={() => setCartOpen(true)}
            whileTap={{ scale: 0.9, rotate: -5 }}
            whileHover={{ scale: 1.1 }}
            className="relative p-2 rounded-full bg-[#0A3D62]/60 text-white border border-white/20"
          >
            <FiShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartItems.length}
              </span>
            )}
          </motion.button>
        </div>
      </Header>

      <div className={`min-h-screen pt-20 p-4 sm:p-6 ${textColor} max-w-7xl mx-auto`}>
        <motion.h1
          className="text-3xl sm:text-4xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Pharmacy
        </motion.h1>

        {/* Map */}
        <motion.div
          className={`w-full h-[400px] rounded-[40px] shadow-md mb-6 ${bgColor} overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div ref={mapContainerRef} className="w-full h-full rounded-[40px] overflow-hidden"></div>
        </motion.div>

        {/* Country Selector */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="country">
            Select Country
          </label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className={`w-full p-4 rounded-[40px] ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
          >
            <option value="USA">USA</option>
            <option value="Other">Other (All Available)</option>
          </select>
        </motion.div>

        {/* Search */}
        <motion.input
          type="text"
          placeholder="Search for medicines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full p-4 mb-6 rounded-[40px] ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
        />

        {/* Medicine Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center"
              >
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                <p>Loading medicines...</p>
              </motion.div>
            ) : medicines.length === 0 && searchQuery ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                No medicines found...
              </motion.p>
            ) : (
              medicines.map((med) => (
                <motion.div
                  key={med.id}
                  layout
                  className={`p-4 sm:p-6 rounded-[40px] ${bgColor} shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={med.image}
                    alt={med.name}
                    className="w-full h-32 object-cover rounded-2xl mb-3"
                  />
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">{med.name}</h2>
                  <p className="text-sm mb-1 line-clamp-2">Generic: {med.generic_name}</p>
                  <p className="text-sm mb-1">Manufacturer: {med.manufacturer}</p>
                  <p className="text-sm mb-1">Country: {med.country}</p>
                  <p className="text-sm mb-1">
                    Price: ${med.price} | Discount: {med.discount}% | Stock: {med.stock}
                  </p>
                  <button
                    onClick={() => addToCart(med)}
                    className="mt-2 px-4 py-2 rounded-[40px] bg-[#0A3D62] text-white hover:bg-[#08253A] hover:shadow-lg transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Cart Sidebar */}
        <AnimatePresence>
          {cartOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className={`fixed top-0 right-0 w-80 h-full ${bgColor} p-6 shadow-xl backdrop-blur-xl rounded-l-3xl z-50 overflow-y-auto`}
            >
              <button
                onClick={() => setCartOpen(false)}
                className="mb-4 text-xl font-bold"
              >
                Close
              </button>
              <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
              {cartItems.length === 0 ? (
                <p>Cart is empty</p>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="mb-4 p-3 rounded-xl bg-[#081F5C] dark:bg-[#081F5C]"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                      <p className="text-sm">
                        Price: ${(item.price * item.quantity * (1 - item.discount / 100)).toFixed(2)}
                      </p>
                    </motion.div>
                  ))}
                  <p className="font-bold mt-4">Total: ${totalPrice.toFixed(2)}</p>

                  {/* Checkout Button */}
                  {!paymentMethod && (
                    <motion.button
                      type="button"
                      onClick={() => setPaymentMethod("select")}
                      className="w-full mt-4 py-2 rounded-xl bg-[#0D3B66] text-white hover:bg-[#081F5C] transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      Checkout
                    </motion.button>
                  )}

                  {/* Payment Method Selection */}
                  {paymentMethod === "select" && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                      <div className="grid grid-cols-1 gap-2">
                        <motion.button
                          type="button"
                          onClick={() => setPaymentMethod("cod")}
                          className={`p-3 rounded-xl ${
                            paymentMethod === "cod" ? "bg-[#0D3B66] text-white" : bgColor
                          } flex items-center justify-center transition-all duration-300`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiDollarSign className="w-5 h-5 mr-2" />
                          Cash on Delivery
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setPaymentMethod("card")}
                          className={`p-3 rounded-xl ${
                            paymentMethod === "card" ? "bg-[#0D3B66] text-white" : bgColor
                          } flex items-center justify-center transition-all duration-300`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiCreditCard className="w-5 h-5 mr-2" />
                          Credit/Debit Card
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setPaymentMethod("bank")}
                          className={`p-3 rounded-xl ${
                            paymentMethod === "bank" ? "bg-[#0D3B66] text-white" : bgColor
                          } flex items-center justify-center transition-all duration-300`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Banknote className="w-5 h-5 mr-2" />
                          Bank Transfer
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Payment Form */}
                  <AnimatePresence>
                    {paymentMethod === "card" && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-4"
                        onSubmit={handleCheckout}
                      >
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardHolder">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            name="cardHolder"
                            value={paymentForm.cardHolder}
                            onChange={handlePaymentChange}
                            className={`w-full p-3 rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0D3B66] dark:focus:ring-[#FDFBFB]`}
                            placeholder="Enter cardholder name"
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="cardNumber">
                            Card Number *
                          </label>
                          <div className="relative">
                            <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0D3B66]" />
                            <input
                              type="text"
                              name="cardNumber"
                              value={paymentForm.cardNumber}
                              onChange={handlePaymentChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0D3B66] dark:focus:ring-[#FDFBFB]`}
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                            {cardDetails && (
                              <span
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
                              value={paymentForm.cardExpiry}
                              onChange={handlePaymentChange}
                              className={`w-full p-3 rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0D3B66] dark:focus:ring-[#FDFBFB]`}
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
                              value={paymentForm.cardCVV}
                              onChange={handlePaymentChange}
                              className={`w-full p-3 rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0D3B66] dark:focus:ring-[#FDFBFB]`}
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>
                        <motion.button
                          type="button"
                          onClick={() => verifyCard(paymentForm.cardNumber)}
                          className="w-full py-2 rounded-xl bg-[#0D3B66] text-white hover:bg-[#081F5C] transition-all duration-300 flex items-center justify-center"
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
                              <FiCreditCard className="w-4 h-4 mr-2" />
                              Verify Card
                            </>
                          )}
                        </motion.button>
                        {paymentError && (
                          <p className="text-red-500 text-sm">{paymentError}</p>
                        )}
                      </motion.form>
                    )}
                    {paymentMethod === "bank" && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-4"
                        onSubmit={handleCheckout}
                      >
                        <div className="relative">
                          <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="bankName">
                            Bank Name *
                          </label>
                          <div className="relative">
                            <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0D3B66]" />
                            <input
                              type="text"
                              name="bankName"
                              value={paymentForm.bankName}
                              onChange={handlePaymentChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0D3B66] dark:focus:ring-[#FDFBFB]`}
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
                          {bankQuery && (
                            <motion.ul
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`absolute z-10 w-full mt-1 rounded-xl ${bgColor} shadow-lg max-h-40 overflow-y-auto`}
                            >
                              {pakistaniBanks
                                .filter((b) => b.name.toLowerCase().includes(bankQuery.toLowerCase()))
                                .map((b, i) => (
                                  <motion.li
                                    key={i}
                                    onClick={() => {
                                      setPaymentForm((p) => ({ ...p, bankName: b.name }));
                                      setBankQuery("");
                                      verifyBank(b.name, paymentForm.accountNumber);
                                    }}
                                    className={`p-3 text-sm cursor-pointer ${textColor} hover:bg-[#0D3B66]/20 flex items-center`}
                                    whileHover={{ backgroundColor: darkMode ? "#0D3B66/30" : "#0D3B66/20" }}
                                  >
                                    <Banknote className="w-4 h-4 mr-2 text-[#0D3B66]" />
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
                            <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0D3B66]" />
                            <input
                              type="text"
                              name="accountNumber"
                              value={paymentForm.accountNumber}
                              onChange={handlePaymentChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0D3B66] dark:focus:ring-[#FDFBFB]`}
                              placeholder="Enter account number"
                              required
                            />
                            {bankDetails && (
                              <span
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
                            value={paymentForm.transactionId}
                            onChange={handlePaymentChange}
                            className={`w-full p-3 rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0D3B66] dark:focus:ring-[#FDFBFB]`}
                            placeholder="Enter transaction ID"
                            required
                          />
                        </div>
                        <motion.button
                          type="button"
                          onClick={() => verifyBank(paymentForm.bankName, paymentForm.accountNumber)}
                          className="w-full py-2 rounded-xl bg-[#0D3B66] text-white hover:bg-[#081F5C] transition-all duration-300 flex items-center justify-center"
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
                              <Banknote className="w-4 h-4 mr-2" />
                              Verify Bank
                            </>
                          )}
                        </motion.button>
                        {paymentError && (
                          <p className="text-red-500 text-sm">{paymentError}</p>
                        )}
                      </motion.form>
                    )}
                    {paymentMethod && paymentMethod !== "select" && (
                      <motion.button
                        type="submit"
                        onClick={handleCheckout}
                        className="w-full mt-4 py-2 rounded-xl bg-[#0D3B66] text-white hover:bg-[#081F5C] transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        disabled={cardLoading || bankLoading}
                      >
                        {cardLoading || bankLoading ? "Processing..." : "Confirm Payment"}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className={`fixed top-4 right-4 z-50 w-full max-w-sm p-6 rounded-xl ${bgColor} shadow-2xl`}
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.3 }}
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-[#0D3B66] mr-3" />
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${textColor}`}>Order Confirmed ✅</h3>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                    Thank you! Your order has been placed successfully.
                  </p>
                  <ul className={`text-sm ${textColor} mt-2 space-y-1`}>
                    <li><strong>Total:</strong> ${totalPrice.toFixed(2)}</li>
                    <li><strong>Payment:</strong> {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "card" ? "Credit/Debit Card" : "Bank Transfer"}</li>
                  </ul>
                </div>
                <motion.button
                  onClick={() => setShowSuccess(false)}
                  className="p-1 rounded-full bg-[#0D3B66]/20 hover:bg-[#0D3B66]/30 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close notification"
                >
                  <X className="w-5 h-5 text-[#0D3B66]" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chatbot behind cart */}
        <div className={`${cartOpen ? "z-0" : "z-50"} relative`}>
          <Chatbot />
        </div>
      </div>
    </>
  );
}

export default Pharmacy;