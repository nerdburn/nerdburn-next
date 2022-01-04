import Link from 'next/link'
import Head from 'next/head'

export const Header = ({ posts }) =>
<>
  <Head>
    <title>nerdburn</title>
  </Head>
  <div className='header'>
    <h1><Link href='/'>nerdburn</Link></h1>
    <nav>
      <ul>
        <li><Link href='/about'>About</Link></li>
      </ul>
    </nav>
  </div>
</>
