<template>
  <div class="slot-editor-instance">
    <div class="row">
      <div class="col">
        <component v-for="(editor, i) in editors"
          class="editor"
          @remove="removeChild"
          :is="editor.use"
          :token="editor.token"
          :key="editor.use + i"></component>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <add-button context="root" :caller="callerId" class="add-button--root"/>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button v-if="undoLog.length > 0" @click.prevent="undo" class="btn btn-xs btn-default">
          <span class="icon"><i class="fa fa-arrow-left"></i></span>
          <span>undo</span>
        </button>
        <button v-if="redoLog.length > 0" @click.prevent="redo" class="btn btn-xs btn-default">
          <span>redo</span>
          <span class="icon"><i class="fa fa-arrow-right"></i></span>
        </button>
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
      undoLog: [],
      redoLog: [],
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
        const old = this.content
        this.content += payload.item
        this.$nextTick(() => this.save(old))
      })
      /* on update save */
      this._provided.bus.$on('update', this.save)
    },
    readSource() {
      const srcId = this.$parent.$options.el.attributes.src.value
      if (!srcId) {
        throw new Error('src missing')
      }
      this.srcElement = document.getElementById(srcId)
      if (!this.srcElement) {
        throw new Error(`src element not found: ${srcId}`)
      }
      this.content = this.srcElement.value || ''
    },
    childrenToString(except = null) {
      return this.$children
        .filter(c => c !== except)
        .filter(c => c.$options.name.endsWith('-editor'))
        .map(c => c.toTemplate())
        .join('')
    },
    save(old = null) {
      this.undoLog.push(old || this.content)
      const content = this.childrenToString()
      this.srcElement.innerText = this.content = content
      this.redoLog = []
    },
    removeChild() {
      this.undoLog.push(this.content)
      const content = this.childrenToString(arguments[0])
      this.srcElement.innerText = this.content = content
      this.redoLog = []
    },
    undo() {
      this.redoLog.push(this.content)
      this.srcElement.innerText = this.content = this.undoLog.pop()
    },
    redo() {
      this.undoLog.push(this.content)
      this.srcElement.innerText = this.content = this.redoLog.pop()
    },
  }
}
</script>
<style>
.editor {
  margin-bottom: 0.5rem;
}
</style>
