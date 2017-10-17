<template>
  <div class="editor-catalog">
    <div class="modal fade" :class="{'is-active': open}">
      <div class="modal-dialog editor-catalog__modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">Catalog: {{context}}</div>
          </div>
          <div class="modal-body editor-catalog__modal-body">
            <div>
              <input v-model="search" class="form-control" placeholder="Search..." type="text" autofocus>
            </div>
            <div class="editor-catalog__items">
              <div v-for="item in filteredItems" class="editor-catalog__item">
                <div class="editor-catalog__item__title">{{item.title}}</div>
                <div class="editor-catalog__item__description">{{item.description}}</div>
                <button @click.prevent="select(item)" class="editor-catalog__item__select btn btn-xs btn-block btn-success">select</button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click.prevent="open = false" class="btn btn-sm btn-default">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {injectEditors} from '@/EditorFactory'

export default {
  name: 'catalog',
  inject: ['bus'],
  beforeCreate() { injectEditors(this) },
  data() {
    return {
      open: false,
      context: 'root',
      action: 'append',
      type: null,
      items: [],
      search: '',
    }
  },
  computed: {
    filteredItems() {
      const items = this.items
        /* items that can be added in context */
        .filter(i => i.context.includes(this.context))
        /* items of type */
        .filter(i => !this.type || i.type === this.type)

      if (this.search.length === 0) { return items }
      const term = this.search.toLowerCase()
      return items.filter(item => {
        return item.description.toLowerCase().indexOf(term) > -1 ||
          item.title.toLowerCase().indexOf(term) > -1
      })
    }
  },
  created() {
    /* build that catalog of components */
    this.fillCatalog()

    /**
     * @param {Object} obj An object with caller and context
     * @param {String} obj.caller An id of the caller so we know who to sent catalog choice to
     * @param {String} [obj.context='all'] The the context for the components that we wish to insert
     */
    this.bus.$on('showCatalog', ({caller, context = 'root', type = null, component = null, action = 'append'}) => {
      this.context = context
      this.caller = caller
      this.action = action
      this.type = type
      if (component) {
        const componentFullName = `${component}-editor`
        const item = this.items.find(i => i.name === componentFullName)
        if (!item) {
          throw new Error('Invalid component requested')
        }
        return this.select(item)
      }

      this.open = true
    })
  },
  methods: {
    select(item) {
      this.open = false
      this.search = ''
      this.bus.$emit(this.caller, {item, action: this.action})
    },
    fillCatalog() {
      this.items = Object.values(this.$options.components)
        .filter(item => item.editorTitle)
        .map(item => ({
          name: item.name,
          title: item.editorTitle,
          description: item.editorDescription,
          sample: item.editorSample,
          context: item.editorContext,
          childContext: item.editorChildContext,
          props: item.editorProps,
          tag: item.editorTag,
          type: item.editorIsContainer ? 'container' : null
        }))
    },
  },
}
</script>
