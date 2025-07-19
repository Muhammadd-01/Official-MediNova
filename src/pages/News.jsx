import React, { useEffect, useState } from "react"
import axios from "axios"
import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"

// Only countries supported by NewsData.io free plan
const validCountries = [
  { code: "", name: "All Countries" },
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "in", name: "India" },
  { code: "au", name: "Australia" },
]

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOption, setSortOption] = useState("recent")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [animateKey, setAnimateKey] = useState(0)

  const fetchNews = async () => {
    setLoading(true)
    setError(null)

    const params = {
      apikey: "pub_c23217c4872549139b929f791ca977d8",
      category: "health",
      language: "en",
      page: 1,
    }

    if (selectedCountry) {
      params.country = selectedCountry
    }

    console.log("📡 Fetching news with params:", params)

    try {
      const res = await axios.get("https://newsdata.io/api/1/news", { params })
      console.log("✅ API response:", res.data)

      let results = res.data.results || []
      results = results.filter(item => item.title || item.description)

      if (results.length === 0) {
        throw new Error("No articles returned")
      }

      setNews(results)
      setAnimateKey(prev => prev + 1)
    } catch (err) {
      console.error("❌ API or data error:", err?.response?.data || err.message)
      setError("Failed to fetch medical news. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [selectedCountry])

  const sortNews = items => {
    if (sortOption === "recent") {
      return [...items].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    }
    return [...items].sort((a, b) => (b.keywords?.length || 0) - (a.keywords?.length || 0))
  }

  const handleReset = () => {
    setSelectedCountry("")
    setSortOption("recent")
    fetchNews()
  }

  if (loading) return <p>Loading medical news...</p>
  if (error) return <p className="text-red-500">{error}</p>

  const sortedNews = sortNews(news)

  return (
    <>
      <Helmet>
        <title>Medical News | MediNova</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Latest Medical News</h1>

        <div className="flex gap-3 flex-wrap">
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            className="border px-3 py-2 rounded-md shadow-sm"
          >
            <option value="recent">Sort by Date</option>
            <option value="popularity">Sort by Popularity</option>
          </select>

          <select
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            className="border px-3 py-2 rounded-md shadow-sm"
          >
            {validCountries.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={handleReset}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={animateKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedNews.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-4 shadow rounded"
            >
              {item.image_url && (
                <img src={item.image_url} alt="news" className="h-40 w-full object-cover mb-3 rounded" />
              )}
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm mt-2">{item.description}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block mt-3">Read Full Article →</a>
              <p className="text-xs text-gray-500 mt-1">
                {item.source_id?.toUpperCase()} | {new Date(item.pubDate).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
