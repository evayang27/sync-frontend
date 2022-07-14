import { defineConfig } from "vite";
import { createVuePlugin as vue } from "vite-plugin-vue2";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import legacy from "@vitejs/plugin-legacy";
import path from "path";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/custom.scss";
        `,
      },
    },
  },

  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  server: {
    port: "8080",
  },

  plugins: [
    createSvgIconsPlugin({
      iconDirs: [
        path.resolve(__dirname, "src/assets/icons/editor"),
        path.resolve(__dirname, "src/assets/icons"),
      ],
      symbolId: "[name]",
    }),

    legacy({
      targets: ["defaults", "not IE 11"],
    }),

    vue({
      target: "es2015",
      vueTemplateOptions: {
        compilerOptions: {
          whitespace: "condense",
        },

        transformAssetUrls: {
          video: ["src", "poster"],
          source: "src",
          img: "src",
          image: "xlink:href",
          "b-avatar": "src",
          "b-img": "src",
          "b-img-lazy": ["src", "blank-src"],
          "b-card": "img-src",
          "b-card-img": "src",
          "b-card-img-lazy": ["src", "blank-src"],
          "b-carousel-slide": "img-src",
          "b-embed": "src",
        },
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },

    extensions: [".mjs", ".js", ".json", ".vue"],
  },
});
