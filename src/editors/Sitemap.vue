<template>
  <div class="editor editor--sitemap">
    <editor-header>{{tag}}<span v-if="klass">, class: {{klass}}</span></editor-header>
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
  editorTag: 'sitemap',
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
