import { getPosts } from '@/util/posts'

export default function handler(req, res) {
  // Get all posts
  const posts = getPosts()
  
  // Base URL of your site
  const baseUrl = 'https://nrdbrn.xyz'
  
  // Static pages
  const staticPages = [
    {
      url: '',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      url: '/about',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.8'
    }
  ]
  
  // Dynamic blog post pages
  const postPages = posts.map(post => ({
    url: `/posts/${post.id}`,
    lastmod: new Date(post.date).toISOString(),
    changefreq: 'monthly',
    priority: '0.9'
  }))
  
  // Combine all pages
  const allPages = [...staticPages, ...postPages]
  
  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()
}
