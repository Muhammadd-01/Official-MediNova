"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, MessageSquare } from "lucide-react"; // optional icons

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 
      bg-gradient-to-br from-[#0A2A43] to-[#081F5C] text-[#FDFBFB] transition-colors duration-500">

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl grid md:grid-cols-2 gap-8 
        bg-[#0A2A43] rounded-3xl shadow-2xl overflow-hidden p-8"
      >
        {/* Left Side - Info */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-gray-300">
            We’d love to hear from you 💬 Whether you have a question, feedback, 
            or just want to say hi — drop us a message and we’ll get back to you.
          </p>
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-sm">
              <Mail className="w-5 h-5 text-blue-400" /> support@medinova.com
            </p>
            <p className="flex items-center gap-2 text-sm">
              📍 Lahore, Pakistan
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="bg-[#081F5C] rounded-xl p-3 shadow-inner flex items-center gap-3">
            <User className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-transparent border-none focus:ring-0 
              text-white placeholder-gray-400"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div className="bg-[#081F5C] rounded-xl p-3 shadow-inner flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent border-none focus:ring-0 
              text-white placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Message */}
          <div className="bg-[#081F5C] rounded-xl p-3 shadow-inner flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-blue-400 mt-1" />
            <textarea
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              className="w-full bg-transparent border-none focus:ring-0 
              text-white placeholder-gray-400 resize-none"
              placeholder="Write your message..."
              required
            ></textarea>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 
            transition-colors font-semibold text-white shadow-md"
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
