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
  vue.$options.components.ProductListEditor = require('@/editors/ProductList')
  vue.$options.components.ContainerEditor = require('@/editors/Container')
  vue.$options.components.RowEditor = require('@/editors/Row')
  vue.$options.components.ColumnEditor = require('@/editors/Column')
  vue.$options.components.TextEditor = require('@/editors/Text')
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
      return new Editor(`${token.name}-editor`, token)
    })
}
