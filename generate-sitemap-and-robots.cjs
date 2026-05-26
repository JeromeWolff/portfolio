const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const CONTENT_DIR = path.join(ROOT_DIR, 'content', 'posts');
const DEFAULT_SITE_URL = 'https://www.jeromewolff.de';
const MAX_URLS_PER_SITEMAP = 50000;

function ensureDir(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function normalizeSiteUrl(value) {
  try {
    const normalized = new URL(value || DEFAULT_SITE_URL);
    return normalized.toString().replace(/\/$/, '');
  } catch {
    throw new Error(`Invalid SITE_URL: ${value}`);
  }
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slugifySegment(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeString(value, fieldName, filePath) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid or missing '${fieldName}' in ${filePath}`);
  }

  return value.trim();
}

function normalizeDate(value, fieldName, filePath) {
  const parsed =
    value instanceof Date ? value : new Date(normalizeString(value, fieldName, filePath));

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid '${fieldName}' date in ${filePath}`);
  }

  return parsed.toISOString();
}

function normalizeTags(value, filePath) {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid or missing 'tags' in ${filePath}`);
  }

  const tags = value
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean);

  if (tags.length === 0) {
    throw new Error(`At least one tag is required in ${filePath}`);
  }

  return tags;
}

function isValidPublicUrl(value) {
  return value.startsWith('/') || /^https?:\/\//.test(value);
}

function maxLastMod(entries) {
  return entries.reduce((latest, entry) => {
    if (!latest) {
      return entry.lastmod;
    }

    return new Date(entry.lastmod).getTime() > new Date(latest).getTime() ? entry.lastmod : latest;
  }, '');
}

function chunk(entries, size) {
  const chunks = [];
  for (let index = 0; index < entries.length; index += size) {
    chunks.push(entries.slice(index, index + size));
  }
  return chunks;
}

function createAbsoluteUrl(siteUrl, pathname) {
  try {
    return new URL(pathname, `${siteUrl}/`).toString();
  } catch {
    throw new Error(`Invalid URL path generated for sitemap: ${pathname}`);
  }
}

function createUrlEntry(siteUrl, entry) {
  return `  <url>\n    <loc>${xmlEscape(createAbsoluteUrl(siteUrl, entry.path))}</loc>\n    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>\n    <changefreq>${xmlEscape(entry.changefreq)}</changefreq>\n    <priority>${xmlEscape(entry.priority)}</priority>\n  </url>`;
}

function createSitemapXml(siteUrl, entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map((entry) => createUrlEntry(siteUrl, entry))
    .join('\n')}\n</urlset>\n`;
}

function createSitemapIndexXml(siteUrl, files) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files
    .map(
      (file) =>
        `  <sitemap>\n    <loc>${xmlEscape(createAbsoluteUrl(siteUrl, `/${file.fileName}`))}</loc>\n    <lastmod>${xmlEscape(file.lastmod)}</lastmod>\n  </sitemap>`
    )
    .join('\n')}\n</sitemapindex>\n`;
}

function cleanGeneratedSitemaps() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    return;
  }

  for (const fileName of fs.readdirSync(PUBLIC_DIR)) {
    if (/^sitemap.*\.xml$/i.test(fileName)) {
      fs.unlinkSync(path.join(PUBLIC_DIR, fileName));
    }
  }
}

function loadPosts() {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((fileName) => fileName.endsWith('.md'));
  const posts = [];
  const seenSlugs = new Set();

  for (const fileName of files) {
    const filePath = path.join(CONTENT_DIR, fileName);
    const fileStats = fs.statSync(filePath);
    const fileContents = fs.readFileSync(filePath, 'utf8');

    let parsed;
    try {
      parsed = matter(fileContents);
    } catch (error) {
      throw new Error(
        `Malformed frontmatter in ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    const data = parsed.data || {};
    const title = normalizeString(data.title, 'title', filePath);
    const slug = slugifySegment(normalizeString(data.slug, 'slug', filePath));
    const description = normalizeString(data.description, 'description', filePath);
    const author = normalizeString(data.author, 'author', filePath);
    const publishedAt = normalizeDate(data.publishedAt, 'publishedAt', filePath);
    const updatedAt =
      data.updatedAt === undefined
        ? undefined
        : normalizeDate(data.updatedAt, 'updatedAt', filePath);
    const tags = normalizeTags(data.tags, filePath);
    const category = normalizeString(data.category, 'category', filePath);
    const featuredImage =
      data.featuredImage === undefined
        ? undefined
        : normalizeString(data.featuredImage, 'featuredImage', filePath);
    const draft = data.draft === undefined ? false : Boolean(data.draft);

    if (!slug) {
      throw new Error(`Invalid 'slug' in ${filePath}`);
    }

    if (seenSlugs.has(slug)) {
      throw new Error(`Duplicate blog slug detected: '${slug}'`);
    }
    seenSlugs.add(slug);

    if (featuredImage && !isValidPublicUrl(featuredImage)) {
      throw new Error(
        `Invalid 'featuredImage' in ${filePath}. Use an absolute site path or full URL.`
      );
    }

    posts.push({
      title,
      slug,
      description,
      author,
      publishedAt,
      updatedAt,
      lastmod: updatedAt || publishedAt || fileStats.mtime.toISOString(),
      tags,
      tagSlugs: tags.map(slugifySegment),
      category,
      categorySlug: slugifySegment(category),
      featuredImage,
      draft,
      filePath,
      fileMtime: fileStats.mtime.toISOString(),
    });
  }

  return posts
    .filter((post) => !post.draft)
    .sort((left, right) => new Date(right.lastmod).getTime() - new Date(left.lastmod).getTime());
}

