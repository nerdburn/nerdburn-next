import Head from 'next/head'

import { getPosts, getLatestPost } from '@/util/posts'
import { Post } from '@/components/post'
import { PostList } from '@/components/post-list'
import Script from 'next/script'

const Index = ({ post, posts }) => {
  return (
    <>
      <Head>
        <title>nerdburn | Startups & design blog by Shawn Adrian</title>
        <meta name="description" content="Insights on technology, startups, web3, AI automation, fintech, and digital innovation by Shawn Adrian - a designer, developer, and entrepreneur since 2000." />
        <meta name="keywords" content="web3, blockchain, AI automation, fintech, startups, entrepreneurship, digital art, NFTs, IPFS, decentralization, Canadian fintech, podcast automation, content management, design, development, tech innovation" />
        <meta name="author" content="Shawn Adrian" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="nerdburn - Shawn Adrian's blog about startups and design (since 2004)" />
        <meta property="og:description" content="Insights on technology, startups, web3, AI automation, fintech, and digital innovation by Shawn Adrian - a designer, developer, and entrepreneur since 2000." />
        <meta property="og:url" content="https://nerdburn.com" />
        <meta property="og:image" content="https://nerdburn.com/images/nerdburn-og-image.png" />
        <meta property="og:site_name" content="nerdburn" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="nerdburn - Shawn Adrian's blog about startups and design (since 2004)" />
        <meta name="twitter:description" content="Insights on technology, startups, web3, AI automation, fintech, and digital innovation by Shawn Adrian - a designer, developer, and entrepreneur since 2000." />
        <meta name="twitter:image" content="https://nerdburn.com/images/nerdburn-og-image.png" />
        <meta name="twitter:creator" content="@nerdburn" />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href="https://www.nerdburn.com" />      
      </Head>
      <Post post={post} />
      <PostList posts={posts} />
      <Script src="https://analytics.ahrefs.com/analytics.js" data-key="dorXtQ0JnCiGIA6uB2uDHg" async />
    </>
  )
}

export async function getStaticProps() {
  const posts = getPosts().slice(1)
  const post = await getLatestPost()
  return {
    props: {
      post,
      posts
    }
  }
}

Index.Layouts = ['BaseLayout']
export default Index
