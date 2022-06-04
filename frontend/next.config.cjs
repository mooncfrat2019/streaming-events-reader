/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_PORT: (process.env?.BACKEND_PORT && process.env.BACKEND_PORT.length) ? process.env.BACKEND_PORT : 6000,
    NEXT_PUBLIC_BACKEND_HOST: (process.env?.BACKEND_HOST && process.env.BACKEND_HOST.length) ? process.env.BACKEND_HOST : "localhost"
  },
};

module.exports = nextConfig;
