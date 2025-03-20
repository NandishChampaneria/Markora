'use client';

import React from 'react';
import { motion } from 'framer-motion';
import LogoIcon from '../../components/LogoIcon';

const Terms = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-16 max-w-4xl pt-40"
    >
      <div className="flex items-center justify-center mb-8">
        <LogoIcon />
      </div>
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Terms of Service
      </h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-300 mb-4">
            By accessing and using Markora, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
          <p className="text-gray-300 mb-4">
            Markora provides an invisible watermarking service for images. You agree to use this service only for lawful purposes and in accordance with these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
          <p className="text-gray-300 mb-4">
            You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p className="text-gray-300 mb-4">
            The service and its original content, features, and functionality are owned by Markora and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
          <p className="text-gray-300 mb-4">
            Markora shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
          <p className="text-gray-300 mb-4">
            We reserve the right to modify or replace these terms at any time. We will provide notice of any changes by posting the new terms on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
          <p className="text-gray-300">
            If you have any questions about these Terms of Service, please contact us at support@markora.com
          </p>
        </section>
      </div>
    </motion.div>
  );
};

export default Terms; 