const basePath = process.env.PAGES_BASE_PATH || "";
const normalizedBasePath =
  basePath && basePath !== "/" ? basePath.replace(/\/$/, "") : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: normalizedBasePath,
  assetPrefix: normalizedBasePath ? `${normalizedBasePath}/` : "",
};

export default nextConfig;
