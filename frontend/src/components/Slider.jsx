import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeContext } from "../App";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
    title: "Welcome to MediNova",
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
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-3xl shadow-xl">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <img
            src={slides[currentSlide].image || "/placeholder.svg"}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-[#0A3D62]/80 dark:from-[#0A2A43]/80 to-transparent flex items-end px-6 py-8 sm:px-8 sm:py-10 ${textColor}`}
          >
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 drop-shadow-md">
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl drop-shadow-md">
                {slides[currentSlide].description}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] ${
              index === currentSlide
                ? "bg-[#0A3D62] dark:bg-[#FDFBFB] scale-125"
                : "bg-gray-400/50 hover:bg-gray-400"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default Slider;