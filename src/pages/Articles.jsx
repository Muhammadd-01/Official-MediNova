import React, { useContext, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import LazyImage from "../components/LazyImage"
import NewsletterSignup from "../components/NewsletterSignup"
import { DarkModeContext } from "../App"
import { motion } from "framer-motion"

function SocialShare({ url, title }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex gap-3 mt-4">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-xs shadow transition"
      >
        Share on Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-full text-xs shadow transition"
      >
        Share on Twitter
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-full text-xs shadow transition"
      >
        Share on LinkedIn
      </a>
    </div>
  );
}

function Articles() {
  const { darkMode } = useContext(DarkModeContext)
  const [articles, setArticles] = useState([])
  const [filterTag, setFilterTag] = useState("")
  const [filterAuthor, setFilterAuthor] = useState("")

  useEffect(() => {
    fetch("https://dev.to/api/articles?tag=health&per_page=40")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error("Error fetching articles:", err))
  }, [])

  const filteredArticles = articles.filter((a) => {
    const matchesTag = filterTag ? a.tags?.includes(filterTag) : true
    const matchesAuthor = filterAuthor ? a.user?.name?.includes(filterAuthor) : true
    return matchesTag && matchesAuthor
  })

  const uniqueTags = Array.from(
    new Set(articles.flatMap((a) => (Array.isArray(a.tag_list) ? a.tag_list : [])))
  )

  const uniqueAuthors = Array.from(
    new Set(articles.map((a) => a.user?.name).filter(Boolean))
  )

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: filteredArticles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        headline: article.title,
        author: {
          "@type": "Person",
          name: article.user?.name || "Unknown Author",
        },
        datePublished: article.published_at,
        description: article.description,
        image: article.cover_image,
        url: article.url,
      },
    })),
  }

  return (
    <>
      <Helmet>
        <title>Health Articles - MediNova</title>
        <meta
          name="description"
          content="Read the latest articles on various health topics. Expert advice and information from medical professionals."
        />
        <link rel="canonical" href="https://www.MediNova.com/articles" />
        <meta property="og:title" content="Health Articles - MediNova" />
        <meta
          property="og:description"
          content="Expert medical articles and health advice from our team of professionals."
        />
        <meta property="og:url" content="https://www.MediNova.com/articles" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className={`${darkMode ? "text-blue-200" : "text-blue-900"}`}>
        <h1 className="text-3xl font-bold mb-6">Health Articles</h1>

        <motion.div 
          className="mb-6 flex flex-col md:flex-row md:justify-end gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <select
            onChange={(e) => setFilterTag(e.target.value)}
            value={filterTag}
            className="border px-3 py-2 rounded shadow w-full md:w-48"
          >
            <option value="">Filter by Tag</option>
            {uniqueTags.map((tag, i) => (
              <option key={i} value={tag}>{tag}</option>
            ))}
          </select>

          <select
            onChange={(e) => setFilterAuthor(e.target.value)}
            value={filterAuthor}
            className="border px-3 py-2 rounded shadow w-full md:w-48"
          >
            <option value="">Filter by Author</option>
            {uniqueAuthors.map((author, i) => (
              <option key={i} value={author}>{author}</option>
            ))}
          </select>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredArticles.map((article) => (
            <motion.div 
              key={article.id} 
              className={`${darkMode ? "bg-blue-800 text-white" : "bg-white text-blue-900"} p-6 rounded-2xl shadow-xl border border-blue-200 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between`}
              whileHover={{ scale: 1.02 }}
            >
              <div>
                {article.cover_image && (
                  <LazyImage src={article.cover_image} alt={article.title} className="w-full h-48 object-cover mb-4 rounded-xl" />
                )}
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h2>
                <p className="mb-4 text-sm line-clamp-3">{article.description}</p>
                <p className={`text-xs ${darkMode ? "text-blue-300" : "text-blue-600"} mb-2`}>
                  By {article.user?.name || "Unknown Author"} | {article.readable_publish_date}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm transition duration-300"
                >
                  Read More ↗
                </a>
                <SocialShare url={article.url} title={article.title} />
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-1 text-sm">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(article.tag_list) ? article.tag_list : []).map((tag, index) => (
                    <a
                      key={index}
                      href={`https://dev.to/t/${encodeURIComponent(tag)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs hover:bg-blue-200"
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Explore More</h2>
          <ul className="list-disc list-inside">
            <li>
              <Link to="/medicine-suggestion" className="text-blue-600 hover:underline">
                Get personalized medicine suggestions
              </Link>
            </li>
            <li>
              <Link to="/consultation" className="text-blue-600 hover:underline">
                Book a consultation with our experts
              </Link>
            </li>
            <li>
              <Link to="/news" className="text-blue-600 hover:underline">
                Read the latest medical news
              </Link>
            </li>
          </ul>
        </div>

        <NewsletterSignup />
      </div>
    </>
  )
}

export default Articles
