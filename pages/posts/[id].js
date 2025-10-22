import Head from 'next/head'

import { getPosts, getPostIds, getPostById } from '@/util/posts'

import { Post } from '@/components/post'
import { PostList } from '@/components/post-list'

const PostItem = ({ post, posts }) => {
  const staticDescription = post.html?.replace(/<[^>]*>/g, '').substring(0, 155).trim() + '...'
  return (
    <>
      <Head>
        <title>nerdburn | {post.title}</title>
        <meta name="description" content="Insights on technology, startups, web3, AI automation, fintech, and digital innovation by Shawn Adrian - a designer, developer, and entrepreneur since 2000." />
        <meta name="keywords" content="web3, blockchain, AI automation, fintech, startups, entrepreneurship, digital art, NFTs, IPFS, decentralization, Canadian fintech, podcast automation, content management, design, development, tech innovation" />
        <meta name="author" content="Shawn Adrian" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${post.title}`} />
        <meta property="og:description" content={staticDescription} />
        <meta property="og:url" content="https://nerdburn.com" />
        <meta property="og:image" content="https://nerdburn.com/images/nerdburn-og-image.png" />
        <meta property="og:site_name" content="nerdburn" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title}`} />
        <meta name="twitter:description" content={staticDescription} />
        <meta name="twitter:image" content="https://nerdburn.com/images/nerdburn-og-image.png" />
        <meta name="twitter:creator" content="@nerdburn" />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href="https://www.nerdburn.com" />      
      </Head>
      <Post post={post} />
      <PostList posts={posts} />
    </>
  )
}

export async function getStaticPaths() {
  const paths = getPostIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const post = await getPostById(params.id)
  const posts = getPosts()
  return {
    props: {
      post,
      posts
    }
  }
}

PostItem.Layouts = ['BaseLayout']
export default PostItem

