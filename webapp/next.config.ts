import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // {
      //   source: "/",
      //   destination: "/projects",
      //   permanent: true,
      // },
      //   {
      //     source: "/projects/:id",
      //     destination: "/projects/:id/suites",
      //   permanent: true,
      // },
    ]
  },
}

export default nextConfig
