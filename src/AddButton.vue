<template>
  <div class="add-button">
    <button @click="showCatalog" class="editor-add btn btn-success">
      <i class="fa fa-plus"></i>
    </button>
  </div>
</template>
<script>
export default {
  name: 'add-button',
  inject: ['bus'],
  props: {caller: String, context: String},
  methods: {
    showCatalog() {
      this.bus.$emit('showCatalog', {caller: this.caller, context: this.context})
    },
  },
}
</script>
