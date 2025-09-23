
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
  const { darkMode } = useContext(DarkModeContext);
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-white";
  const bgColor = darkMode ? "bg-[#0A2A43]/80" : "bg-gray-50";

  return (
    <div className="mt-4 flex gap-2">
      {[
        {
          href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          label: "Facebook",
        },
        {
          href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
          label: "Twitter",
        },
        {
          href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          label: "LinkedIn",
        },
      ].map((item, index) => (
        <motion.a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`bg-[#0A3D62] ${textColor} px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#08253A] hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Share on ${item.label}`}
        >
          {item.label}
        </motion.a>
      ))}
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
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const bgColor = darkMode ? "bg-[#0A2A43]/80" : "bg-gray-50";
  const inputBg = darkMode ? "bg-[#0A2A43]/80 text-[#FDFBFB] border-none" : "bg-gray-50 text-[#0A3D62] border-none";

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const devtoTags = ["health", "medical", "science", "lifestyle"];
      const requests = devtoTags.map((tag) =>
        fetch(`https://dev.to/api/articles?tag=${tag}&per_page=100`).then(
          (res) => res.json()
        )
      );
      try {
        const results = await Promise.all(requests);
        const combined = results.flat();
        setAllArticles(combined);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    let filtered = allArticles.filter((article) => {
      const matchAuthor = authorFilter
        ? article.user?.name?.toLowerCase() === authorFilter.toLowerCase()
        : true;
      const matchDate = dateFilter
        ? article.readable_publish_date === dateFilter
        : true;
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

  const uniqueAuthors = [
    ...new Set(allArticles.map((a) => a.user?.name).filter(Boolean)),
  ];
  const uniqueDates = [
    ...new Set(allArticles.map((a) => a.readable_publish_date).filter(Boolean)),
  ];
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
        <meta
          name="description"
          content="Explore trending health articles from Dev.to"
        />
        <link rel="canonical" href="https://www.MediNova.com/articles" />
      </Helmet>

      <div
        className={`max-w-7xl mx-auto p-4 sm:p-6 ${textColor} bg-transparent rounded-[40px] shadow-md transition-all duration-300 hover:shadow-xl border-none outline-none`}
      >
        <motion.h1
          className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-blue-500"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Health Articles
        </motion.h1>

        {/* Filters */}
        <motion.div
          className={`flex flex-col md:flex-row flex-wrap gap-4 mb-8 p-4 sm:p-6 rounded-[40px] ${bgColor} shadow-md hover:shadow-xl transition-all duration-300 border-none outline-none`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            {
              value: authorFilter,
              setter: setAuthorFilter,
              placeholder: "Filter by Author",
              options: uniqueAuthors,
              ariaLabel: "Filter articles by author",
            },
            {
              value: dateFilter,
              setter: setDateFilter,
              placeholder: "Filter by Date",
              options: uniqueDates,
              ariaLabel: "Filter articles by date",
            },
            {
              value: tagFilter,
              setter: setTagFilter,
              placeholder: "Filter by Tag",
              options: uniqueTags,
              ariaLabel: "Filter articles by tag",
            },
          ].map((filter, idx) => (
            <motion.div
              key={idx}
              className="relative w-full md:w-1/3"
              whileFocus={{ scale: 1.02 }}
            >
              <motion.select
                className={`w-full p-3 sm:p-4 rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300 appearance-none`}
                value={filter.value}
                onChange={(e) => filter.setter(e.target.value)}
                aria-label={filter.ariaLabel}
              >
                <option value="">{filter.placeholder}</option>
                {filter.options.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </motion.select>
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          ))}

          <motion.div className="relative w-full md:w-1/3" whileFocus={{ scale: 1.02 }}>
            <motion.select
              className={`w-full p-3 sm:p-4 rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300 appearance-none`}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort articles"
            >
              <option value="">Sort Articles</option>
              <option value="popularity">By Popularity</option>
            </motion.select>
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>

          <motion.button
            onClick={resetFilters}
            className={`w-full md:w-auto bg-[#0A3D62] ${darkMode ? "text-[#FDFBFB]" : "text-white"} px-6 py-3 sm:py-4 rounded-xl font-medium hover:bg-[#08253A] hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Reset all filters"
          >
            Reset Filters
          </motion.button>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.p
                className={textColor}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Loading...
              </motion.p>
            ) : (
              currentArticles.map((article) => (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, shadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`p-6 rounded-[40px] ${bgColor} shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-none outline-none`}
                >
                  {article.cover_image && (
                    <LazyImage
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-48 object-cover mb-4 rounded-[40px]"
                      loading="lazy"
                    />
                  )}
                  <h2 className={`text-xl sm:text-2xl font-semibold mb-2 line-clamp-2 ${textColor}`}>
                    {article.title}
                  </h2>
                  <p className={`text-sm line-clamp-3 ${textColor} opacity-80 mb-4`}>
                    {article.description}
                  </p>
                  <p className={`text-xs ${textColor} mb-2`}>
                    By {article.user?.name || "Unknown Author"} |{" "}
                    {article.readable_publish_date}
                  </p>
                  <motion.a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block mt-2 bg-[#0A3D62] ${darkMode ? "text-[#FDFBFB]" : "text-white"} px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#08253A] hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={`Read more about ${article.title}`}
                  >
                    Read More ↗
                  </motion.a>
                  <SocialShare url={article.url} title={article.title} />
                  <div className="mt-4">
                    <h3 className={`font-semibold mb-1 text-sm ${textColor}`}>Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(article.tag_list)
                        ? article.tag_list
                        : []
                      ).map((tag, index) => (
                        <Link
                          key={index}
                          to={`/search?q=${encodeURIComponent(tag)}`}
                          className={`bg-gray-100 dark:bg-[#0A2A43]/50 px-2 py-1 rounded-xl text-xs ${textColor} hover:bg-gray-200 dark:hover:bg-[#0A2A43]/70 transition-all duration-300`}
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

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            disabled={page <= 1}
            onClick={() => handlePageChange("prev")}
            className={`bg-[#0A3D62] ${darkMode ? "text-[#FDFBFB]" : "text-white"} font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-[#08253A] hover:shadow-lg transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]`}
            aria-label="Previous page"
          >
            Previous
          </motion.button>

          <span className={`text-lg font-medium ${textColor}`}>
            Page {page} of {totalPages}
          </span>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            disabled={page >= totalPages}
            onClick={() => handlePageChange("next")}
            className={`bg-[#0A3D62] ${darkMode ? "text-[#FDFBFB]" : "text-white"} font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-[#08253A] hover:shadow-lg transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]`}
            aria-label="Next page"
          >
            Next
          </motion.button>
        </div>

        <div className="mt-16">
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
}

export default Articles;
