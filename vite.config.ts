import path from "path";
import { defineConfig } from "vite";

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), "node_modules/$1"),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), "src/$1"),
      },
    ],
  },
  server: { port: 3000 },
  preview: { port: 3000, open: true },
  build: {
    rollupOptions: {
      // external: ['@mui/utils'],
    },
  },
});
