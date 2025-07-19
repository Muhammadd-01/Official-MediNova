import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import LazyImage from "../components/LazyImage";
import NewsletterSignup from "../components/NewsletterSignup";
import SocialShare from "../components/SocialShare";
import { DarkModeContext } from "../App";

function Articles() {
  const { darkMode } = useContext(DarkModeContext);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("https://dev.to/api/articles?per_page=9&tag=health")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item, index) => ({
          id: item.id,
          title: item.title,
          excerpt: item.description || item.title,
          author: item.user.name,
          date: new Date(item.published_at).toISOString().split("T")[0],
          image: item.cover_image ||
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
          slug: item.slug,
          url: item.url,
          relatedTopics: Array.isArray(item.tag_list)
            ? item.tag_list
            : item.tag_list?.split(",") || [],
        }));
        setArticles(formatted);
      })
      .catch((err) => console.error("Error fetching articles:", err));
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        headline: article.title,
        author: {
          "@type": "Person",
          name: article.author,
        },
        datePublished: article.date,
        description: article.excerpt,
        image: article.image,
        url: article.url,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Health Articles - MediNova</title>
        <meta name="description" content="Read the latest articles on various health topics." />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className={`${darkMode ? "text-blue-200" : "text-blue-900"}`}>
        <h1 className="text-3xl font-bold mb-6">Health Articles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.map((article) => (
            <div key={article.id} className={`${darkMode ? "bg-blue-700" : "bg-white"} p-6 rounded-lg shadow-md`}>
              <LazyImage
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
              <p className="mb-4">{article.excerpt}</p>
              <p className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-600"} mb-4`}>
                By {article.author} | {article.date}
              </p>
              <Link
                to={`/articles/${article.slug}`}
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Read More
              </Link>
              <SocialShare url={article.url} title={article.title} />
              <div className="flex flex-wrap gap-2 mt-4">
                {(Array.isArray(article.relatedTopics) ? article.relatedTopics : [])
                  .slice(0, 4)
                  .map((tag, index) => (
                    <Link
                      key={index}
                      to={`/search?q=${encodeURIComponent(tag.trim())}`}
                      className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-700 text-blue-600 rounded-full hover:bg-blue-200 transition"
                    >
                      {tag.trim()}
                    </Link>
                  ))}
              </div>
            </div>
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
  );
}

export default Articles;
