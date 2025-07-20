import React from "react"

const faqs = [
  {
    question: "What services does MediNova offer?",
    answer:
      "MediNova offers a range of services including medicine suggestions based on symptoms, expert consultations, health articles, and the latest medical news.",
  },
  {
    question: "How can I book a consultation with a doctor?",
    answer:
      "You can book a consultation by visiting our Consultation page, where you'll find a list of available doctors and their specialties. Premium members can book directly through the website.",
  },
  {
    question: "Is the medicine suggestion feature a substitute for professional medical advice?",
    answer:
      "No, the medicine suggestion feature is for informational purposes only and should not be considered a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.",
  },
  {
    question: "How often is the medical news updated?",
    answer:
      "Our medical news section is updated daily with the latest developments in healthcare and medical research from reliable sources.",
  },
  {
    question: "How can I provide feedback about the website or services?",
    answer:
      "We welcome your feedback! You can use our Feedback page to share your thoughts, suggestions, or concerns about our website and services.",
  },
]

function FAQ() {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ

