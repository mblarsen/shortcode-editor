<template>
  <div class="editor editor-column">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">product list</a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <div class="product-list__title">{{num}} product(s) from {{name}} <template v-if="title">with title {{title}}</template></div>
    <div class="product-list__products">
      <div v-for="i in products" class="product-list__product" :style="{width: productWidth}">
        <span class="icon"><i class="fa fa-product-hunt"></i></span>
      </div>
    </div>
    <edit-modal :open="isEditing">
      <template slot="title">Product list</template>
      <template slot="body">
        <div class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label">Title</label>
            <div class="col-sm-10">
              <div class="input-group">
                <input class="form-control" type="text" v-model="title" placeholder="Optional list title">
                <span class="input-group-btn">
                  <button class="btn btn-default" @click="title = ''"><span class="icon"><i class="fa fa-times"></i></span></button>
                </span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Products</label>
            <div class="col-sm-5">
              <input class="form-control input-sm" type="number" min="1" max="20" step="1" v-model="num">
              <span class="help-block">The number of products to be displayed in the list.</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">List</label>
            <div class="col-sm-5">
              <select class="form-control" v-model="name" :disabled="loading">
                <option value="" disabled>Select list</option>
                <option value="random">Random</option>
                <option value="bestsellers">Bestsellers</option>
                <option v-for="list in lists" :value="list.name">{{list.title}}</option>
              </select>
              <span v-if="loading" class="help-block">Loading...</span>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <div class="checkbox-inline">
                <label><input type="checkbox" v-model="fullwidth"> fullwidth</label>
              </div>
              <div class="checkbox-inline">
                <label><input type="checkbox" v-model="nav"> with navigation</label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="classes" class="col-sm-2 control-label">Classes</label>
            <div class="col-sm-10">
              <div class="input-group">
                <input class="form-control" type="text" v-model="klass" placeholder="CSS classes">
                <span class="input-group-btn">
                  <button class="btn btn-default" @click="klass = ''"><span class="icon"><i class="fa fa-times"></i></span></button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <button @click="save" class="btn btn-success" :disabled="loading">Save</button>
      </template>
    </edit-modal>
  </div>
</template>
<script>
import BaseEditor from '@/editors/Base'

export default {
  name: 'product-list-editor',
  extends: BaseEditor,
  props: ['token'],

  editorTitle: 'Product list',
  editorDescription: 'Display a list of products',
  editorTemplate: '[product-list name="random" num=4/]',
  editorContext: ['root', 'container'],

  data() {
    return {
      numInList: 4, // TODO read from shop config
      title: this.token.params.title,
      name: this.token.params.name || '',
      num: this.token.params.num || 8,
      fullwidth: this.token.params.fullwidth === undefined
        ? this.token.params.fullwidth
        : true,
      play: this.token.params.play || 2500,
      nav: this.token.params.nav === undefined
        ? this.token.params.nav
        : true,
      lists: [],
      loading: false,
    }
  },
  computed: {
    productWidth() {
      return `calc(100%/${this.numInList})`
    },
    products() {
      return parseInt(this.num)
    },
  },
  watch: {
    isEditing(editing) {
      if (editing) {
        this.fetchLists()
      }
    }
  },
  methods: {
    fetchLists() {
      this.loading = true
      setTimeout(() => {
        this.lists = [
          {name: 'summer2018', title: 'Summer of 2018'},
        ]
        this.loading = false
      }, 1500)
    },
    properties() {
      const props = [
        `name="${this.name}"`,
        `num=${this.num}`,
        `fullwidth=${this.fullwidth ? 'true' : 'false'}`,
        `nav=${this.nav ? 'true' : 'false'}`,
      ]

      this.title && props.push(`title="${this.title}"`)

      return props
    },
  }
}
</script>
<style>
.product-list__products {
  display: flex;
  justify-items: space-between;
  height: 10vh;
  margin-left: -5px;
  margin-bottom: 1rem;
}
.product-list__product {
  display: flex;
  height: 100%;
  margin-left: 5px;
  justify-content: center;
  align-items: center;
  color: var(--content-dimmed-color);
  background-color: var(--content-color);
  border-radius: var(--box-border-radius);
}
</style>
