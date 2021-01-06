module.exports = {
    optimizeDeps: {
        include: [
            'element-plus/lib/locale/lang/zh-cn',
            'dayjs/locale/zh-cn.js',
            'dayjs'
        ]
    },
    proxy: {
        '/api': {
            target: 'http://localhost:8080'
        }
    }
}