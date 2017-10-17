<template>
  <div class="editor editor--social-icons">
    <editor-header>{{tag}}<span v-if="klass">, class: {{klass}}</span></editor-header>
    <div class="social-icons__preview">
      <div v-for="icon in icons" class="social-icons__icon">
       <i :class="icon.class"></i><span class="social-icons__network" v-if="withNames"> {{icon.name}}</span>
      </div>
    </div>
    <edit-modal :open="isEditing">
      <template slot="title">Social Icons</template>
      <template slot="body">
        <div class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label">Features</label>
            <div class="col-sm-10">
              <div class="checkbox-inline">
                <label><input type="checkbox" v-model="withNames"> include network names</label>
              </div>
            </div>
          </div>
          <simple-input v-model="klass" title="Classes"></simple-input>
       </div>
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
  name: 'social-icons-editor',
  extends: BaseEditor,
  props: ['token'],

  editorTitle: 'Social Icons',
  editorDescription: 'Shows the shops social networks.',
  editorTag: 'social-icons',
  editorContext: ['root', 'container'],

  data() {
    return {
      icons: [
        {
          name: 'Facebook',
          class: 'fa fa-facebook',
        },
        {
          name: 'YouTube',
          class: 'fa fa-youtube',
        },
        {
          name: 'Line',
          class: 'fa c-fa-line',
        },
        {
          name: 'Instagram',
          class: 'fa fa-instagram',
        }
      ],
      withNames: this.token.params.withNames !== undefined
        ? this.token.params.withNames
        : true,
    }
  },
  computed: {
    activeNetworks() {
      // TODO get from Shipnity config
      const config = {
        facebook: 'Shipnity',
        twitter: 'Shipnity',
        youtube: 'Shipnity',
        line: 'Shipnity',
      }
      return this.icons.filter(i => config[i.name.toLowerCase()])
    }
  },
  methods: {
    properties() {
      return [
        `withNames=${this.withNames ? 'true' : 'false'}`,
      ]
    },
  }
}
</script>
<style>
.social-icons__preview {
  display: flex;
  justify-content: center;
}
.social-icons__icon {
  margin-left: 1rem;
}
.social-icons__icon:first-child {
  margin-left: 0;
}
</style>
