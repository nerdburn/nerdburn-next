import Link from 'next/link'

export const PostList = ({ posts }) =>
  <div className='post-list'>
    <h4>Continue reading</h4>
    <ul>
      {posts.map(({ id, date, title }) => (
        <li key={id}>
          <Link href={`posts/${id}`}>{title}</Link>
        </li>
      ))}
    </ul>
  </div>
