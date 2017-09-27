import {default as Tokenizer} from 'shortcode-tokenizer'

class Editor {
  constructor(use, token) {
    this.use = use
    this.token = token
  }
  update(content) {
    this.token.body = content
  }
}

/* computed property: callerId */
export function callerId() {
  return `${this.$options.name}-${this._uid}`
}

/* computed property: editors  */
export function editors() {
  return createEditors(this.token.children)
}

export function injectEditors(vue) {
  vue.$options.components.TextEditor = require('@/editors/Text')
  vue.$options.components.ImageEditor = require('@/editors/Image')
  vue.$options.components.SectionEditor = require('@/editors/Section')
  vue.$options.components.ContainerEditor = require('@/editors/Container')
  vue.$options.components.RowEditor = require('@/editors/Row')
  vue.$options.components.ColumnEditor = require('@/editors/Column')
  vue.$options.components.DivEditor = require('@/editors/Div')
  vue.$options.components.ProductListEditor = require('@/editors/ProductList')
  vue.$options.components.HeroSliderEditor = require('@/editors/HeroSlider')
  vue.$options.components.AddressBoxEditor = require('@/editors/AddressBox')
  vue.$options.components.LogoEditor = require('@/editors/Logo')
  vue.$options.components.PageTitleEditor = require('@/editors/PageTitle')
  vue.$options.components.ServiceBoxEditor = require('@/editors/ServiceBox')
  vue.$options.components.SocialIconsEditor = require('@/editors/SocialIcons')
  vue.$options.components.SitemapEditor = require('@/editors/Sitemap')
}

export function createEditors(content) {
  let tokens = content
  if (typeof content === 'string') {
    const tokenizer = new Tokenizer(null, {
      strict: false,
      skipWhiteSpace: true
    })
    tokens = tokenizer
      .input(content)
      .ast()
  }
  return tokens
    .filter(token => token.type !== Tokenizer.ERROR)
    .map((token, index) => {
      token.index = index
      if (token.type === Tokenizer.TEXT) {
        return new Editor('text-editor', token)
      }
      if (token.name === 'service') {
        return new Editor('service-box-editor', token)
      }
      return new Editor(`${token.name}-editor`, token)
    })
}
