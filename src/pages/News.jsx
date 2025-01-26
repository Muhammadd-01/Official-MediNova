import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import axios from "axios"

function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Replace with your actual API key and endpoint
        const response = await axios.get("https://newsapi.org/v2/top-headlines", {
          params: {
            country: "us",
            category: "health",
            apiKey: "YOUR_API_KEY_HERE",
          },
        })
        setNews(response.data.articles)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch news. Please try again later.")
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <>
      <Helmet>
        <title>Medical News - MediCare</title>
        <meta name="description" content="Stay updated with the latest medical news and breakthroughs in healthcare." />
        <link rel="canonical" href="https://www.medicare.com/news" />
        <meta property="og:title" content="Latest Medical News - MediCare" />
        <meta
          property="og:description"
          content="Get the latest updates on medical research, treatments, and healthcare innovations."
        />
        <meta property="og:url" content="https://www.medicare.com/news" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold mb-6">Medical News</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="mb-4">{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Read full article
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default News

