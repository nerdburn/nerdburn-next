import Head from 'next/head'

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useStore } from '@/util/store'
import { getPosts, getPostIds, getPostById } from '@/util/posts'

import { Post } from '@/components/post'
import { PostList } from '@/components/post-list'

const PostItem = ({ post, posts }) => {
  return (
    <>
      <Head>
        <title>nerdburn | {post.title}</title>
        <meta property="og:title" content={`Nerdburn | ${post.title}`} />
        <meta property="og:description" content="A collection of articles written by Shawn Adrian, a designer, developer, and blogger since 2000."/>
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

