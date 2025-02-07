---
title: 'Automating Podcast Prep Work with AI'
date: '2025-02-06'
---

Last year, I reluctantly started a podcast. Today, I'm excited to share the website that our team and I put together for it: [Internet Plumber](https://internetplumber.co). While there are still a few details to polish up, I wanted to share how we've automated much of the podcast workflow using AI.

![Internet Plumber](/images/internet-plumber-site.png)

## The backstory

When Elysse approached Gavin and me about creating a company podcast for [Input Logic](https://inputlogic.ca), my immediate response was: No way, I don’t have time to prep for episodes! So, we came up with this idea to collect all the links our team is sharing in slack, and then just click on them together in real-time, easy peasy, right?

## Automating the podcast workflow with AI

To streamline the process, Gavin Vickery used his YAML-based AI automation framework (codename: Sidekick, coming soon) to handle the podcast's prep work.

![Sidekick AI Automation Framework](/images/sidekick-yaml.png)

First, an AI agent fetches all the links shared in specific Slack channels in our teams Slack (AI, code, design, random).
It visits each link, generates a one-line summary, and assigns an emoji for quick context.

![Often we rewrite these](/images/link-style.png)

The Sidekick AI then runs a script that pushes all the links into our Sanity CMS for the website and formats them for a custom Campaign Monitor email template.

![Campaign Monitor Email Template](/images/newsletter-example.png)

Elysse then manually edits the email newsletter, refines any links that need tweaking, and sends it out every Friday.

## Recording the actual podcast

We use Riverside to record the podcast. We click each link in real-time, discuss, and also riff on whatever happened in tech that week — it feels pretty water-cooler. Elysse Bujold handles post-production: recording in Riverside, editing in Premiere, transcribing in Descript, then publishing to Spotify and YouTube.

![Riverside Recording Interface](/images/riverside-recording.png)

Once the episode is published our AI agent grabs the podcast's RSS feed, creates the next episode in Sanity CMS, and links it to the relevant link list.

## The result

With minimal effort, our AI-powered workflow allows us to jam out a weekly podcast without too many hours of preparation. Everything syncs with our website, email newsletter, and podcast platforms.

Check it out for yourself at [Internet Plumber](https://internetplumber.co) ✨.