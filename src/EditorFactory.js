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

export function wrap(token, index) {
  token.index = index
  if (token.type === Tokenizer.TEXT) {
    return new Editor('text-editor', token)
  }
  return new Editor(`${token.name}-editor`, token)
}

export default function create(content) {
  let tokens = content
  if (typeof content === 'string') {
    const tokenizer = new Tokenizer()
    tokenizer.strict = false
    tokens = tokenizer
      .input(content)
      .ast()
  }
  return tokens
    .filter(token => token.type !== Tokenizer.ERROR)
    .filter(token => {
      if (token.type !== Tokenizer.TEXT) { return true }
      return token.body.replace(/\s/g, '').length > 0
    })
    .map(wrap)
}
