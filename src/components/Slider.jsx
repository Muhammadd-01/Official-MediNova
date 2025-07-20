import React, { useState, useEffect, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DarkModeContext } from "../App"

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
]

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { darkMode } = useContext(DarkModeContext)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-lg shadow-lg">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <img
            src={slides[currentSlide].image || "/placeholder.svg"}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-transparent text-white p-8">
            <h2 className="text-4xl font-bold mb-4">{slides[currentSlide].title}</h2>
            <p className="text-xl">{slides[currentSlide].description}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-gray-400"}`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default Slider

