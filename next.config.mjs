/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "react-pdf"],
  },
}

export default nextConfig
