import { getPosts } from '@/util/posts'
import { PostList } from '@/components/post-list'

const Index = ({ posts }) => {

  return (
    <>
      <p><strong>Shawn Adrian</strong></p>
      <p>I'll never forget the weight of a Rolex on my wrist at 21 or the sting of bankruptcy at 24. Some lessons come hard and fast while others take years to learn. Fortunately, I have a ferocious appetite for study and a curiosity that just won’t quit.</p>
      <p>I write html, css, javascript and python but my native language is pixels. After 20 years of making things on the web, I still revel in the thrill of execution.</p>
      <p>These days I execute at <a href='http://inputlogic.ca'>the product studio</a> I started with my friend <a href='https://geekforbrains.com'>Gavin</a> — we work with startups and huge brands to launch digital products.</p>
      <p>I try to be helpful, so if you have a question feel free to <a href='mailto:shawn@nerdburn.com'>email me</a>.</p>
      
      <PostList posts={posts} />
    </>
  )
}

export async function getStaticProps() {
  const posts = getPosts()
  return {
    props: {
      posts
    }
  }
}

Index.Layouts = ['BaseLayout']
export default Index
