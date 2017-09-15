<template>
  <div class="slot-editor-instance">
    <div class="row">
      <div class="col">
        <component v-for="(editor, i) in editors"
          class="editor"
          :is="editor.use"
          :token="editor.token"
          :key="editor.use + i"></component>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <add-button context="root" :caller="callerId"/>
      </div>
    </div>
    <catalog/>
  </div>
</template>

<script>
import Vue from 'vue'
import CodeSlot from '@/CodeSlot'
import createEditors from '@/EditorFactory'
import TextEditor from '@/editors/Text'
import RowEditor from '@/editors/Row'
import Catalog from '@/Catalog'
import ProductListEditor from '@/editors/ProductList'
import AddButton from '@/AddButton'
import SaveButton from '@/SaveButton'

export default {
  name: 'slot-editor',
  provide() {
    return {
      bus: new Vue()
    }
  },
  components: {
    AddButton,
    SaveButton,
    Catalog,
    CodeSlot,
    RowEditor,
    TextEditor,
    ProductListEditor,
  },
  data() {
    return {
      content: '',
      srcElement: null,
    }
  },
  computed: {
    callerId() {
      return `${this.$options.name}-${this._uid}`
    },
    editors() {
      if (!this.content) { return [] }
      return createEditors(this.content)
    }
  },
  created() {
    /* prepend root items */
    this._provided.bus.$on(this.callerId, (payload) => {
      this.content += payload.item
      this.$nextTick(this.save)
    })
    /* on update save */
    this._provided.bus.$on('update', this.save)
  },
  mounted() {
    const srcId = this.$parent.$options.el.attributes.src.value
    this.srcElement = document.getElementById(srcId)
    this.content = this.srcElement.value
  },
  methods: {
    save() {
      const template = this.$children
        .filter(c => c.$options.name.endsWith('-editor'))
        .map(c => c.toTemplate())
        .join('')
      this.content = template
      this.srcElement.value = template
    }
  }
}
</script>
<style>
.editor {
  margin-bottom: 0.5rem;
}
</style>
