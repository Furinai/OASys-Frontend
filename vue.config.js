module.exports = {
    outputDir: "dist",
    filenameHashing: false,
    productionSourceMap: false,
    devServer: {proxy: "http://localhost"},
    configureWebpack: {performance: {hints: false}}
};