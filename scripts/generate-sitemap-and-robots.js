const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

// Define your main routes here
const routes = ['/'];

// Generate sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => `  <url>\n    <loc>${SITE_URL.replace(/\/$/, '')}${route}</loc>\n  </url>`)
  .join('\n')}
</urlset>
`;

// Generate robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL.replace(/\/$/, '')}/sitemap.xml
`;

// Write files to project root
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(__dirname, 'robots.txt'), robots);

// eslint-disable-next-line no-console
console.log('sitemap.xml and robots.txt generated!');
