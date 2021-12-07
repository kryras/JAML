module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/JAML/'
    : '/',
  pwa: {
    name: 'JAML',
    themeColor: '#FF7B42',
    msTileColor: '#FFFFFF',
    manifestOptions: {
      background_color: "#FFFFFF"
    },
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    workboxPluginMode: 'GenerateSW',
  }
}