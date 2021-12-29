import Head from 'next/head'

import { useEffect } from 'react'

import { useStore } from '@/util/store'
import { apiUrl } from '@/util/urls'

import { PostList } from '@/components/post-list'

const Index = () => {
  const setModal = useStore((state) => state.setModal)

  return (
    <>
      <Head>
        <title>nerdburn</title>
      </Head>
      <p>whee</p>
      <PostList />
    </>
  )
}

Index.Layouts = ['BaseLayout']
export default Index
