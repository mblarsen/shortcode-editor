<template>
  <div class="editor-catalog">
    <div class="modal fade" :class="{'is-active': open}">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">Catalog: {{context}}</div>
          </div>
          <div class="modal-body editor-catalog__modal-body">
            <div>
              <input v-model="search" class="form-control" placeholder="Search..." type="text">
            </div>
            <div v-for="item in filteredItems" class="editor-catalog__item">
              <div>{{item.title}}</div>
              <div>{{item.description}}</div>
              <button @click="select(item.template)" class="btn btn-sm">select</button>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="open = false" class="btn btn-default">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ColumnEditor from '@/editors/Column'
import RowEditor from '@/editors/Row'
import TextEditor from '@/editors/Text'

let items = [
  ColumnEditor,
  RowEditor,
  TextEditor,
].map(item => ({
  name: item.name,
  title: item.shortcodeTitle,
  description: item.shortcodeDescription,
  template: item.shortcodeTemplate,
  context: item.shortcodeContext,
}))

export default {
  name: 'catalog',
  inject: ['bus'],
  data() {
    return {
      open: false,
      context: 'root',
      items: items,
      search: '',
    }
  },
  computed: {
    filteredItems() {
      const items = this.items.filter(i => i.context.includes(this.context))
      if (this.search.length === 0) { return items }
      const term = this.search.toLowerCase()
      return items.filter(item => {
        return item.description.toLowerCase().indexOf(term) > -1 ||
          item.title.toLowerCase().indexOf(term) > -1
      })
    }
  },
  created() {
    /**
     * @param {Object} obj An object with caller and context
     * @param {String} obj.caller An id of the caller so we know who to sent catalog choice to
     * @param {String} [obj.context='all'] The the context for the components that we wish to insert
     */
    this.bus.$on('showCatalog', ({caller, context = 'root', component = null}) => {
      this.context = context
      this.caller = caller
      if (component) {
        const componentFullName = `${component}-editor`
        const item = this.items.find(i => i.name === componentFullName)
        if (!item) {
          throw new Error('Invalid component requested')
        }
        return this.select(item.template)
      }

      this.open = true
    })
  },
  methods: {
    select(item) {
      this.open = false
      this.bus.$emit(this.caller, {item})
    },
  },
}
</script>
<style>
.modal.is-active {
  display: block;
  opacity: 1;
}
.modal.is-active .modal-dialog {
  transform: translate(0, 0);
}
.editor-catalog {
}
.editor-catalog__item {
  flex: 1;
}
</style>
