// lib/sanity.js
import { createClient } from '@sanity/client';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable');
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET environment variable');
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
});

// Optional: Add a helper for image URLs
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
  return builder.image(source);
};