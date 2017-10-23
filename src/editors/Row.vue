<template>
  <div class="editor editor--row">
    <editor-header>{{tag}}<span v-if="klass">, class: {{klass}}</span></editor-header>
    <div class="editor__children editor__children--row">
      <component v-for="(editor, i) in editors"
        class="editor"
        @remove="removeChild"
        @movePrev="moveChildPrev"
        @moveNext="moveChildNext"
        :is="editor.use"
        :token="editor.token"
        :key="editor.token.uuid"></component>
    </div>
    <add-button context="row" text="Column" component="column" :caller="callerId"/>
    <edit-modal :open="isEditing">
      <template slot="title">Row</template>
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
  name: 'row-editor',
  extends: BaseContainerEditor,

  editorTitle: 'Row',
  editorDescription: 'This component will break content into rows.',
  editorTag: 'row',
  editorIsContainer: true,
  editorSample: '[row][column][/column][/row]',
  editorContext: ['root', 'container'],
  editorChildContext: 'row',

  data() {
    return {
      content: null,
    }
  },
}
</script>
