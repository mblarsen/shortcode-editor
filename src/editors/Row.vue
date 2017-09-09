<template>
  <div class="editor editor-row">
    <div class="editor__label"><a @click="edit">row <span v-if="klass">[{{klass}}]</span></a></div>
    <div class="editor__children editor__children--row">
      <component v-for="(editor, i) in editors"
        class="editor"
        :is="editor.use"
        :token="editor.token"
        :key="editor.use + i"></component>
    </div>
    <add-button context="row" text="Column" component="column" :caller="callerId"/>
    <edit-modal :open="isEditing">
      <template slot="title">
        Column
      </template>
      <template slot="body">
        <input type="text" v-model="klass" placeholder="CSS classes">
      </template>
      <template slot="footer">
        <button @click="save">Save</button>
      </template>
    </edit-modal>
  </div>
</template>
<script>
import AddButton from '@/AddButton'
import EditModal from '@/EditModal'
import ColumnEditor from '@/editors/Column'
import createEditors from '@/EditorFactory'

export default {
  name: 'row-editor',
  inject: ['bus'],
  props: ['token'],
  shortcodeTitle: 'Row',
  shortcodeDescription: 'This component will break content into rows.',
  shortcodeTemplate: '[row][column][/column][/row]',
  shortcodeContext: ['root', 'container'],
  components: {
    AddButton,
    ColumnEditor,
    EditModal,
  },
  data() {
    return {
      isEditing: false,
      klass: this.token.params.class || '',
      content: null,
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
    this.bus.$on(this.callerId, ({item}) => (this.append(item)))
  },
  methods: {
    append(content) {
      const template = this.$children
        .filter(c => c.$options.name.endsWith('-editor'))
        .map(c => c.toTemplate())
        .join('') + content
      this.content = `[row${this.klass.trim().length ? ` class="${this.klass}"` : ''}]${template}[/row]`
      this.bus.$emit('update')
    },
    edit() {
      this.isEditing = true
    },
    save() {
      this.isEditing = false
      this.bus.$emit('update')
    },
    toTemplate() {
      /* return pre-compiled content */
      if (this.content) {
        const content = this.content
        this.content = null
        return content
      }
      const template = this.$children
        .filter(c => c.$options.name.endsWith('-editor'))
        .map(c => c.toTemplate())
        .join('')
      return `[row${this.klass.trim().length ? ` class="${this.klass}"` : ''}]${template}[/row]`
    }
  }
}
</script>
