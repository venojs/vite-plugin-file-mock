import { defineConfig } from 'vite'
import mockPlugin from 'vite-plugin-file-mock'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mockPlugin({
      // enable: true,
    })
  ],
})
