<script>
import Simple from '@/editors/Simple'

export default {
  name: 'logo-editor',
  extends: Simple,

  editorTitle: 'Logo',
  editorDescription: 'Inserts the shop logo. Has link and defaults to text.',
  editorTemplate: '[logo/]',
  editorContext: ['root', 'container'],
}
</script>
