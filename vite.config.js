import { defineConfig } from "vite";

export default defineConfig({
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  // root: "./src",
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "./index.html",
        "heavy-with-worker": "./heavy-with-worker.html",
        "heavy-without-worker": "./heavy-without-worker.html",
        "light-with-worker": "./light-with-worker.html",
        "light-without-worker": "./light-without-worker.html",
      },
    },
  },
});

// export default {
//   root: "./src",
//   build: {
//     outDir: "../dist",
//     emptyOutDir: true,
//     rollupOptions: {
//       input: {
//         index: "./src/index.html",
//         about: "./src/about.html",
//         article: "./src/blog/article.html",
//       },
//     },
//   },
// };
