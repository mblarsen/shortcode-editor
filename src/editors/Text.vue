<template>
  <div class="editor editor-text">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">text</a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <div v-if="!isEditing">
      <div v-html="content" @click="edit" class="text-editor__content"></div>
    </div>
    <div v-if="isEditing">
      <textarea v-model="content" class="form-control text-editor__content--editing" cols="30" rows="10"></textarea>
      <button @click.prevent="save" class="btn btn-xs btn-success">Close</button>
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
  editorTemplate: '<h1>Cupcakes</h1><p>Wafer cake cheesecake pastry gummi bears cupcake gummies. Tootsie roll jelly chocolate.</p>',
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
<style>
.text-editor__content {
  width: 100%;
}
.text-editor__content--editing {
  margin-bottom: 0.5rem;
}
.text-editor__content * {
  font-size: 90%;
}
</style>
