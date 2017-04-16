
const path = require(`path`);
const webpack = require(`webpack`); // Da bundling modules!
const merge = require(`webpack-merge`); // Merge together configurations!
const cssImport = require(`postcss-import`);
const cssnext = require(`postcss-cssnext`);
const HtmlWebpackExcludeAssetsPlugin = require(`html-webpack-exclude-assets-plugin`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);

const TARGET = process.env.npm_lifecycle_event;

function getPaths(t, clientPaths) {
  const paths = {
    mode: `dev`,
    name: ``,
    app: ``,
    build: ``,
    toProcess: [],
    shared: clientPaths.shared
  };

  if (t.indexOf(`prod`) !== -1)
    paths.mode = `prod`;

  if (t.indexOf(`login`) !== -1) {
    paths.name = `login`;
    paths.app = clientPaths.login.src;
    paths.build = clientPaths.login.build;
  }

  if (t.indexOf(`admin`) !== -1) {
    paths.name = `admin`;
    paths.app = clientPaths.admin.src;
    paths.build = clientPaths.admin.build;
  }

  paths.toProcess.push(paths.app);
  paths.toProcess.push(clientPaths.shared);

  return paths;
}

const CLIENT_PATHS = {
  admin: {
    src: path.join(__dirname, `clients/admin-panel/src`),
    build: path.join(__dirname, `clients/admin-panel/build`)
  },
  login: {
    src: path.join(__dirname, `clients/login/src`),
    build: path.join(__dirname, `clients/login/build`)
  },
  shared: path.join(__dirname, `clients/shared`)
};

const PATHS = Object.assign({}, getPaths(TARGET, CLIENT_PATHS), {
  assets: path.join(__dirname, `assets`)
});

const COMMON_CONFIGURATION = {
  entry: {
    app: PATHS.app
  },
  resolve: {
    extensions: [`.js`, `.jsx`], // Resolve these extensions
    alias: {
      components: path.resolve(PATHS.app, `components`),
      icons: path.resolve(PATHS.app, `icons`),
      stores: path.resolve(PATHS.app, `stores`),
      shared: PATHS.shared
    }
  },
  output: {
    path: PATHS.build,
    filename: `bundle.js`
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: PATHS.toProcess,
        use: [
          {
            loader: `style-loader`
          },
          {
            loader: `css-loader`
          },
          {
            loader: `postcss-loader`
          }
        ]
      },
      {
        test: /\.jsx?$/,
        loader: `babel-loader`,
        include: PATHS.toProcess,
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: `file-loader`,
            options: {
              hash: `sha512`,
              digest: `hex`,
              name: `[hash].[ext]`
            }
          },
          {
            loader: `image-webpack-loader`,
            options: {
              bypassOnDebug: true
            }
          }
        ],
        include: PATHS.toProcess
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(PATHS.mode === `dev` ? `development` : `production`)
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      options: {
        imageWebpackLoader: {
          gifsicle: {
            interlaced: false
          },
          optipng: {
            optimizationLevel: 7
          }
        }
      }
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.css$/,
      options: {
        postcss: {
          plugins: [
            cssImport({
              path: PATHS.toProcess,
              addDependencyTo: webpack
            }),
            cssnext
          ]
        }
      }
    }),
    new HtmlWebpackPlugin({
      excludeAssets: [/\.min\.js$/],
      template: path.join(PATHS.assets, `index.html`)
    }),
    new HtmlWebpackExcludeAssetsPlugin()
  ]
};

switch (PATHS.mode) {
  case `dev`:
    module.exports = merge(COMMON_CONFIGURATION, {
      devServer: {
        contentBase: PATHS.build,
        historyApiFallback: true,
        hot: true,
        inline: true,
        stats: `errors-only`,
        host: `0.0.0.0`,
        https: false,
        proxy: {
          '/api': `http://localhost:3000`
        }
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin()
      ],
      devtool: `eval-source-map`
    });
    break;
  case `prod`:
    module.exports = merge(COMMON_CONFIGURATION, {
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify(`production`)
          }
        }),
        new webpack.optimize.UglifyJsPlugin()
      ]
    });
    break;

  default:
    throw new Error(`No such target!`);
}
