import React, { useState, useEffect } from "react"

const slides = [
  {
    image: "/placeholder.svg?height=400&width=800",
    title: "Welcome to MediCare",
    description: "Your trusted source for medical information and expert consultations.",
  },
  {
    image: "/placeholder.svg?height=400&width=800",
    title: "Expert Consultations",
    description: "Book a consultation with our experienced medical professionals.",
  },
  {
    image: "/placeholder.svg?height=400&width=800",
    title: "Latest Health Articles",
    description: "Stay informed with our regularly updated health articles.",
  },
]

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
            <p>{slide.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Slider

