"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [toggleVisibility]) // Added toggleVisibility to dependencies

  return (
    <>
      {isVisible && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 cursor-pointer bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 z-50"
        >
          <ArrowUp size={24} />
        </div>
      )}
    </>
  )
}

export default GoToTop

