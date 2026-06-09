import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const episodesPath = path.join(process.cwd(), 'data', 'podcast-episodes.json')
  const episodes = JSON.parse(fs.readFileSync(episodesPath, 'utf8'))

  const baseUrl = 'https://nerdburn.com'

  const items = episodes.map(ep => `    <item>
      <title>${escapeXml(ep.title)}</title>
      <description>${escapeXml(ep.description)}</description>
      <pubDate>${new Date(ep.date).toUTCString()}</pubDate>
      <enclosure url="${baseUrl}/podcast/${ep.file}" length="${ep.bytes}" type="audio/mpeg" />
      <guid isPermaLink="false">${ep.file}</guid>
      <itunes:duration>${ep.duration}</itunes:duration>
      <itunes:episodeType>full</itunes:episodeType>
    </item>`).join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>The Digest — Shawn's Daily Briefing</title>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <description>A daily AI-generated podcast summarizing the best products, articles, and ideas from Shawn's curated feeds. Tech, design, and the builder world — in under 10 minutes.</description>
    <itunes:author>Shawn Adrian</itunes:author>
    <itunes:owner>
      <itunes:name>Shawn Adrian</itunes:name>
      <itunes:email>shawn@inputlogic.ca</itunes:email>
    </itunes:owner>
    <itunes:category text="Technology" />
    <itunes:explicit>false</itunes:explicit>
${items}
  </channel>
</rss>`

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.write(feed)
  res.end()
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
