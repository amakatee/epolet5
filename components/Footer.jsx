// components/Footer.jsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PhoneIcon, MapPinIcon, EnvelopeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import Form from './Form';
import { client } from '../app/lib/sanity/client';

// Constants
const CONTACT_INFO = {
  phone: '+7(916)003-28-81',
  phoneLink: '+79160032881',
  email: 'partner@epolet5.ru',
  address: 'Московская Область, пгт. Шаховская, Волочановское шоссе дом 6А',
  mapUrl: 'https://yandex.ru/map-widget/v1/-/CCUFFKVwxC',
  workHours: 'Ежедневно с 9:00 до 21:00',
};

const SOCIAL_LINKS = [
  // Add your social media links here if needed
  // { name: 'WhatsApp', url: 'https://wa.me/79160032881', icon: 'whatsapp' },
  // { name: 'Telegram', url: 'https://t.me/epolet', icon: 'telegram' },
];

const Footer = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-black text-white">
      {/* Main Footer Content */}
      <div className="footer-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Map Section */}
          <div className="footer-map space-y-4">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={CONTACT_INFO.mapUrl}
                title="Карта расположения компании Эполет"
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                aria-label="Карта с местоположением компании"
              />
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-300">
              <MapPinIcon className="w-5 h-5 text-yellow-main flex-shrink-0 mt-0.5" />
              <span className="footer-map-address text-sm leading-relaxed">
                {CONTACT_INFO.address}
              </span>
            </div>
          </div>

          {/* Contact Section */}
          <div className="footer-contact space-y-6">
            <h2 className="text-2xl lg:text-3xl font-light tracking-wide text-yellow-main">
              Контакты
            </h2>
            
            <div className="space-y-4">
              {/* Phone */}
              <a
                href={`tel:${CONTACT_INFO.phoneLink}`}
                className="flex items-center gap-3 group hover:text-yellow-main transition-colors duration-300"
                aria-label="Позвонить нам"
              >
                <PhoneIcon className="w-5 h-5 text-yellow-main group-hover:scale-110 transition-transform" />
                <span className="text-base lg:text-lg">{CONTACT_INFO.phone}</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-3 group hover:text-yellow-main transition-colors duration-300"
                aria-label="Отправить email"
              >
                <EnvelopeIcon className="w-5 h-5 text-yellow-main group-hover:scale-110 transition-transform" />
                <span className="text-base lg:text-lg break-all">{CONTACT_INFO.email}</span>
              </a>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-yellow-main flex-shrink-0 mt-1" />
                <span className="text-sm lg:text-base text-gray-300 leading-relaxed">
                  {CONTACT_INFO.address}
                </span>
              </div>

              {/* Work Hours */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  <span className="text-yellow-main">Часы работы:</span> {CONTACT_INFO.workHours}
                </p>
              </div>
            </div>

            {/* Optional: Social Links */}
            {SOCIAL_LINKS.length > 0 && (
              <div className="flex gap-4 pt-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-main hover:text-black transition-all duration-300"
                    aria-label={social.name}
                  >
                    {/* Add your social icon here */}
                    <span className="sr-only">{social.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-cont bg-gradient-to-r from-yellow-500 to-yellow-600 mt-8">
        <Form />
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Эполет. Все права защищены.
            </p>
            <div className="flex gap-6 text-xs text-gray-400">
              <Link href="/privacy" className="hover:text-yellow-main transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="hover:text-yellow-main transition-colors">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;