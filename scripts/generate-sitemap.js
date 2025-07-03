const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

// Get all markdown files from content directory
function getPosts() {
  const postsDirectory = path.join(process.cwd(), 'content')
  const fileNames = fs.readdirSync(postsDirectory)
  
  const allPostsData = fileNames.filter((fileName) => {
    return fileName.endsWith('.md') && !fileName.startsWith('.')
  }).map(fileName => {
    const id = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    
    return {
      id,
      date: matterResult.data.date
    }
  })
  
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

function generateSitemap() {
  const posts = getPosts()
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

  // Write sitemap to public directory
  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap)
  console.log('✅ Sitemap generated successfully!')
}

generateSitemap()
