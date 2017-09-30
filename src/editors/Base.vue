<template>
  <div></div>
</template>
<script>
import AddButton from '@/AddButton'
import EditModal from '@/EditModal'
import {callerId} from '@/EditorFactory'

export default {
  name: 'base-editor',
  inject: ['bus'],
  props: ['token'],
  components: {AddButton, EditModal},
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
  created() {
    this.bus.$on(this.callerId, ({item}) => (this.append(item)))
  },
  methods: {
    /* self-closing */
    toString() {
      return `[${this.tag}${this.propertiesToString()}/]`
    },
    propertiesToString() {
      const props = this.properties()
      this.klass && props.push(`class="${this.klass}"`)
      return props.length > 0
        ? ' ' + props.join(' ')
        : ''
    },
    properties() {
      return []
    },
    toTemplate() {
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
  }
}
</script>
