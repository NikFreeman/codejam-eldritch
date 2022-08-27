const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDev = process.env.NODE_ENV === "development";
// const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);
const filename = (ext) => `[name].${ext}`;
// const isProd = !isDev

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      // options: {
      //   hmr: isDev,
      //   reloadAll: true,
      // },
    },
    "css-loader",
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

module.exports = {
  mode: "development",
  entry: "/src/js/",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: filename("js"),
    assetModuleFilename: "images/[name][ext]",
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: "asset/resource",
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders("sass-loader"),
      },
    ],
  },
};
