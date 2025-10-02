"use client";
import { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeContext, NotificationContext } from "../App";
import { CheckCircle, X, User, Mail, Phone, Calendar } from "lucide-react";

function Profile() {
  const { darkMode } = useContext(DarkModeContext);
  const { showNotification } = useContext(NotificationContext);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    allergies: "",
    medications: "",
    history: "",
    password: "",
    profilePic: null,
  });
  const [showSuccess, setShowSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProfileData({ ...profileData, [name]: files[0] });
      setShowSuccess({
        title: "Photo Uploaded ✅",
        message: "Your profile picture has been successfully uploaded.",
      });
      setTimeout(() => setShowSuccess(null), 3000);
    } else {
      setProfileData({ ...profileData, [name]: value });
      if (name === "password" && value.length >= 6) {
        setShowSuccess({
          title: "Password Updated ✅",
          message: "Your password has been successfully updated.",
        });
        setTimeout(() => setShowSuccess(null), 3000);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(profileData);
    showNotification("Profile updated successfully ✅", "success");
  };

  // Styling from Labs.jsx
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const cardBg = darkMode
    ? "bg-[#0A2A43]/20 backdrop-blur-[10px] border border-white/20"
    : "bg-white/20 backdrop-blur-md border border-gray-200";
  const inputBg = darkMode
    ? "bg-[#0A2A43]/40 border-white/10 text-[#FDFBFB]"
    : "bg-white/40 border-[#0A3D62]/10 text-[#0A3D62]";

  return (
    <>
      <Helmet>
        <title>Profile - MediNova</title>
        <meta name="description" content="Manage your MediNova profile" />
      </Helmet>

      <div className={`min-h-screen py-12 px-4 sm:px-8 lg:px-16 ${textColor} bg-transparent max-w-7xl mx-auto`}>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl sm:text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-blue-500`}
        >
          My Profile
        </motion.h1>
        <p
          className={`text-center max-w-2xl mx-auto mb-10 text-base sm:text-lg ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Update your personal and medical information securely.
        </p>

        <motion.form
          className="w-full max-w-3xl mx-auto space-y-8"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <motion.label
              className={`w-32 h-32 ${cardBg} rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105`}
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Upload profile picture"
            >
              {profileData.profilePic ? (
                <img
                  src={URL.createObjectURL(profileData.profilePic)}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-[#00C2CB]" />
              )}
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </motion.label>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="fullName">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                <motion.input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={profileData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none hover:shadow-lg hover:scale-[1.02]`}
                  required
                  aria-required="true"
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(0, 194, 203, 0.3)" }}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                <motion.input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={profileData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none hover:shadow-lg hover:scale-[1.02]`}
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(0, 194, 203, 0.3)" }}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="phone">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                <motion.input
                  type="tel"
                  name="phone"
                  placeholder="03XX-XXXXXXX"
                  value={profileData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none hover:shadow-lg hover:scale-[1.02]`}
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(0, 194, 203, 0.3)" }}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="gender">
                Gender
              </label>
              <motion.select
                name="gender"
                value={profileData.gender}
                onChange={handleChange}
                className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none appearance-none hover:shadow-lg hover:scale-[1.02]`}
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(0, 194, 203, 0.3)" }}
              >
                <option value="">Select gender</option>
                <option value="male">Male ♂</option>
                <option value="female">Female ♀</option>
                <option value="other">Other</option>
              </motion.select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="dob">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                <motion.input
                  type="date"
                  name="dob"
                  value={profileData.dob}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none appearance-none hover:shadow-lg hover:scale-[1.02]`}
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(0, 194, 203, 0.3)" }}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="bloodGroup">
                Blood Group
              </label>
              <motion.select
                name="bloodGroup"
                value={profileData.bloodGroup}
                onChange={handleChange}
                className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none appearance-none hover:shadow-lg hover:scale-[1.02]`}
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(0, 194, 203, 0.3)" }}
              >
                <option value="">Select blood group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </motion.select>
            </div>
          </div>

          {/* Medical Info */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="allergies">
              Allergies
            </label>
            <motion.textarea
              name="allergies"
              placeholder="List any allergies"
              value={profileData.allergies}
              onChange={handleChange}
              className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none h-24 resize-none hover:shadow-lg hover:scale-[1.02]`}
              rows="3"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(0, 194, 203, 0.3)" }}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="medications">
              Current Medications
            </label>
            <motion.textarea
              name="medications"
              placeholder="List current medications"
              value={profileData.medications}
              onChange={handleChange}
              className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none h-24 resize-none hover:shadow-lg hover:scale-[1.02]`}
              rows="3"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(0, 194, 203, 0.3)" }}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="history">
              Medical History
            </label>
            <motion.textarea
              name="history"
              placeholder="Brief medical history"
              value={profileData.history}
              onChange={handleChange}
              className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none h-24 resize-none hover:shadow-lg hover:scale-[1.02]`}
              rows="3"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(0, 194, 203, 0.3)" }}
            />
          </div>

          {/* Security Info */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="password">
              New Password
            </label>
            <motion.input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={profileData.password}
              onChange={handleChange}
              className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg} focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none hover:shadow-lg hover:scale-[1.02]`}
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(0, 194, 203, 0.3)" }}
            />
          </div>

          {/* Save Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              type="submit"
              className={`w-full py-3 rounded-[20px] bg-[#00C2CB] text-white hover:bg-[#0097A7] focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300`}
            >
              Save Profile
            </button>
          </motion.div>
        </motion.form>

        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
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
                  <h3 className={`text-lg font-bold ${textColor}`}>
                    {showSuccess.title}
                  </h3>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                    {showSuccess.message}
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowSuccess(null)}
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

export default Profile;