import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.md',
  }),
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().min(1),
    author: z.string().min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).min(1),
    category: z.string().min(1),
    featuredImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
