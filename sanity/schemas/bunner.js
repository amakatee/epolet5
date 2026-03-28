// sanity/schemas/banner.js
export const banner = {
    name: 'banner',
    title: 'Banners',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: Rule => Rule.required(),
      },
      {
        name: 'subtitle',
        title: 'Subtitle',
        type: 'string',
      },
      {
        name: 'image',
        title: 'Banner Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        validation: Rule => Rule.required(),
      },
      {
        name: 'buttonText',
        title: 'Button Text',
        type: 'string',
      },
      {
        name: 'buttonLink',
        title: 'Button Link',
        type: 'string',
      },
    ],
    preview: {
      select: {
        title: 'title',
        subtitle: 'subtitle',
        media: 'image',
      },
    },
  };