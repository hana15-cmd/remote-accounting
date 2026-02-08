import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    federation({
      name: "mfe_accounting_app",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        react: {
          requiredVersion: "^19.2.0",
        },
        "react-dom": {
          requiredVersion: "^19.2.0",
        },
        "react-router-dom": {
          requiredVersion: "^7.0.0",
        },
      },
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  preview: {
    port: 5002,
    strictPort: true,
    cors: true,
  },
  server: {
    port: 5002,
    strictPort: true,
    cors: true,
  },
});