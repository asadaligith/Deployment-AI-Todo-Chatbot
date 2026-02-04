/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  async rewrites() {
    // Use environment variable for backend URL (Kubernetes service discovery)
    const backendUrl = process.env.BACKEND_URL || 'http://backend-svc:8000';
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
