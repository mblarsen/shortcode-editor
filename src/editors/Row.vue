<template>
  <div class="editor editor-row">
    <div class="editor__label">row</div>
    <div class="editor__children editor__children--row">
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
import TextEditor from '@/editors/Text'
import ColumnEditor from '@/editors/Column'
import RowEditor from '@/editors/Row'
import createEditors from '@/EditorFactory'

export default {
  name: 'row-editor',
  inject: ['bus'],
  props: ['token'],
  shortcodeTitle: 'Row',
  shortcodeDescription: 'This component will break content into rows.',
  shortcodeTemplate: '[row][/row]',
  components: {
    AddButton,
    ColumnEditor,
    RowEditor,
    TextEditor,
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
