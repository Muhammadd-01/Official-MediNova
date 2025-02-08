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
    const handleScroll = () => toggleVisibility() //Added handleScroll function to pass to event listener
    window.addEventListener("scroll", handleScroll) //Changed event listener to use handleScroll function
    return () => window.removeEventListener("scroll", handleScroll) //Changed event listener to use handleScroll function
  }, []) //Added [] to specify dependencies

  return (
    <>
      {isVisible && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 cursor-pointer bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
        >
          <ArrowUp size={24} />
        </div>
      )}
    </>
  )
}

export default GoToTop

