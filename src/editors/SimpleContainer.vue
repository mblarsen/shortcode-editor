<template>
  <div class="editor" :class="[`editor-${tag}`]">
    <editor-header>{{tag}}<span v-if="klass">, class: {{klass}}</span></editor-header>
    <div class="editor__children" :class="[`editor__children--${layoutDirection}`]">
      <component v-for="(editor, i) in editors"
        class="editor"
        @remove="removeChild"
        @movePrev="moveChildPrev"
        @moveNext="moveChildNext"
        :isChild="true"
        :is="editor.use"
        :token="editor.token"
        :key="editor.token.uuid"></component>
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
  data() {
    return {
      layoutDirection: 'column',
    }
  }
}
</script>
