'use client';

import React from 'react';
import { motion } from 'framer-motion';
import LogoIcon from '../../components/LogoIcon';
import BackgroundDots from '../../components/BackgroundDots';

const Privacy = () => {
  return (
    <div className="min-h-screen w-full bg-black relative">
      <BackgroundDots 
        dotColor="#6366F1"
        backgroundColor="transparent"
        dotSize={1}
        gap={20}
        fade={true}
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="container mx-auto px-4 py-16 max-w-4xl relative z-10"
      >
        <div className="flex items-center justify-center mb-8">
          <LogoIcon />
        </div>
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 mb-4">
              We collect information that you provide directly to us, including when you create an account, use our service, or communicate with us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We use the information we collect to provide, maintain, and improve our service, to communicate with you, and to protect our rights and interests.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="text-gray-300 mb-4">
              We do not sell or share your personal information with third parties except as described in this privacy policy or with your consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p className="text-gray-300 mb-4">
              You have the right to access, correct, or delete your personal information. You may also have the right to restrict or object to certain processing of your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
            <p className="text-gray-300 mb-4">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Changes to Privacy Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at privacy@markora.com
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy; 