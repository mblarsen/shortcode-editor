<template>
  <div class="editor editor--sitemap">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">sitemap<span v-if="klass">, class: {{klass}}</span><span v-if="klass">, prefix: {{classPrefix}}</span></a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <edit-modal :open="isEditing">
      <template slot="title">Sitemap</template>
      <template slot="body">
        <div class="form-horizontal">
          <simple-input v-model="classPrefix" title="Class prefix"></simple-input>
          <simple-input v-model="klass" title="Classes"></simple-input>
        </div>
      </template>
      <template slot="footer">
        <button @click.prevent="save" class="btn btn-success">Close</button>
      </template>
    </edit-modal>
  </div>
</template>
<script>
import BaseEditor from '@/editors/Base'

export default {
  name: 'sitemap-editor',
  extends: BaseEditor,
  props: ['token'],

  editorTitle: 'Sitemap',
  editorDescription: 'List shop pages organized by topics',
  editorTemplate: '[sitemap /]',
  editorContext: ['root', 'container'],

  data() {
    return {
      classPrefix: this.token.params.classPrefix,
    }
  },
  methods: {
    properties() {
      return this.classPrefix
        ? [`classPrefix="${this.classPrefix}"`]
        : []
    },
  }
}
</script>
