<template>
  <div class="editor editor-container">
    <editor-header>{{tag}}<span v-if="klass">, class: {{klass}}</span></editor-header>
    <div class="editor__children editor__children--column">
      <component v-for="(editor, i) in editors"
        class="editor"
        @remove="removeChild"
        @movePrev="moveChildPrev"
        @moveNext="moveChildNext"
        :is="editor.use"
        :token="editor.token"
        :key="editor.token.uuid"></component>
    </div>
    <add-button context="container" :caller="callerId"/>
    <edit-modal :open="isEditing">
      <template slot="title">
        Container
      </template>
      <template slot="body">
        <form class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label">Features</label>
            <div class="col-sm-10">
              <div class="checkbox-inline">
                <label><input type="checkbox" v-model="fullwidth"> fullwidth</label>
              </div>
            </div>
          </div>
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
  name: 'container-editor',
  extends: BaseContainerEditor,

  editorTitle: 'Container',
  editorDescription: 'This component provides proper padding to content. Can be normal width or full width.',
  editorTag: 'container',
  editorIsContainer: true,
  editorProps: ['fullwidth'],
  editorContext: ['root', 'container'],

  data() {
    return {
      fullwidth: this.token.params.fullwidth !== undefined
        ? this.token.params.fullwidth
        : true,
    }
  },
  methods: {
    properties() {
      return [`fullwidth=${this.fullwidth ? 'true' : 'false'}`]
    },
  }
}
</script>
