<template>
  <div class="editor-row">
    <div class="editor-row__label">row</div>
    <div class="editor-row__children">
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
<style>
.editor-row {
  background-color: #f9f9f9;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  padding: 1rem;
}
.editor-row__label {
  color: lightgray;
  font-size: 90%;
  margin-top: -10px;
  margin-left: -3px;
}
.editor-row__children {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.editor-row__children > * {
  flex: 1;
  margin-right: 0.5rem;
}
.editor-row__children > *:last-child {
  margin-left: 0;
}
</style>
