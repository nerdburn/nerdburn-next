import Head from 'next/head'

import { getPosts, getLatestPost } from '@/util/posts'
import { Post } from '@/components/post'
import { PostList } from '@/components/post-list'
import Script from 'next/script'

const Index = ({ post, posts }) => {
  return (
    <>
      <Head>
        <meta property="og:title" content="nerdburn"/>
        <meta property="og:description" content="A collection of articles written by Shawn Adrian, a designer, developer, and blogger since 2000."/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://nrdbrn.xyz"/>
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/nerdburn-og-image.png`} />
        <meta property="og:site_name" content="nerdburn" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="nerdburn" />
        <meta name="twitter:description" content="A collection of articles written by Shawn Adrian, a designer, developer, and blogger since 2000." />
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/nerdburn-og-image.png`} />
      </Head>
      <Script src="https://analytics.ahrefs.com/analytics.js" data-key="dorXtQ0JnCiGIA6uB2uDHg" async></Script>
      <Post post={post} />
      <PostList posts={posts} />
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
