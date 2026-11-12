import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/api/downloads/[filename]": ["./node_modules/pdfkit/js/standard-fonts/**/*"],
  },
};

export default nextConfig;
