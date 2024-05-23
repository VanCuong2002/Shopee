import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
    plugins: [react(), visualizer()],
    server: {
        port: 3000
    },
    css: {
        devSourcemap: true
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, './src')
        }
    }
})
