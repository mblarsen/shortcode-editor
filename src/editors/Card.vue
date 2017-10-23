<template>
  <div class="editor editor--card">
    <editor-header>{{tag}}<span v-if="klass">, class: {{klass}}</span></editor-header>
    <div class="editor__children editor__children--card editor__children--column">
      <div class="card__preview" :style="cardStyle">
        <component v-for="(editor, i) in editors"
          class="editor"
          @remove="removeChild"
          @movePrev="moveChildPrev"
          @moveNext="moveChildNext"
          :is="editor.use"
          :token="editor.token"
          :key="editor.token.uuid"></component>
        <button v-if="cta" class="card__preview__cta btn btn-success">{{cta}}</button>
      </div>
    </div>
    <add-button context="container" :caller="callerId"/>
    <edit-modal :open="isEditing">
      <template slot="title"> Card </template>
      <template slot="body">
        <form class="form-horizontal">

          <simple-input v-model="cta" title="CTA" placeholder="Buy Now" help="Will show a button with Call To Action (CTA)."></simple-input>

          <!-- select image -->
          <div class="form-group">
            <label class="col-sm-2 control-label">List</label>
            <div class="col-sm-5">
              <select class="form-control" v-model="list" :disabled="true || loading">
                <option v-for="list in lists" :value="list.name">{{list.name}}</option>
              </select>
              <span v-if="loading" class="help-block">Loading...</span>
            </div>
            <div class="col-sm-offset-2 col-sm-10">
              <div v-if="images.length" class="card__list-images">
                <img v-for="image in images" :src="image.url" :key="image.url" @click="selectImage(image)" class="card__list-image" :class="{'card__list-image--selected': image.name === image}">
              </div>
              <div v-else class="form-control-static">
                <div class="alert alert-warning">The list contains no images.</div>
              </div>
              <div v-if="error" class="form-control-static">
                <div class="alert alert-danger"><strong>Error</strong>: {{error}}</div>
              </div>
              <div v-if="image" class="form-control-static">
                <button class="btn btn-primary" @click.prevent="deselectImage">Clear image selection</button>
              </div>
            </div>
          </div>

          <!-- background-color -->
          <div class="form-group">
            <label class="col-sm-2 control-label">Color</label>
            <div class="col-sm-10">
              <div class="input-group">
                <input class="form-control" type="text" v-model="color">
                <span class="input-group-btn">
                  <button class="btn btn-default" @click.prevent="color = ''"><span class="icon"><i class="fa fa-times"></i></span></button>
                </span>
              </div>
              <span class="help-block">If no image is used the background color will be displayed. (Any valid CSS can be used)</span>
            </div>
          </div>

          <simple-input v-model="dest" title="Link to" placeholder="https://www.google.com"></simple-input>

          <div class="form-group">
            <label class="col-sm-2 control-label">Features</label>
            <div class="col-sm-10">
              <div class="checkbox-inline">
                <label><input type="checkbox" v-model="autocrop"> autocrop</label>
              </div>
            </div>
          </div>

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
  name: 'card-editor',
  extends: BaseContainerEditor,

  editorTitle: 'Card',
  editorDescription: 'Card with Call-To-Action and optional image background',
  editorTag: 'card',
  editorIsContainer: true,
  editorProps: ['image', 'cta', 'color', 'dest', 'autocrop'],
  editorSample: '[card]<h1>Headline</h1><p>Paragraph</p>[/card]',
  editorContext: ['root', 'container'],

  data() {
    return {
      image: this.token.params.image,
      cta: this.token.params.cta,
      color: this.token.params.color,
      dest: this.token.params.dest,
      autocrop: this.token.params !== false,

      list: this.token.params.list || 'global',
      error: null,
      lists: [],
      images: [],
      src: null,
      loading: false,
    }
  },
  computed: {
    cardStyle() {
      let background = this.color || 'linear-gradient(rgba(243,243,243,1),rgba(200,200,200,1))'
      background = this.src
        ? `url(${this.src}), ${background}`
        : background

      return {
        background,
        backgroundSize: `cover`
      }
    }
  },
  created() {
    this.fetchImage()
  },
  methods: {
    properties() {
      return [
        ...(this.image ? [`image="${this.image}"`] : []),
        ...(this.cta ? [`cta="${this.cta}"`] : []),
        ...(this.color ? [`color="${this.color}"`] : []),
        ...(this.dest ? [`dest="${this.dest}"`] : []),
        ...(!this.autocrop ? [`autocrop=${this.autocrop}`] : []),
      ]
    },
    fetchImage() {
      this.fetchLists()
        .then(() => {
          const list = this.findList(this.list)
          if (!list) {
            this.error = `List "${this.initialList}" does not exist.`
            return
          }
          this.images = list.images
          const image = list && list.images.find(i => i.name === this.name) || null
          this.src = image && image.url || null
        })
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
    findList(name) {
      return this.lists.find(l => l.name === this.list)
    },
    selectImage(image) {
      this.image = image.name
      this.src = image.url
    },
    deselectImage() {
      this.image = null
      this.src = null
    },
  }
}
</script>
<style>
.card__preview {
  display: flex;
  flex-direction: column;
  min-height: 10vh;
  padding: 1rem;
  border-radius: var(--box-border-radius);
}
.card__list-images {
  margin-top: 1rem;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0.5rem;
  max-height: 35vh;
  overflow-y: auto;
}
.card__list-image {
  border: 5px solid transparent;
  min-height: 3rem;
  width: 100%;
}
.card__list-image:hover {
  border-color: var(--highlight-border-color);
}
.card__list-image--selected {
  border-color: #5cb85c;
}
</style>
