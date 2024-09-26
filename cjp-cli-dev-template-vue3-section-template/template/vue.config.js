const { defineConfig } = require("@vue/cli-service");
const CjpCliDevSectionPlugin = require("cjp-cli-dev-vue3-section-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new CjpCliDevSectionPlugin()],
  },
});
