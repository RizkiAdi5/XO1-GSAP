import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX({});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // public/ files default to `max-age=0, must-revalidate`: every page change
  // re-asks the server about every animation (1–4MB each). Cache for a day and
  // serve from cache while revalidating for a week after that.
  // ponytail: names aren't content-hashed, so a replaced file can stay stale for
  // up to a day; rename the file (or import it) when swapping an asset.
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default withNextIntl(withMDX(nextConfig));
