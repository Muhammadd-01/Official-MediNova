import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

function About() {
  const { darkMode } = useContext(DarkModeContext);

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
          className={`text-5xl font-bold mb-8 text-center ${
            darkMode ? "text-white" : "text-[#5c4433]"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About MediNova
        </motion.h1>
        <motion.div
          className={`${
            darkMode ? "bg-[#3a2c22]" : "bg-[#fff9f5]"
          } rounded-lg shadow-lg p-8 mb-16`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-[#5c4433]"}`}>
            Our Mission
          </h2>
          <p className={`${darkMode ? "text-[#fbeadd]" : "text-[#6e4d39]"} mb-6`}>
            At MediNova, our mission is to provide accessible, reliable, and comprehensive medical information and
            services to empower individuals in making informed decisions about their health. We strive to bridge the gap
            between medical expertise and public understanding, ensuring that quality healthcare knowledge is available
            to all.
          </p>
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Medical professionals collaborating"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <h2 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-[#5c4433]"}`}>
            Our Values
          </h2>
          <ul className={`list-disc list-inside ${darkMode ? "text-[#fbeadd]" : "text-[#6e4d39]"} mb-6`}>
            <li>
              Accuracy and Reliability: We are committed to providing up-to-date and scientifically accurate medical
              information.
            </li>
            <li>
              Accessibility: We believe that quality healthcare information should be available to everyone, regardless
              of their location or background.
            </li>
            <li>
              Empathy: We understand the concerns and needs of our users and strive to provide compassionate support and
              guidance.
            </li>
            <li>
              Innovation: We continuously seek to improve our services and embrace new technologies to enhance the user
              experience.
            </li>
            <li>Privacy and Security: We prioritize the protection of our users' personal and medical information.</li>
          </ul>
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Medical technology"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <h2 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-[#5c4433]"}`}>
            Our Team
          </h2>
          <p className={`${darkMode ? "text-[#fbeadd]" : "text-[#6e4d39]"} mb-6`}>
            MediNova is powered by a diverse team of healthcare professionals, including doctors, pharmacists, and
            medical researchers. Our experts are dedicated to providing the highest quality of medical information and
            services to our users.
          </p>
          <h2 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-[#5c4433]"}`}>
            Our Commitment
          </h2>
          <p className={`${darkMode ? "text-[#fbeadd]" : "text-[#6e4d39]"}`}>
            We are committed to continually improving and expanding our services to meet the evolving needs of our
            users. Whether you're seeking personalized medicine suggestions, expert consultations, or the latest health
            news, MediNova is here to support you on your health journey.
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default About;
