<template>
  <div class="editor editor--hero-slider">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">hero slider "{{list}}", {{nav ? 'with controls' : 'no controls'}}{{play ? `, ${play}ms interval` : ''}}</a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <div class="hero-slider__previews">
      <img v-for="image in images" :src="image.url" :key="image.url"  class="hero-slider__preview" />
    </div>
    <edit-modal :open="isEditing">
      <template slot="title">Hero slider</template>
      <template slot="body">
        <div class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label">List</label>
            <div class="col-sm-5">
              <select class="form-control" v-model="list" :disabled="loading">
                <option v-for="list in lists" :value="list.name">{{list.name}}</option>
              </select>
              <span v-if="loading" class="help-block">Loading...</span>
            </div>
            <div class="col-sm-offset-2 col-sm-10">
              <div v-if="images.length" class="hero-slider__list-images">
                <img v-for="image in images" :src="image.url" :key="image.url" class="hero-slider__list-image" :class="{'hero-slider__list-image--selected': image.name === name}" alt="">
              </div>
              <div v-if="error" class="form-control-static">
                <div class="alert alert-danger"><strong>Error</strong>: {{error}}</div>
              </div>
              <div v-else class="form-control-static">
                <div class="alert alert-warning">The list contains no images</div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Interval</label>
            <div class="col-sm-5">
              <div class="input-group">
                <input class="form-control" type="number" :min="0" max="10000" step="100" v-model="play">
                <span class="input-group-btn">
                  <button class="btn btn-default" @click.prevent="play = 2500">default</button>
                </span>
              </div>
              <span class="help-block">The number of miliseconds between slide to next page.</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Features</label>
            <div class="col-sm-10">
              <div class="checkbox-inline">
                <label><input type="checkbox" v-model="nav"> with navigation</label>
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
        <button @click.prevent="save" class="btn btn-success" :disabled="loading">Close</button>
      </template>
    </edit-modal>
  </div>
</template>
<script>
import BaseEditor from '@/editors/Base'

export default {
  name: 'hero-slider-editor',
  extends: BaseEditor,
  props: ['token'],

  editorTitle: 'Hero slider',
  editorDescription: 'Typical hero slider for frontpage.',
  editorTemplate: '[hero-slider list="frontslider" /]',
  editorContext: ['root', 'container'],

  data() {
    return {
      list: this.token.params.list || 'global',
      play: this.token.params.play || 2500,
      nav: this.token.params.nav !== undefined
        ? this.token.params.nav
        : true,

      error: null,
      initialList: this.token.params.list,
      lists: [],
      images: [],
      loading: false,
    }
  },
  created() {
    this.fetchImages()
  },
  watch: {
    list() {
      this.error = null
      if (!this.list) { return }
      this.fetchImages()
    },
  },
  methods: {
    fetchImages() {
      this.fetchLists()
        .then(() => {
          const list = this.findList(this.list)
          if (!list) {
            this.error = `List "${this.initialList}" does not exist.`
            return
          }
          this.images = list.images
        })
    },
    fetchLists() {
      if (this.lists.length) { return Promise.resolve() }
      this.loading = true
      return window.jQuery.get('/image_lists.json')
        .then(({image_lists: lists}) => {
          this.lists = lists
          this.loading = false
        })
    },
    findList(name) {
      return this.lists.find(l => l.name === this.list)
    },
    properties() {
      const props = [
        `list="${this.list}"`,
        `nav=${this.nav ? 'true' : 'false'}`
      ]
      this.play && (+this.play !== 2500) && props.push(`play=${this.play}`)
      return props
    },
  }
}
</script>
<style>
.hero-slider__previews {
  width: 100%;
  display: flex;
  justify-items: space-between;
  height: 10vh;
  margin-left: -5px;
  margin-bottom: 1rem;
}
.hero-slider__preview {
  display: flex;
  height: 100%;
  margin-left: 5px;
}
.hero-slider__list-images {
  margin-top: 1rem;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0.5rem;
  max-height: 35vh;
  overflow-y: auto;
}
</style>
