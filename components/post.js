import { Date } from '@/components/date'

export const Post = ({ post }) => {
  const { title, date, html } = post
  
  if (!post || !title || !date || !html)
    return <LoadingIndicator />
    
  return (
    <div className='post'>
      <h1>{title}</h1>
      <p><Date dateString={date} /></p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
