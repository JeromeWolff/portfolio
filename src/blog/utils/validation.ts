interface RawBlogFrontmatter {
  title?: unknown;
  slug?: unknown;
  description?: unknown;
  author?: unknown;
  publishedAt?: unknown;
  updatedAt?: unknown;
  tags?: unknown;
  category?: unknown;
  featuredImage?: unknown;
  draft?: unknown;
}

interface NormalizedBlogFrontmatter {
  title: string;
  slug: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  tagSlugs: string[];
  category: string;
  categorySlug: string;
  featuredImage?: string;
  draft: boolean;
}

function assertString(value: unknown, fieldName: string, sourcePath: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid or missing '${fieldName}' in ${sourcePath}`);
  }

  return value.trim();
}

function normalizeDate(value: unknown, fieldName: string, sourcePath: string): string {
  const parsed =
    value instanceof Date ? value : new Date(assertString(value, fieldName, sourcePath));

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid '${fieldName}' date in ${sourcePath}`);
  }

  return parsed.toISOString();
}

function normalizeTags(value: unknown, sourcePath: string): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid or missing 'tags' in ${sourcePath}`);
  }

  const tags = value
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean);

  if (tags.length === 0) {
    throw new Error(`At least one tag is required in ${sourcePath}`);
  }

  return tags;
}

function isValidPublicUrl(value: string): boolean {
  return value.startsWith('/') || /^https?:\/\//.test(value);
}

export function slugifySegment(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeBlogFrontmatter(
  raw: RawBlogFrontmatter,
  sourcePath: string
): NormalizedBlogFrontmatter {
  const title = assertString(raw.title, 'title', sourcePath);
  const slug = slugifySegment(assertString(raw.slug, 'slug', sourcePath));
  const description = assertString(raw.description, 'description', sourcePath);
  const author = assertString(raw.author, 'author', sourcePath);
  const publishedAt = normalizeDate(raw.publishedAt, 'publishedAt', sourcePath);
  const updatedAt =
    raw.updatedAt === undefined ? undefined : normalizeDate(raw.updatedAt, 'updatedAt', sourcePath);
  const tags = normalizeTags(raw.tags, sourcePath);
  const category = assertString(raw.category, 'category', sourcePath);
  const featuredImage =
    raw.featuredImage === undefined
      ? undefined
      : assertString(raw.featuredImage, 'featuredImage', sourcePath);
  const draft = raw.draft === undefined ? false : Boolean(raw.draft);

  if (!slug) {
    throw new Error(`Invalid 'slug' in ${sourcePath}`);
  }

  if (featuredImage && !isValidPublicUrl(featuredImage)) {
    throw new Error(
      `Invalid 'featuredImage' in ${sourcePath}. Use an absolute site path or full URL.`
    );
  }

  return {
    title,
    slug,
    description,
    author,
    publishedAt,
    updatedAt,
    tags,
    tagSlugs: tags.map(slugifySegment),
    category,
    categorySlug: slugifySegment(category),
    featuredImage,
    draft,
  };
}

export function assertUniquePostSlugs(slugs: string[]): void {
  const seen = new Set<string>();

  for (const slug of slugs) {
    if (seen.has(slug)) {
      throw new Error(`Duplicate blog slug detected: '${slug}'`);
    }

    seen.add(slug);
  }
}
