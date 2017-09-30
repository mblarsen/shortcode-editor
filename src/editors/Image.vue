<template>
<div class="editor editor-image">
    <div class="editor__header">
      <div class="editor__label"><a @click.prevent="edit">image<span v-if="klass">, class: {{klass}}</span></a></div>
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
            <label for="classes" class="col-sm-2 control-label">Source</label>
            <div class="col-sm-10">
              <div class="radio-inline">
                <label><input type="radio" v-model="imageSource" value="list"> image list</label>
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
            <label class="col-sm-2 control-label">List</label>
            <div class="col-sm-5">
              <select class="form-control" v-model="list" :disabled="loading">
                <option v-for="list in lists" :value="list.name">{{list.name}}</option>
              </select>
              <span v-if="loading" class="help-block">Loading...</span>
            </div>
            <div class="col-sm-offset-2 col-sm-10">
              <div v-if="images.length" class="image__list-images">
                <img v-for="image in images" :src="image.url" :key="image.url" @click="selectImage(image)" class="image__list-image" :class="{'image__list-image--selected': image.name === name}" alt="">
              </div>
              <div v-else class="form-control-static">
                <div class="alert alert-warning"> The list contains no images </div>
              </div>
              <div v-if="error" class="form-control-static">
                <div class="alert alert-danger"><strong>Error</strong>: {{error}}</div>
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
        <button @click.prevent="save" class="btn btn-success">Close</button>
      </template>
    </edit-modal>
  </div>
</template>
<script>
import BaseEditor from '@/editors/Base'

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
      initialList: this.token.params.list,
      src: this.token.params.src,
      name: this.token.params.name,
      alt: this.token.params.alt || '',

      error: null,
      imageSource: this.token.params.src ? 'src' : 'list',
      lists: [],
      images: [],
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
      this.name = null
      this.src_ = null
      this.error = null
      if (!this.list) { return }
      this.images = this.findList(this.list).images || []
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
            if (!list) {
              this.error = `List "${this.initialList}" does not exist.`
              return
            }
            this.images = list.images
            const image = list && list.images.find(i => i.name === this.name) || null
            this.src_ = image && image.url || null
          })
      }
    },
    fetchLists() {
      this.loading = true
      return window.jQuery.get('/image_lists.json')
        .then(({image_lists: lists}) => {
          this.lists = (lists || []).map(list => {
            list.images = list.shop_images
                .map(i => (i.url = i.thumb, i)) // eslint-disable-line
                .map(i => (i.url = i.url.replace(/https?:/, window.location.protocol), i)) // eslint-disable-line
            return list
          })
          this.loading = false
          return this.lists
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
  min-height: 3rem;
  width: 100%;
}
.image__list-image:hover {
  border-color: var(--highlight-border-color);
}
.image__list-image--selected {
  border-color: #5cb85c;
}
</style>
