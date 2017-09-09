<template>
  <div class="slot-editor">
    <div class="row">
      <div class="col-xs-8 col-xs-offset-2">
        <textarea v-model="content" style="width: 100%"></textarea>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-8 col-xs-offset-2">
        <component v-for="(editor, i) in editors"
          class="editor"
          :is="editor.use"
          :token="editor.token"
          :key="editor.use + i"></component>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-8 col-xs-offset-2">
        <add-button context="root" :caller="callerId"/>
      </div>
    </div>
    <catalog/>
      <hr />
    <save-button @save="save"></save-button>
    <div v-for="item in log">{{item}} <button class="btn btn-sm" @click="content = item">use</button></div>
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
  provide: {
    bus: new Vue()
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
      log: [],
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
  methods: {
    save() {
      const template = this.$children
        .filter(c => c.$options.name.endsWith('-editor'))
        .map(c => c.toTemplate())
        .join('')
      this.content = template
      this.log.unshift(template)
    }
  }
}
</script>
<style>
.slot-editor {
}
.editor {
  margin-bottom: 0.5rem;
}
</style>
