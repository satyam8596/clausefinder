"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

type Testimonial = {
  id: string;
  quote: string;
  author: {
    name: string;
    title: string;
    company: string;
    image: string;
  };
  tags?: string[];
};

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: "ClauseFinder has revolutionized our contract review process. What used to take days now takes hours, with greater accuracy and fewer overlooked clauses. The risk assessment feature has been particularly valuable in highlighting potential issues before they become problems.",
    author: {
      name: 'Sarah Thompson',
      title: 'General Counsel',
      company: 'Vertex Technologies',
      image: '/public/testimonials/sarah-thompson.jpg',
    },
    tags: ['Enterprise', 'Technology'],
  },
  {
    id: '2',
    quote: "As a solo practitioner, I was spending too much time on contract review. ClauseFinder has given me back hours each week and improved my work quality. The template library alone has been worth the investment, providing consistently reliable starting points for new agreements.",
    author: {
      name: 'Michael Lawson',
      title: 'Attorney',
      company: 'Lawson Legal Services',
      image: '/public/testimonials/michael-lawson.jpg',
    },
    tags: ['Solo Practice', 'Legal Services'],
  },
  {
    id: '3',
    quote: "Our legal team has seen a 40% reduction in contract review time since implementing ClauseFinder. The AI-powered analysis consistently identifies nuanced issues that even our experienced attorneys might miss during a manual review. It's become an indispensable tool for our department.",
    author: {
      name: 'Jennifer Chen',
      title: 'Legal Operations Director',
      company: 'Meridian Healthcare',
      image: '/public/testimonials/jennifer-chen.jpg',
    },
    tags: ['Healthcare', 'Team'],
  },
  {
    id: '4',
    quote: "The version control and collaboration features have transformed how our team works together on complex agreements. Being able to track changes, compare versions, and collaborate in real-time has eliminated countless email chains and confusion. Highly recommended for any multi-attorney practice.",
    author: {
      name: 'Robert Wilson',
      title: 'Managing Partner',
      company: 'Wilson & Associates',
      image: '/public/testimonials/robert-wilson.jpg',
    },
    tags: ['Law Firm', 'Collaboration'],
  },
  {
    id: '5',
    quote: "ClauseFinder's ability to integrate with our existing document management system was the game-changer for us. The transition was seamless, and the ROI was immediate. Our contracts are now more standardized, risks are better identified, and our team is more efficient.",
    author: {
      name: 'Amanda Garcia',
      title: 'VP of Legal Affairs',
      company: 'Nexus Financial',
      image: '/public/testimonials/amanda-garcia.jpg',
    },
    tags: ['Financial Services', 'Integration'],
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredTestimonials = selectedTag
    ? testimonials.filter(t => t.tags?.includes(selectedTag))
    : testimonials;

  const uniqueTags = Array.from(
    new Set(testimonials.flatMap(t => t.tags || []))
  ).sort();

  return (
    <div>
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Legal Professionals
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See what our users have to say about how ClauseFinder has transformed their contract review process
            </p>

            {uniqueTags.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                {uniqueTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <div className="relative">
            <div className="overflow-hidden">
              <div className="relative max-w-4xl mx-auto">
                {filteredTestimonials.length > 0 ? (
                  <div className="flex flex-col space-y-10">
                    {filteredTestimonials.map((testimonial, index) => (
                      <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-slate-50 p-8 rounded-2xl shadow-sm"
                      >
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                          <div className="md:w-24 flex-shrink-0">
                            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-slate-200">
                              <Image
                                src={testimonial.author.image}
                                alt={testimonial.author.name}
                                width={96}
                                height={96}
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center mb-3">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="h-5 w-5 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <blockquote className="text-slate-700 text-lg italic mb-4">"
                              {testimonial.quote}"</blockquote>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {testimonial.author.name}
                              </p>
                              <p className="text-slate-600">
                                {testimonial.author.title}, {testimonial.author.company}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-600">No testimonials found with the selected filter.</p>
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View all testimonials
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Trusted by teams at</h3>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
              {[
                { name: 'Vertex Technologies', logo: '/public/logos/vertex.svg' },
                { name: 'Meridian Healthcare', logo: '/public/logos/meridian.svg' },
                { name: 'Nexus Financial', logo: '/public/logos/nexus.svg' },
                { name: 'Global Legal Partners', logo: '/public/logos/glp.svg' },
                { name: 'Innovate Solutions', logo: '/public/logos/innovate.svg' },
              ].map((company, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-12 w-32 relative grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={128}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20 bg-blue-600 text-white rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-12 md:p-12 md:flex items-center justify-between">
              <div className="mb-8 md:mb-0 md:max-w-xl">
                <h3 className="text-2xl font-bold mb-4">Ready to transform your contract review process?</h3>
                <p className="text-blue-100">
                  Join the thousands of legal professionals who've already upgraded their contract review process with ClauseFinder.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                  Start Free Trial
                </button>
                <button className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 