<template>
  <div class="editor" :class="[`editor-${tag}`]">
    <editor-header>{{tag}}<span v-if="klass">, class: {{klass}}</span></editor-header>
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
