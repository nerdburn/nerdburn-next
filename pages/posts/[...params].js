import Head from 'next/head'

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useStore } from '@/util/store'

import { Post } from '@/components/post'

const PostItem = () => {
  const router = useRouter()
  const { params } = router.query
  if (params && params.length) {
    const cid = params[0]
    const slug = params[1]
    console.log(cid, slug)
  }
    
  // TODO - if no cid, go home
  
  return (
    <>
      <Head>
        <title>nerdburn</title>
      </Head>
      <Post />
    </>
  )
}

PostItem.Layouts = ['BaseLayout']
export default PostItem

