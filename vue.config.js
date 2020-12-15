module.exports = {
    filenameHashing: false,
    productionSourceMap: false,
    devServer: {
        port: 80,
        proxy: "http://localhost:8080",
        //todo 仅用于内网穿透演示
        inline: false,
        disableHostCheck: true
    },
    configureWebpack: {
        performance: {
            hints: false
        }
    }
}