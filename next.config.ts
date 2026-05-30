import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */

    webpack: (config, { isServer }) => {
        if (isServer) {
            // ✅ Solves the page data collection failure by mocking missing system modules/JSONs
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                crypto: false,
            };

            // Ignore native optional binaries that don't exist in serverless environments
            config.externals = [...(config.externals || []), { canvas: 'empty', noders: 'empty' }];
        }
        return config;
    },
};

export default nextConfig;