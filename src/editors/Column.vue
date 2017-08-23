<template>
  <div class="editor-column">
    <div class="editor-row__label">column</div>
    <div class="editor-column__children">
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
import RowEditor from '@/editors/Row'
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
.editor-column {
  background-color: #f9f9f9;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  padding: 1rem;
}
.editor-column__label {
  color: lightgray;
  font-size: 90%;
  margin-top: -10px;
  margin-left: -3px;
}
.editor-column__children {
  display: flex;
  flex-direction: column
}
.editor-column__children > * {
  flex: 1
}
</style>
