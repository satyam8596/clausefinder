"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import React from 'react';

// Define a simple CheckIcon component to avoid heroicons dependency issues
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: string;
    annually: string;
  };
  features: string[];
  cta: string;
  popular?: boolean;
};

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for solo practitioners and small firms',
    price: {
      monthly: '$79',
      annually: '$69',
    },
    features: [
      'AI-powered clause detection',
      'Up to 25 contracts per month',
      'Basic risk assessment',
      'Template library (5 templates)',
      'Email support',
      'Single user',
    ],
    cta: 'Request Demo',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing legal teams and departments',
    price: {
      monthly: '$149',
      annually: '$129',
    },
    features: [
      'All Starter features',
      'Up to 100 contracts per month',
      'Advanced risk assessment',
      'Template library (20 templates)',
      'Priority email support',
      'Up to 5 users',
      'Version control',
      'Basic integrations',
    ],
    cta: 'Request Demo',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Customized solutions for large organizations',
    price: {
      monthly: 'Custom',
      annually: 'Custom',
    },
    features: [
      'All Professional features',
      'Unlimited contracts',
      'Custom AI model training',
      'Unlimited templates',
      'Dedicated account manager',
      'Unlimited users',
      'Advanced analytics',
      'Custom integrations',
      'SSO & advanced security',
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
  },
];

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');

  return (
    <div>
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Transparent Pricing for Every Size Team
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs, with no hidden fees or surprises
            </p>
            
            <div className="mt-8 inline-flex p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md font-medium text-sm ${
                  billingCycle === 'monthly'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`px-6 py-2 rounded-md font-medium text-sm flex items-center ${
                  billingCycle === 'annually'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annually
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  Save 15%
                </span>
              </button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-xl p-8 relative ${
                  plan.popular
                    ? 'bg-white border-2 border-blue-500 shadow-xl'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold uppercase py-1 px-4 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-500 text-sm">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <p className="flex items-baseline">
                    <span className="text-4xl font-bold text-slate-900">
                      {plan.price[billingCycle]}
                    </span>
                    {plan.price[billingCycle] !== 'Custom' && (
                      <span className="ml-2 text-slate-500">
                        /month {billingCycle === 'annually' && '(billed annually)'}
                      </span>
                    )}
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="ml-3 text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  } transition-colors`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20 bg-white rounded-xl p-8 shadow-sm border border-slate-200"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Need a Custom Solution?
                </h3>
                <p className="text-slate-600 mb-6">
                  We offer tailored solutions for large legal teams and enterprises with specialized requirements.
                  Our team will work with you to create a custom plan that addresses your unique needs.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Schedule a Consultation
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">High Volume</h4>
                  <p className="text-slate-600 text-sm">
                    Specialized pricing for organizations processing thousands of contracts.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Industry-Specific</h4>
                  <p className="text-slate-600 text-sm">
                    Solutions tailored to your industry's unique contract requirements.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Enterprise Security</h4>
                  <p className="text-slate-600 text-sm">
                    Enhanced security features for handling sensitive legal documents.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">API Access</h4>
                  <p className="text-slate-600 text-sm">
                    Direct API integration with your existing contract management systems.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-20"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              Frequently Asked Questions
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">What is included in the free trial?</h4>
                  <p className="text-slate-600">
                    Our 14-day free trial includes full access to all features in the Professional plan, with a limit of 10 contracts.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Can I upgrade or downgrade my plan?</h4>
                  <p className="text-slate-600">
                    Yes, you can change your plan at any time. If you upgrade, you'll be billed the prorated difference. If you downgrade, you'll receive credit toward your next billing cycle.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">How does the contract limit work?</h4>
                  <p className="text-slate-600">
                    The contract limit refers to the number of new contracts you can analyze per month. There is no limit to accessing or working with previously analyzed contracts.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Is there a setup fee?</h4>
                  <p className="text-slate-600">
                    No, we do not charge any setup fees on our standard plans. Enterprise plans may include custom onboarding services.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">What payment methods do you accept?</h4>
                  <p className="text-slate-600">
                    We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. Enterprise clients can also pay by invoice.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Do you offer discounts for non-profits?</h4>
                  <p className="text-slate-600">
                    Yes, we offer special pricing for non-profit organizations. Please contact our sales team for more information.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 