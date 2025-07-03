/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./styles'],
  },
  async redirects() {
    return [
      {
        source: '/excited-about-web3',
        destination: '/posts/excited-about-web3',
        permanent: true,
      },
      {
        source: '/automating-podcast-prep-work-with-ai',
        destination: '/posts/automating-podcast-prep-work-with-ai',
        permanent: true,
      },
      {
        source: '/get-a-cofounder-build-something-sell-something',
        destination: '/posts/get-a-cofounder-build-something-sell-something',
        permanent: true,
      },
      {
        source: '/in-support-of-lazy-writing',
        destination: '/posts/in-support-of-lazy-writing',
        permanent: true,
      },
      {
        source: '/maybe-ill-start-writing-again',
        destination: '/posts/maybe-ill-start-writing-again',
        permanent: true,
      },
      {
        source: '/the-new-fintech-stack-for-canadian-startups',
        destination: '/posts/the-new-fintech-stack-for-canadian-startups',
        permanent: true,
      },
      {
        source: '/theres-no-such-thing-as-work-life-balance',
        destination: '/posts/theres-no-such-thing-as-work-life-balance',
        permanent: true,
      },
      {
        source: '/unbundling-and-decentralization',
        destination: '/posts/unbundling-and-decentralization',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 