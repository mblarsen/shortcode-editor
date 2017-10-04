<template>
  <div class="editor" :class="[`editor-${tag}`]">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">{{tag}}<span v-if="klass">, class: {{klass}}</span></a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <div class="editor__children" :class="[`editor__children--${layoutDirection}`]">
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
        {{$options.editorTitle}}
      </template>
      <template slot="body">
        <form class="form-horizontal">
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
  name: 'simple-container-editor',
  extends: BaseContainerEditor,

  editorTitle: 'Div',
  editorDescription: 'A simple div. Also see section, container, row, column.',
  editorTemplate: '[div][/div]',
  editorContext: ['root', 'container'],

  data() {
    return {
      layoutDirection: 'column',
    }
  }
}
</script>
