const path = require('path')
const WebpackUserscript = require('webpack-userscript')
const dev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: path.join(__dirname, 'src', 'index.js'),
  // {
  //   index: path.join(__dirname, 'src', 'index.js'),
  // address: path.join(__dirname, 'src/util', 'address.js'),
  // captcha: path.join(__dirname, 'src/util', 'captcha.js'),
  // giveaway: path.join(__dirname, 'src/util', 'giveaway.js'),
  // logger: path.join(__dirname, 'src/util', 'logger.js'),
  // signIn: path.join(__dirname, 'src/util', 'signIn.js'),
  // styles: path.join(__dirname, 'src/util', 'styles.js'),
  // uiTemplate: path.join(__dirname, 'src/util', 'uiTemplate.js'),
  // unfollow: path.join(__dirname, 'src/util', 'unfollow.js'),
  // win: path.join(__dirname, 'src/util', 'win.js'),
  // },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'amazon-giveaway-bot.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: 'https://localhost:8080/',
    // host: '0.0.0.0',
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
        // version: `[version]`,
        description: 'Automates Amazon giveaway entries',
        downloadURL: dev ? '' : 'https://github.com/TyGooch/amazon-giveaway-bot/raw/master/amazonGiveawayBot.user.js',
        updateURL: dev ? '' : 'https://github.com/TyGooch/amazon-giveaway-bot/raw/master/amazonGiveawayBot.user.js',
        match: 'https://www.amazon.com/giveaway/*',
        // require: dev ? 'https://localhost:8080/amazon-giveaway-bot.user.js' : '',
        grant: ['GM_setValue', 'GM_getValue', 'GM_addStyle', 'GM_notification', 'unsafeWindow', 'window.focus'],
        'run-at': 'document-start',
        noframes: true,
      },
      metajs: true,
      pretty: false,
    }),
  ],
}
