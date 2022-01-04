import Link from 'next/link'
import { useRouter } from 'next/router'

import { get } from '@/util/api'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const BaseLayout = ({ user, children }) => {
  const router = useRouter()

  return (
    <>
      <Header />
      <div className='container'>
        {children}
      </div>
      <Footer />
    </>
  )
}

export default BaseLayout
