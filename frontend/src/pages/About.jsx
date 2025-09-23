"use client";

import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

function About() {
  const { darkMode } = useContext(DarkModeContext);

  const headingColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const paragraphColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const cardBg = darkMode
    ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62]";

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const teamMembers = [
    {
      name: "Dr. Ahmed Khan",
      role: "Chief Medical Officer",
      specialty: "Internal Medicine & Diagnostics",
      experience: "15 years",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Dr. Bilal Raza",
      role: "Pharmacist & Research Lead",
      specialty: "Drug Research & Safety",
      experience: "12 years",
      image:
        "https://images.unsplash.com/photo-1595152772835-219674b2a8a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Dr. Omar Siddiqui",
      role: "AI & Tech Specialist",
      specialty: "Healthcare AI & Automation",
      experience: "8 years",
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const sections = [
    {
      title: "Our Mission",
      content:
        "At MediNova, our mission is to provide accessible, reliable, and comprehensive medical information and services to empower individuals in making informed decisions about their health. We strive to bridge the gap between patients and healthcare providers through innovative technology and trusted resources. Our goal is to make healthcare knowledge and guidance transparent, accurate, and actionable for everyone.",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Our Values",
      contentList: [
        "Accuracy and Reliability: Evidence-based info backed by medical experts.",
        "Accessibility: Ensuring services are available to all, anytime, anywhere.",
        "Empathy: Addressing user needs with care.",
        "Innovation: Leveraging technology to enhance healthcare delivery.",
        "Privacy and Security: Protecting user data with highest confidentiality standards.",
      ],
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <>
      <Helmet>
        <title>About MediNova - Your Trusted Medical Resource</title>
        <meta
          name="description"
          content="Learn about MediNova's mission, values, team, and commitment to providing high-quality medical information and services."
        />
        <link rel="canonical" href="https://www.MediNova.com/about" />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 py-16">
        <motion.h1
          className={`text-4xl sm:text-5xl font-bold mb-12 text-center ${headingColor}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About MediNova
        </motion.h1>

        {/* Sections: Mission & Values */}
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            className={`rounded-[40px] shadow-md p-6 sm:p-8 mb-16 ${cardBg} backdrop-blur-2xl transition-all duration-500 hover:scale-102 hover:shadow-xl`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${headingColor}`}>
              {section.title}
            </h2>

            {section.content && (
              <p className={`text-sm sm:text-base ${paragraphColor} mb-6`}>
                {section.content}
              </p>
            )}

            {section.contentList && (
              <ul className={`list-disc list-inside ${paragraphColor} mb-6 text-sm sm:text-base`}>
                {section.contentList.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            <div className="overflow-hidden rounded-[40px] mb-6">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          </motion.div>
        ))}

        {/* Our Team */}
        <motion.div className="mb-16">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-8 text-center ${headingColor}`}>
            Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                className={`rounded-[40px] p-6 backdrop-blur-2xl ${cardBg} transition-all duration-500 hover:scale-102 hover:shadow-xl`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="overflow-hidden rounded-3xl mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-1">{member.name}</h3>
                <p className="text-sm sm:text-base mb-1">{member.role}</p>
                <p className="text-sm sm:text-base mb-1">Specialty: {member.specialty}</p>
                <p className="text-sm sm:text-base">Experience: {member.experience}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Commitment Section */}
        <motion.div
          className={`rounded-[40px] shadow-md p-6 sm:p-8 mb-16 ${cardBg} backdrop-blur-2xl transition-all duration-500 hover:scale-102 hover:shadow-xl`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${headingColor}`}>Our Commitment</h2>
          <p className={`text-sm sm:text-base ${paragraphColor}`}>
            We are committed to continually improving and expanding our services to meet the evolving needs of our users.
            By adhering to global healthcare standards like HIPAA and WHO guidelines, we ensure trust and reliability in
            every interaction. We aim to educate, empower, and provide real-time support for male health and wellness,
            bridging the gap between technology and personalized care.
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default About;
