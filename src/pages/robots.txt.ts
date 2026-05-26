export function GET() {
  const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://www.jeromewolff.de';

  return new Response(
    ['User-agent: *', 'Allow: /', `Sitemap: ${siteUrl}/sitemap-index.xml`].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    }
  );
}
