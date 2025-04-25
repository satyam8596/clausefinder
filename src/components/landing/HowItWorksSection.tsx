"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const steps = [
  {
    title: "Upload Your Contract",
    description: "Securely upload any contract or legal document in PDF, DOCX, or plain text format.",
    image: "/images/upload-document.svg",
  },
  {
    title: "AI Analysis",
    description: "Our AI analyzes the document, identifies clauses, and extracts key information within seconds.",
    image: "/images/ai-analysis.svg",
  },
  {
    title: "Review Findings",
    description: "Browse through an interactive summary with highlighted clauses, risks, and important terms.",
    image: "/images/review-findings.svg",
  },
  {
    title: "Take Action",
    description: "Export findings, share with colleagues, or make informed decisions based on the analysis.",
    image: "/images/take-action.svg",
  },
];

export default function HowItWorksSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div>
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              How It Works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Get started in minutes with our simple four-step process
            </p>
          </motion.div>

          <motion.div 
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {/* Timeline connector */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-100 -translate-x-1/2 z-0"></div>
            
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className={`flex flex-col md:flex-row items-center mb-16 last:mb-0 relative z-10 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-white p-2 inline-block rounded-full mb-4 shadow-sm">
                    <div className="bg-blue-50 text-blue-600 w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-800 mb-3">{step.title}</h3>
                  <p className="text-slate-600 text-lg">{step.description}</p>
                </div>
                
                <div className={`w-full md:w-1/2 mt-6 md:mt-0 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                  <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
                    <div className="w-full h-48 relative">
                      <Image 
                        src={step.image} 
                        alt={step.title} 
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <a 
              href="/signup"
              className="inline-flex items-center py-3 px-8 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg"
            >
              Try It Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 