/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true
      },
      reactStrictMode: true,
      swcMinify: true,
};

export default nextConfig;
