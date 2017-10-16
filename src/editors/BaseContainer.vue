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
    toString(content = '') {
      return this.buildTemplate(this.tag, this.propertiesToString(), content)
    },
    handleCatalogAction(item, action) {
      const actionName = typeof action === 'object'
        ? action.action
        : action
      if (actionName === 'append') {
        this.append(item)
      } else if (actionName === 'replace') {
        this.replaceSelf(item)
      }
    },
    /* catalog action: append new content in container */
    append(item) {
      const children = this.childrenToString() + (item.sample || this.buildTemplate(item.tag))
      this.content = this.toString(children)
      this.bus.$emit('update')
    },
    /* catalog action: replaces self and children if possible */
    replaceSelf(item) {
      this.content = this.buildTemplate(item.tag, this.intersectProps(item), this.childrenToString())
      this.bus.$emit('update')
    },
    moveChildPrev(child) {
      this.moveChild(child, -1)
    },
    moveChildNext(child) {
      this.moveChild(child, 1)
    },
    moveChild(child, direction) {
      const children = this.children()
      const index = children.findIndex(c => c.token.uuid === child.token.uuid)

      if (direction === -1 && index === 0 || direction === 1 & index + 1 === children.length) {
        return // noop
      }
      const otherChild = children[index + direction]

      children[index + direction] = child
      children[index] = otherChild

      const template = children
        .map(c => c.toTemplate())
        .join('')

      this.content = this.toString(template)
      this.bus.$emit('update')
    },
    children(except = null) {
      return this.$children
        .filter(c => c !== except)
        .filter(c => c.$options.name.endsWith('-editor'))
    },
    childrenToString(except = null) {
      return this.children(except)
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
    },
    removeChild() {
      const template = this.childrenToString(arguments[0])
      this.content = this.toString(template)
      this.bus.$emit('update')
    }
  }
}
</script>
