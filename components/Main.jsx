// components/Main.jsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Main Hero Component
 * @param {Object} props
 * @param {Object} props.mainBanner - Banner data from Sanity
 */
const Main = ({ mainBanner }) => {
  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const imageVariants = {
    animate: {
      scale: 1.1,
      transition: {
        duration: 7,
        repeat: Infinity,
        repeatDelay: 0.3,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }
  };

  // Debug: Log the banner data to see what's coming in
  console.log('Main component - mainBanner:', mainBanner);
  console.log('Main component - imageUrl:', mainBanner?.imageUrl);
  console.log('Main component - image field:', mainBanner?.image);

  // Try multiple ways to get the image URL
  let imageUrl = null;
  
  if (mainBanner) {
    // Method 1: Direct imageUrl from query
    if (mainBanner.imageUrl) {
      imageUrl = mainBanner.imageUrl;
      console.log('Using imageUrl:', imageUrl);
    }
    // Method 2: Nested image.asset.url
    else if (mainBanner.image?.asset?.url) {
      imageUrl = mainBanner.image.asset.url;
      console.log('Using image.asset.url:', imageUrl);
    }
    // Method 3: Direct image string
    else if (typeof mainBanner.image === 'string') {
      imageUrl = mainBanner.image;
      console.log('Using string image:', imageUrl);
    }
    // Method 4: Check if image is an object with url
    else if (mainBanner.image?.url) {
      imageUrl = mainBanner.image.url;
      console.log('Using image.url:', imageUrl);
    }
  }

  // Default title and subtitle if not provided
  const title = mainBanner?.title || 'Качественные изделия из ППУ';
  const subtitle = mainBanner?.subtitle || 'Производство изделий из мягкого, жесткого и интегрального пенополиуретана';

  return (
    <div className="main-page relative w-full h-screen overflow-hidden" id="main">
      {/* Background Image with Animation */}
      {imageUrl ? (
        <div className="image-container-div absolute inset-0">
          <motion.img
            variants={imageVariants}
            animate="animate"
            className="main-image-cont w-full h-full object-cover"
            src={imageUrl}
            alt={title}
            priority
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              e.target.style.display = 'none';
            }}
          />
          <div className="main-img-overlay absolute inset-0 bg-black/50 z-10" />
        </div>
      ) : (
        // Fallback gradient background when no image
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-main/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-main/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-main/5 rounded-full blur-3xl" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-white leading-tight max-w-4xl mx-auto"
        >
          {title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-yellow-main text-base sm:text-lg md:text-xl mt-4 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <a
            href="#katalog"
            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-yellow-main text-black rounded-lg font-medium text-sm sm:text-base hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Смотреть продукцию
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/60 text-xs hidden sm:block">Прокрутите вниз</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white/60 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Main;