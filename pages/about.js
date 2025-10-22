import { getPosts } from '@/util/posts'
import { PostList } from '@/components/post-list'

const Index = ({ posts }) => {

  return (
    <>
      <Head>
        <title>nerdburn | Startups & design blog by Shawn Adrian</title>
        <meta name="description" content="Insights on technology, startups, web3, AI automation, fintech, and digital innovation by Shawn Adrian - a designer, developer, and entrepreneur since 2000." />
        <meta name="keywords" content="web3, blockchain, AI automation, fintech, startups, entrepreneurship, digital art, NFTs, IPFS, decentralization, Canadian fintech, podcast automation, content management, design, development, tech innovation" />
        <meta name="author" content="Shawn Adrian" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="nerdburn - Shawn Adrian's blog about startups and design (since 2004)" />
        <meta property="og:description" content="Insights on technology, startups, web3, AI automation, fintech, and digital innovation by Shawn Adrian - a designer, developer, and entrepreneur since 2000." />
        <meta property="og:url" content="https://nerdburn.com" />
        <meta property="og:image" content="https://nerdburn.com/images/nerdburn-og-image.png" />
        <meta property="og:site_name" content="nerdburn" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="nerdburn - Shawn Adrian's blog about startups and design (since 2004)" />
        <meta name="twitter:description" content="Insights on technology, startups, web3, AI automation, fintech, and digital innovation by Shawn Adrian - a designer, developer, and entrepreneur since 2000." />
        <meta name="twitter:image" content="https://nerdburn.com/images/nerdburn-og-image.png" />
        <meta name="twitter:creator" content="@nerdburn" />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href="https://www.nerdburn.com" />      
      </Head>

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
