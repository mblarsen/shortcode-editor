<template>
  <div></div>
</template>
<script>
import AddButton from '@/AddButton'
import EditorHeader from '@/EditorHeader'
import EditModal from '@/EditModal'
import {callerId} from '@/EditorFactory'

export default {
  name: 'base-editor',
  inject: ['bus'],
  props: ['token', 'isChild'],
  components: {AddButton, EditModal, EditorHeader},
  computed: {
    callerId,
    tag() {
      return this.$options.name.replace('-editor', '')
    },
  },
  data() {
    return {
      klass: this.token.params.class || '',
      isEditing: false,
    }
  },
  beforeCreate() {
    this.$options.components.SimpleInput = require('@/editors/Form/Simple').default
  },
  created() {
    this.bus.$on(this.callerId, ({item, action}) => this.handleCatalogAction(item, action))
  },
  methods: {
    handleCatalogAction(item, action) {
      let actionName = typeof action === 'object'
        ? action.action
        : action
      actionName = actionName[0].toUpperCase() + actionName.substring(1)
      this[`handle${actionName}`](item, action)
      this.bus.$emit('update')
    },
    /* catalog action: wraps compent in container type component */
    handleWrap(item) {
      this.content = this.buildTemplate(item.tag, this.intersectProps(item), this.toTemplate())
    },
    /* catalog action: replaces self and children if possible */
    handleReplace(item) {
      this.content = this.buildTemplate(item.tag, this.intersectProps(item))
    },
    intersectProps(item) {
      const props = this.properties()
      const itemProps = item.props || []
      itemProps.push('class')
      this.klass && props.push(`class="${this.klass}"`)
      return props.filter(prop => {
        const propName = prop.substring(0, prop.indexOf('='))
        return itemProps.includes(propName)
      })
    },
    buildTemplate(tag, props = [], content = null) {
      props = props.length > 0 ? ' ' + props.join(' ') : ''
      return content === null
        ? `[${tag}${props}/]`
        : `[${tag}${props}]${content}[/${tag}]`
    },
    toString(content = null) {
      return this.buildTemplate(this.tag, this.propertiesToString(), content)
    },
    propertiesToString() {
      const props = this.properties()
      this.klass && props.push(`class="${this.klass}"`)
      return props
    },
    properties() {
      return []
    },
    toTemplate() {
      /* return pre-compiled content */
      if (this.content) {
        const content = this.content
        this.content = null
        return content
      }
      return this.toString()
    },
    edit() {
      this.isEditing = true
    },
    save() {
      this.isEditing = false
      this.bus.$emit('update')
    },
    remove() {
      this.$emit('remove', this)
    },
    movePrev() {
      this.$emit('movePrev', this)
    },
    moveNext() {
      this.$emit('moveNext', this)
    },
    wrapIn() {
      const context = this.$parent.$options.editorChildContext || 'container'
      this.bus.$emit('showCatalog', {
        caller: this.callerId,
        context: context,
        type: 'container',
        action: 'wrap',
      })
    },
    changeType() {
      const context = this.$parent.$options.editorChildContext || 'container'
      this.bus.$emit('showCatalog', {
        caller: this.callerId,
        context: context,
        action: 'replace',
      })
    },
    copyTemplate() {
      const template = this.toTemplate()
      window.localStorage.copiedTemplate = template
      this.bus.$emit('copy', {component: this, template})
    },
  },
}
</script>
