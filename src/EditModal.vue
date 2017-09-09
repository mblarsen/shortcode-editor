<template>
  <div class="edit-modal">
    <div class="modal fade" :class="{'is-active': open}">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <slot name="title">Edit</slot>
          </div>
          <div class="modal-body edit-modal__modal-body">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'edit-modal',
  props: ['open'],
}
</script>

