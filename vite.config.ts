import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // You're using SWC, which is fine.
import path from "path";
import { visualizer } from "rollup-plugin-visualizer"; // Import visualizer

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8080,
    strictPort: true,
    fs: {
      strict: true,
      allow: [".."]
    }
  },
  plugins: [
    react(),
    mode === "development" && // Conditional plugin
    // Add visualizer, it's helpful for both dev and prod analysis if needed
    // but typically you'd run it after a 'build' command.
    // You can make it conditional too if you only want it for 'build' mode.
    visualizer({
      open: true, // Automatically open in browser after build
      gzipSize: true,
      brotliSize: true,
      filename: "dist/stats.html", // Output stats file to the dist folder
    }),
  ].filter(Boolean), // Keeps the array clean if a plugin is conditionally false
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true, // Good for debugging production issues if needed
    chunkSizeWarningLimit: 700, // Example: Increase warning limit if needed after optimizations
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks(id, { getModuleInfo }) {
          // Group Firebase SDKs into a single chunk
          if (id.includes("node_modules/@firebase")) {
            return "firebase-vendor";
          }
          // Group React Router and related routing libraries
          if (
            id.includes("node_modules/react-router-dom") ||
            id.includes("node_modules/@remix-run") ||
            id.includes("node_modules/react-router")
          ) {
            return "router-vendor";
          }
          // Group Radix UI (used by ShadCN) components
          if (id.includes("node_modules/@radix-ui")) {
            return "radix-ui-vendor";
          }
          // Group other large, commonly used vendor libraries
          if (id.includes("node_modules/lucide-react")) {
            return "lucide-icons-vendor";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "react-query-vendor";
          }

          // Example: If you have many custom UI components under components/ui
          // that aren't part of Radix and are used across many pages,
          // you might consider grouping them.
          // if (id.includes('src/components/ui/')) {
          //   return 'custom-ui-components';
          // }

          // Code-split large page components if React.lazy isn't enough
          // or if specific large components within pages need to be split.
          // This is more advanced and typically React.lazy is preferred for pages.
          // const moduleInfo = getModuleInfo(id);
          // if (moduleInfo && moduleInfo.isEntry && id.includes('src/pages/')) {
          //   const pageName = path.basename(id, path.extname(id)).toLowerCase();
          //   return `page-${pageName}`;
          // }
        },
      },
    },
  },
}));
