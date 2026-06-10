/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence Supabase/Gemini package warnings in server components
  serverExternalPackages: ['@google/genai'],
};

export default nextConfig;
