import { remark } from 'remark'
import html from 'remark-html'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { visit } from 'unist-util-visit'

const postsDirectory = path.join(process.cwd(), 'content')

// moved this up here so all id's are returned the same
const getId = (fileName) => {
  if (!fileName)
    return false
  return fileName.replace('&', 'and').replace(`'`, '').replace(/\.md$/, '')
}

// returns list of posts without html content
export function getPosts() {
  
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  
  const allPostsData = fileNames.filter((fileName) => {
    // filter out any filename that doesn't look like markdown
    if (fileName.startsWith('.') || !fileName || !fileName.endsWith('.md')) {
      return false
    }
    return true  
  }).map(fileName => {
    
    // Remove ".md" from file name to get id
    const id = getId(fileName)

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  
  return fileNames.map(fileName => {
    return {
      params: {
        id: getId(fileName)
      }
    }
  })
}

// New remark plugin for tweet transformation
function remarkTweets() {
  return (tree) => {
    visit(tree, 'paragraph', (node) => {
      const { children } = node
      
      // Look for tweet syntax in text nodes
      children.forEach((child, index) => {
        if (child.type !== 'text') return
        
        const matches = child.value.match(/{%\s*tweet\s+url="([^"]+)"\s*%}/g)
        if (!matches) return
        
        // Replace the text node with HTML node
        matches.forEach(match => {
          const url = match.match(/url="([^"]+)"/)[1]
          const tweetId = url.split('/').pop()
          
          child.type = 'html'
          child.value = `
            <div class="tweet" data-tweet-id="${tweetId}">
              <blockquote class="twitter-tweet">
                <a href="${url}">Loading tweet...</a>
              </blockquote>
              <script async src="https://platform.twitter.com/widgets.js"></script>
            </div>`
        })
      })
    })
  }
}

export async function getPostById(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)
  
  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkTweets) // Add the tweet plugin
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()
  
  // Combine the data with the id and contentHtml
  return {
    id,
    html: contentHtml,
    ...matterResult.data
  }
}

export async function getLatestPost() {
  const posts = getPosts()
  const latestPost = posts[0]
  
  const fullPath = path.join(postsDirectory, `${latestPost.id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)
  
  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkTweets) // Add the tweet plugin
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()
  
  // Combine the data with the id and contentHtml
  return {
    id: latestPost.id,
    html: contentHtml,
    ...matterResult.data
  }
}