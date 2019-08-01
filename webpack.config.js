module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  entry: "./src/ts/index.ts",
  output: {
    path: __dirname + "dist/lib",
    library: "MonacoMarkdown",
    libraryTarget: "umd",
    umdNamedDefine: true,
    filename: "monaco-markdown.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts"],
  },
  plugins: [],
  externals: {
    "monaco-editor": {
      amd: "vs/editor/editor.main",
      commonjs: "monaco-editor",
      commonjs2: "monaco-editor",
      root: "monaco"
    }
  }
};
