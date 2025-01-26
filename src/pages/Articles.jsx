import React from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import LazyImage from "../components/LazyImage"
import NewsletterSignup from "../components/NewsletterSignup"
import SocialShare from "../components/SocialShare"

const articles = [
  {
    id: 1,
    title: "The Importance of Regular Exercise",
    excerpt: "Learn about the numerous benefits of incorporating regular exercise into your daily routine.",
    author: "Dr. Jane Smith",
    date: "2023-05-15",
    image: "/images/exercise.jpg",
    slug: "importance-of-regular-exercise",
  },
  {
    id: 2,
    title: "Nutrition Tips for a Healthy Heart",
    excerpt:
      "Discover the best foods and dietary habits to maintain a healthy heart and reduce the risk of cardiovascular diseases.",
    author: "Dr. John Doe",
    date: "2023-05-10",
    image: "/images/healthy-heart.jpg",
    slug: "nutrition-tips-for-healthy-heart",
  },
  {
    id: 3,
    title: "Understanding and Managing Stress",
    excerpt: "Explore effective strategies to recognize, cope with, and reduce stress in your daily life.",
    author: "Dr. Mike Johnson",
    date: "2023-05-05",
    image: "/images/stress-management.jpg",
    slug: "understanding-and-managing-stress",
  },
]

function Articles() {
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
        image: `https://www.medicare.com${article.image}`,
        url: `https://www.medicare.com/articles/${article.slug}`,
      },
    })),
  }

  return (
    <>
      <Helmet>
        <title>Health Articles - MediCare</title>
        <meta
          name="description"
          content="Read the latest articles on various health topics. Expert advice and information from medical professionals."
        />
        <link rel="canonical" href="https://www.medicare.com/articles" />
        <meta property="og:title" content="Health Articles - MediCare" />
        <meta
          property="og:description"
          content="Expert medical articles and health advice from our team of professionals."
        />
        <meta property="og:url" content="https://www.medicare.com/articles" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold mb-6">Health Articles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white p-6 rounded-lg shadow-md">
              <LazyImage src={article.image} alt={article.title} className="w-full h-48 object-cover mb-4 rounded" />
              <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
              <p className="mb-4">{article.excerpt}</p>
              <p className="text-sm text-gray-600 mb-4">
                By {article.author} | {article.date}
              </p>
              <Link
                to={`/articles/${article.slug}`}
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Read More
              </Link>
              <SocialShare url={`https://www.medicare.com/articles/${article.slug}`} title={article.title} />
            </div>
          ))}
        </div>
        <NewsletterSignup />
      </div>
    </>
  )
}

export default Articles

