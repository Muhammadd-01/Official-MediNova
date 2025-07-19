import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPages, setPrevPages] = useState([]);
  const [currentPageToken, setCurrentPageToken] = useState(null); // Null means first page

  const API_KEY = "pub_c23217c4872549139b929f791ca977d8";
  const BASE_URL = "https://newsdata.io/api/1/news";

  const fetchNews = async (pageToken = null) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(BASE_URL, {
        params: {
          apikey: API_KEY,
          category: "health",
          language: "en",
          country: "pk",
          page: pageToken || undefined, // If null, first page
        },
      });

      if (!res.data.results || res.data.results.length === 0) {
        setError("No news found.");
      } else {
        setNews(res.data.results);
        setNextPage(res.data.nextPage || null);
        setCurrentPageToken(pageToken); // Save the current page token
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch medical news.");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleNext = () => {
    if (nextPage) {
      setPrevPages([...prevPages, currentPageToken]);
      fetchNews(nextPage);
    }
  };

  const handlePrevious = () => {
    if (prevPages.length > 0) {
      const prev = [...prevPages];
      const lastToken = prev.pop();
      setPrevPages(prev);
      fetchNews(lastToken);
    }
  };

  return (
    <>
      <Helmet>
        <title>Medical News | MediNova</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Latest Medical News</h1>

      {loading ? (
        <p>Loading medical news...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {news.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-4 shadow rounded"
                >
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
                    Source: {item.source_id?.toUpperCase()} | {item.pubDate}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <motion.button
              onClick={handlePrevious}
              disabled={prevPages.length === 0}
              whileTap={{ scale: 0.9 }}
              className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
            >
              ← Previous
            </motion.button>

            <span className="text-sm text-gray-700">Page {prevPages.length + 1}</span>

            <motion.button
              onClick={handleNext}
              disabled={!nextPage}
              whileTap={{ scale: 0.9 }}
              className="bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Next →
            </motion.button>
          </div>
        </>
      )}
    </>
  );
}
