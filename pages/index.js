import Head from 'next/head'

import { getPosts, getLatestPost } from '@/util/posts'
import { Post } from '@/components/post'
import { PostList } from '@/components/post-list'

const Index = ({ post, posts }) => {
  return (
    <>
      <Head>
        <title>nerdburn</title>
      </Head>
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
