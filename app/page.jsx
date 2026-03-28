// app/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { client } from '../app/lib/sanity/client';
import Main from '@/components/Main';
import AboutUs from '@/components/AboutUs';
import ProductIcon from '@/components/ProductIcon';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [bannerData, setBannerData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [fetchedBanner, fetchedProducts] = await Promise.all([
          client.fetch(`
            *[_type == "banner"][0] {
              title,
              subtitle,
              maindetails,
              aboutsection,
              "imageUrl": image.asset->url,
              aboutArray[] {
                title,
                description
              }
            }
          `),
          client.fetch(`
            *[_type == "product"] | order(_createdAt desc)[0...8] {
              _id,
              name,
              details,
              "slug": slug.current,
              "imageUrl": coverImg.asset->url,
              coverImg
            }
          `)
        ]);
        
        setBannerData(fetchedBanner);
        setProducts(fetchedProducts || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-yellow-main text-black rounded-lg"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="main-section relative w-full min-h-screen overflow-hidden bg-black">
        <Main mainBanner={bannerData} />
      </section>

      <div className="about-section relative w-full">
        <AboutUs aboutBanner={bannerData} />
      </div>

      <section className="relative w-full bg-black py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-yellow-main mb-6">
              Наша продукция
            </h2>
            <a
              href="/katalog"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-yellow-main text-black rounded-lg font-medium text-sm sm:text-base hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Перейти в каталог
            </a>
          </div>

          {!products || products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">Нет доступных товаров</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductIcon key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}