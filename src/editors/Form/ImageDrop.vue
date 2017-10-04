<template>
  <div class="image-drop">
    <div class="image-drop__dropped">
      <div v-for="image in images" class="image-drop__dropped__image">
        <img :src="image.url"/>
        <div class="progress">
          <div class="progress-bar" role="progressbar" :style="progressStyle(image)">
            <span class="sr-only">{{progress(image)}}% Complete</span>
          </div>
        </div>
      </div>
    </div>
    <div v-show="dragging" ref="dropzone" @dragenter="canDrop = true" @dragleave="canDrop = false" class="image-drop__dropzone" :class="{'image-drop__dropzone--ready': canDrop}">
      Drop image to upload
    </div>
  </div>
</template>
<script>
// https://gist.github.com/mathewbyrne/1280286
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/-{2,}/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text
}

export default {
  name: 'image-drop',
  props: ['container', 'submitUrl', 'submitHook'],
  data() {
    return {
      dragging: 0,
      canDrop: false,
      images: [],
      files: [],
    }
  },
  mounted() {
    console.log('image drop')
    this.listenToDrag()
  },
  watch: {
    files() {
      this.files.forEach(f => this.upload(f))
    }
  },
  methods: {
    /* build object for thumbnail and progress */
    mapToImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          const image = {
            url: reader.result,
            name: slugify(file.name),
            file: file,
            loaded: 0,
            total:
            file.size
          }
          this.images.push(image)
          resolve(image)
        })
        reader.readAsDataURL(file)
      })
    },
    upload(file) {
      this.mapToImage(file).then(image => {
        /* in case there as special needs for submitting file
         * the client component can implement build the data
         * object itself */
        let data
        if (this.submitHook) {
          data = this.submitHook(file, image)
        } else {
          data = new FormData()
          data.set('shop_image[name]', image.name)
          data.set('shop_image[picture]', file)
        }

        /* start upload */
        window.jQuery.ajax({
          method: 'POST',
          url: this.submitUrl,
          data: data,
          cache: false,
          contentType: false,
          processData: false,
          success: () => {
            this.images = this.images.filter(i => i.file.name !== image.file.name)
            this.$emit('imageUploaded', image)
          },
          xhr: () => {
            const xhr = window.jQuery.ajaxSettings.xhr()
            if (xhr.upload) {
              xhr.upload.addEventListener('progress', event => {
                console.log('progress event', event)
                if (event.lengthComputable) {
                  image.loaded = event.loaded
                  image.total = event.total
                }
              }, false)
            }
            return xhr
          },
        })
      })
    },
    listenToDrag() {
      const container = this.container && this.container.$el || this.container || this.$el
      console.log('container', container)
      container.addEventListener('dragenter', (event) => {
        this.dragging += 1
      })
      container.addEventListener('dragleave', (event) => {
        this.dragging -= 1
      })
      this.$refs.dropzone.addEventListener('dragover', (event) => {
        event.preventDefault()
      }, false)
      this.$refs.dropzone.addEventListener('drop', (event) => {
        event.preventDefault()
        this.dragging = false
        this.files = Array.from(event.dataTransfer.files)
          .filter(f => f.type.indexOf('image') > -1)
      }, false)
    },
    progress(image) {
      return Math.round(100 * image.loaded / image.total)
    },
    progressStyle(image) {
      return {width: `${this.progress(image)}%`}
    },
  },
}
</script>
<style>
.image-drop__dropped {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0.5rem;
}

.image-drop__dropped__image,
.image-drop__dropped__image > img {
  width: 100%;
}

.image-drop__dropzone {
  width: 100%;
  height: 20vh;
  border: 3px dashed var(--gray-border-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-drop__dropzone--ready {
  border-color: var(--highlight-border-color);
}
</style>
