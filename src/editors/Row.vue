<template>
  <div class="editor editor-row">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">row<span v-if="klass">, class: {{klass}}</span></a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <div class="editor__children editor__children--row">
      <component v-for="(editor, i) in editors"
        class="editor"
        @remove="removeChild"
        :is="editor.use"
        :token="editor.token"
        :key="editor.use + i"></component>
    </div>
    <add-button context="row" text="Column" component="column" :caller="callerId"/>
    <edit-modal :open="isEditing">
      <template slot="title">
        Column
      </template>
      <template slot="body">
        <form class="form-horizontal">
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
  editorTemplate: '[row][column][/column][/row]',
  editorContext: ['root', 'container'],

  data() {
    return {
      content: null,
    }
  },
}
</script>
