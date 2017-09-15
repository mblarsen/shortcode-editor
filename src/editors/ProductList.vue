<template>
  <div class="editor editor-column">
    <div class="editor__label"><a @click="edit">product list: {{name}}</a></div>
    <div>{{num}} product(s) from {{name}}</div>
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
import EditModal from '@/EditModal'

export default {
  name: 'product-list-editor',
  inject: ['bus'],
  props: ['token'],
  shortcodeTitle: 'Product list',
  shortcodeDescription: 'Display a list of products',
  shortcodeTemplate: '[product-list name="random" num=4/]',
  shortcodeContext: ['root', 'container'],
  components: {
    EditModal,
  },
  data() {
    return {
      isEditing: false,
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
      klass: this.token.params.class || '',
      lists: [],
      loading: false,
    }
  },
  computed: {
    callerId() {
      return `${this.$options.name}-${this._uid}`
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
    edit() {
      this.isEditing = true
    },
    save() {
      this.isEditing = false
      this.bus.$emit('update')
    },
    toTemplate() {
      const props = [
        `name="${this.name}"`,
        `num=${this.num}`,
        `fullwidth=${this.fullwidth ? 'true' : 'false'}`,
        `nav=${this.nav ? 'true' : 'false'}`,
      ]
      if (this.title) {
        props.push(`title="${this.title}"`)
      }
      if (this.klass) {
        props.push(`class="${this.klass}"`)
      }

      return `[product-list ${props.join(' ')}/]`
    }
  }
}
</script>
