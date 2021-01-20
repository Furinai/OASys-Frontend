import vue from '@vitejs/plugin-vue'

export default {
    plugins: [vue()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        },
        hmr: {
            overlay: false
        }
    },
    optimizeDeps: {
        include: [
            'element-plus/lib/locale/lang/zh-cn',
            'dayjs/locale/zh-cn.js',
            'dayjs'
        ]
    }
}