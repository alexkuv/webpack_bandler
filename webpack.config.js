const path = require('path');
const fs = require('fs');
const isProd = process.env.NODE_ENV === 'production';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const pagesPath = path.resolve(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesPath);

const createHtmlPlugins = () => {
  return pages.map(page => {
    if 
    (
      fs.existsSync(path.resolve(pagesPath, page)) &&
      path.extname(page) === '.hbs'
    ) {
      return new HtmlWebpackPlugin({
        scriptLoading: 'blocking',
        minify: false,
        filename: `${path.parse(page).name}.html`,
        template: `${path.join(pagesPath, page)}`
      })
    }
  }).filter(el => el);
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'inline-source-map',
  devServer: {
    port: 8080,
    hot: !isProd,
    open: !isProd,
    static: {
      directory: path.join(__dirname, 'dist')
    },
    watchFiles: [pagesPath, `${path.resolve(__dirname, 'src', 'components')}/**/*.hbs`]
  },
  resolve: {
    extensions: ['.js', '.postcss'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  stats: {
    children: true
  },
  entry: {
    index: {
      import: './components/index.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.postcss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-import',
                  'postcss-each',
                  'postcss-for',
                  'postcss-calc',
                  'postcss-nested',
                  ['autoprefixer', {
                    overrideBrowserslist:['ie >= 8', 'last 4 version']
                  }],
                  'postcss-color-function',
                  ['postcss-url', {
                    url: 'inline'
                  }],
                ]
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.hbs$/i,
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              partialDirs: path.join(__dirname, 'src', 'components')
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false
          }
        },
        extractComments: false
      }),
      new CssMinimizerPlugin()
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundles/common.css',
    }),
    new CopyPlugin({
      patterns: [
        { from: "assets/img/*", to: "assets/img/[name][ext]", noErrorOnMissing : true },
        { from: "assets/temp/*", to: "assets/temp/[name][ext]", noErrorOnMissing : true },
        { from: 'assets/favicons/*', to: 'assets/favicons/[name][ext]', noErrorOnMissing : true},
      ],
    }),
  ].concat(createHtmlPlugins()),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundles/common.js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true
  },
};