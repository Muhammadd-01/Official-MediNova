import React, { useEffect, useState } from "react"
import axios from "axios"
import { Helmet } from "react-helmet-async"

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOption, setSortOption] = useState("recent")

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("https://newsdata.io/api/1/news", {
          params: {
            apikey: "pub_c23217c4872549139b929f791ca977d8",
            category: "health",
            language: "en",
           // country: "pk",
          },
        })

        let results = res.data.results || []
        results = results.filter(item => item.title && item.description) // remove empty

        setNews(results)
      } catch (err) {
        console.error(err)
        setError("Failed to fetch medical news.")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const sortNews = (items) => {
    if (sortOption === "recent") {
      return [...items].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    } else if (sortOption === "popularity") {
      return [...items].sort((a, b) => (b.keywords?.length || 0) - (a.keywords?.length || 0))
    }
    return items
  }

  if (loading) return <p>Loading medical news...</p>
  if (error) return <p className="text-red-500">{error}</p>

  const sortedNews = sortNews(news)

  return (
    <>
      <Helmet>
        <title>Medical News | MediNova</title>
      </Helmet>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Latest Medical News</h1>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="recent">Sort by Date (Recent)</option>
          <option value="popularity">Sort by Popularity</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNews.map((item, i) => (
          <div key={i} className="bg-white p-4 shadow rounded">
            {item.image_url && (
              <img
                src={item.image_url}
                alt="news"
                className="h-40 w-full object-cover mb-3 rounded"
              />
            )}
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm mt-2">{item.description}</p>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline block mt-3"
            >
              Read Full Article →
            </a>
            <p className="text-xs text-gray-500 mt-1">
              Source: {item.source_id?.toUpperCase()} |{" "}
              {new Date(item.pubDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
