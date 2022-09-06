const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new ESLintPlugin({
    extensions: ['js', 'ts', 'jsx', 'tsx'],
    fix: true,
    quiet: true
  }),
];
