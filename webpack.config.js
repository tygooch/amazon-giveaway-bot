const path = require('path')
const WebpackUserscript = require('webpack-userscript')
const dev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname),
    filename: 'amazonGiveawayBot.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname),
    publicPath: 'https://localhost:8080/',
    hot: false,
    liveReload: true,
    port: 8080,
    disableHostCheck: true,
    https: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    useLocalIp: false,
  },
  plugins: [
    new WebpackUserscript({
      headers: {
        name: dev ? 'Amazon Giveaway Bot (dev)' : 'Amazon Giveaway Bot',
        version: dev ? `[version]-build.[buildNo]` : `[version]`,
        description: 'Automates Amazon giveaway entries',
        downloadURL: dev ? '' : 'https://github.com/TyGooch/amazon-giveaway-bot/raw/master/amazonGiveawayBot.user.js',
        updateURL: dev ? '' : 'https://github.com/TyGooch/amazon-giveaway-bot/raw/master/amazonGiveawayBot.meta.js',
        match: 'https://www.amazon.com/giveaway/*',
        grant: ['GM_setValue', 'GM_getValue', 'GM_addStyle', 'GM_notification', 'unsafeWindow', 'window.focus'],
        'run-at': 'document-start',
        noframes: true,
      },
      metajs: true,
      pretty: false,
    }),
  ],
}
