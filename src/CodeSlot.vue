<script>
import {default as Tokenizer} from 'shortcode-tokenizer'
import Vue from 'vue'

const hyphenateRE = /([^-])([A-Z])/g
const hyphenate = str => {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
}

/* map from code to component */
const codeMap = {
}

let containerClasses = []

const allComponents = Object.values(codeMap)
  .reduce(function (all, c) {
    all[hyphenate(c.name)] = c
    return all
  }, {})

function renderToken(token) {
  return wrapKeepAlive(
      renderText(
        renderSelfClosing(
          renderOpen(token)
        )
      )
    ).output
}

function wrapKeepAlive(token) {
  if (typeof token.params['keep-alive'] !== 'undefined') {
    token.output = `<keep-alive>${token.output}</keep-alive>`
  }
  return token
}

function renderParams(token) {
  if (Object.keys(token.params)) {
    return ' ' + Object.entries(token.params)
      .map(pair => {
        if (pair[0] === 'keep-alive') {
          return null
        }
        if (pair[0] === 'container-class') {
          containerClasses.push(pair[1])
          return null
        }
        let value = pair[1]
        let key = ':' + pair[0]
        if (typeof pair[1] === 'string') {
          value = `"${value}"`
          key = pair[0]
        }
        return `${key}=${value}`
      })
      .join(' ')
  }
  return ''
}

function renderText(token) {
  if (token.type === Tokenizer.TEXT || token.type === Tokenizer.ERROR) {
    token.output = token.body
  }
  return token
}

function renderOpen(token) {
  if (token.type === Tokenizer.OPEN) {
    const name = getComponentName(token)
    const params = renderParams(token)
    const children = token.children
      .map(renderToken)
      .join('')
    token.output = `<${name}${params}>${children}</${name}>`
  }
  return token
}

function ensureOneRoot(source, content) {
  if (source.length === 0 ||
      source.length > 1 ||
      source[0].type === Tokenizer.TEXT ||
      source[0].type === Tokenizer.ERROR) {
    return `<div class="${containerClasses.join(' ')}">${content}</div>`
  }
  return content
}

function renderSelfClosing(token) {
  if (token.type === Tokenizer.SELF_CLOSING) {
    const name = getComponentName(token)
    const params = renderParams(token)
    token.output = `<${name}${params}></${name}>`
  }
  return token
}

function getComponentName(token) {
  if (typeof codeMap[token.name] === 'undefined') {
    throw new Error(`Unknown code: ${token.name}`)
  }
  return hyphenate(codeMap[token.name].name)
}

export default {
  name: 'CodeSlot',
  props: {
    content: {
      type: String,
      required: true
    },
    strict: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    renderContent() {
      try {
        containerClasses = []
        const ast = this.tokenizer
          .input(this.content.replace(/\s+$/g, ''))
          .ast()
        const content = ast
          .map(renderToken)
          .join('')
        return ensureOneRoot(ast, content)
      } catch (err) {
        // TODO use error component
        console.error(err)
        return `<div class="error">${err.message}</div>`
      }
    }
  },
  created() {
    this.tokenizer = new Tokenizer()
    this.tokenizer.strict = this.strict
  },
  render(h) {
    return h(Vue.component('code-wrapper', {
      template: this.renderContent(),
      components: allComponents
    }))
  }
}
</script>
