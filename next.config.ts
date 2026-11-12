import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/api/downloads/[filename]": [
      "./node_modules/pdfkit/js/standard-fonts/**/*",
      "./node_modules/@fontsource/inter/files/inter-latin-400-normal.woff",
      "./node_modules/@fontsource/inter/files/inter-latin-700-normal.woff",
      "./node_modules/@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff",
    ],
  },
};

export default nextConfig;
