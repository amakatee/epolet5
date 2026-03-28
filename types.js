// types.js - or you can keep types at the beginning of the file
/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} name
 * @property {string} [description]
 * @property {number} [price]
 * @property {Object} [image]
 * @property {Object} [image.asset]
 * @property {string} [image.asset.url]
 * @property {string} [category]
 */

/**
 * @typedef {Object} Banner
 * @property {string} _id
 * @property {string} [title]
 * @property {string} [subtitle]
 * @property {Object} [image]
 * @property {Object} [image.asset]
 * @property {string} [image.asset.url]
 * @property {string} [buttonText]
 * @property {string} [buttonLink]
 */

/**
 * @typedef {Object} HomePageProps
 * @property {Product[]} products
 * @property {Banner[]} bannerData
 */