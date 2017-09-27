<template>
  <div class="editor" :class="[`editor-${tag}`]">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">{{tag}} <span v-if="klass">[{{klass}}]</span></a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <add-button context="container" :caller="callerId"/>
    <edit-modal :open="isEditing">
      <template slot="title">
        {{$options.editorTitle}}
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
import BaseEditor from '@/editors/Base'

export default {
  name: 'simple-editor',
  extends: BaseEditor,
}
</script>
