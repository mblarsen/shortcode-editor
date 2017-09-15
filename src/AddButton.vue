<template>
  <div class="add-button">
    <button @click="showCatalog" class="editor-add btn btn-xs btn-success">
      <i class="fa fa-plus"></i>
      <span v-if="text">{{text}}</span>
    </button>
  </div>
</template>
<script>
export default {
  name: 'add-button',
  inject: ['bus'],
  props: {
    caller: String,
    context: String,
    text: String,
    component: String,
  },
  methods: {
    showCatalog() {
      this.bus.$emit('showCatalog', {
        caller: this.caller,
        context: this.context,
        component: this.component,
      })
    },
  },
}
</script>
