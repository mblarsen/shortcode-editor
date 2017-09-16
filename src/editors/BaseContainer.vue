<template>
  <div></div>
</template>
<script>
import BaseEditor from '@/editors/Base'
import {editors, injectEditors} from '@/EditorFactory'

export default {
  name: 'base-container-editor',
  extends: BaseEditor,
  inject: ['bus'],
  beforeCreate: function () { injectEditors(this) },
  computed: {editors},
  data() {
    return {
      content: null,
    }
  },
  methods: {
    /* container */
    toString(childContent = '') {
      return `[${this.tag}${this.propertiesToString()}]${childContent}[/${this.tag}]`
    },
    /* append new content in container */
    append(content) {
      const template = this.childrenToString() + content
      this.content = this.toString(template)
      this.bus.$emit('update')
    },
    childrenToString() {
      return this.$children
        .filter(c => c.$options.name.endsWith('-editor'))
        .map(c => c.toTemplate())
        .join('')
    },
    toTemplate() {
      /* return pre-compiled content */
      if (this.content) {
        const content = this.content
        this.content = null
        return content
      }
      return this.toString(this.childrenToString())
    }
  }
}
</script>
