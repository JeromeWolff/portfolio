const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://www.jeromewolff.de';

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

// Write files to public directory
fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(__dirname, 'public', 'robots.txt'), robots);

console.log('sitemap.xml and robots.txt generated!');
