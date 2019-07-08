<template>
  <div
    :class="{
      'is-dragover': dragover
    }"
    @dragleave.prevent="dragover = false"
    @dragover.prevent="onDragover"
    @drop.prevent="onDrop"
    class="el-upload-dragger"
  >
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'ElUploadDrag',
    props: {
      disabled: Boolean
    },
    data() {
      return {
        dragover: false
      };
    },
    methods: {
      onDragover() {
        if (!this.disabled) {
          this.dragover = true;
        }
      },
      onDrop(e) {
        if (!this.disabled) {
          this.dragover = false;
          this.$emit('file', e.dataTransfer.files);
        }
      }
    }
  };
</script>

