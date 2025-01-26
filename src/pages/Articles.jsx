import React from "react"
import { Helmet } from "react-helmet-async"
import LazyImage from "../components/LazyImage"

const articles = [
  {
    id: 1,
    title: "The Importance of Regular Exercise",
    excerpt: "Learn about the numerous benefits of incorporating regular exercise into your daily routine.",
    author: "Dr. Jane Smith",
    date: "2023-05-15",
    image: "/images/exercise.jpg",
  },
  {
    id: 2,
    title: "Nutrition Tips for a Healthy Heart",
    excerpt:
      "Discover the best foods and dietary habits to maintain a healthy heart and reduce the risk of cardiovascular diseases.",
    author: "Dr. John Doe",
    date: "2023-05-10",
    image: "/images/healthy-heart.jpg",
  },
  {
    id: 3,
    title: "Understanding and Managing Stress",
    excerpt: "Explore effective strategies to recognize, cope with, and reduce stress in your daily life.",
    author: "Dr. Mike Johnson",
    date: "2023-05-05",
    image: "/images/stress-management.jpg",
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white p-6 rounded-lg shadow-md">
              <LazyImage src={article.image} alt={article.title} className="w-full h-48 object-cover mb-4 rounded" />
              <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
              <p className="mb-4">{article.excerpt}</p>
              <p className="text-sm text-gray-600">
                By {article.author} | {article.date}
              </p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Read More</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Articles

