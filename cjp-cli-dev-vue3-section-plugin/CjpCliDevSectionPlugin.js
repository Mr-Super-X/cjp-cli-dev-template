const HtmlWebpackPlugin = require("html-webpack-plugin"); // 用于修改模板文件

class CjpCliDevSectionPlugin {
  constructor(option) {
    console.log("CjpCliDevSectionPlugin init");
  }

  apply(compiler) {
    // 1.修改模板文件的路径为壳应用下的public/index.html
    //   使用html-webpack-plugin
    const config = {
      title: "代码片段壳应用插件",
      template: require.resolve("./public/index.html"),
    };
    compiler.options.plugins.push(new HtmlWebpackPlugin(config));
    // 2.修改模板entry路径（默认指向src/main.js）为壳应用下的src/index.js
    compiler.options.entry.app.import[0] = require.resolve("./src/index.js");
    // 3.让壳应用中index.js能够找到代码片段中的源码文件
    // 通过别名@section来拿到当前目录下/src/index.vue
    compiler.options.resolve.alias[
      "@section"
    ] = `${process.cwd()}/src/index.vue`;
  }
}

module.exports = CjpCliDevSectionPlugin;
