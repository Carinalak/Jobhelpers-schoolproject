import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
 
// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ["@digi/arbetsformedlingen"],
  },
  plugins: [react()],
  base: '/Jobhelpers-schoolproject/',
});