<template>
  <transition-group
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    name="el-list"
    tag="ul"
  >
    <li
      :class="['el-upload-list__item', 'is-' + file.status]"
      :key="file.uid"
      v-for="(file, index) in files"
    >
      <img
        :src="file.url"
        alt=""
        class="el-upload-list__item-thumbnail"
        v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
      >
      <a @click="handleClick(file)" class="el-upload-list__item-name">
        <i class="el-icon-document"></i>{{file.name}}
      </a>
      <label class="el-upload-list__item-status-label">
        <i :class="{
          'el-icon-upload-success': true,
          'el-icon-circle-check': listType === 'text',
          'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
        }"></i>
      </label>
      <i @click="$emit('remove', file)" class="el-icon-close" v-if="!disabled"></i>
      <el-progress
        :percentage="parsePercentage(file.percentage)"
        :stroke-width="listType === 'picture-card' ? 6 : 2"
        :type="listType === 'picture-card' ? 'circle' : 'line'"
        v-if="file.status === 'uploading'">
      </el-progress>
      <span class="el-upload-list__item-actions" v-if="listType === 'picture-card'">
        <span
          @click="handlePreview(file)"
          class="el-upload-list__item-preview"
          v-if="handlePreview && listType === 'picture-card'"
        >
          <i class="el-icon-view"></i>
        </span>
        <span
          @click="$emit('remove', file)"
          class="el-upload-list__item-delete"
          v-if="!disabled"
        >
          <i class="el-icon-delete2"></i>
        </span>
      </span>
    </li>
  </transition-group>
</template>
<script>
  import Locale from 'element-ui/lib/mixins/locale';
  import ElProgress from 'element-ui/lib/progress';

  export default {
    mixins: [Locale],

    components: {ElProgress},

    props: {
      files: {
        type: Array,
        default() {
          return [];
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      handlePreview: Function,
      listType: String
    },
    methods: {
      parsePercentage(val) {
        return parseInt(val, 10);
      },
      handleClick(file) {
        this.handlePreview && this.handlePreview(file);
      }
    }
  };
</script>
