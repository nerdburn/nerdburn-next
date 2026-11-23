import Head from 'next/head'

import books from '../data/books.json'

const description = 'Books Shawn Adrian has been listening to on Audible.'

const STANDALONE = 'Standalone'

// Series appear in the order they first show up in books.json, standalones last
const groupBySeries = (books) => {
  const groups = []
  const bySeries = {}
  books.forEach((book) => {
    const series = book.series || STANDALONE
    if (!bySeries[series]) {
      bySeries[series] = { series, books: [] }
      groups.push(bySeries[series])
    }
    bySeries[series].books.push(book)
  })
  return [
    ...groups.filter(({ series }) => series !== STANDALONE),
    ...groups.filter(({ series }) => series === STANDALONE)
  ]
}

const Reading = ({ books }) => {
  const groups = groupBySeries(books)
  return (
    <>
      <Head>
        <title>Reading | nerdburn</title>
        <meta name="description" content={description} />
        <meta name="author" content="Shawn Adrian" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Reading | nerdburn" />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://nerdburn.com/reading" />
        <meta property="og:image" content="https://nerdburn.com/images/nerdburn-og-image.png" />
        <meta property="og:site_name" content="nerdburn" />
        <link rel="canonical" href="https://www.nerdburn.com/reading" />
      </Head>

      <div className='reading'>
        <h1>Reading</h1>
        <p>Books I've been listening to on Audible.</p>
        {books.length === 0
          ? <p className='reading-empty'>Nothing here yet.</p>
          : (
            groups.map(({ series, books }) => (
              <div className='reading-group' key={series}>
                <h4>{series}</h4>
                <ul>
                  {books.map(({ title, author, url }) => (
                    <li key={url || title}>
                      {url ? <a href={url}>{title}</a> : <strong>{title}</strong>}
                      {author && <span className='author'> {author}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
      </div>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      books
    }
  }
}

Reading.Layouts = ['BaseLayout']
export default Reading
