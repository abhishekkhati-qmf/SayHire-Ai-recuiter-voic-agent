/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'img.freepik.com',
      'lh3.googleusercontent.com',
      'cdn-icons-png.flaticon.com',
      'zvlbcadrwnbjbtulqvfl.supabase.co'
    ],
  },
  output: "standalone",   // 👈 important for Vercel builds
  experimental: {
    appDir: true,          // 👈 only if you are using /app router
  },
};

export default nextConfig;

