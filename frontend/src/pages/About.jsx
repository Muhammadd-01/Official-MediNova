"use client";

import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

function About() {
  const { darkMode } = useContext(DarkModeContext);

  const headingColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const paragraphColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const containerBg = darkMode ? "bg-[#0A2A43]" : "bg-white";

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

      <div className="container mx-auto px-4 sm:px-6 py-16">
        <motion.h1
          className={`text-4xl sm:text-5xl font-bold mb-8 text-center ${headingColor}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About MediNova
        </motion.h1>

        <motion.div
          className={`${containerBg} rounded-[40px] shadow-md p-6 sm:p-8 mb-16 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:bg-gray-50 dark:hover:bg-[#0A2A43]/70`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          role="region"
          aria-label="About MediNova Section"
        >
          <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${headingColor}`}>
            Our Mission
          </h2>
          <p className={`text-sm sm:text-base ${paragraphColor} mb-6`}>
            At MediNova, our mission is to provide accessible, reliable, and comprehensive medical information and
            services to empower individuals in making informed decisions about their health. We strive to bridge the gap
            between patients and healthcare providers through innovative technology and trusted resources.
          </p>

          <div className="overflow-hidden rounded-[40px] mb-6">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
              alt="Medical professionals collaborating"
              className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>

          <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${headingColor}`}>
            Our Values
          </h2>
          <ul className={`list-disc list-inside ${paragraphColor} mb-6 text-sm sm:text-base`}>
            <li>Accuracy and Reliability: Providing evidence-based information backed by medical experts.</li>
            <li>Accessibility: Ensuring our services are available to all, anytime, anywhere.</li>
            <li>Empathy: Understanding and addressing the needs of our users with care.</li>
            <li>Innovation: Leveraging cutting-edge technology to enhance healthcare delivery.</li>
            <li>Privacy and Security: Protecting user data with the highest standards of confidentiality.</li>
          </ul>

          <div className="overflow-hidden rounded-[40px] mb-6">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
              alt="Medical technology"
              className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>

          <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${headingColor}`}>
            Our Team
          </h2>
          <p className={`text-sm sm:text-base ${paragraphColor} mb-6`}>
            MediNova is powered by a diverse team of healthcare professionals, technologists, and researchers dedicated
            to improving global health outcomes. Our doctors, pharmacists, and AI specialists work together to deliver
            accurate and personalized medical solutions.
          </p>

          <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${headingColor}`}>
            Our Commitment
          </h2>
          <p className={`text-sm sm:text-base ${paragraphColor}`}>
            We are committed to continually improving and expanding our services to meet the evolving needs of our users.
            By adhering to global healthcare standards like HIPAA and WHO guidelines, we ensure trust and reliability in
            every interaction.
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default About;