"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const features: Feature[] = [
  {
    id: 'ai-powered',
    title: 'AI-Powered Clause Detection',
    description: 'Our advanced machine learning algorithms automatically identify and categorize clauses in your contracts, saving you hours of manual review time.',
    icon: '/icons/ai-brain.svg',
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    description: 'Instantly identify high-risk clauses and potential issues with our intelligent risk scoring system, helping you address problems before they occur.',
    icon: '/icons/risk-shield.svg',
  },
  {
    id: 'template-library',
    title: 'Clause Template Library',
    description: 'Access our extensive library of industry-standard clause templates to quickly find alternatives and recommended language for your contracts.',
    icon: '/icons/template-document.svg',
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Share contracts, assign tasks, and collaborate in real-time with your team members, ensuring everyone stays aligned throughout the review process.',
    icon: '/icons/team-collaboration.svg',
  },
  {
    id: 'integration',
    title: 'Seamless Integration',
    description: 'Connect ClauseFinder with your existing document management systems, CRM platforms, and other tools to create a unified workflow.',
    icon: '/icons/integration-puzzle.svg',
  },
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    description: 'Gain valuable insights into your contracting process with comprehensive analytics and reporting features that highlight trends and bottlenecks.',
    icon: '/icons/analytics-chart.svg',
  },
];

const showcaseFeatures = [
  {
    id: 'clause-detection',
    title: 'Intelligent Clause Detection',
    description: 'Our AI engine automatically identifies, extracts, and categorizes clauses from your contracts with industry-leading accuracy. ClauseFinder recognizes over 500 clause types across multiple industries and jurisdictions.',
    image: '/clause-detection.svg',
    stats: [
      { value: '99.2%', label: 'Accuracy' },
      { value: '90%', label: 'Time Saved' },
      { value: '500+', label: 'Clause Types' },
    ]
  },
  {
    id: 'risk-analysis',
    title: 'Comprehensive Risk Analysis',
    description: 'ClauseFinder evaluates each clause against your company policies and industry best practices, flagging potential issues before they become problems. Our intelligent risk scoring gives you clear indications of which clauses need your attention most.',
    image: '/risk-analysis.svg',
    stats: [
      { value: '87%', label: 'Risk Reduction' },
      { value: '75%', label: 'Faster Reviews' },
      { value: '24/7', label: 'Monitoring' },
    ]
  },
  {
    id: 'team-workflow',
    title: 'Streamlined Team Workflow',
    description: 'Collaborate seamlessly with your colleagues through our intuitive interface. Assign tasks, track changes, add comments, and maintain version control—all in one place. ClauseFinder becomes your central hub for all contract-related work.',
    image: '/team-workflow.svg',
    stats: [
      { value: '40%', label: 'Productivity Boost' },
      { value: '65%', label: 'Fewer Emails' },
      { value: '100%', label: 'Version Control' },
    ]
  },
];

export default function FeaturesSection() {
  return (
    <div>
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Legal Professionals
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              ClauseFinder streamlines your contract review process with advanced AI technology and intuitive workflows
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={28}
                    height={28}
                    className="text-blue-600"
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Showcase features with images and stats */}
          {showcaseFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`flex flex-col ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } gap-8 lg:gap-12 items-center mb-20`}
            >
              <div className="w-full lg:w-1/2">
                <div className="rounded-xl overflow-hidden shadow-lg bg-blue-50">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={720}
                    height={450}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-lg text-slate-600 mb-6">{feature.description}</p>
                
                <div className="grid grid-cols-3 gap-4">
                  {feature.stats.map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-8 md:p-10 text-center"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Ready to experience ClauseFinder?</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              See how our powerful features can transform your contract review process with a personalized demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Schedule Your Demo
              </button>
              <button className="px-8 py-3 bg-slate-100 text-slate-800 font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                View Documentation
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 