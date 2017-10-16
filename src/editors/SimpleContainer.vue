<template>
  <div class="editor" :class="[`editor-${tag}`]">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">{{tag}}<span v-if="klass">, class: {{klass}}</span></a></div>
      <a class="editor__change btn btn-xs btn-link`" @click.prevent="changeType">Change type</a>
      <a class="editor__move-prev btn btn-xs btn-link`" @click.prevent="movePrev"><span class="icon"><i class="fa fa-chevron-left"></i></span></a>
      <a class="editor__move-next btn btn-xs btn-link`" @click.prevent="moveNext"><span class="icon"><i class="fa fa-chevron-right"></i></span></a>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
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
