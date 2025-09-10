import { useContext, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import Slider from "../components/Slider";
import NewsletterSignup from "../components/NewsletterSignup";
import FAQ from "../components/FAQ";
import BMICalculator from "../components/BMICalculator";
import HealthTips from "../components/HealthTips";
import HorizontalSponsorSlider from "../components/HorizontalSponsorSlider";
import { DarkModeContext } from "../App";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.05, y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" },
};

const buttonVariants = {
  hover: { scale: 1.1, transition: { type: "spring", stiffness: 300, damping: 15 } },
  tap: { scale: 0.95 },
};

const heroVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } },
};

const statsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const testimonialVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const sponsors = [
  { name: "PharmaCorp", logo: "/sponsor-logos/pharmacorp.png" },
  { name: "MediTech", logo: "/sponsor-logos/meditech.png" },
  { name: "HealthPlus", logo: "/sponsor-logos/healthplus.png" },
  { name: "BioLife", logo: "/sponsor-logos/biolife.png" },
  { name: "CureAll", logo: "/sponsor-logos/cureall.png" },
];

const testimonials = [
  {
    quote: "MediNova transformed my healthcare experience with instant consultations!",
    author: "Sarah K., Patient",
  },
  {
    quote: "The AI-powered medicine suggestions are spot-on and doctor-approved.",
    author: "Dr. Ahmed R., Cardiologist",
  },
  {
    quote: "Accessible, secure, and reliable — MediNova is my go-to health platform.",
    author: "Hina S., Regular User",
  },
];

