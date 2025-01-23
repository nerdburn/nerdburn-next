import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

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
