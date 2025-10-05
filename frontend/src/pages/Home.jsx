"use client";

import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "../components/Slider";
import NewsletterSignup from "../components/NewsletterSignup";
import FAQ from "../components/FAQ";
import BMICalculator from "../components/BMICalculator";
import HealthTips from "../components/HealthTips";
import HorizontalSponsorSlider from "../components/HorizontalSponsorSlider";
import { DarkModeContext } from "../App";

function Home() {
  const { darkMode } = useContext(DarkModeContext);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const cardBg = darkMode
    ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62]";

  return (
    <>
      <Helmet>
        <title>MediNova - Your Trusted Medical Platform</title>
        <meta
          name="description"
          content="MediNova offers expert-backed medical consultations, personalized drug recommendations, and secure digital healthcare services 24/7."
        />
        <link rel="canonical" href="https://www.MediNova.com" />
      </Helmet>

      <div className="animate-fadeIn">
        <Slider />

        <motion.div
          className="container mx-auto px-4 sm:px-6 py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <motion.h1
            className="text-4xl sm:text-5xl font-bold mb-8 text-center text-[#0A3D62] dark:text-[#FDFBFB]"
            {...fadeInUp}
          >
            Welcome to MediNova
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl mb-12 text-center text-muted-foreground dark:text-[#FDFBFB] max-w-4xl mx-auto"
            {...fadeInUp}
          >
            Your digital bridge to licensed doctors, evidence-based medicine
            recommendations, and real-time health guidance — all under one
            secure platform.
          </motion.p>

          {/* Services Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16"
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              {
                title: "Medicine Suggestions",
                image:
                  "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80",
                description:
                  "Receive AI-assisted, guideline-based medicine suggestions — reviewed by certified pharmacists.",
                link: "/medibot",
              },
              {
                title: "Expert Consultations",
                image:
                  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
                description:
                  "Book secure consultations with specialists in cardiology, dermatology, mental health, and more.",
                link: "/consultation",
              },
              {
                title: "Health Articles",
                image:
                  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
                description:
                  "Explore doctor-reviewed articles on prevention, nutrition, and chronic conditions.",
                link: "/articles",
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                className={`rounded-[40px] p-6 backdrop-blur-2xl ${cardBg} transition-all duration-500`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                {...fadeInUp}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <div className="overflow-hidden rounded-3xl mb-4">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                  {service.title}
                </h2>
                <p className="text-sm sm:text-base mb-6">
                  {service.description}
                </p>
                <Link
                  to={service.link}
                  className="inline-block px-6 py-3 rounded-2xl font-semibold bg-[#0A3D62]/80 text-white hover:bg-[#0A3D62]/90 transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Tools Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <BMICalculator />
            <HealthTips />
          </motion.div>

         {/* Why MediNova */}
<motion.div
  className="mb-16"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  role="region"
  aria-label="Why Choose MediNova Section"
>
  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center tracking-wide">
    Why Choose MediNova?
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[
      {
        title: "Expert Medical Advice",
        description:
          "All content is reviewed by qualified healthcare providers following WHO and CDC guidelines.",
      },
      {
        title: "Personalized Care",
        description:
          "Get treatment paths based on AI + doctor-reviewed diagnostics tailored to your symptoms and history.",
      },
      {
        title: "24/7 Accessibility",
        description:
          "Use MediNova anytime from home or travel — all services are mobile-optimized and secure.",
      },
      {
        title: "E-Prescription Support",
        description:
          "Doctors can issue digital prescriptions that can be filled from our verified pharmacy partners.",
      },
    ].map((item, index) => (
      <motion.div
        key={item.title}
        className={`flex flex-col p-6 rounded-3xl ${
          darkMode
            ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB] hover:bg-[#0A2A43]/50"
            : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62] hover:bg-white/50"
        } backdrop-blur-2xl transition-all duration-500`}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-3">{item.title}</h3>
        <p className="text-sm sm:text-base leading-relaxed">{item.description}</p>
      </motion.div>
    ))}
  </div>
</motion.div>

          {/* Trust Section */}
<motion.div
  className="mb-16"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  role="region"
  aria-label="Trusted by Healthcare Professionals Section"
>
  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center tracking-wide">
    Trusted by Healthcare Professionals
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[
      {
        title: "Used by 1,200+ licensed practitioners",
        description:
          "Recommended by 40+ clinics nationwide.",
      },
      {
        title: "Compliant with medical standards",
        description:
          "MediNova complies with HIPAA, HIMS-Pakistan, and ICD-11 medical data standards.",
      },
    ].map((item, index) => (
      <motion.div
        key={item.title}
        className={`flex flex-col p-6 rounded-3xl ${
          darkMode
            ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB] hover:bg-[#0A2A43]/50"
            : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62] hover:bg-white/50"
        } backdrop-blur-2xl transition-all duration-500`}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-3">{item.title}</h3>
        <p className="text-sm sm:text-base leading-relaxed">{item.description}</p>
      </motion.div>
    ))}
  </div>
</motion.div>


          {/* Sponsors */}
          <motion.div
            className={`rounded-[40px] p-8 backdrop-blur-2xl ${cardBg} mb-16 transition-all duration-500`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
              Our Sponsors
            </h2>
            <HorizontalSponsorSlider />
          </motion.div>

          <NewsletterSignup />
          <FAQ />
        </motion.div>
      </div>
    </>
  );
}

export default Home;
