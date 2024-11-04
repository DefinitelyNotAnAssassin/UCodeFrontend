import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const basenameProd = "/frontend/"

export default defineConfig(({ command }) => {
  const isProd = command === "build"

  return {
    base: "https://ucode-five.vercel.app/",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
