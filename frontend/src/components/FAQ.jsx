import React, { useContext } from "react";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

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
];

function FAQ() {
  const { darkMode } = useContext(DarkModeContext);

  const cardBg = darkMode
    ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62]";

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      role="region"
      aria-label="Frequently Asked Questions Section"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Frequently Asked Questions
      </h2>

      <div className="space-y-5">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-[30px] ${cardBg} backdrop-blur-2xl transition-all duration-500`}
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.12 }}
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              {faq.question}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed">{faq.answer}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}




export default FAQ;
