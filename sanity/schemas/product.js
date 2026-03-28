// sanity/schemas/product.js
export const product = {
    name: 'product',
    title: 'Products',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Product Name',
        type: 'string',
        validation: Rule => Rule.required(),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'name',
          maxLength: 96,
        },
      },
      {
        name: 'price',
        title: 'Price',
        type: 'number',
        validation: Rule => Rule.required().min(0),
      },
      {
        name: 'image',
        title: 'Main Image',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
      },
      {
        name: 'featured',
        title: 'Featured',
        type: 'boolean',
        initialValue: false,
      },
    ],
    preview: {
      select: {
        title: 'name',
        subtitle: 'price',
        media: 'image',
      },
      prepare(selection) {
        const { title, subtitle, media } = selection;
        return {
          title: title,
          subtitle: subtitle ? `${subtitle} ₽` : 'No price',
          media: media,
        };
      },
    },
  };