const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "production" ? "/newsite/" : "/",
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },

  devServer: {
    host: 'localhost',
    allowedHosts: "all", // This line allows Localtunnel and other external connections
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
