require('@/css')
import Vue from 'vue'
import App from './App'
import sentinel from 'sentinel-js'

Vue.config.productionTip = false

sentinel.on('.slot-editor', (el) => {
  return new Vue({el, render: h => h(App)})
})
