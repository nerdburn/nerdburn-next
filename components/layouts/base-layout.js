import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Head from 'next/head'

const BaseLayout = ({ children }) => {
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
