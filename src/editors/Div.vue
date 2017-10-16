<script>
import SimpleContainer from '@/editors/SimpleContainer'

export default {
  name: 'div-editor',
  extends: SimpleContainer,

  editorTitle: 'Div',
  editorDescription: 'A simple div. Also see section, container, row, column.',
  editorTag: 'div',
  editorContext: ['root', 'container'],
}
</script>
