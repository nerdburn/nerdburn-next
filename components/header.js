import Link from 'next/link'
import Head from 'next/head'

export const Header = ({ posts }) =>
<>
  <Head>
    <title>nerdburn</title>
    <meta property="og:title" content="Nerdburn"/>
    <meta property="og:description" content="A collection of articles written by Shawn Adrian, a designer, developer, and blogger since 2000."/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="https://nrdbrn.xyz"/>
    <meta property="og:image" content="https://nrdbrn.xyz/public/images/nerdburn-og-image.png"/>
  </Head>
  <div className='header'>
    <h1><Link href='/'>n</Link></h1>
    <nav>
      <ul>
        <li><Link href='/about'>&hellip;</Link></li>
      </ul>
    </nav>
  </div>
</>
