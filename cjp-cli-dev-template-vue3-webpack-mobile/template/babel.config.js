module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      // 自定义babel-plugin
      './src/babels/async-add-try-catch-plugin',
      {
        exclude: ['node_modules'],
        includes: ['main.js'],
        customLog: 'myCustomLog',
      },
    ],
  ],
}