function Home() {
  const { darkMode } = useContext(DarkModeContext);

  // Medical-themed colors
  const gradientBg = darkMode
    ? "bg-gradient-to-r from-[#2B3A55] to-[#5C9EAD]"
    : "bg-gradient-to-r from-[#E6F0FA] to-[#B3D9FF]";
  const textColor = darkMode ? "text-[#E6F0FA]" : "text-[#1A3C5A]"; // Body text
  const headingColor = "text-white"; // Headings
  const hoverBg = darkMode ? "hover:bg-[#5C9EAD]/20" : "hover:bg-[#4A90E2]/20";

  // Scroll-triggered animations
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

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

      {/* Hero Section */}
      <motion.section
        className={`relative ${gradientBg} ${headingColor} pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-2xl mb-16`}
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight"
            variants={itemVariants}
          >
            Empower Your Health with MediNova
          </motion.h1>
          <motion.p
            className={`text-lg sm:text-xl max-w-3xl mx-auto mb-8 ${textColor}`}
            variants={itemVariants}
          >
            Connect with licensed doctors, access AI-driven medicine recommendations, and manage your health seamlessly — anytime, anywhere.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              to="/consultation"
              className={`inline-block bg-[#4A90E2] text-white px-8 py-4 rounded-2xl font-semibold text-lg ${hoverBg} hover:bg-[#2B6CB0] hover:shadow-2xl transition-all duration-300`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <div ref={ref} className="animate-fadeIn">
        {/* Slider with Curved Corners and Gradient */}
        <motion.div
          className={`${gradientBg} ${textColor} rounded-2xl mx-4 sm:mx-6 lg:mx-8 mb-16 ${hoverBg} transition-all duration-300`}
          variants={itemVariants}
        >
          <Slider className="rounded-2xl" />
        </motion.div>

        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Services Section */}
          <motion.section className="mb-16" variants={containerVariants}>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-8 text-center ${headingColor}`}>
              Our Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  title: "Medicine Suggestions",
                  image:
                    "https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  description:
                    "AI-assisted, pharmacist-reviewed medicine suggestions tailored to your needs.",
                  link: "/medicine-suggestion",
                },
                {
                  title: "Expert Consultations",
                  image:
                    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  description:
                    "Secure consultations with specialists in cardiology, dermatology, and more.",
                  link: "/consultation",
                },
                {
                  title: "Health Articles",
                  image:
                    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  description:
                    "Doctor-reviewed articles on prevention, nutrition, and chronic conditions.",
                  link: "/articles",
                },
              ].map((service, index) => (
                <motion.div
                  key={service.title}
                  className={`${gradientBg} ${textColor} rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${hoverBg}`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  <div className="p-6">
                    <h3 className={`text-2xl font-semibold mb-4 ${headingColor}`}>
                      {service.title}
                    </h3>
                    <p className={`mb-6 ${textColor}`}>{service.description}</p>
                    <Link
                      to={service.link}
                      className={`inline-block bg-[#4A90E2] text-white px-6 py-3 rounded-2xl font-medium ${hoverBg} hover:bg-[#2B6CB0] transition-all duration-300`}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Learn More
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Tools Section */}
          <motion.section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16" variants={containerVariants}>
            <motion.div
              variants={itemVariants}
              className={`${gradientBg} ${textColor} rounded-2xl p-6 shadow-lg ${hoverBg} transition-all duration-300`}
            >
              <BMICalculator className="rounded-2xl" />
            </motion.div>
            <motion.div
              variants={itemVariants}
              className={`${gradientBg} ${textColor} rounded-2xl p-6 shadow-lg ${hoverBg} transition-all duration-300`}
            >
              <HealthTips className="rounded-2xl" />
            </motion.div>
          </motion.section>

          {/* Why MediNova */}
          <motion.section
            className={`${gradientBg} ${textColor} rounded-2xl shadow-lg p-8 mb-16 transition-all duration-300 ${hoverBg}`}
            variants={containerVariants}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-8 ${headingColor}`}>
              Why Choose MediNova?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {[
                {
                  title: "Expert Medical Advice",
                  description:
                    "Content reviewed by qualified healthcare providers following WHO and CDC guidelines.",
                },
                {
                  title: "Personalized Care",
                  description:
                    "AI-driven diagnostics tailored to your symptoms and medical history.",
                },
                {
                  title: "24/7 Accessibility",
                  description:
                    "Mobile-optimized, secure services available anytime, anywhere.",
                },
                {
                  title: "E-Prescription Support",
                  description:
                    "Digital prescriptions issued by doctors, filled by verified pharmacies.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="p-4"
                >
                  <h3 className={`text-xl font-semibold mb-4 ${headingColor}`}>
                    {item.title}
                  </h3>
                  <p className={textColor}>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section
            className={`${gradientBg} ${textColor} rounded-2xl py-12 mb-16 text-center ${hoverBg} transition-all duration-300`}
            variants={containerVariants}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-8 ${headingColor}`}>
              MediNova by the Numbers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                { value: "1,200+", label: "Licensed Practitioners" },
                { value: "40+", label: "Clinics Nationwide" },
                { value: "10,000+", label: "Consultations Monthly" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={statsVariants}
                  className={`p-6 rounded-2xl ${hoverBg} transition-all duration-300`}
                >
                  <h3 className={`text-3xl font-bold text-[#4A90E2]`}>{stat.value}</h3>
                  <p className={`text-lg ${textColor}`}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Testimonial Section */}
          <motion.section
            className={`${gradientBg} ${textColor} rounded-2xl py-12 mb-16 ${hoverBg} transition-all duration-300`}
            variants={containerVariants}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-8 text-center ${headingColor}`}>
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  className={`${gradientBg} ${textColor} rounded-2xl p-6 shadow-lg ${hoverBg} transition-all duration-300`}
                  variants={testimonialVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <p className={`text-lg italic mb-4 ${textColor}`}>"{testimonial.quote}"</p>
                  <p className={`font-semibold ${textColor}`}>{testimonial.author}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Trust Section */}
          <motion.section
            className={`${gradientBg} ${textColor} rounded-2xl py-12 mb-16 text-center ${hoverBg} transition-all duration-300`}
            variants={containerVariants}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${headingColor}`}>
              Trusted by Healthcare Professionals
            </h2>
            <motion.p variants={itemVariants} className={`text-lg mb-4 ${textColor}`}>
              Used by 1,200+ licensed practitioners and recommended by 40+ clinics nationwide.
            </motion.p>
            <motion.p variants={itemVariants} className={`text-md ${textColor}`}>
              MediNova complies with HIPAA, HIMS-Pakistan, and ICD-11 medical data standards.
            </motion.p>
          </motion.section>

          {/* Sponsors */}
          <motion.section
            className={`${gradientBg} ${textColor} rounded-2xl py-12 mb-16 ${hoverBg} transition-all duration-300`}
            variants={containerVariants}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-8 text-center ${headingColor}`}>
              Our Sponsors
            </h2>
            <motion.div
              variants={itemVariants}
              className={`${gradientBg} ${textColor} rounded-2xl p-6 ${hoverBg} transition-all duration-300`}
            >
              <HorizontalSponsorSlider className="rounded-2xl" />
            </motion.div>
          </motion.section>

          {/* Newsletter and FAQ */}
          <motion.section variants={containerVariants}>
            <motion.div
              className={`${gradientBg} ${textColor} rounded-2xl p-8 mb-8 ${hoverBg} transition-all duration-300`}
              variants={itemVariants}
            >
              <NewsletterSignup className="rounded-2xl" />
            </motion.div>
            <motion.div
              className={`${gradientBg} ${textColor} rounded-2xl p-8 ${hoverBg} transition-all duration-300`}
              variants={itemVariants}
            >
              <FAQ className="rounded-2xl" />
            </motion.div>
          </motion.section>
        </motion.div>
      </div>
    </>
  );
}

export default Home;