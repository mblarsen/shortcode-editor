require('@/css')
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Array.from(document.getElementsByClassName('slot-editor'))
  .map(el => {
    return new Vue({el, render: h => h(App)})
  })
