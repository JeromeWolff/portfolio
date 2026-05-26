---
title: React Performance for Real Products
slug: react-performance
description: Practical React performance techniques that improve user-perceived speed.
author: Jerome
publishedAt: 2026-02-14
updatedAt: 2026-02-17
tags:
  - react
  - performance
  - frontend
category: Frontend Engineering
featuredImage: /images/blog/react-performance-cover.svg
draft: false
---

# React Performance for Real Products

React performance work should begin with user journeys, not random memoization.

## Measure before optimizing

Profile the route that matters most. Look for rendering waterfalls, expensive effects, and unnecessary layout work.

## Keep initial bundles small

The best optimization is often shipping less JavaScript.

```tsx
const ProductPage = lazy(() => import('./product-page'));

export function AppRoutes() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProductPage />
    </Suspense>
  );
}
```

## Prefer stable composition

A stable component tree often outperforms aggressive memoization.

| Problem            | Better fix                            |
| ------------------ | ------------------------------------- |
| Re-render storms   | Move state closer to where it is used |
| Slow route startup | Lazy-load non-critical modules        |
| Layout jank        | Avoid DOM reads in the critical path  |

## Make the browser work less

Critical CSS, lazy images, and stable layout reservations frequently deliver larger gains than component-level tweaks.

![React performance cover](/images/blog/react-performance-cover.svg)
