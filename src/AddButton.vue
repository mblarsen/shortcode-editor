<template>
  <div class="editor-add">
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
<style>
.editor-add {
  width: 100%;
  flex: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
