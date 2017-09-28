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
          <div class="form-group">
            <label class="col-sm-2 control-label">Class prefix</label>
            <div class="col-sm-10">
              <div class="input-group">
                <input class="form-control" type="text" v-model="classPrefix">
                <span class="input-group-btn">
                  <button class="btn btn-default" @click.prevent="classPrefix = ''"><span class="icon"><i class="fa fa-times"></i></span></button>
                </span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Classes</label>
            <div class="col-sm-10">
              <div class="input-group">
                <input class="form-control" type="text" v-model="klass" placeholder="CSS classes">
                <span class="input-group-btn">
                  <button class="btn btn-default" @click.prevent="klass = ''"><span class="icon"><i class="fa fa-times"></i></span></button>
                </span>
              </div>
            </div>
          </div>
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
