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
        :key="editor.token.uuid"></component>
    </div>
    <add-button context="container" :caller="callerId"/>
    <edit-modal :open="isEditing">
      <template slot="title">
        Service Box
      </template>
      <template slot="body">
        <form class="form-horizontal">
          <simple-input v-model="icon" title="Icon">
            <div class="form-control-static">
              <i class="fa fa-4x" :class="[icon]"></i>
            </div>
          </simple-input>
          <simple-input v-model="klass" title="Classes"></simple-input>
        </form>
      </template>
      <template slot="footer">
        <button @click.prevent="save" class="btn btn-success">Close</button>
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
  editorTag: 'service-box',
  editorIsContainer: true,
  editorProps: ['icon'],
  editorSample: '[service-box icon="fa-bath"]<h3>Clean</h3><p>Sit enim expedita repudiandae quisquam corporis Obcaecati inventore earum.</p>[/service-box]',
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
  background: linear-gradient(rgba(243,243,243,1),rgba(200,200,200,1));
  min-height: 10vh;
  border-radius: var(--box-border-radius);
  padding: 1rem
}
</style>
