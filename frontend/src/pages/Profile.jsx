"use client";
import { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeContext } from "../App";
import { CheckCircle, X, User, Mail, Phone, Calendar } from "lucide-react";
import axios from "axios";

function Profile() {
  const { darkMode } = useContext(DarkModeContext);

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

  // Fetch user data from backend
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:4000/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      if (data) {
        setProfileData({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phoneNumber || "",
          gender: data.gender || "",
          dob: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().split("T")[0]
            : "",
          bloodGroup: data.bloodGroup || "",
          allergies: data.allergies || "",
          medications: data.medications || "",
          history: data.history || "",
          password: "",
          profilePic: null,
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProfileData({ ...profileData, [name]: files[0] });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Prepare FormData for possible file upload
      const formData = new FormData();
      for (let key in profileData) {
        if (profileData[key] !== "" && profileData[key] !== null) {
          formData.append(key, profileData[key]);
        }
      }

      await axios.put("http://localhost:4000/api/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Show success notification once
      setShowSuccess({
        title: "Profile Updated ✅",
        message: "Your profile has been successfully updated.",
      });

      // Reload the page after short delay so user sees the notification
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

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

      <div
        className={`min-h-screen py-12 px-4 sm:px-8 lg:px-16 ${textColor} bg-transparent max-w-7xl mx-auto`}
      >
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
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                <motion.input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                <motion.input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                <motion.input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Gender
              </label>
              <motion.select
                name="gender"
                value={profileData.gender}
                onChange={handleChange}
                className={`w-full pl-4 pr-4 py-2 rounded-[20px] ${inputBg}`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male ♂</option>
                <option value="Female">Female ♀</option>
                <option value="Other">Other</option>
              </motion.select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                <motion.input
                  type="date"
                  name="dob"
                  value={profileData.dob}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-[20px] ${inputBg}`}
                />
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Blood Group
              </label>
              <motion.input
                type="text"
                name="bloodGroup"
                value={profileData.bloodGroup}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-[20px] ${inputBg}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Allergies
              </label>
              <motion.input
                type="text"
                name="allergies"
                value={profileData.allergies}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-[20px] ${inputBg}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Medications
              </label>
              <motion.input
                type="text"
                name="medications"
                value={profileData.medications}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-[20px] ${inputBg}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Medical History
              </label>
              <motion.input
                type="text"
                name="history"
                value={profileData.history}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-[20px] ${inputBg}`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${textColor}`}>
              Change Password
            </label>
            <motion.input
              type="password"
              name="password"
              value={profileData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-[20px] ${inputBg}`}
              placeholder="Enter new password"
            />
          </div>

          {/* Save Button */}
          <div className="text-center">
            <motion.button
              type="submit"
              className="px-6 py-3 rounded-[20px] bg-[#00C2CB] text-white font-bold hover:bg-[#0098A3] transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Changes
            </motion.button>
          </div>
        </motion.form>

        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className={`fixed top-4 right-4 z-50 w-full max-w-sm p-6 rounded-[20px] ${cardBg} shadow-2xl`}
            >
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-[#00C2CB] mr-3" />
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${textColor}`}>
                    {showSuccess.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } mt-1`}
                  >
                    {showSuccess.message}
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowSuccess(null)}
                  className="p-1 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30"
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
