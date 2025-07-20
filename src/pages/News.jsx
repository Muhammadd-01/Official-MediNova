import React, { useEffect, useState } from "react"
import axios from "axios"
import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"

const countries = [
  { code: "", name: "All Countries" },
  { code: "pk", name: "Pakistan" },
  { code: "us", name: "United States" },
  { code: "gb", name: "UK" },
  { code: "in", name: "India" },
  { code: "au", name: "Australia" },
]

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [country, setCountry] = useState("")
  const [sort, setSort] = useState("recent")

  const API_KEY = "pub_c23217c4872549139b929f791ca977d8" // ✅ Use your NewsData.io key

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)

      try {
        const url = `https://newsdata.io/api/1/news`
        const res = await axios.get(url, {
          params: {
            apikey: API_KEY,
            category: "health",
            language: "en",
            country: country || undefined,
            page_size: 20,
          },
        })

        if (res.data && res.data.results) {
          setNews(res.data.results)
        } else {
          throw new Error("No news found")
        }
      } catch (err) {
        console.error(err)
        setError("⚠️ Failed to fetch medical news. Please check your API key or try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [country])

  const resetFilters = () => {
    setCountry("")
    setSort("recent")
  }

  const sortedNews =
    sort === "popularity"
      ? [...news].sort((a, b) => b.popularity - a.popularity)
      : [...news].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))

  return (
    <>
      <Helmet><title>Medical News | MediNova</title></Helmet>

      <div className="flex gap-4 items-center mb-4">
        <select value={sort} onChange={e => setSort(e.target.value)} className="p-2 border rounded">
          <option value="recent">Recent</option>
          <option value="popularity">Popularity</option>
        </select>

        <select value={country} onChange={e => setCountry(e.target.value)} className="p-2 border rounded">
          {countries.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>

        <button onClick={resetFilters} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Reset Filters</button>
      </div>

      {loading && <p>Loading news...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {sortedNews.map((item, idx) => (
            <div key={idx} className="bg-white shadow rounded-lg overflow-hidden">
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm mt-3 inline-block"
                >
                  Read full article →
                </a>
                <p className="text-xs text-gray-400 mt-2">
                  {item.source_id} | {new Date(item.pubDate).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
