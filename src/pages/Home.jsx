"use client"

import { useContext } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Slider from "../components/Slider"
import NewsletterSignup from "../components/NewsletterSignup"
import FAQ from "../components/FAQ"
import BMICalculator from "../components/BMICalculator"
import HealthTips from "../components/HealthTips"
import HorizontalSponsorSlider from "../components/HorizontalSponsorSlider"
import { DarkModeContext } from "../App"

const sponsors = [
  { name: "PharmaCorp", logo: "/sponsor-logos/pharmacorp.png" },
  { name: "MediTech", logo: "/sponsor-logos/meditech.png" },
  { name: "HealthPlus", logo: "/sponsor-logos/healthplus.png" },
  { name: "BioLife", logo: "/sponsor-logos/biolife.png" },
  { name: "CureAll", logo: "/sponsor-logos/cureall.png" },
]

function Home() {
  const { darkMode } = useContext(DarkModeContext)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <>
      <Helmet>
        <title>MediNova - Your Trusted Medical Platform</title>
        <meta
          name="description"
          content="MediNova offers expert-backed medical consultations, personalized drug recommendations, and secure digital healthcare services 24/7."
        />
        <link rel="canonical" href="https://www.MediNova.com" />
        <meta property="og:title" content="MediNova - Your Trusted Medical Platform" />
        <meta
          property="og:description"
          content="Expert-backed consultations, AI-powered medicine suggestions, and health tools. Secure, reliable, and always available."
        />
        <meta property="og:url" content="https://www.MediNova.com" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="animate-fadeIn">
        <Slider />
        <motion.div
          className="container mx-auto px-4 py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 className="text-5xl font-bold mb-8 text-center text-foreground" {...fadeInUp}>
            Welcome to MediNova
          </motion.h1>

          <motion.p className="text-xl mb-12 text-center text-muted-foreground" {...fadeInUp}>
            Your digital bridge to licensed doctors, evidence-based medicine recommendations, and real-time health guidance — all under one secure platform.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              {
                title: "Medicine Suggestions",
                image:
                  "https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                description:
                  "Receive AI-assisted, guideline-based medicine suggestions — reviewed by certified pharmacists.",
                link: "/medicine-suggestion",
              },
              {
                title: "Expert Consultations",
                image:
                  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                description:
                  "Book secure consultations with specialists in cardiology, dermatology, mental health, and more.",
                link: "/consultation",
              },
              {
                title: "Health Articles",
                image:
                  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                description:
                  "Explore doctor-reviewed articles on prevention, nutrition, and chronic conditions.",
                link: "/articles",
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                {...fadeInUp}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">{service.title}</h2>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <Link
                    to={service.link}
                    className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:brightness-110 transition-colors duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <BMICalculator />
            <HealthTips />
          </motion.div>

          <motion.div
            className="bg-card text-card-foreground rounded-lg shadow-lg p-8 mb-16 transition-all duration-300 hover:shadow-xl"
            {...fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-6 text-foreground">Why Choose MediNova?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <motion.div key={item.title} {...fadeInUp} transition={{ delay: 0.1 * (index + 1) }}>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="mb-16" {...fadeInUp}>
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-lg text-center mb-4 text-muted-foreground">
              Used by 1,200+ licensed practitioners and recommended by 40+ clinics nationwide.
            </p>
            <p className="text-md text-center text-muted-foreground">
              MediNova complies with HIPAA, HIMS-Pakistan, and ICD-11 medical data standards.
            </p>
          </motion.div>

          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Our Sponsors</h2>
            <HorizontalSponsorSlider />
          </motion.div>

          <NewsletterSignup />
          <FAQ />
        </motion.div>
      </div>
    </>
  )
}

export default Home
