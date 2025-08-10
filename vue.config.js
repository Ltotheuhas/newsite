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
    proxy: {
      '/fastfetch': {
        target: 'https://api.luhas.gratis',
        changeOrigin: true,
        secure: true,
      },
    },
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
