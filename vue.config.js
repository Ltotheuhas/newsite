const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },

  devServer: {
    host: '0.0.0.0',
    allowedHosts: "all",
  },

  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.txt$/,
          use: 'raw-loader',
        },
      ],
    },
  },
});
