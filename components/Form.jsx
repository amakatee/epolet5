// components/Form.jsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserIcon, EnvelopeIcon, PhoneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Validation patterns
const VALIDATION = {
  name: {
    required: 'Имя обязательно для заполнения',
    minLength: { value: 2, message: 'Имя должно содержать минимум 2 символа' },
    maxLength: { value: 50, message: 'Имя не должно превышать 50 символов' },
    pattern: { value: /^[А-Яа-яA-Za-z\s-]+$/, message: 'Имя может содержать только буквы, пробелы и дефисы' }
  },
  email: {
    required: 'Email обязателен для заполнения',
    pattern: { 
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
      message: 'Введите корректный email адрес' 
    }
  },
  phone: {
    required: 'Телефон обязателен для заполнения',
    pattern: { 
      value: /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/, 
      message: 'Введите корректный номер телефона (например: +7(916)003-28-81)' 
    }
  },
  message: {
    required: 'Сообщение обязательно для заполнения',
    minLength: { value: 10, message: 'Сообщение должно содержать минимум 10 символов' },
    maxLength: { value: 500, message: 'Сообщение не должно превышать 500 символов' }
  }
};

// Helper function to format phone number
const formatPhoneNumber = (value) => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format as +7 (XXX) XXX-XX-XX
  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  if (cleaned.length === 10) {
    return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8, 10)}`;
  }
  return value;
};

// Helper function to clean phone number for API
const cleanPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return `+${cleaned}`;
  }
  if (cleaned.length === 10) {
    return `+7${cleaned}`;
  }
  return phone;
};

const Form = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      agreement: false
    }
  });

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    e.target.value = formatted;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});
    
    try {
      // Prepare data for API
      const apiData = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: cleanPhoneNumber(data.phone),
        message: data.message.trim(),
        agreement: data.agreement
      };

      const response = await axios.post('/api/contact', apiData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      
      if (response.status === 200) {
        setShowSuccess(true);
        reset();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      
      // Handle validation errors from API
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        setFieldErrors(errors);
        
        // Set form errors
        errors.forEach(error => {
          setError(error.field, {
            type: 'manual',
            message: error.message
          });
        });
      } else if (err.response?.status === 429) {
        setSubmitError('Слишком много запросов. Пожалуйста, попробуйте позже.');
      } else if (err.code === 'ECONNABORTED') {
        setSubmitError('Превышено время ожидания. Пожалуйста, попробуйте еще раз.');
      } else {
        setSubmitError('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  // Character counter for message
  const messageValue = watch('message') || '';
  const messageLength = messageValue.length;
  const isMessageNearLimit = messageLength > 450;

  return (
    <>
      <div id="form" className="form-item py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-gray-800">
              Напишите нам
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Заполните форму и мы свяжемся с вами в ближайшее время
            </p>
          </div>

          <form className="contact-form space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Имя <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  {...register('name', VALIDATION.name)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-yellow-500'
                  }`}
                  placeholder="Иван Иванов"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
              </div>
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  {...register('email', VALIDATION.email)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-yellow-500'
                  }`}
                  placeholder="ivan@example.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Телефон <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  {...register('phone', VALIDATION.phone)}
                  onChange={handlePhoneChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-yellow-500'
                  }`}
                  placeholder="+7 (___) ___-__-__"
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Сообщение <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <ChatBubbleLeftRightIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="message"
                  {...register('message', VALIDATION.message)}
                  rows={4}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all resize-y ${
                    errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-yellow-500'
                  }`}
                  placeholder="Ваше сообщение..."
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'message-error' : 'message-count'}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                {errors.message ? (
                  <p id="message-error" className="text-sm text-red-500">
                    {errors.message.message}
                  </p>
                ) : (
                  <p id="message-count" className={`text-xs ${isMessageNearLimit ? 'text-yellow-600' : 'text-gray-400'}`}>
                    {messageLength}/500 символов
                  </p>
                )}
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('agreement', { required: 'Необходимо согласие на обработку персональных данных' })}
                  className="mt-1 w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 cursor-pointer"
                  aria-invalid={errors.agreement ? 'true' : 'false'}
                  aria-describedby={errors.agreement ? 'agreement-error' : undefined}
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  Согласен с{' '}
                  <Link href="/confidential" className="text-yellow-600 hover:text-yellow-700 underline" target="_blank">
                    условиями
                  </Link>{' '}
                  обработки персональных данных
                </span>
              </label>
              {errors.agreement && (
                <p id="agreement-error" className="text-sm text-red-500">
                  {errors.agreement.message}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                <p className="text-sm text-red-600 text-center">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-white shadow-md hover:shadow-lg'
              }`}
              aria-label="Отправить сообщение"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Отправка...
                </span>
              ) : (
                'Отправить сообщение'
              )}
            </button>

            {/* Additional Links */}
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/sout" passHref>
                <button className="w-full py-2 text-sm text-gray-500 hover:text-yellow-600 transition-colors">
                  Специальная оценка условий труда (СОУТ)
                </button>
              </Link>
              <Link href="/confidential" passHref>
                <button className="w-full py-2 text-sm text-gray-500 hover:text-yellow-600 transition-colors">
                  Политика конфиденциальности
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={closeSuccess}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-md"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Спасибо за обращение!
                </h3>
                <p className="text-gray-600 mb-4">
                  Мы свяжемся с вами в ближайшее время.
                </p>
                <button
                  onClick={closeSuccess}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Form;