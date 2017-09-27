<template>
  <div class="editor editor--service-box">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">service-box<span v-if="klass">, class: {{klass}}</span></a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <div class="editor__children editor__children--service-box editor__children--column">
      <i class="fa fa-2x service-box__preview__icon" :class="[icon]"></i>
      <component v-for="(editor, i) in editors"
        class="editor"
        @remove="removeChild"
        :is="editor.use"
        :token="editor.token"
        :key="editor.use + i"></component>
    </div>
    <add-button context="container" :caller="callerId"/>
    <edit-modal :open="isEditing">
      <template slot="title">
        Service Box
      </template>
      <template slot="body">
        <form class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label">Icon</label>
            <div class="col-sm-10">
              <div class="input-group">
                <input class="form-control" type="text" v-model="icon">
                <span class="input-group-btn">
                  <button class="btn btn-default" @click.prevent="icon = ''"><span class="icon"><i class="fa fa-times"></i></span></button>
                </span>
              </div>
              <div class="form-control-static">
                <i class="fa fa-4x" :class="[icon]"></i>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="classes" class="col-sm-2 control-label">Classes</label>
            <div class="col-sm-10">
              <div class="input-group">
                <input class="form-control" type="text" v-model="klass" placeholder="CSS classes">
                <span class="input-group-btn">
                  <button class="btn btn-default" @click.prevent="klass = ''"><span class="icon"><i class="fa fa-times"></i></span></button>
                </span>
              </div>
            </div>
          </div>
        </form>
      </template>
      <template slot="footer">
        <button @click="save" class="btn btn-success">Close</button>
      </template>
    </edit-modal>
  </div>
</template>
<script>
import BaseContainerEditor from '@/editors/BaseContainer'

export default {
  name: 'service-box-editor',
  extends: BaseContainerEditor,

  editorTitle: 'Service Box',
  editorDescription: 'Typical service box with icon that describes your USP.',
  editorTemplate: '[service-box icon="fa-star"][/service-box]',
  editorContext: ['container'],

  data() {
    return {
      icon: this.token.params.icon
    }
  },
  methods: {
    properties() {
      return this.icon
        ? [`icon="${this.icon}"`]
        : []
    },
  }
}
</script>
<style>
.service-box__preview__icon {
  margin-bottom: 0.5em;
  align-self: center;
}
.editor__children--service-box {
  color: #999;
  background-color: var(--gray-border-color);
  min-height: 10vh;
  border-radius: var(--box-border-radius);
  padding: 1rem
}
</style>
