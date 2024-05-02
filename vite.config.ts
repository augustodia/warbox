import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import { createVuexPlugin } from "vite-plugin-vuex";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      svgoConfig: {
        plugins: ["prefixIds"],
      },
    }),
    createVuexPlugin(),
  ],
  server: {
    https: true,
  },
});
