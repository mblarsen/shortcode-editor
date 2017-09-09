<template>
  <div class="editor editor-column">
    <div class="editor__label"><a @click="edit">product list: {{name}}</a></div>
    <div>{{num}} product(s) from {{name}}</div>
    <edit-modal :open="isEditing">
      <template slot="title">Product list</template>
      <template slot="body">
        <input type="text" v-model="klass">
        <input type="text" v-model="title" placeholder="Optional list title"> <button @click="title = ''">Clear</button>
        <select v-model="name">
          <option value="" disabled>Select list</option>
          <option value="random">Random</option>
          <option value="bestsellers">Bestsellers</option>
          <option v-for="list in lists" :value="list.name">{{list.title}}</option>
        </select>
        <input type="input" min="1" max="20" step="1" v-model="num">
        <label><input type="checkbox" v-model="fullwidth"> is full width</label>
        <label><input type="checkbox" v-model="nav"> has navigation</label>
      </template>
      <template slot="footer">
        <button @click="save">Save</button>
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
      lists: [
        {name: 'summer2018', title: 'Summer of 2018'},
      ],
    }
  },
  computed: {
    callerId() {
      return `${this.$options.name}-${this._uid}`
    },
  },
  methods: {
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
