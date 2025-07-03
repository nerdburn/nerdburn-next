import Link from 'next/link'

export const Header = ({ posts }) =>
<>
  <div className='header'>
    <span className='n'>
      <Link href='/'>n</Link>
    </span>
    <nav>
      <ul>
        <li><Link href='/about'>&hellip;</Link></li>
      </ul>
    </nav>
  </div>
</>
