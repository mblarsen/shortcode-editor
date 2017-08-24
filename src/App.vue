<template>
  <div class="slot-editor">
    <div class="row">
      <div class="col-xs-8 col-xs-offset-2">
        <textarea v-model="content"></textarea>
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
        <add-button context="all" :caller="callerId"/>
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
import AddButton from '@/AddButton'

export default {
  name: 'slot-editor',
  provide: {
    bus: new Vue()
  },
  components: {
    AddButton,
    Catalog,
    CodeSlot,
    RowEditor,
    TextEditor,
  },
  data() {
    return {
      content: '',
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
    this._provided.bus.$on(this.callerId, (payload) => {
      this.content += payload.item
    })
  },
}
</script>
<style>
.slot-editor {
}
.editor {
  margin-bottom: 0.5rem;
}
</style>
