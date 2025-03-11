/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://fliper.com",
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  sitemapSize: 7000,
};