function createEntries(posts) {
  const latestPostDate = posts[0]?.lastmod || new Date().toISOString();

  const pages = [
    { path: '/', lastmod: latestPostDate, changefreq: 'weekly', priority: '1.0' },
    { path: '/blog', lastmod: latestPostDate, changefreq: 'weekly', priority: '0.8' },
  ];

  const postsEntries = posts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastmod: post.lastmod,
    changefreq: 'monthly',
    priority: '0.7',
  }));

  const tagsMap = new Map();
  const categoriesMap = new Map();

  for (const post of posts) {
    post.tags.forEach((tag, index) => {
      const slug = post.tagSlugs[index];
      const existing = tagsMap.get(slug);
      if (!existing || new Date(post.lastmod).getTime() > new Date(existing.lastmod).getTime()) {
        tagsMap.set(slug, {
          path: `/blog/tag/${slug}`,
          lastmod: post.lastmod,
          changefreq: 'weekly',
          priority: '0.6',
        });
      }
    });

    const existingCategory = categoriesMap.get(post.categorySlug);
    if (
      !existingCategory ||
      new Date(post.lastmod).getTime() > new Date(existingCategory.lastmod).getTime()
    ) {
      categoriesMap.set(post.categorySlug, {
        path: `/blog/category/${post.categorySlug}`,
        lastmod: post.lastmod,
        changefreq: 'weekly',
        priority: '0.6',
      });
    }
  }

  return {
    pages,
    posts: postsEntries,
    tags: [...tagsMap.values()].sort((left, right) => left.path.localeCompare(right.path)),
    categories: [...categoriesMap.values()].sort((left, right) =>
      left.path.localeCompare(right.path)
    ),
  };
}

function writeSingleSitemap(siteUrl, entries) {
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'sitemap.xml'),
    createSitemapXml(siteUrl, entries),
    'utf8'
  );
}

function writeSegmentedSitemaps(siteUrl, groupedEntries) {
  const fileRecords = [];

  for (const [groupName, entries] of Object.entries(groupedEntries)) {
    const entryChunks = chunk(entries, MAX_URLS_PER_SITEMAP);
    entryChunks.forEach((entryChunk, index) => {
      const fileName =
        entryChunks.length > 1
          ? `sitemap-${groupName}-${index + 1}.xml`
          : `sitemap-${groupName}.xml`;
      fs.writeFileSync(
        path.join(PUBLIC_DIR, fileName),
        createSitemapXml(siteUrl, entryChunk),
        'utf8'
      );
      fileRecords.push({ fileName, lastmod: maxLastMod(entryChunk) || new Date().toISOString() });
    });
  }

  const indexXml = createSitemapIndexXml(siteUrl, fileRecords);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-index.xml'), indexXml, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), indexXml, 'utf8');
}

function writeRobots(siteUrl) {
  const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /drafts\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robots, 'utf8');
}

function main() {
  ensureDir(PUBLIC_DIR);
  cleanGeneratedSitemaps();

  const siteUrl = normalizeSiteUrl(process.env.SITE_URL);
  const posts = loadPosts();
  const groupedEntries = createEntries(posts);
  const allEntries = [
    ...groupedEntries.pages,
    ...groupedEntries.posts,
    ...groupedEntries.tags,
    ...groupedEntries.categories,
  ];

  if (allEntries.length > MAX_URLS_PER_SITEMAP) {
    writeSegmentedSitemaps(siteUrl, groupedEntries);
  } else {
    writeSingleSitemap(siteUrl, allEntries);
  }

  writeRobots(siteUrl);

  console.log(`Generated sitemap and robots for ${allEntries.length} URLs.`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
