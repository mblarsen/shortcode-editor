<template>
  <div class="editor editor-container">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">container <span v-if="klass">[{{klass}}]</span></a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <div class="editor__children editor__children--column">
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
        Container
      </template>
      <template slot="body">
        <form class="form-horizontal">
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <div class="checkbox-inline">
                <label><input type="checkbox" v-model="fullwidth"> fullwidth</label>
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
  name: 'container-editor',
  extends: BaseContainerEditor,

  editorTitle: 'Container',
  editorDescription: 'This component provides proper padding to content. Can be normal width or full width.',
  editorTemplate: '[container][/container]',
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
