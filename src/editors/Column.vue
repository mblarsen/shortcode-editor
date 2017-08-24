<template>
  <div class="editor editor-column">
    <div class="editor__label">column</div>
    <div class="editor__children editor__children--column">
      <component v-for="(editor, i) in editors"
        class="editor"
        :is="editor.use"
        :token="editor.token"
        :key="editor.use + i"></component>
    </div>
    <add-button context="all" :caller="callerId"/>
  </div>
</template>
<script>
import AddButton from '@/AddButton'
import createEditors from '@/EditorFactory'

export default {
  name: 'column-editor',
  inject: ['bus'],
  props: ['token'],
  shortcodeTitle: 'Column',
  shortcodeDescription: 'This component can order content in a column. Use boostrap classes to define size.',
  shortcodeTemplate: '[column class="col-sm-3"][/column]',
  components: {
    AddButton,
  },
  beforeCreate: function () {
    this.$options.components.RowEditor = require('@/editors/Row')
    this.$options.components.TextEditor = require('@/editors/Text')
  },
  data() {
    return {
      content: ''
    }
  },
  computed: {
    callerId() {
      return `${this.$options.name}-${this._uid}`
    },
    editors() {
      return createEditors(this.token.children)
    }
  },
  created() {
    this.bus.$on(this.callerId, ({item}) => (this.content += item))
  },
}
</script>
