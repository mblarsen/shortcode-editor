<template>
  <div class="save-button">
    <button @click.prevent="$emit('save')" class="editor-add btn btn-success">
      <span>Save</span>
    </button>
  </div>
</template>
<script>
export default {
  name: 'save-button',
}
</script>
