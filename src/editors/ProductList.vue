<template>
  <div class="editor editor--product-list">
    <div class="editor__header">
      <div class="editor__label"><a @click="edit">product list "{{name}}" {{num}} products</a></div>
      <a class="editor__remove btn btn-xs btn-link`" @click.prevent="remove"><span class="icon"><i class="fa fa-times"></i></span></a>
    </div>
    <div v-if="title" class="product-list__title">{{title}}</div>
    <div class="product-list__products">
      <div v-if="!fullwidth" class="product-list__product product-list__product--fullwidth"></div>
      <div v-if="nav" class="product-list__product product-list__product--nav">
        <span class="icon"><i class="fa fa-chevron-circle-left"></i></span>
      </div>
      <div v-for="i in products" class="product-list__product" :style="{width: productWidth}">
        <span class="icon"><i class="fa fa-product-hunt"></i></span>
      </div>
      <div v-if="nav" class="product-list__product product-list__product--nav">
        <span class="icon"><i class="fa fa-chevron-circle-right"></i></span>
      </div>
      <div v-if="!fullwidth" class="product-list__product product-list__product--fullwidth"></div>
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
                  <button class="btn btn-default" @click.prevent="title = ''"><span class="icon"><i class="fa fa-times"></i></span></button>
                </span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">List</label>
            <div class="col-sm-5">
              <select class="form-control" v-model="name" :disabled="loading">
                <option v-for="list in listsWithSpecial" :value="list.slug">{{list.name}}</option>
              </select>
              <span v-if="loading" class="help-block">Loading...</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Products</label>
            <div class="col-sm-5">
              <div class="input-group">
                <input class="form-control" type="number" :min="numInList" max="20" step="1" v-model="num">
                <span class="input-group-btn">
                  <button class="btn btn-default" @click.prevent="num = 8">default</button>
                </span>
              </div>
              <span class="help-block">The number of products to be displayed in the list.</span>
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
      fullwidth: this.token.params.fullwidth !== undefined
        ? this.token.params.fullwidth
        : true,
      play: this.token.params.play || 2500,
      nav: this.token.params.nav !== undefined
        ? this.token.params.nav
        : true,
      lists: [],
      loading: false,
    }
  },
  computed: {
    listsWithSpecial() {
      return [
        {slug: 'random', name: 'Random'},
        {slug: 'bestsellers', name: 'Bestsellers'},
        ...this.lists
      ]
    },
    productWidth() {
      return `calc(100%/${this.numInList})`
    },
    products() {
      return parseInt(this.num)
    },
    list() {
      return this.lists.find(l => l.slug === this.name)
    },
  },
  watch: {
    isEditing(editing) {
      if (editing) {
        this.fetchLists()
      }
    },
    name() {
      if (!this.title) {
        this.title = this.list.name
      }
    }
  },
  methods: {
    fetchLists() {
      this.loading = true
      window.jQuery.get('/product_lists.json')
        .then(lists => {
          this.lists = lists
          this.loading = false
        })
    },
    properties() {
      const props = [
        `name="${this.name}"`,
        `num=${this.num}`,
        `play=${this.play}`,
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
.product-list__title {
  color: #777;
  font-weight: bold;
  font-size: 115%;
  margin-bottom: 1rem;
  text-align: center;
  text-transform: uppercase;
}
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
.product-list__product--fullwidth {
  background-color: var(--gray-border-color);
  min-width: 4%;
}
.product-list__product--nav {
  color: #999;
  background-color: var(--gray-border-color);
  min-width: 2%;
}
</style>
