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

