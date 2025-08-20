import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  output: "standalone", 
  outputFileTracingRoot: path.join(__dirname),   // 👈 important for Vercel builds
};

export default nextConfig;

