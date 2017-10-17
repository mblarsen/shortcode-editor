<template>
  <div class="editor" :class="[`editor-${tag}`]">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">{{tag}}<span v-if="klass">, class: {{klass}}</span></a></div>
      <a class="editor__wrap btn btn-xs btn-link`" @click.prevent="wrapIn">Wrap in</a>
      <a class="editor__change btn btn-xs btn-link`" @click.prevent="changeType">Change type</a>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
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
import BaseEditor from '@/editors/Base'

export default {
  name: 'simple-editor',
  extends: BaseEditor,
}
</script>
