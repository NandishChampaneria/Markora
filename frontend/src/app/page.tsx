'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { MdOutlineSubdirectoryArrowRight, MdOutlineUploadFile, MdOutlineTextFields, MdOutlineDownload, MdOutlineSearch, MdOutlineAnalytics, MdOutlineCheckCircle, MdKeyboardArrowDown, MdOutlineModeComment } from 'react-icons/md';
import { TbHandClick } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import TextFlip from '../components/TextFlip';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  // Refs for each section
  const heroRef = useRef(null);
  const stepsRef = useRef(null);
  const faqRef = useRef(null);
  const testimonialsRef = useRef(null);
  const footerRef = useRef(null);

  // State for FAQ items
  const [openFaqItems, setOpenFaqItems] = useState([false, false, false, false]);

  // FAQ data
  const faqItems = [
    {
      question: "What is an invisible watermark?",
      answer: "An invisible watermark is a digital signature embedded in a file that's imperceptible to the human eye but can be detected using specialized software. It helps protect your intellectual property without compromising the quality."
    },
    {
      question: "How does the watermarking process work?",
      answer: "Our AI-powered system analyzes your file and embeds the watermark text in a way that's invisible to the human eye. The process preserves file quality while ensuring the watermark can be detected later."
    },
    {
      question: "Can watermarks be removed?",
      answer: "While no protection is 100% foolproof, our invisible watermarks are designed to be robust against common manipulation attempts. The watermark is embedded in a way that makes it difficult to remove without significantly degrading the image quality."
    },
    {
      question: "What file formats are supported?",
      answer: "We currently support common file formats including JPG, PNG, and WebP (more to come soon). The maximum file size is 10MB per file."
    }
  ];

  const testimonials = [
    {
      name: "Jane Doe",
      image: "https://ui-avatars.com/api/?name=Jane+Doe&background=random",
      occupation: "Professional Photographer",
      review: "The invisible watermarking system has been a game-changer for my photography business. It's seamless, reliable, and gives me peace of mind knowing my work is protected."
    },
    {
      name: "John Smith",
      image: "https://ui-avatars.com/api/?name=John+Smith&background=random",
      occupation: "Content Creator",
      review: "I've been using Markora for my YouTube videos, and it's a game-changer. The watermark is invisible, so it doesn't affect the video's quality, but it's still easy to detect if someone tries to steal my content."
    },
    {
      name: "Sarah Chen",
      image: "https://ui-avatars.com/api/?name=Sarah+Chen&background=random",
      occupation: "Graphic Designer",
      review: "Markora has made it easy to protect my designs. The watermark is invisible, so it doesn't affect the design's quality, but it's still easy to detect if someone tries to steal my work."
    },
  ];

  // Viewport detection
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const stepsInView = useInView(stepsRef, { once: true, margin: "-100px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-50px" });
  const footerInView = useInView(footerRef, { once: true, margin: "-100px" });

  // Function to toggle FAQ item
  const toggleFaqItem = (index: number) => {
    setOpenFaqItems(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
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
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 bg-gradient-to-r to-indigo-500 via-purple-500 from-pink-500 text-transparent bg-clip-text font-display tracking-tight">
            Invisible Watermark
          </h1>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed font-light">
            Protect your digital assets with invisible watermarks.
            <br />
            <TextFlip 
              texts={["Embed", "Detect "]}
              interval={3000}
              className="text-4xl mt-1.5 text-indigo-400 font-bold"
            />
            <br />
            watermarks without compromising file quality.
          </p>
          
          {/* Feature Cards */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <motion.div 
              variants={fadeInUp}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-indigo-500/50 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Embed</h3>
              <p className="text-gray-400 mb-4 font-light">Upload and watermark individual files with custom text.</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Batch Process</h3>
              <p className="text-gray-400 mb-4 font-light">Process multiple files at once with the same watermark.</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-pink-500/50 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Detect</h3>
              <p className="text-gray-400 mb-4 font-light">Check if a file contains a watermark and extract it.</p>
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            variants={fadeInUp}
          >
            <Link
              href="/upload"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl shadow-lg shadow-indigo-500/20 tracking-wide"
            >
              Get Started
              <MdOutlineSubdirectoryArrowRight className="ml-2 w-6 h-6 transition-transform duration-500 ease-in-out group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Steps Section */}
        <motion.div 
          ref={stepsRef}
          initial="hidden"
          animate={stepsInView ? "visible" : "hidden"}
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
              How It Works
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Simple steps to protect your digital content
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Embedding Process */}
            <motion.div 
              variants={fadeInLeft}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3 font-display">
                  <span className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </span>
                  Embedding Process
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MdOutlineUploadFile className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1 font-display">Upload File</h4>
                      <p className="text-gray-400 font-light">Select your file to add a watermark</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MdOutlineTextFields className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1 font-display">Enter Watermark Text</h4>
                      <p className="text-gray-400 font-light">Add your custom watermark text</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MdOutlineDownload className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1 font-display">Download Protected File</h4>
                      <p className="text-gray-400 font-light">Get your watermarked file instantly</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Detection Process */}
            <motion.div 
              variants={fadeInRight}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3 font-display">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </span>
                  Detection Process
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MdOutlineSearch className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1 font-display">Upload File</h4>
                      <p className="text-gray-400 font-light">Select the file to check for watermarks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MdOutlineAnalytics className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1 font-display">AI Analysis</h4>
                      <p className="text-gray-400 font-light">Our AI analyzes the file for watermarks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MdOutlineCheckCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1 font-display">View Results</h4>
                      <p className="text-gray-400 font-light">See if the file contains a watermark</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          ref={faqRef}
          initial="hidden"
          animate={faqInView ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className="mt-32"
        >
          <motion.div 
            variants={fadeInUp}
            className="text-center items-center flex flex-col mb-16"
          >
            <MdOutlineModeComment className="text-indigo-500 items-center text-2xl mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-display tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Everything you need to know about our service
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-4"
          >
            {faqItems.map((faq, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaqItem(index)}
                  className="w-full cursor-pointer p-6 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <h3 className="text-xl font-semibold text-white font-display">{faq.question}</h3>
                  <MdKeyboardArrowDown 
                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ease-in-out ${
                      openFaqItems[index] ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaqItems[index] ? "auto" : 0,
                    opacity: openFaqItems[index] ? 1 : 0,
                  }}
                  transition={{
                    height: { duration: 0.3, ease: "easeInOut" },
                    opacity: { duration: 0.2, ease: "easeInOut" }
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-4 border-t border-gray-800">
                    <p className="text-gray-400 font-light">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          ref={testimonialsRef}
          initial="hidden"
          animate={testimonialsInView ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className="mt-32"
        >
          <motion.div 
            variants={fadeInUp}
            className="text-center items-center flex flex-col mb-16"
          >
            <FiUsers className="text-indigo-500 items-center text-2xl mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-display tracking-tight">
              What Our Users Say
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Trusted by photographers and content creators worldwide
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                variants={fadeInUp}
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-indigo-500"
                    />
                    <div className="ml-4">
                      <h4 className="text-white font-medium font-display">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.occupation}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 font-light leading-relaxed">
                    "{testimonial.review}"
                  </p>
                  <div className="mt-6 flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
                Advanced AI-powered watermarking technology for protecting your digital assets.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-medium mb-3 font-display text-sm uppercase tracking-wider">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="/upload" className="text-gray-400 hover:text-white transition-colors text-sm font-light">Embed</Link></li>
                  <li><Link href="/detect" className="text-gray-400 hover:text-white transition-colors text-sm font-light">Detect</Link></li>
                  <li><Link href="/batch" className="text-gray-400 hover:text-white transition-colors text-sm font-light">Batch Process</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-3 font-display text-sm uppercase tracking-wider">Company</h4>
                <ul className="space-y-2">
                  <li><Link href="/plan" className="text-gray-400 hover:text-white transition-colors text-sm font-light">Pricing</Link></li>
                  <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm font-light">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm font-light">Terms</Link></li>
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
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light opacity-75 hover:opacity-100">Twitter</a>
              <span className="text-gray-400/30">·</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light opacity-75 hover:opacity-100">GitHub</a>
              <span className="text-gray-400/30">·</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light opacity-75 hover:opacity-100">Instagram</a>
            </div>
          </motion.div>
    </div>
      </motion.footer>
    </main>
  );
}
