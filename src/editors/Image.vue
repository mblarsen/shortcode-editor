<template>
<div class="editor editor-image">
    <div class="editor__header">
      <div class="editor__label"><a @click.prevent="edit">image <span v-if="klass">[{{klass}}]</span></a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <img v-if="src_" :src="src_" :alt="alt" class="image__preview" @click="edit"/>
    <edit-modal :open="isEditing">
      <template slot="title">
        Image
      </template>
      <template slot="body">
        <form class="form-horizontal">
          <div class="form-group">
            <label for="classes" class="col-sm-2 control-label">Image source</label>
            <div class="col-sm-10">
              <div class="radio-inline">
                <label><input type="radio" v-model="imageSource" value="list"> from list</label>
              </div>
              <div class="radio-inline">
                <label><input type="radio" v-model="imageSource" value="src"> src attribute</label>
              </div>
            </div>
          </div>
          <div v-if="imageSource === 'src'" class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <input id="classes" class="form-control" type="text" v-model="src" placeholder="URL for image">
            </div>
          </div>
          <div v-if="imageSource === 'list'" class="form-group">
            <div class="col-sm-offset-2 col-sm-5">
              <select class="form-control" v-model="list" :disabled="loading">
                <option v-for="list in lists" :value="list.name">{{list.title}}</option>
              </select>
              <span v-if="loading" class="help-block">Loading...</span>
            </div>
            <div class="col-sm-offset-2 col-sm-10">
              <div class="image__list-images">
                <img v-for="image in images" :src="image.url" :key="image.url" @click="selectImage(image)" class="image__list-image" :class="{'image__list-image--selected': image.name === name}" alt="">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="classes" class="col-sm-2 control-label">Alt text</label>
            <div class="col-sm-10">
              <div class="input-group">
                <input class="form-control" type="text" v-model="alt" placeholder="Optional alt text">
                <span class="input-group-btn">
                  <button class="btn btn-default" @click.prevent="alt = ''"><span class="icon"><i class="fa fa-times"></i></span></button>
                </span>
              </div>
            </div>
          </div>
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
        <button @click="save" class="btn btn-success">Close</button>
      </template>
    </edit-modal>
  </div>
</template>
<script>
import BaseEditor from '@/editors/Base'

let lists = []

export default {
  name: 'image-editor',
  extends: BaseEditor,
  props: ['token'],

  editorTitle: 'Image',
  editorDescription: 'Displays an image',
  editorTemplate: '[image name="logo"/]',
  editorContext: ['root', 'container'],

  data() {
    return {
      list: this.token.params.list || 'global',
      src: this.token.params.src,
      name: this.token.params.name,
      alt: this.token.params.alt || '',

      imageSource: this.token.params.src ? 'src' : 'list',
      lists: lists,
      images: [],
      selectedImage: null,
      src_: this.token.params.src,
      loading: false,
    }
  },
  created() {
    this.fetchImage()
  },
  watch: {
    src() {
      this.src_ = this.src
    },
    imageSource(source) {
      if (source === 'src') {
        this.name = null
        this.src_ = null
      }
      if (source === 'list') {
        this.src = null
        this.src_ = null
        this.fetchLists()
      }
    },
    list() {
      this.images = this.findList(this.list).images
      this.name = null
      this.src_ = null
    },
  },
  methods: {
    findList(name) {
      return this.lists.find(l => l.name === this.list)
    },
    fetchImage() {
      if (!this.src) {
        this.fetchLists()
          .then(() => {
            const list = this.findList(this.list)
            this.images = list.images
            const image = list && list.images.find(i => i.name === this.name) || null
            this.src_ = image && image.url || null
          })
      }
    },
    fetchLists() {
      return new Promise((resolve, reject) => {
        this.loading = true
        if (this.lists.lists) { return resolve() }
        setTimeout(() => {
          this.lists = lists = [
            {
              name: 'global',
              title: 'Global',
              images: [
                {name: 'logo', url: 'http://lorempixel.com/400/200/abstract/6'},
                {name: 'logo2', url: 'http://lorempixel.com/500/200/abstract/1'},
                {name: 'logo3', url: 'http://lorempixel.com/200/300/abstract/2'},
                {name: 'logo4', url: 'http://lorempixel.com/250/250/abstract/3'},
                {name: 'logo5', url: 'http://lorempixel.com/200/200/abstract/4'},
                {name: 'logo6', url: 'http://lorempixel.com/100/400/abstract/5'}
              ]
            },
            {
              name: 'cats',
              title: 'Cats',
              images: [
                {name: 'juju', url: 'http://lorempixel.com/200/200/cats/3/Juju'},
                {name: 'jester2', url: 'http://lorempixel.com/200/200/cats/2/Jester'},
                {name: 'balder', url: 'http://lorempixel.com/200/200/cats/1/Balder'}
              ]
            }
          ]
          this.loading = false
          resolve(this.lists)
        }, 800)
      })
    },
    selectImage(image) {
      this.name = image.name
      this.src_ = image.url
    },
    properties() {
      const props = []
      this.name && props.push(`name="${this.name}"`)
      this.src && props.push(`src="${this.src}"`)
      this.alt && props.push(`alt="${this.alt}"`)
      this.list && this.list !== 'global' && props.push(`list="${this.list}"`)
      return props
    },
  },
}
</script>
<style>
.image__preview {
  width: 100%;
}
.image__list-images {
  margin-top: 1rem;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0.5rem;
  max-height: 35vh;
  overflow-y: auto;
}
.image__list-image {
  border: 5px solid transparent;
  width: 100%;
}
.image__list-image:hover {
  border-color: var(--highlight-border-color);
}
.image__list-image--selected {
  border-color: #5cb85c;
}
</style>
