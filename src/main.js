require('@/css')
import Vue from 'vue'
import App from './App'
import sentinel from 'sentinel-js'

Vue.config.productionTip = false

if (process.env.NODE_ENV === 'development') {
  const imageLists = require('./mock/imageLists')
  const productLists = require('./mock/productLists')
  let progressCallback
  window.jQuery = {
    ajax: function (options) {
      options.xhr()
      const file = options.data.get('shop_image[picture]')
      const progressSize = file.size / 10
      let progress = 0
      let interval = setInterval(() => {
        progress += progressSize
        progress = progress >= file.size ? file.size : progress
        progressCallback({
          lengthComputable: true,
          loaded: progress,
          total: file.size
        })
        if (progress === file.size) {
          clearInterval(interval)
          options.success()
        }
      }, 200)
    },
    ajaxSettings: {
      xhr: function () {
        return {
          upload: {
            addEventListener: function (_, callback) {
              progressCallback = callback
            }
          }
        }
      }
    },
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
