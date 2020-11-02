module.exports = {
    filenameHashing: false,
    productionSourceMap: false,
    devServer: {
        port: 80,
        proxy: "http://localhost:8080"
    },
    configureWebpack: {
        performance: {
            hints: false
        }
    }
}