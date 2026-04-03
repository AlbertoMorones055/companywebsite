import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import imagemin from "vite-plugin-imagemin";
import purgecss from "vite-plugin-purgecss";

export default defineConfig(() => {
  const shouldUseImagemin =
    process.env.VERCEL !== "1" && process.env.CI !== "true";

  return {
    plugins: [
      react(),
      ...(shouldUseImagemin
        ? [
            imagemin({
              gifsicle: { optimizationLevel: 7 },
              optipng: { optimizationLevel: 7 },
              mozjpeg: { quality: 80 },
              pngquant: { quality: [0.8, 0.9], speed: 4 },
              svgo: { plugins: [{ removeViewBox: false }] },
            }),
          ]
        : []),
      purgecss(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
          },
        },
      },
    },
  };
});
