<script>
import SimpleContainer from '@/editors/SimpleContainer'

export default {
  name: 'column-editor',
  extends: SimpleContainer,

  editorTitle: 'Column',
  editorDescription: 'This component can order content in a column. Use boostrap classes to define size.',
  editorTag: 'column',
  editorIsContainer: true,
  editorContext: ['row'],
}
</script>
