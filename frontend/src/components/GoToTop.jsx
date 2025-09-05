"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { ArrowUp } from "lucide-react"

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()

  // Show button after scrolling 300px
  const toggleVisibility = () => {
    setIsVisible(window.pageYOffset > 300)
  }

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Scroll to top automatically on route change
  useEffect(() => {
    scrollToTop()
  }, [location.pathname])

  // Listen for manual scroll
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <>
      {isVisible && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 cursor-pointer bg-[#002c4b] text-white p-2 rounded-full shadow-lg hover:bg-[#014269] transition-colors duration-300 z-50"
        >
          <ArrowUp size={24} />
        </div>
      )}
    </>
  )
}

export default GoToTop
