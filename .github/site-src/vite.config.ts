import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.P3D_BASE_PATH || "./",
  publicDir: process.env.P3D_PUBLIC_DIR || "public",
  plugins: [react()],
});
