const pkg = require('./package.json')
module.exports = {
  entry: 'src/main.js',
  filename: {js: `slot-editor-${pkg.version}.js`},
  extractCSS: false,
  sourceMap: false,
  vendor: false,
  html: {
    template: './index.ejs',
  },
}
