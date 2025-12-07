import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    // 构建配置
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
        },
        // 生成sourcemap便于调试
        sourcemap: true,
    },

    // 开发服务器配置
    server: {
        port: 3000,
        open: true,
    },

    // 预览服务器配置
    preview: {
        port: 4173,
    },
})
