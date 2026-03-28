// components/AboutUs.jsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaAnchor } from 'react-icons/fa';
import { AiOutlineCopyrightCircle } from 'react-icons/ai';
import { HiLightBulb } from 'react-icons/hi';

const AboutUs = ({ aboutBanner }) => {
  const router = useRouter();

  // Default content if no banner data
  const mainDetails = aboutBanner?.maindetails || 'Компания Эполет специализируется на производстве изделий из мягкого, жесткого и интегрального пенополиуретана. Мы предлагаем высококачественную продукцию для различных отраслей промышленности и бытового использования.';
  const buttonText = aboutBanner?.aboutsection || 'Подробнее о компании';

  // Features array with icons
  const features = [
    { 
      icon: FaAnchor, 
      title: aboutBanner?.aboutArray?.[0]?.description || 'Гибкое ценообразование',
      description: 'Индивидуальный подход к каждому клиенту'
    },
    { 
      icon: AiOutlineCopyrightCircle, 
      title: aboutBanner?.aboutArray?.[1]?.description || 'Изготовление изделий любой сложности',
      description: 'Современное оборудование и опытные специалисты'
    },
    { 
      icon: HiLightBulb, 
      title: aboutBanner?.aboutArray?.[2]?.description || 'Гарантия качества 20 лет',
      description: 'Надежность, проверенная временем'
    }
  ];

  return (
    <section id="about" className="about-section relative w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          {/* Logo Section */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-main-dark leading-tight">
              Компания <br />
              <span className="font-bold text-white">Эполет</span>
            </h1>
            <div className="w-20 h-1 bg-white mx-auto lg:mx-0 mt-4 rounded-full" />
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex-1 text-center lg:text-left"
          >
            <p className="text-main-dark text-base sm:text-lg leading-relaxed mb-6">
              {mainDetails}
            </p>
            
            <button
              onClick={() => router.push('/about')}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-main-dark text-white rounded-lg font-medium text-sm sm:text-base hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              {buttonText}
            </button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-12 md:mt-16"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/95 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                  <IconComponent size={32} className="text-yellow-600" />
                </div>
                <h3 className="text-main-dark font-semibold text-base sm:text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-main-dark/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;