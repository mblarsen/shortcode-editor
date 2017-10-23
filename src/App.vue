<template>
  <div class="slot-editor-instance">
    <div class="row">
      <div class="col">
        <component v-for="(editor, i) in editors"
          class="editor"
          @remove="removeChild"
          @movePrev="moveChildPrev"
          @moveNext="moveChildNext"
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
    window.localStorage.removeItem('copiedTemplate')
  },
  mounted() {
    this.readSource()
  },
  methods: {
    addListeners() {
      /* prepend root items */
      this._provided.bus.$on(this.callerId, (payload) => {
        const old = this.content
        this.content += payload.item.sample || this.buildTemplate(payload.item.tag)
        this.$nextTick(() => this.save(old))
      })
      /* on update save */
      this._provided.bus.$on('update', this.save)
      this.$on('movePrev', this.moveChildPrev)
      this.$on('moveNext', this.moveChildNext)
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
    moveChildPrev(child) {
      this.moveChild(child, -1)
    },
    moveChildNext(child) {
      this.moveChild(child, 1)
    },
    moveChild(child, direction) {
      if (child === this) { return }
      const children = this.children()
      const index = children.findIndex(c => c.token.uuid === child.token.uuid)

      if (direction === -1 && index === 0 || direction === 1 & index + 1 === children.length) {
        return // noop
      }
      const otherChild = children[index + direction]

      children[index + direction] = child
      children[index] = otherChild

      const template = children
        .map(c => c.toTemplate())
        .join('')

      this.save(this.content, template)
    },
    children(except = null) {
      return this.$children
        .filter(c => c !== except)
        .filter(c => c.$options.name.endsWith('-editor'))
    },
    childrenToString(except = null) {
      return this.children(except)
        .map(c => c.toTemplate())
        .join('')
    },
    save(old = null, preRendered = null) {
      this.undoLog.push(old || this.content)
      const content = preRendered || this.childrenToString()
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
    buildTemplate(tag, props = [], content = null) {
      props = props.length > 0 ? ' ' + props.join(' ') : ''
      return content === null
        ? `[${tag}${props}/]`
        : `[${tag}${props}]${content}[/${tag}]`
    },
  }
}
</script>
<style>
.editor {
  margin-bottom: 0.5rem;
}
</style>
