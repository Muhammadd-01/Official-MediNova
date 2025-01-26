import React, { useState } from "react"

function NewsletterSignup() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the email to your server
    console.log("Subscribing email:", email)
    alert("Thank you for subscribing!")
    setEmail("")
  }

  return (
    <div className="bg-blue-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-grow px-4 py-2 rounded-md border-2 border-blue-300 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}

export default NewsletterSignup

