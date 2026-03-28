// components/ProductIcon.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  details?: any;
  slug?: string;
  imageUrl?: string;
  coverImg?: {
    asset?: {
      url?: string;
      _ref?: string;
    };
  };
}

interface ProductIconProps {
  product: Product;
}

/**
 * Helper function to extract plain text from Portable Text
 */
const getPlainText = (text: any): string => {
  if (!text) return '';
  if (typeof text === 'string') return text;
  if (Array.isArray(text)) {
    return text
      .map(block => {
        if (block._type !== 'block' || !block.children) return '';
        return block.children.map((child: any) => child.text).join('');
      })
      .join(' ')
      .substring(0, 100);
  }
  return '';
};

/**
 * Product Icon Component
 */
const ProductIcon: React.FC<ProductIconProps> = ({ product }) => {
  const { name, details, slug, imageUrl, coverImg } = product;

  console.log('Rendering product:', { name, slug, imageUrl });

  if (!slug) {
    console.warn('Product missing slug:', product);
    return null;
  }

  const productUrl = `/product/${slug}`;
  
  // Get image URL (try multiple sources)
  const imgUrl = imageUrl || coverImg?.asset?.url || null;

  const plainDetails = getPlainText(details);
  const truncatedDetails = plainDetails.length > 60 
    ? `${plainDetails.substring(0, 60)}...` 
    : plainDetails;

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', imgUrl);
    const imgElement = e.currentTarget;
    imgElement.style.display = 'none';
    // Show fallback text
    const parent = imgElement.parentElement;
    if (parent) {
      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span class="text-gray-500 text-sm">Нет фото</span></div>';
    }
  };

  return (
    <Link href={productUrl} passHref legacyBehavior>
      <motion.a
        className="group block bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:transform hover:-translate-y-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Image Container */}
        <div className="w-full aspect-square overflow-hidden rounded-lg mb-4 bg-gray-800">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">Нет фото</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <h3 className="text-white text-lg font-medium mb-2 group-hover:text-yellow-main transition-colors line-clamp-1">
          {name || 'Без названия'}
        </h3>
        
        {truncatedDetails && (
          <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
            {truncatedDetails}
          </p>
        )}

        {/* Button */}
        <span className="mt-4 inline-block px-4 py-2 border border-yellow-main text-yellow-main rounded-lg text-sm hover:bg-yellow-main hover:text-black transition-all duration-300">
          Подробнее
        </span>
      </motion.a>
    </Link>
  );
};

export default ProductIcon;