import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeContext } from "../App";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
    title: "Welcome to HealthSphere",
    description: "Your trusted source for medical information and expert consultations.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
    title: "Expert Consultations",
    description: "Book a consultation with our experienced medical professionals.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
    title: "Latest Health Articles",
    description: "Stay informed with our regularly updated health articles.",
  },
];

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const textColor = darkMode ? "text-white" : "text-[#0B1C3D]";

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-[40px] shadow-2xl border border-white/20 dark:border-[#0A2A43]/30">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <img
            src={slides[currentSlide].image || "/placeholder.svg"}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />

          {/* Liquid glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10 backdrop-blur-sm" />

          <div
            className={`absolute bottom-0 left-0 right-0 px-6 py-8 sm:px-10 sm:py-12 ${textColor}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white/10 dark:bg-[#0A2A43]/30 backdrop-blur-xl border border-white/20 dark:border-[#0A2A43]/50 rounded-3xl p-6 sm:p-8 max-w-2xl shadow-lg"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl opacity-90">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Futuristic glowing dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            className={`w-4 h-4 rounded-full transition-all duration-500 shadow-lg ${
              index === currentSlide
                ? "bg-gradient-to-r from-[#0A3D62] to-teal-400 dark:from-[#FDFBFB] dark:to-teal-300 ring-2 ring-white/60"
                : "bg-gray-400/50 hover:bg-gray-300 dark:hover:bg-gray-500"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></motion.button>
        ))}
      </div>
    </div>
  );
}

export default Slider;
