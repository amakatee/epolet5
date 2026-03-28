// app/studio/[[...index]]/page.tsx
'use client';

import { lazy, Suspense } from 'react';

const Studio = lazy(() => 
  import('sanity').then(module => ({ default: module.Studio }))
);

import config from '../../../sanity/sanity.config'

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Sanity Studio...</p>
        </div>
      </div>
    }>
      <Studio config={config} />
    </Suspense>
  );
}