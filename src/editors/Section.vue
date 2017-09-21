<template>
  <div class="editor editor-section">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">section <span v-if="klass">[{{klass}}]</span></a></div>
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
        Section
      </template>
      <template slot="body">
        <form class="form-horizontal">
          <div class="form-group">
            <label for="classes" class="col-sm-2 control-label">Classes</label>
            <div class="col-sm-10">
              <input id="classes" class="form-control" type="text" v-model="klass" placeholder="CSS classes">
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
  name: 'section-editor',
  extends: BaseContainerEditor,

  editorTitle: 'Section',
  editorDescription: 'Use to partion content into sections of a page.',
  editorTemplate: '[section][/section]',
  editorContext: ['root', 'container'],

}
</script>
