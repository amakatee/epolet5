// components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  PhoneIcon, 
  MapPinIcon, 
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Constants
const CONTACT_INFO = {
  phone: '+7(916)003-28-81',
  phoneLink: '+79160032881',
  address: 'Московская Область, пгт. Шаховская, Волочановское шоссе дом 6А',
  addressShort: 'Шаховская',
  email: 'partner@epolet5.ru',
};

const NAVIGATION_ITEMS = [
  { name: 'Каталог', path: '/katalog' },
  { name: 'О Компании', path: '/about' },
  { name: 'Контакты', path: '/contact' },
];

// Animation variants
const menuVariants = {
  closed: {
    x: '100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  open: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};

const navItemVariants = {
  closed: { opacity: 0, x: 50 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3 }
  })
};

interface NavbarProps {
  offsetY?: number[];
  scrollY?: any;
}

const Navbar: React.FC<NavbarProps> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(true);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsContactVisible(window.scrollY < 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  const isActiveRoute = (path: string) => pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-lg' 
          : 'bg-black/70 backdrop-blur-sm'
      }`}
      aria-label="Главная навигация"
    >
      {/* Top Contact Bar - Desktop & Tablet */}
      <AnimatePresence>
        {isContactVisible && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:flex justify-between items-center px-6 xl:px-20 py-2 border-b border-white/10 text-xs font-light tracking-wide bg-black/50"
          >
            <div className="flex items-center gap-4 xl:gap-6">
              <a
                href={`tel:${CONTACT_INFO.phoneLink}`}
                className="flex items-center gap-2 hover:text-yellow-main transition-colors group"
                aria-label="Позвонить нам"
              >
                <PhoneIcon className="w-4 h-4 text-yellow-main group-hover:scale-110 transition-transform" />
                <span>{CONTACT_INFO.phone}</span>
              </a>
              <div className="flex items-center gap-2 group">
                <MapPinIcon className="w-4 h-4 text-yellow-main flex-shrink-0" />
                <span className="hidden xl:inline">{CONTACT_INFO.address}</span>
                <span className="xl:hidden text-xs">{CONTACT_INFO.addressShort}</span>
              </div>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2 hover:text-yellow-main transition-colors group"
                aria-label="Отправить email"
              >
                <EnvelopeIcon className="w-4 h-4 text-yellow-main group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">{CONTACT_INFO.email}</span>
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-xs">Работаем 24/7</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 h-16 lg:h-20">
        {/* Logo */}
        <motion.div
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="На главную"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleNavigation('/')}
        >
          <motion.img
            className="w-8 sm:w-10 lg:w-12 transition-all duration-300 group-hover:scale-110"
            src="/ep.png"
            alt="Эполет логотип"
            whileHover={{ rotate: 5 }}
          />
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-light tracking-wide uppercase leading-tight">
              Эполет
            </h3>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
          {NAVIGATION_ITEMS.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`relative text-sm lg:text-base font-light tracking-wider uppercase transition-all duration-300 px-2 py-1 ${
                isActiveRoute(item.path)
                  ? 'text-yellow-main'
                  : 'hover:text-yellow-main'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.name}
              {isActiveRoute(item.path) && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-main"
                  layoutId="activeNav"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Quick Contact - Tablet */}
        <div className="hidden sm:flex md:hidden items-center gap-3">
          <a
            href={`tel:${CONTACT_INFO.phoneLink}`}
            className="flex items-center gap-1 text-xs hover:text-yellow-main transition-colors"
            aria-label="Позвонить"
          >
            <PhoneIcon className="w-4 h-4 text-yellow-main" />
            <span>{CONTACT_INFO.phone}</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMenuOpen}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? (
            <XMarkIcon className="w-6 h-6 text-white" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-40 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="flex flex-col h-full pt-20 pb-8 px-6">
              {/* Navigation Items */}
              <div className="flex-1">
                {NAVIGATION_ITEMS.map((item, index) => (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full text-left py-4 text-2xl font-light tracking-wider uppercase border-b border-white/10 ${
                      isActiveRoute(item.path)
                        ? 'text-yellow-main'
                        : 'hover:text-yellow-main'
                    }`}
                    custom={index}
                    variants={navItemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>

              {/* Mobile Contact Section */}
              <motion.div
                className="pt-6 border-t border-white/20 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <a
                  href={`tel:${CONTACT_INFO.phoneLink}`}
                  className="flex items-center gap-3 py-2 hover:text-yellow-main transition-colors"
                >
                  <PhoneIcon className="text-yellow-main w-5 h-5" />
                  <div>
                    <p className="text-xs text-white/60">Телефон</p>
                    <p className="text-sm font-medium">{CONTACT_INFO.phone}</p>
                  </div>
                </a>
                
                <div className="flex items-start gap-3 py-2">
                  <MapPinIcon className="text-yellow-main w-5 h-5 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-white/60">Адрес</p>
                    <p className="text-sm">{CONTACT_INFO.address}</p>
                  </div>
                </div>
                
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-3 py-2 hover:text-yellow-main transition-colors"
                >
                  <EnvelopeIcon className="text-yellow-main w-5 h-5" />
                  <div>
                    <p className="text-xs text-white/60">Email</p>
                    <p className="text-sm">{CONTACT_INFO.email}</p>
                  </div>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;