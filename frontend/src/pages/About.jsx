import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

function About() {
  const { darkMode } = useContext(DarkModeContext);

  const headingColor = darkMode ? "text-[#FDFBFB]" : "text-[#003366]";
  const paragraphColor = darkMode ? "text-[#FDFBFB]" : "text-[#003366]";
  const containerBg = darkMode ? "bg-[#0A2A43]" : "bg-[#fff9f5]";

  return (
    <>
      <Helmet>
        <title>About MediNova - Your Trusted Medical Resource</title>
        <meta
          name="description"
          content="Learn about MediNova's mission, values, and commitment to providing high-quality medical information and services."
        />
        <link rel="canonical" href="https://www.MediNova.com/about" />
        <meta property="og:title" content="About MediNova - Your Trusted Medical Resource" />
        <meta
          property="og:description"
          content="Discover MediNova's dedication to improving healthcare accessibility and information."
        />
        <meta property="og:url" content="https://www.MediNova.com/about" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <motion.h1
          className={`text-5xl font-bold mb-8 text-center ${headingColor}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About MediNova
        </motion.h1>

        <motion.div
          className={`${containerBg} rounded-lg shadow-lg p-8 mb-16`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className={`text-3xl font-bold mb-6 ${headingColor}`}>Our Mission</h2>
          <p className={`${paragraphColor} mb-6`}>
            At MediNova, our mission is to provide accessible, reliable, and comprehensive medical information and
            services to empower individuals in making informed decisions about their health...
          </p>

          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Medical professionals collaborating"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          <h2 className={`text-3xl font-bold mb-6 ${headingColor}`}>Our Values</h2>
          <ul className={`list-disc list-inside ${paragraphColor} mb-6`}>
            <li>Accuracy and Reliability...</li>
            <li>Accessibility...</li>
            <li>Empathy...</li>
            <li>Innovation...</li>
            <li>Privacy and Security...</li>
          </ul>

          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Medical technology"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          <h2 className={`text-3xl font-bold mb-6 ${headingColor}`}>Our Team</h2>
          <p className={`${paragraphColor} mb-6`}>
            MediNova is powered by a diverse team of healthcare professionals...
          </p>

          <h2 className={`text-3xl font-bold mb-6 ${headingColor}`}>Our Commitment</h2>
          <p className={`${paragraphColor}`}>
            We are committed to continually improving and expanding our services...
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default About;
