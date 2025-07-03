import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Head from 'next/head'

const BaseLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>nerdburn | Shawn Adrian's personal blog about building startups and the internet since 2004</title>
        <meta name="description" content="Insights on technology, startups, web3, AI automation, fintech, and digital innovation by Shawn Adrian - a designer, developer, and entrepreneur since 2000." />
        <meta name="keywords" content="web3, blockchain, AI automation, fintech, startups, entrepreneurship, digital art, NFTs, IPFS, decentralization, Canadian fintech, podcast automation, content management, design, development, tech innovation" />
        <meta name="author" content="Shawn Adrian" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="nerdburn - Shawn Adrian's personal blog about building startups and the internet since 2004" />
        <meta property="og:description" content="Insights on technology, startups, web3, AI automation, fintech, and digital innovation by Shawn Adrian - a designer, developer, and entrepreneur since 2000." />
        <meta property="og:url" content="https://nrdbrn.xyz" />
        <meta property="og:image" content="https://nrdbrn.xyz/images/nerdburn-og-image.png" />
        <meta property="og:site_name" content="nerdburn" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="nerdburn - Shawn Adrian's personal blog about building startups and the internet since 2004" />
        <meta name="twitter:description" content="Insights on technology, startups, web3, AI automation, fintech, and digital innovation by Shawn Adrian - a designer, developer, and entrepreneur since 2000." />
        <meta name="twitter:image" content="https://nrdbrn.xyz/images/nerdburn-og-image.png" />
        <meta name="twitter:creator" content="@nerdburn" />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href="https://nrdbrn.xyz" />
      </Head>
      <Header />
      <div className='container'>
        {children}
      </div>
      <Footer />
    </>
  )
}

export default BaseLayout
