# nerdburn-next

A modern blog built with Next.js 15, featuring markdown-based content management and a clean, minimalist design. This project is bootstrapped from [Input Next Starter](https://github.com/inputlogic/next-starter) with customizations for blog functionality.

## 🚀 Tech Stack

- **Next.js 15.1.6** - React framework with Pages Router (not App Router)
- **React 19** - Latest React with modern hooks
- **Sass** - CSS preprocessing with SCSS modules
- **Remark** - Markdown processing with custom plugins
- **Gray Matter** - YAML front matter parsing
- **Date-fns** - Date formatting and manipulation
- **React GA4** - Google Analytics 4 integration

## 📝 Content Management

### Markdown-Based Blog Posts

All blog content is stored as markdown files in the `/content` directory. Each post includes YAML front matter for metadata:

```markdown
---
title: 'Your Post Title'
date: '2025-02-06'
---

Your markdown content here...
```

### Content Processing Pipeline

The blog uses a markdown processing system:

1. **File Reading**: Posts are read from `/content/*.md` files
2. **Front Matter Parsing**: Uses `gray-matter` to extract metadata (title, date, etc.)
3. **Markdown Processing**: Uses `remark` with `remark-html` for HTML conversion
4. **Custom Plugins**: Includes a custom `remarkTweets` plugin for embedding tweets
5. **Static Generation**: Content is processed at build time for optimal performance

### Key Content Functions (`/util/posts.js`)

- `getPosts()` - Returns all posts with metadata (no HTML content)
- `getPostIds()` - Returns post IDs for static path generation
- `getPostById(id)` - Returns full post with processed HTML content
- `getLatestPost()` - Returns the most recent post with HTML

## 🎨 Layout System

### Dynamic Layout Composition

The project uses a custom layout system that allows pages to specify which layouts to use:

```javascript
// In any page component
PageComponent.Layouts = ['BaseLayout']
export default PageComponent
```

### How It Works

1. **Layout Registration**: Layouts are registered in `/util/layout.js`
2. **Dynamic Wrapping**: The `buildLayout()` function recursively wraps components
3. **Prop Injection**: Layout props are passed down to nested components
4. **Flexible Nesting**: Supports multiple nested layouts if needed

### Layout Components

- **BaseLayout** (`/components/layouts/base-layout.js`)
  - Provides HTML head metadata (SEO, Open Graph, Twitter Cards)
  - Includes header and footer components
  - Wraps content in responsive container

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Environment Setup

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_DOMAIN=https://nrdbrn.xyz
```

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate sitemap
npm run sitemap
```

### Development Server

Open [http://localhost:3000](http://localhost:3000) to view the site. The page auto-reloads when you edit files.

## 📱 Features

- **Static Site Generation (SSG)** - All pages pre-rendered at build time
- **Responsive Design** - Mobile-first responsive layout
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards
- **Google Analytics** - GA4 integration with page tracking
- **Custom Tweet Embedding** - Special syntax for embedding tweets
- **Automatic Sitemap** - Generated during build process
- **Clean URLs** - SEO-friendly post URLs

## 🎯 Pages Router Architecture

This project uses Next.js Pages Router (not App Router) with the following routing:

- `/` - Homepage displaying latest post + post list
- `/posts/[id]` - Dynamic post pages
- `/about` - About page
- `/api/sitemap.xml.js` - Dynamic sitemap generation

## 📚 Learn More

- [Next.js Pages Router Documentation](https://nextjs.org/docs/pages)
- [Remark Documentation](https://remark.js.org/)
- [Gray Matter Documentation](https://github.com/jonschlinkert/gray-matter)
- [Sass Documentation](https://sass-lang.com/documentation)
