require('@/css')
import Vue from 'vue'
import App from './App'
import sentinel from 'sentinel-js'

Vue.config.productionTip = false

if (process.env.NODE_ENV === 'development') {
  const imageLists = require('./mock/imageLists')
  const productLists = require('./mock/productLists')
  window.jQuery = {
    get: function (url) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (url === '/product_lists.json') {
            resolve(productLists)
          } else if (url === '/image_lists.json') {
            resolve(imageLists)
          } else {
            reject()
          }
        }, 1000)
      })
    }
  }
}

sentinel.on('.slot-editor', (el) => {
  return new Vue({el, render: h => h(App)})
})
