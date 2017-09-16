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
import AddButton from '@/AddButton'
import Catalog from '@/Catalog'
import {callerId, createEditors, injectEditors} from '@/EditorFactory'

export default {
  name: 'slot-editor',
  provide() {
    return {
      bus: new Vue()
    }
  },
  components: {AddButton, Catalog},
  data() {
    return {
      content: '',
      srcElement: null,
    }
  },
  computed: {
    callerId,
    editors() {
      return createEditors(this.content || '')
    },
  },
  created() {
    injectEditors(this)
    this.addListeners()
  },
  mounted() {
    this.readSource()
  },
  methods: {
    addListeners() {
      /* prepend root items */
      this._provided.bus.$on(this.callerId, (payload) => {
        this.content += payload.item
        this.$nextTick(this.save)
      })
      /* on update save */
      this._provided.bus.$on('update', this.save)
    },
    readSource() {
      const srcId = this.$parent.$options.el.attributes.src.value
      this.srcElement = document.getElementById(srcId)
      this.content = this.srcElement.value || ''
    },
    save() {
      const content = this.childrenToString()
      this.srcElement.value = this.content = content
    },
    childrenToString() {
      return this.$children
        .filter(c => c.$options.name.endsWith('-editor'))
        .map(c => c.toTemplate())
        .join('')
    },
  }
}
</script>
<style>
.editor {
  margin-bottom: 0.5rem;
}
</style>
