/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: 'https://chefoodai.vercel.app',
	changefreq: 'daily',
	priority: 0.7,
	sitemapSize: 5000,
	exclude: ['/api/*'], // API route'larını hariç tut
  }