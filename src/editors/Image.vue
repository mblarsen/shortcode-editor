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
        <form ref="editor" class="form-horizontal">

          <!-- list or src -->
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

          <simple-input v-if="imageSource === 'src'" v-model="src" placeholder="URL for image"></simple-input>

          <!-- select image -->
          <div v-if="imageSource === 'list'" class="form-group">
            <label class="col-sm-2 control-label">List</label>
            <div class="col-sm-5">
              <select class="form-control" v-model="list" :disabled="loading">
                <option v-for="list in lists" :value="list.name">{{list.name}}</option>
              </select>
              <span v-if="loading" class="help-block">Loading...</span>
            </div>
            <div class="col-sm-offset-2 col-sm-10">
              <image-drop v-if="canDrop" :container="$refs.editor" :submitUrl="`/image_lists/${listId}/add_image`" @imageUploaded="addUploadedImage"></image-drop>
              <div v-if="images.length" class="image__list-images">
                <img v-for="image in images" :src="image.url" :key="image.url" @click="selectImage(image)" class="image__list-image" :class="{'image__list-image--selected': image.name === name}" alt="">
              </div>
              <div v-else class="form-control-static">
                <div class="alert alert-warning">The list contains no images.</div>
              </div>
              <div v-if="error" class="form-control-static">
                <div class="alert alert-danger"><strong>Error</strong>: {{error}}</div>
              </div>
            </div>
          </div>

          <simple-input v-model="dest" title="Link to" placeholder="https://www.google.com"></simple-input>
          <simple-input v-model="alt" title="Alt text" placeholder="Optional alt text"></simple-input>
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
import ImageDrop from '@/editors/Form/ImageDrop'
import BaseEditor from '@/editors/Base'

export default {
  name: 'image-editor',
  extends: BaseEditor,
  props: ['token'],

  editorTitle: 'Image',
  editorDescription: 'Displays an image',
  editorTag: 'image',
  editorProps: ['list', 'src', 'dest', 'name', 'alt'],
  editorSample: '[image name="logo"/]',
  editorContext: ['root', 'container'],

  components: {
    ImageDrop,
  },

  data() {
    return {
      list: this.token.params.list || 'global',
      initialList: this.token.params.list,
      src: this.token.params.src,
      dest: this.token.params.dest,
      name: this.token.params.name,
      alt: this.token.params.alt || '',

      error: null,
      imageSource: this.token.params.src ? 'src' : 'list',
      lists: [],
      listId: null,
      images: [],
      src_: this.token.params.src,
      loading: false,
      canDrop: false,
    }
  },
  created() {
    this.fetchImage()
  },
  mounted() {
    this.canDrop = true
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
      const list = this.findList(this.list)
      this.listId = list.id
      this.images = list.images || []
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
            this.listId = list.id
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
      this.dest && props.push(`dest="${this.dest}"`)
      this.alt && props.push(`alt="${this.alt}"`)
      this.list && this.list !== 'global' && props.push(`list="${this.list}"`)
      return props
    },
    addUploadedImage(image) {
      this.name = image.name
      this.src_ = image.url
      this.images.push(image)
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
