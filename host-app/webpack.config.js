const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const packageJson = require('./package.json');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    clean: true
  },
  devServer: {
    port: 3000,
    historyApiFallback: {
      rewrites: [{ from: /./, to: '/' }]
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'hdfcHostApp',
      filename: 'remoteEntry.js',
      remotes: {
        businessReports: 'businessReports@http://localhost:3010/remoteEntry.js',
        modelPortfolio: 'modelPortfolio@http://localhost:3011/remoteEntry.js',
        outgoingApiLogs: 'outgoingApiLogs@http://localhost:3012/remoteEntry.js',
        incomingApiLogs: 'incomingApiLogs@http://localhost:3013/remoteEntry.js',
        makerRequests: 'makerRequests@http://localhost:3014/remoteEntry.js',
        vroUploads: 'vroUploads@http://localhost:3015/remoteEntry.js'
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: packageJson.dependencies.react,
          eager: true
        },
        'react-dom': {
          singleton: true,
          requiredVersion: packageJson.dependencies['react-dom'],
          eager: true
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};