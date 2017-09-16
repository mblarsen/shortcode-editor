<template>
  <div class="editor editor-text">
    <div class="editor__label">text</div>
    <div v-if="!edit">
      {{content}}
    </div>
    <div v-if="edit">
      <textarea v-model="content" cols="30" rows="10"></textarea>
    </div>
  </div>
</template>
<script>
export default {
  name: 'text-editor',
  props: ['token'],
  editorTitle: 'Text',
  editorDescription: 'This component will render HTML',
  editorTemplate: '<h1>Title</h1>',
  editorContext: ['root', 'container'],
  data() {
    return {
      edit: false,
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
