import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import LazyImage from "../components/LazyImage";
import NewsletterSignup from "../components/NewsletterSignup";
import { DarkModeContext } from "../App";
import { motion, AnimatePresence } from "framer-motion";

function SocialShare({ url, title }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="mt-4 flex gap-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-700 transition"
      >
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-400 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-500 transition"
      >
        Twitter
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-900 transition"
      >
        LinkedIn
      </a>
    </div>
  );
}

function Articles() {
  const { darkMode } = useContext(DarkModeContext);
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [authorFilter, setAuthorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [lazyAnimate, setLazyAnimate] = useState(true);

  const articlesPerPage = 20;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const devtoTags = ["health", "medical", "science", "lifestyle"];
      const requests = devtoTags.map((tag) =>
        fetch(`https://dev.to/api/articles?tag=${tag}&per_page=100`).then((res) =>
          res.json()
        )
      );
      const results = await Promise.all(requests);
      const combined = results.flat();
      setAllArticles(combined);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    let filtered = allArticles.filter((article) => {
      const matchAuthor = authorFilter
        ? article.user?.name?.toLowerCase() === authorFilter.toLowerCase()
        : true;
      const matchDate = dateFilter ? article.readable_publish_date === dateFilter : true;
      const matchTag = tagFilter ? article.tag_list.includes(tagFilter) : true;
      return matchAuthor && matchDate && matchTag;
    });

    if (sortBy === "popularity") {
      filtered = [...filtered].sort(
        (a, b) =>
          (b.public_reactions_count || 0) - (a.public_reactions_count || 0)
      );
    }

    setArticles(filtered);
    setPage(1);
  }, [authorFilter, dateFilter, tagFilter, sortBy, allArticles]);

  const uniqueAuthors = [...new Set(allArticles.map((a) => a.user?.name).filter(Boolean))];
  const uniqueDates = [...new Set(allArticles.map((a) => a.readable_publish_date).filter(Boolean))];
  const uniqueTags = [...new Set(allArticles.flatMap((a) => a.tag_list))];

  const indexOfLast = page * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = (direction) => {
    setLazyAnimate(false);
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
      setLazyAnimate(true);
      setLoading(false);
    }, 300);
  };

  const resetFilters = () => {
    setAuthorFilter("");
    setDateFilter("");
    setTagFilter("");
    setSortBy("");
  };

  return (
    <>
      <Helmet>
        <title>Health Articles - MediNova</title>
        <meta name="description" content="Explore trending health articles from Dev.to" />
      </Helmet>

      <div className={`${darkMode ? "text-blue-200" : "text-blue-900"}`}>
        <h1 className="text-3xl font-bold mb-6">Health Articles</h1>

        <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6">
          <select
            className="p-2 border rounded w-full md:w-1/3"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          >
            <option value="">Filter by Author</option>
            {uniqueAuthors.map((author, index) => (
              <option key={index} value={author}>
                {author}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded w-full md:w-1/3"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">Filter by Date</option>
            {uniqueDates.map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded w-full md:w-1/3"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            <option value="">Filter by Tag</option>
            {uniqueTags.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded w-full md:w-1/3"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort Articles</option>
            <option value="popularity">By Popularity</option>
          </select>

          <button
            onClick={resetFilters}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full md:w-auto"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <p>Loading...</p>
            ) : (
              currentArticles.map((article) => (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, boxShadow: "0px 15px 30px rgba(0,0,0,0.2)" }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`transform transition-transform duration-300 ${darkMode ? "bg-blue-800 text-white" : "bg-white text-blue-900"} p-6 rounded-2xl border border-blue-200`}
                >
                  {article.cover_image && (
                    <LazyImage
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-48 object-cover mb-4 rounded-xl"
                    />
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
                  <div className="mt-4">
                    <h3 className="font-semibold mb-1 text-sm">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(article.tag_list) ? article.tag_list : []).map((tag, index) => (
                        <Link
                          key={index}
                          to={`/search?q=${encodeURIComponent(tag)}`}
                          className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs hover:bg-blue-200"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            disabled={page <= 1}
            onClick={() => handlePageChange("prev")}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            Previous
          </motion.button>

          <span className="text-lg font-medium">
            Page {page} of {totalPages}
          </span>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            disabled={page >= totalPages}
            onClick={() => handlePageChange("next")}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            Next
          </motion.button>
        </div>

        <NewsletterSignup />
      </div>
    </>
  );
}

export default Articles;