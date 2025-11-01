/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: 'https://chefoodai.vercel.app',
	generateIndexSitemap: false, 
	changefreq: 'daily',
	priority: 0.7,
	sitemapSize: 5000,
	exclude: ['/api/*'],
	robotsTxtOptions: {
	  policies: [
		{
		  userAgent: '*',
		  allow: '/',
		  disallow: ['/api/'],
		},
	  ],
	  additionalSitemaps: [
		'https://chefoodai.vercel.app/sitemap.xml',
	  ],
	},
  }