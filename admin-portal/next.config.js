/** @type {import('next').NextConfig} */
const nextConfig = {
    // Other Next.js configurations can go here
    images: {
      domains: ['storage.googleapis.com'], // Add this line
    },
    // Configure middleware
    async middleware() {
      return [
        {
          source: '/((?!api/|_next/static|_next/image|favicon.ico).*)', // Exclude API routes and static files
          middleware: './middleware.ts', // Path to your middleware file
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  