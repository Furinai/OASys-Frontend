module.exports = {
    optimizeDeps: {
        include: ['element-plus/lib/locale/lang/zh-cn']
    },
    proxy: {
        '/api': {
            target: 'http://localhost:8080'
        }
    }
}