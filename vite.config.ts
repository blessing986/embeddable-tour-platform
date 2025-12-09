import { defineConfig } from 'vite'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths()
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {} // optional fallback
  },
  build: {
    lib: {
      entry: "src/widget-entry.ts",
      name: "OnboardWidget",
      fileName: (format) => `onboard.${format}.js`,
      formats: ["iife"]
    },
     rollupOptions: {
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    },
    minify: "esbuild"
  },
})
