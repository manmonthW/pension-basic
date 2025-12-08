import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, existsSync, mkdirSync } from 'fs'

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

    // 插件：复制静态文件
    plugins: [
        {
            name: 'copy-static-files',
            closeBundle() {
                // 确保dist目录存在
                if (!existsSync('dist')) {
                    mkdirSync('dist', { recursive: true });
                }
                // 复制JS和CSS文件
                const filesToCopy = ['app.js', 'main.js', 'styles.css'];
                filesToCopy.forEach(file => {
                    if (existsSync(file)) {
                        copyFileSync(file, `dist/${file}`);
                        console.log(`✓ Copied ${file} to dist/`);
                    }
                });
            }
        }
    ],

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
