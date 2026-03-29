// app/[slug]/page.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { client, urlFor } from '@/lib/sanity/client';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useCartContext } from '@/context/StateContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProductDetails() {
    const params = useParams();
    const slug = params?.slug;

    const { show, index, setIndex, closeImg, openImg } = useCartContext();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const infoRef = useRef(null);
    const isLightTheme = slug === 'integralnyi-ppu-light';

    // Fetch product
    useEffect(() => {
        if (!slug) {
            setError('Товар не найден');
            setLoading(false);
            return;
        }

        async function fetchProduct() {
            try {
                setLoading(true);
                const data = await client.fetch(
                    `*[_type == "product" && slug.current == $slug][0] {
                        name,
                        details,
                        specifications,
                        features,
                        image[] { ... },
                        slug
                    }`,
                    { slug }
                );

                if (!data) {
                    setError('Товар не найден');
                } else {
                    setProduct(data);
                    document.title = `${data.name} — Эполет`;
                }
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [slug]);

    // GSAP Animations
    useEffect(() => {
        if (loading || !product || !infoRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(infoRef.current, 
                { opacity: 0, y: 50 }, 
                { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }
            );

            gsap.fromTo(".feature-item", 
                { opacity: 0, x: -30 }, 
                { opacity: 1, x: 0, stagger: 0.08, duration: 0.7, ease: "power2.out", delay: 0.3 }
            );
        }, infoRef);

        return () => ctx.revert();
    }, [product, loading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-t-transparent border-primary-yellow animate-spin" />
                    <p className="text-xl text-white">Загрузка товара...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="max-w-md px-6 text-center">
                    <p className="mb-4 text-2xl text-red-500">Товар не найден</p>
                    <a href="/katalog" className="inline-block px-8 py-3 font-medium text-black bg-primary-yellow rounded-xl">
                        Вернуться в каталог
                    </a>
                </div>
            </div>
        );
    }

    const { name, details, specifications, features, image = [] } = product;
    const images = Array.isArray(image) ? image : [];
    const currentImage = images[index];

    const tapForward = () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    const tapBack = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    return (
        <div className={`min-h-screen ${isLightTheme ? 'bg-gray-50' : 'bg-gradient-to-b from-gray-900 to-black'}`}>
            <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:py-16">
                {/* Back Link */}
                <a href="/katalog" className="inline-flex items-center gap-2 mb-8 text-sm text-gray-400 transition-colors hover:text-white">
                    ← Назад в каталог
                </a>

                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* ==================== IMAGE GALLERY ==================== */}
                    <div>
                        <div className="mb-4">
                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium ${isLightTheme ? 'bg-gray-200 text-gray-700' : 'bg-white/10 text-gray-300'}`}>
                                <CheckCircle className="w-3 h-3" />
                                {isLightTheme ? 'Светлая серия' : 'Основная серия'}
                            </span>
                        </div>

                        {/* Responsive Grid: Mobile = 1 column, Desktop = up to 4 columns */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {images.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => openImg(i)}
                                    className="relative overflow-hidden transition-all duration-300 border cursor-pointer group aspect-square rounded-2xl bg-black/30 border-white/10 hover:border-primary-yellow/50"
                                >
                                    <Image
                                        src={urlFor(img).url()}
                                        alt={`${name} - фото ${i + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 transition-colors bg-black/30 group-hover:bg-black/10" />
                                </div>
                            ))}
                        </div>

                        {images.length === 0 && (
                            <p className="py-12 text-center text-gray-500">Нет изображений для этого товара</p>
                        )}
                    </div>

                    {/* ==================== PRODUCT INFORMATION ==================== */}
                    <div ref={infoRef} className={`space-y-8 ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                        <div>
                            <h1 className="mb-6 text-4xl font-light tracking-tight md:text-5xl">{name}</h1>

                            {specifications && Object.keys(specifications).length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(specifications).slice(0, 4).map(([key, value]) => (
                                        <span key={key} className="px-4 py-1.5 text-xs rounded-full bg-primary-yellow/10 text-primary-yellow border border-primary-yellow/20">
                                            {value}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {details && (
                            <div className="prose prose-invert max-w-none text-[15px] leading-relaxed">
                                <PortableText value={details} />
                            </div>
                        )}

                        {/* Features */}
                        {features?.length > 0 && (
                            <div className={`p-7 rounded-3xl ${isLightTheme ? 'bg-gray-100' : 'bg-white/5'} border ${isLightTheme ? 'border-gray-200' : 'border-gray-700'}`}>
                                <h3 className="mb-5 text-xl font-semibold">Ключевые особенности</h3>
                                <ul className="space-y-4">
                                    {features.map((feature, idx) => (
                                        <li key={idx} className="feature-item flex gap-4 text-[15px]">
                                            <CheckCircle className="w-6 h-6 text-primary-yellow mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Specifications Table */}
                        {specifications && Object.keys(specifications).length > 0 && (
                            <div className={`rounded-3xl overflow-hidden border ${isLightTheme ? 'border-gray-200' : 'border-gray-700'}`}>
                                <div className={`p-6 ${isLightTheme ? 'bg-gray-100' : 'bg-white/5'}`}>
                                    <h3 className="text-xl font-semibold">Технические характеристики</h3>
                                </div>
                                <div className="divide-y divide-gray-700">
                                    {Object.entries(specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between p-6 text-sm">
                                            <span className={isLightTheme ? 'text-gray-600' : 'text-gray-400'}>{key}</span>
                                            <span className="font-medium text-right">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <a
                            href="#contact"
                            className="block w-full py-4 text-center font-semibold text-black bg-primary-yellow rounded-2xl hover:bg-yellow-400 transition-all hover:scale-[1.02]"
                        >
                            Получить консультацию
                        </a>
                    </div>
                </div>
            </div>

            {/* ==================== IMAGE LIGHTBOX / SLIDER ==================== */}
            <AnimatePresence>
                {show && images.length > 0 && currentImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
                        onClick={closeImg}
                    >
                        <button
                            onClick={closeImg}
                            className="absolute z-10 p-3 transition-colors rounded-full top-6 right-6 bg-white/10 hover:bg-white/20"
                        >
                            <X className="text-white w-7 h-7" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); tapBack(); }}
                            className="absolute p-4 transition-colors -translate-y-1/2 rounded-full left-6 top-1/2 bg-white/10 hover:bg-white/20"
                        >
                            <ChevronLeft className="w-8 h-8 text-white" />
                        </button>

                        <div className="relative w-full max-w-5xl px-4" onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={urlFor(currentImage).url()}
                                alt={name}
                                width={1200}
                                height={800}
                                className="max-h-[88vh] w-auto mx-auto object-contain rounded-2xl"
                                priority
                            />
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); tapForward(); }}
                            className="absolute p-4 transition-colors -translate-y-1/2 rounded-full right-6 top-1/2 bg-white/10 hover:bg-white/20"
                        >
                            <ChevronRight className="w-8 h-8 text-white" />
                        </button>

                        {/* Image counter */}
                        <div className="absolute text-sm -translate-x-1/2 bottom-8 left-1/2 text-white/70">
                            {index + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}