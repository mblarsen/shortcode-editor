<template>
  <div class="editor editor-text">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">html</a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <div v-if="!isEditing">
      {{content}}
    </div>
    <div v-if="isEditing">
      <textarea v-model="content" cols="30" rows="10"></textarea>
    </div>
  </div>
</template>
<script>
import BaseEditor from '@/editors/Base'

export default {
  name: 'text-editor',
  props: ['token'],
  extends: BaseEditor,
  editorTitle: 'Text',
  editorDescription: 'This component will render HTML',
  editorTemplate: '<h1>Title</h1>',
  editorContext: ['root', 'container'],
  data() {
    return {
      content: '',
    }
  },
  created() {
    this.$watch('token.body', function () {
      this.content = this.token.body
    }, {immediate: true})
  },
  methods: {
    toTemplate() {
      return this.content
    }
  }
}
</script>
