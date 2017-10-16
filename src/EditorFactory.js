import {default as Tokenizer} from 'shortcode-tokenizer'
import uuid from 'uuid/v4'

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
  vue.$options.components.TextEditor = require('@/editors/Text').default
  vue.$options.components.ImageEditor = require('@/editors/Image').default
  vue.$options.components.SectionEditor = require('@/editors/Section').default
  vue.$options.components.ContainerEditor = require('@/editors/Container').default
  vue.$options.components.RowEditor = require('@/editors/Row').default
  vue.$options.components.ColumnEditor = require('@/editors/Column').default
  vue.$options.components.DivEditor = require('@/editors/Div').default
  vue.$options.components.ProductListEditor = require('@/editors/ProductList').default
  vue.$options.components.HeroSliderEditor = require('@/editors/HeroSlider').default
  vue.$options.components.AddressBoxEditor = require('@/editors/AddressBox').default
  vue.$options.components.LogoEditor = require('@/editors/Logo').default
  vue.$options.components.PageTitleEditor = require('@/editors/PageTitle').default
  vue.$options.components.CardEditor = require('@/editors/Card').default
  vue.$options.components.ServiceBoxEditor = require('@/editors/ServiceBox').default
  vue.$options.components.SocialIconsEditor = require('@/editors/SocialIcons').default
  vue.$options.components.SitemapEditor = require('@/editors/Sitemap').default
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
      token.uuid = uuid()
      if (token.type === Tokenizer.TEXT) {
        return new Editor('text-editor', token)
      }
      if (token.name === 'service') {
        return new Editor('service-box-editor', token)
      }
      return new Editor(`${token.name}-editor`, token)
    })
}
