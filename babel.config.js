const prodPlugin = []; // 配置一个要展开的生产插件
if (process.env.NODE_ENV === 'production') { // 如果是生产环境去除console
  prodPlugin.push('transform-remove-console');
}


module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset'
  ],
  // plugins: [
  //   ...prodPlugin // 展开到插件中
  // ],
  'env': {
    'development': {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      // https://panjiachen.github.io/vue-element-admin-site/guide/advanced/lazy-loading.html
      'plugins': ['dynamic-import-node']
    }
  }
}
