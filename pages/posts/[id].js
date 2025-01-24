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
        <meta property="og:title" content={`${post.title}`} />
        <meta property="og:description" content={staticDescription} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/nerdburn-og-image.png`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${post.title}`} />
        <meta name="twitter:description" content={staticDescription} />
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/nerdburn-og-image.png`} />
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

