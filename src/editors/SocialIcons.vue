<template>
  <div class="editor editor--social-icons">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">social-icons<span v-if="klass">, class: {{klass}}</span></a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
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
          <div class="form-group">
            <label class="col-sm-2 control-label">Classes</label>
            <div class="col-sm-10">
              <div class="input-group">
                <input class="form-control" type="text" v-model="klass" placeholder="CSS classes">
                <span class="input-group-btn">
                  <button class="btn btn-default" @click.prevent="klass = ''"><span class="icon"><i class="fa fa-times"></i></span></button>
                </span>
              </div>
            </div>
          </div>
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
  editorTemplate: '[social-icons withNames=true /]',
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
