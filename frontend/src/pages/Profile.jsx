// src/pages/Profile.jsx

"use client";
import { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeContext, NotificationContext } from "../App";
import { CheckCircle, X } from "lucide-react";

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProfileData({ ...profileData, [name]: files[0] });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(profileData);
    showNotification("Profile updated successfully ✅", "success");
  };

  // Styling
  const bgColor = darkMode
    ? "bg-[#0A2A43]/70 backdrop-blur-lg"
    : "bg-white/60 backdrop-blur-lg";
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0D3B66]";
  const inputGlass =
    "w-full px-4 py-3 border rounded-2xl sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#00C2CB] border-gray-300/40 bg-white/30 backdrop-blur-lg shadow-inner placeholder-gray-500 text-[#0D3B66] dark:bg-[#0A2A43]/60 dark:text-[#FDFBFB] dark:placeholder-gray-300";

  return (
    <>
      <Helmet>
        <title>Profile - MediNova</title>
        <meta name="description" content="Manage your MediNova profile" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className={`max-w-3xl w-full space-y-8 p-10 rounded-2xl shadow-xl border border-gray-200/20 ${bgColor} ${textColor}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-3xl font-extrabold tracking-tight">
            My Profile
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <label className="w-32 h-32 bg-gray-200/40 dark:bg-[#0A2A43]/40 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-all">
                {profileData.profilePic ? (
                  <img
                    src={URL.createObjectURL(profileData.profilePic)}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm">Upload Photo</span>
                )}
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={profileData.fullName}
                onChange={handleChange}
                className={inputGlass}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={profileData.email}
                onChange={handleChange}
                className={inputGlass}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={profileData.phone}
                onChange={handleChange}
                className={inputGlass}
              />
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleChange}
                className={inputGlass}
              >
                <option value="">Gender</option>
                <option value="male">Male ♂</option>
                <option value="female">Female ♀</option>
                <option value="other">Other</option>
              </select>
              <input
                type="date"
                name="dob"
                value={profileData.dob}
                onChange={handleChange}
                className={inputGlass}
              />
              <select
                name="bloodGroup"
                value={profileData.bloodGroup}
                onChange={handleChange}
                className={inputGlass}
              >
                <option value="">Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>
            </div>

            {/* Medical Info */}
            <textarea
              name="allergies"
              placeholder="Allergies"
              value={profileData.allergies}
              onChange={handleChange}
              className={inputGlass}
              rows="3"
            />
            <textarea
              name="medications"
              placeholder="Current Medications"
              value={profileData.medications}
              onChange={handleChange}
              className={inputGlass}
              rows="3"
            />
            <textarea
              name="history"
              placeholder="Medical History"
              value={profileData.history}
              onChange={handleChange}
              className={inputGlass}
              rows="3"
            />

            {/* Security Info */}
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={profileData.password}
              onChange={handleChange}
              className={inputGlass}
            />

            {/* Save Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:scale-105 hover:shadow-lg transition-all"
              >
                Save Profile
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default Profile;
