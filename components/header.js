import Link from 'next/link'

export const Header = ({ posts }) =>
<>
  <div className='header'>
    <h1><Link href='/'>n</Link></h1>
    <nav>
      <ul>
        <li><Link href='/about'>&hellip;</Link></li>
      </ul>
    </nav>
  </div>
</>
