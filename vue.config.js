module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/JAML/'
  : '/',
  pwa: {
    name: 'JAML',
    themeColor: '#FF7B42',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    workboxPluginMode: 'GenerateSW',
  }
}