import React, { useState } from "react"

function NewsletterSignup() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Subscribing email:", email)
    alert("Thank you for subscribing!")
    setEmail("")
  }

  return (
    <div
      className={`
        p-6 rounded-lg shadow-md
        bg-[#FDFBFB] text-[#7F2323]
        dark:bg-[#7F2323] dark:text-[#FDFBFB]
      `}
    >
      <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className={`
            flex-grow px-4 py-2 rounded-md border-2
            border-[#7F2323] text-[#7F2323] bg-[#FDFBFB]
            dark:border-[#FDFBFB] dark:text-[#FDFBFB] dark:bg-[#7F2323]
            focus:outline-none
          `}
        />
        <button
          type="submit"
          className={`
            px-6 py-2 rounded-md transition duration-300
            bg-[#7F2323] text-[#FDFBFB] hover:bg-[#692020]
            dark:bg-[#FDFBFB] dark:text-[#7F2323] dark:hover:bg-[#e0dddd]
          `}
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}

export default NewsletterSignup
