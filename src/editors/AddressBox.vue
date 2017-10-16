<script>
import Simple from '@/editors/Simple'

export default {
  name: 'address-box-editor',
  extends: Simple,

  editorTitle: 'Address Box',
  editorDescription: 'Inserts contact information.',
  editorTag: 'address-box',
  editorContext: ['root', 'container'],
}
</script>
