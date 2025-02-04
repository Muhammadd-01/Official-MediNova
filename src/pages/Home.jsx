import { useContext } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Slider from "../components/Slider"
import NewsletterSignup from "../components/NewsletterSignup"
import FAQ from "../components/FAQ"
import BMICalculator from "../components/BMICalculator"
import HealthTips from "../components/HealthTips"
import { DarkModeContext } from "../App"

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
        <title>MediCare - Your Trusted Medical Resource</title>
        <meta
          name="description"
          content="MediCare provides professional medical advice, medicine suggestions, and expert consultations. Your one-stop for all health-related information."
        />
        <link rel="canonical" href="https://www.medicare.com" />
        <meta property="og:title" content="MediCare - Your Trusted Medical Resource" />
        <meta
          property="og:description"
          content="Professional medical advice, medicine suggestions, and expert consultations."
        />
        <meta property="og:url" content="https://www.medicare.com" />
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
          <motion.h1
            className={`text-5xl font-bold mb-8 text-center ${darkMode ? "text-gray-200" : "text-gray-800"}`}
            {...fadeInUp}
          >
            Welcome to MediCare
          </motion.h1>
          <motion.p
            className={`text-xl mb-12 text-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            {...fadeInUp}
          >
            Your trusted source for medical information and expert consultations.
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
                  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                description: "Get personalized medicine recommendations based on your symptoms.",
                link: "/medicine-suggestion",
              },
              {
                title: "Expert Consultations",
                image:
                  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                description: "Book a consultation with our experienced medical professionals.",
                link: "/consultation",
              },
              {
                title: "Health Articles",
                image:
                  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                description: "Read the latest articles on various health topics.",
                link: "/articles",
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl`}
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
                  <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    {service.title}
                  </h2>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-4`}>{service.description}</p>
                  <Link
                    to={service.link}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
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
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg p-8 mb-16 transition-all duration-300 hover:shadow-xl`}
            {...fadeInUp}
          >
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
              Why Choose MediCare?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Expert Medical Advice",
                  description:
                    "Our team of experienced healthcare professionals provides accurate and up-to-date medical information.",
                },
                {
                  title: "Personalized Care",
                  description:
                    "We offer tailored medicine suggestions and consultations based on your unique health needs.",
                },
                {
                  title: "24/7 Accessibility",
                  description: "Access our services anytime, anywhere, ensuring you always have the support you need.",
                },
                {
                  title: "Comprehensive Health Resources",
                  description:
                    "From articles to news updates, we provide a wide range of health-related information to keep you informed.",
                },
              ].map((item, index) => (
                <motion.div key={item.title} {...fadeInUp} transition={{ delay: 0.1 * (index + 1) }}>
                  <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {item.title}
                  </h3>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <NewsletterSignup />
          <FAQ />
        </motion.div>
      </div>
    </>
  )
}

export default Home

