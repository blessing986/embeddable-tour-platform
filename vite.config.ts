import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
    react(),                     // ← REQUIRED!
    tsconfigPaths(),
    dts({ insertTypesEntry: true }),
  ],
 define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: "src/widget-entry.ts",
      name: "OnboardWidget",
      fileName: (format) => `onboard.${format}.js`,
      formats: ["es", "iife"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
})
