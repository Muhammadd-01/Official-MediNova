import React, { useState } from "react"
import { Helmet } from "react-helmet-async"

function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the contact form data to your server
    console.log("Contact form submitted:", { name, email, message })
    alert("Thank you for contacting us. We will get back to you soon!")
    setName("")
    setEmail("")
    setMessage("")
  }

  return (
    <>
      <Helmet>
        <title>Contact Us - MediCare</title>
        <meta
          name="description"
          content="Get in touch with MediCare. We're here to answer your questions and provide support."
        />
        <link rel="canonical" href="https://www.medicare.com/contact" />
        <meta property="og:title" content="Contact MediCare - Get in Touch" />
        <meta
          property="og:description"
          content="Contact our team for any questions or support regarding our medical services."
        />
        <meta property="og:url" content="https://www.medicare.com/contact" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-2">
              Message:
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded"
              rows="6"
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Send Message
          </button>
        </form>
      </div>
    </>
  )
}

export default Contact

