'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { MdOutlineWaterDrop, MdOutlineSubdirectoryArrowRight, MdOutlineUploadFile, MdOutlineSearch, MdOutlineShield, MdOutlineSpeed, MdOutlineEmail, MdOutlinePerson, MdOutlineMessage } from "react-icons/md";
import { TbHandClick } from "react-icons/tb";
import emailjs from '@emailjs/browser';
import { PulseLoader } from 'react-spinners';
import Logo from '../../components/Logo';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    imageCount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  // Refs for intersection observer
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const contactRef = useRef(null);
  const footerRef = useRef(null);

  // In view states
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const contactInView = useInView(contactRef, { once: true, margin: "-100px" });
  const footerInView = useInView(footerRef, { once: true, margin: "-100px" });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      await emailjs.send(
        'service_zgdv9y3', // Replace with your EmailJS service ID
        'template_n94rioh', // Replace with your contact template ID
        {
          from_name: contactForm.name,
          from_email: contactForm.email,
          company: contactForm.company,
          image_count: contactForm.imageCount,
          message: contactForm.message,
          to_email: 'nandishladdu7@gmail.com' // Replace with your email
        },
        'XgUHv45g2kyc1WgOu' // Replace with your EmailJS public key
      );

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your interest! We\'ll get back to you within 24 hours with pricing and next steps.'
      });
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        company: '',
        message: '',
        imageCount: ''
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again later.';
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full">
      <div 
        className="fixed inset-0 w-full h-full bg-black"
        style={{
          backgroundImage: 'url("/images/bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1
        }}
      />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-16">
        {/* Hero Section */}
        <motion.div 
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="flex justify-center mb-8">
            <Logo className="scale-200" />
          </div>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed font-light">
            Professional invisible watermarking service to protect your digital assets.
            <br />
            <span className="text-2xl mt-2 text-indigo-400 font-bold block">
              Contact us for custom watermarking solutions
            </span>
          </p>
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8">
            <p className="text-yellow-400 font-medium">
              ⚠️ Our automated services are temporarily unavailable. Please contact us directly for watermarking requests.
            </p>
          </div>
          
          {/* Quick CTA */}
          <motion.div
            variants={fadeInUp}
            className="mb-16"
          >
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl shadow-lg shadow-indigo-500/20 tracking-wide"
            >
              Get Quote
              <MdOutlineSubdirectoryArrowRight className="ml-2 w-6 h-6 transition-transform duration-500 ease-in-out group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          ref={featuresRef}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className="mt-32"
        >
          <motion.div 
            variants={fadeInUp}
            className="text-center items-center flex flex-col mb-16"
          >
            <MdOutlineShield className="text-indigo-500 items-center text-2xl mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-display tracking-tight">
              Why Choose Markora?
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Advanced watermarking technology for complete content protection
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div 
              variants={fadeInUp}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-indigo-500/50 transition-all duration-300"
            >
              <MdOutlineShield className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Invisible Protection</h3>
              <p className="text-gray-400 mb-4 font-light">Embed watermarks that are completely invisible to the naked eye while maintaining image quality.</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
            >
              <MdOutlineSpeed className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Fast Processing</h3>
              <p className="text-gray-400 mb-4 font-light">Quick turnaround time for all your watermarking needs, from single images to bulk processing.</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-pink-500/50 transition-all duration-300"
            >
              <MdOutlineSearch className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Detection Proof</h3>
              <p className="text-gray-400 mb-4 font-light">Our watermarks are resistant to common image editing and compression techniques.</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-indigo-500/50 transition-all duration-300"
            >
              <MdOutlineUploadFile className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Batch Processing</h3>
              <p className="text-gray-400 mb-4 font-light">Handle multiple images efficiently with our bulk watermarking service.</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div 
          ref={howItWorksRef}
          initial="hidden"
          animate={howItWorksInView ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className="mt-32"
        >
          <motion.div 
            variants={fadeInUp}
            className="text-center items-center flex flex-col mb-16"
          >
            <TbHandClick className="text-indigo-500 items-center text-2xl mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-display tracking-tight">
              How Our Service Works
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Simple process to protect your digital content
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <motion.div 
              variants={fadeInLeft}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 relative overflow-hidden group text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <span className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold mb-6 mx-auto">
                  1
                </span>
                <h3 className="text-2xl font-semibold text-white mb-4 font-display">Contact Us</h3>
                <p className="text-gray-400 font-light">
                  Fill out our contact form with your requirements including the number of images and any specific needs.
                </p>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 relative overflow-hidden group text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <span className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold mb-6 mx-auto">
                  2
                </span>
                <h3 className="text-2xl font-semibold text-white mb-4 font-display">Send Images</h3>
                <p className="text-gray-400 font-light">
                  Securely send us your images via email or cloud storage link. We'll process them with your custom watermark.
                </p>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeInRight}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 relative overflow-hidden group text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <span className="w-12 h-12 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold mb-6 mx-auto">
                  3
                </span>
                <h3 className="text-2xl font-semibold text-white mb-4 font-display">Receive Protected Files</h3>
                <p className="text-gray-400 font-light">
                  Get your watermarked images back within 24-48 hours, fully protected and ready to use.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          id="contact"
          ref={contactRef}
          initial="hidden"
          animate={contactInView ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className="mt-32"
        >
          <motion.div 
            variants={fadeInUp}
            className="text-center items-center flex flex-col mb-16"
          >
            <MdOutlineEmail className="text-indigo-500 items-center text-2xl mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-display tracking-tight">
              Get Started Today
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Contact us for custom watermarking solutions tailored to your needs
            </p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <MdOutlinePerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={contactForm.company}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="imageCount" className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Images *
                    </label>
                    <select
                      id="imageCount"
                      name="imageCount"
                      value={contactForm.imageCount}
                      onChange={handleContactChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select range</option>
                      <option value="1-10">1-10 images</option>
                      <option value="11-50">11-50 images</option>
                      <option value="51-100">51-100 images</option>
                      <option value="100+">100+ images</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Project Details *
                  </label>
                  <div className="relative">
                    <MdOutlineMessage className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      required
                      rows={4}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell us about your project, watermark requirements, timeline, and any specific needs..."
                    />
                  </div>
                </div>

                {submitStatus.message && (
                  <div className={`p-4 rounded-xl ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="font-semibold flex items-center justify-center">
                      <PulseLoader size={10} color="#FFFFFF" className="mr-2" />
                      Sending...
                    </span>
                  ) : (
                    <span className="font-semibold">Send Message & Get Quote</span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        ref={footerRef}
        initial="hidden"
        animate={footerInView ? "visible" : "hidden"}
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="relative mt-32 border-t border-gray-800/30"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <h3 className="text-xl font-bold text-white font-display">Markora</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed max-w-md">
                Professional invisible watermarking service for protecting your digital assets. Contact us for custom solutions.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-medium mb-3 font-display text-sm uppercase tracking-wider">Services</h4>
                <ul className="space-y-2">
                  <li><span className="text-gray-400 text-sm font-light">Image Watermarking</span></li>
                  <li><span className="text-gray-400 text-sm font-light">Batch Processing</span></li>
                  <li><span className="text-gray-400 text-sm font-light">Custom Solutions</span></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-3 font-display text-sm uppercase tracking-wider">Company</h4>
                <ul className="space-y-2">
                  <li><Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm font-light">Privacy Policy</Link></li>
                  <li><Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm font-light">Terms</Link></li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
          <motion.div 
            variants={fadeInUp}
            className="mt-12 pt-8 border-t border-gray-800/30 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-gray-400 text-sm font-light">
              © {new Date().getFullYear()} Markora - All Rights Reserved
            </p>

          </motion.div>
        </div>
      </motion.footer>
    </main>
  );
} 