import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const pages = [
    '',
    'quiz',
    // Add more routes as needed
  ];
  const urls = pages.map(
    (page) => `  <url><loc>${baseUrl}/${page}</loc></url>`
  ).join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 