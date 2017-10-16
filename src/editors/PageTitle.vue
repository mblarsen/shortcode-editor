<template>
  <div class="editor editor--page-title">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">page-title<span v-if="klass">, class: {{klass}}</span></a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <div class="page-title__demo">
      <div v-if="!fullwidth" class="page-title__padding"></div>
      <div class="page-title__titles">
        <div class="page-title__title">{{title}}</div>
        <div v-if="subtitle" class="page-title__subtitle">{{subtitle}}</div>
      </div>
      <div v-if="!fullwidth" class="page-title__padding"></div>
    </div>
    <edit-modal :open="isEditing">
      <template slot="title">Page Title</template>
      <template slot="body">
        <div class="form-horizontal">

          <simple-input v-model="title" title="Title"></simple-input>
          <simple-input v-model="subtitle" title="Subtitle" placeholder="Optional subtitle"></simple-input>

          <!-- fullwidth -->
          <div class="form-group">
            <label class="col-sm-2 control-label">Features</label>
            <div class="col-sm-10">
              <div class="checkbox-inline">
                <label><input type="checkbox" v-model="fullwidth"> fullwidth</label>
              </div>
            </div>
          </div>

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
  name: 'page-title-editor',
  extends: BaseEditor,
  props: ['token'],

  editorTitle: 'Page title',
  editorDescription: 'Show a title and optional title on a page. Can also be used for sections.',
  editorTag: 'page-title',
  editorProps: ['title', 'subtitle', 'fullwidth'],
  editorSample: '[page-title list="Title" /]',
  editorContext: ['root', 'container'],

  data() {
    return {
      title: this.token.params.title || 'Title',
      subtitle: this.token.params.subtitle,
      fullwidth: this.token.params.fullwidth !== undefined
        ? this.token.params.fullwidth
        : true,
    }
  },
  methods: {
    properties() {
      const props = [
        `title="${this.title}"`,
        `fullwidth=${this.fullwidth ? 'true' : 'false'}`,
      ]
      this.subtitle && props.push(`subtitle="${this.subtitle}"`)
      return props
    },
  }
}
</script>
<style>
.page-title__demo {
  display: flex;
  justify-items: space-between;
  height: 10vh;
  margin-left: -5px;
  margin-bottom: 1rem;
}
.page-title__titles {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.page-title__padding {
  height: 100%;
  margin-left: 5px;
  color: var(--content-dimmed-color);
  background-color: var(--gray-border-color);
  border-radius: var(--box-border-radius);
  min-width: 4%;
}
.page-title__title, .page-title__subtitle {
  color: #777;
  font-weight: bold;
  font-size: 115%;
  margin-bottom: 1rem;
  text-align: center;
  text-transform: uppercase;
}
.page-title__subtitle {
  font-size: 105%;
}
</style>
