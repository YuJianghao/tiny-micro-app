import { defineConfig } from "vite"

export default defineConfig({
  server: {
    port: 5174,
    headers:{
      'Access-Control-Allow-Origin': '*',
    }
  },
})
