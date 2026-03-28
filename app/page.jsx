// app/page.jsx
import { Suspense } from 'react';
import { client } from '../app/lib/sanity/client';
import Main from '@/components/Main';
import AboutUs from '@/components/AboutUs';
import ProductIcon from '@/components/ProductIcon';
import LoadingSpinner from '@/components/LoadingSpinner';

/**
 * Home Page - Server Component
 */
export default async function Home() {
  try {
    // Fetch both banner and products in parallel
    const [bannerData, products] = await Promise.all([
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

    // Debug logs
    console.log('✅ Banner data:', bannerData?.title);
    console.log('📸 Products count:', products?.length);
    console.log('📦 First product:', products?.[0]);

    return (
      <>
        {/* Hero Section */}
        <section className="main-section relative w-full min-h-screen overflow-hidden bg-black">
          <Main mainBanner={bannerData} />
        </section>

        {/* About Section */}
        <div className="about-section relative w-full">
          <AboutUs aboutBanner={bannerData} />
        </div>

        {/* Products Section */}
        <section className="relative w-full bg-black py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
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

            {/* Products Grid */}
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
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center px-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-white text-2xl font-light mb-2">Ошибка загрузки данных</h1>
          <p className="text-white/60 mb-6">Не удалось загрузить информацию. Пожалуйста, попробуйте позже.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-yellow-main text-black rounded-lg hover:bg-yellow-600 transition"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }
}