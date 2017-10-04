<template>
  <div class="form-group">
    <label v-if="title" class="col-sm-2 control-label">{{title}}</label>
    <div class="col-sm-10" :class="{'col-sm-offset-2': !title}">
      <div class="input-group">
        <input class="form-control" type="text" v-model="value_" :placeholder="placeholder">
        <span class="input-group-btn">
          <button class="btn btn-default" @click.prevent="value_ = ''"><span class="icon"><i class="fa fa-times"></i></span></button>
        </span>
      </div>
      <span v-if="help" class="help-block">{{help}}</span>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'simple-input',
  props: ['value', 'title', 'placeholder', 'help'],
  data() {
    return {
      value_: this.value,
    }
  },
  watch: {
    value_() {
      this.$emit('input', this.value_)
    }
  },
}
</script>

