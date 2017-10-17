<template>
  <div class="editor__header">
    <div class="editor__label"><a @click="$parent.edit"><slot></slot></a></div>
    <a class="editor__copy btn btn-xs btn-link`" @click.prevent="$parent.copyTemplate">Copy <span v-if="copied">copied!</span></a>
    <a v-if="canPaste && hasPaste" class="editor__paste btn btn-xs btn-link`" @click.prevent="$parent.pasteTemplate">Paste <span v-if="copied">copied!</span></a>
    <a class="editor__wrap btn btn-xs btn-link`" @click.prevent="$parent.wrapIn">Wrap in</a>
    <a class="editor__change btn btn-xs btn-link`" @click.prevent="$parent.changeType">Change type</a>
    <a class="editor__move-prev btn btn-xs btn-link`" @click.prevent="$parent.movePrev"><span class="icon"><i class="fa fa-chevron-left"></i></span></a>
    <a class="editor__move-next btn btn-xs btn-link`" @click.prevent="$parent.moveNext"><span class="icon"><i class="fa fa-chevron-right"></i></span></a>
    <a class="editor__remove btn btn-xs btn-link`" @click.prevent="$parent.remove"><span class="icon"><i class="fa fa-times"></i></span></a>
  </div>
</template>
<script>
export default {
  name: 'editor-header',
  inject: ['bus'],
  data() {
    return {
      copied: false,
      hasPaste: false,
      canPaste: false,
    }
  },
  created() {
    this.canPaste = this.$parent && this.$parent.$options.editorIsContainer === true
    this.hasPaste = Boolean(window.localStorage.copiedTemplate)
    this.bus.$on('copy', ({component}) => {
      this.hasPaste = true
      if (this.$parent === component) {
        this.copied = true
        setTimeout(() => {
          this.copied = false
        }, 2000)
      }
    })
  },
}
</script>
