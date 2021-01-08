module.exports = {
  lintOnSave: true, // 关闭eslint语法检查
  outputDir: 'dist', // 配置打包后的整个输出根路径
  assetsDir: './static/', // 配置打包后生成的静态资源{css、fonts、img、js}的路径
  publicPath: './', // 配置部署应用包时的基本 URL。所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径
  indexPath: './index.html', // 配置生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
  filenameHashing: true // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
}
