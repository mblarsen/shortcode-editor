<script>
import SimpleContainer from '@/editors/SimpleContainer'

export default {
  name: 'section-editor',
  extends: SimpleContainer,

  editorTitle: 'Section',
  editorDescription: 'Use to partion content into sections of a page.',
  editorTag: 'section',
  editorContext: ['root', 'container'],

}
</script>
