import React, { useContext, useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import LazyImage from "../components/LazyImage";
import NewsletterSignup from "../components/NewsletterSignup";
import { DarkModeContext } from "../App";

// Liquid glass dropdown component
function FilterDropdown({ label, options, value, onChange, darkMode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const bg = darkMode ? "bg-[#0A2A43]/60 text-[#FDFBFB]" : "bg-white/40 text-[#0A3D62]";

  return (
    <div className="relative w-full md:w-1/4" ref={ref}>
      <motion.button
        className={`w-full p-3 sm:p-4 rounded-[40px] ${bg} backdrop-blur-xl shadow-md hover:shadow-xl flex justify-between items-center cursor-pointer transition-all duration-300`}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {value || label}
        <svg
          className="w-5 h-5 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={open ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 w-full mt-2 max-h-60 overflow-auto rounded-[40px] ${bg} backdrop-blur-xl shadow-lg border border-white/10`}
          >
            {options.map((opt, idx) => (
              <motion.li
                key={idx}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`px-4 py-3 cursor-pointer rounded-[30px] hover:bg-white/20 hover:backdrop-blur-xl transition-all duration-300`}
                whileHover={{ scale: 1.03 }}
              >
                {opt}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function SocialShare({ url, title }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const { darkMode } = useContext(DarkModeContext);
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-white";

  return (
    <div className="mt-4 flex gap-2">
      {[
        { href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, label: "Facebook" },
        { href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, label: "Twitter" },
        { href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, label: "LinkedIn" },
      ].map((item, index) => (
        <motion.a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`bg-[#0A3D62] ${textColor} px-4 py-2 rounded-2xl text-sm font-medium hover:bg-[#08253A] hover:shadow-lg transition-all duration-300`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
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

  const articlesPerPage = 20;
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const cardBg = darkMode ? "bg-[#0A2A43]/60 backdrop-blur-xl text-[#FDFBFB]" : "bg-white/40 backdrop-blur-xl text-[#0A3D62]";

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const devtoTags = ["health", "medical", "science", "lifestyle"];
      const requests = devtoTags.map(tag =>
        fetch(`https://dev.to/api/articles?tag=${tag}&per_page=100`).then(res => res.json())
      );
      try {
        const results = await Promise.all(requests);
        setAllArticles(results.flat());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    let filtered = allArticles.filter(article => {
      const matchAuthor = authorFilter ? article.user?.name?.toLowerCase() === authorFilter.toLowerCase() : true;
      const matchDate = dateFilter ? article.readable_publish_date === dateFilter : true;
      const matchTag = tagFilter ? article.tag_list.includes(tagFilter) : true;
      return matchAuthor && matchDate && matchTag;
    });

    if (sortBy === "Popularity") {
      filtered.sort((a, b) => (b.public_reactions_count || 0) - (a.public_reactions_count || 0));
    }

    setArticles(filtered);
    setPage(1);
  }, [authorFilter, dateFilter, tagFilter, sortBy, allArticles]);

  const uniqueAuthors = [...new Set(allArticles.map(a => a.user?.name).filter(Boolean))];
  const uniqueDates = [...new Set(allArticles.map(a => a.readable_publish_date).filter(Boolean))];
  const uniqueTags = [...new Set(allArticles.flatMap(a => a.tag_list))];

  const indexOfLast = page * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = direction => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(prev => (direction === "next" ? prev + 1 : prev - 1));
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
      </Helmet>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <motion.h1
          className="text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Health Articles
        </motion.h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <FilterDropdown label="Author" options={uniqueAuthors} value={authorFilter} onChange={setAuthorFilter} darkMode={darkMode} />
          <FilterDropdown label="Date" options={uniqueDates} value={dateFilter} onChange={setDateFilter} darkMode={darkMode} />
          <FilterDropdown label="Tag" options={uniqueTags} value={tagFilter} onChange={setTagFilter} darkMode={darkMode} />
          <FilterDropdown label="Sort Articles" options={["Popularity"]} value={sortBy} onChange={setSortBy} darkMode={darkMode} />
          <motion.button
            onClick={resetFilters}
            className={`w-full md:w-auto px-6 py-3 rounded-[40px] bg-[#0A3D62] ${darkMode ? "text-[#FDFBFB]" : "text-white"} hover:bg-[#08253A] hover:shadow-xl transition-all duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Filters
          </motion.button>
        </div>

        {/* Article Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.p className={textColor} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Loading...</motion.p>
            ) : (
              currentArticles.map(article => (
                <motion.div
                  key={article.id}
                  layout
                  className={`p-6 rounded-[40px] ${cardBg} shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                >
                  {article.cover_image && (
                    <LazyImage src={article.cover_image} alt={article.title} className="w-full h-48 object-cover rounded-[30px] mb-4" />
                  )}
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h2>
                  <p className="text-sm opacity-80 mb-4 line-clamp-3">{article.description}</p>
                  <p className="text-xs mb-2">By {article.user?.name || "Unknown"} | {article.readable_publish_date}</p>
                  <motion.a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 rounded-2xl bg-[#0A3D62] text-white hover:bg-[#08253A] hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Read More ↗
                  </motion.a>
                  <SocialShare url={article.url} title={article.title} />
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
            className="px-6 py-3 rounded-2xl bg-[#0A3D62] text-white hover:bg-[#08253A] hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            Previous
          </motion.button>
          <span className={`text-lg font-medium ${textColor}`}>Page {page} of {totalPages}</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            disabled={page >= totalPages}
            onClick={() => handlePageChange("next")}
            className="px-6 py-3 rounded-2xl bg-[#0A3D62] text-white hover:bg-[#08253A] hover:shadow-lg transition-all duration-300 disabled:opacity-50"
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
