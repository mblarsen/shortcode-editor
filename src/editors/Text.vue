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
      <ckeditor v-model="content" :config="config"></ckeditor>
      <button @click.prevent="save" class="btn btn-xs btn-success">Close</button>
    </div>
  </div>
</template>
<script>
import BaseEditor from '@/editors/Base'
import Ckeditor from 'vue-ckeditor2'

export default {
  name: 'text-editor',
  props: ['token'],

  extends: BaseEditor,
  editorTitle: 'Text',
  editorDescription: 'This component will render HTML',
  editorTemplate: '<h1>Headline</h1><p>Paragraph</p>',
  editorContext: ['root', 'container'],

  components: {
    Ckeditor,
  },
  data() {
    return {
      content: '',
      config: {
        toolbar: [
          { name: 'document', items: [ 'Source', 'Templates' ] },
          { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
          { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
          '/',
          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'CopyFormatting', 'RemoveFormat' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
          { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
          { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
          '/',
          { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
        ],
        entities: false,
        height: 300
      }
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
    },
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
