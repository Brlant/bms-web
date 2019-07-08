<template>
  <div>
    <oms-el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :show-file-list="false"
      name="file"
      :on-success="handleAvatarSuccess"
      :on-error="error"
      :on-remove="handleRemove"
      :before-upload="beforeAvatarUpload"
      :on-change="changePhoto"
      :data="uploadData"
      :formData="formData"
    >
      <img v-if="imageUrl" :src="imageUrl" slot="trigger" class="avatar">
      <i v-else="" class="el-icon-plus avatar-uploader-icon" slot="trigger"></i>
    </oms-el-upload>
  </div>
</template>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<script>
  import {OmsAttachment} from '@/resources';
  import OmsElUpload from './upload/src/index.vue';

  export default {
    props: ['photoUrl', 'formData'],
    name: 'omsPhotoUpload',
    components: {
      OmsElUpload
    },
    data() {
      return {
        imageUrl: this.photoUrl,
        uploadData: {},
        uploadUrl: '/omsAttachment'
      };
    },
    watch: {
      photoUrl: function (val) {
        if (!val) {
          this.imageUrl = '';
        } else {
          this.imageUrl = val;
        }
      }
    },
    methods: {
      handleRemove(file) {
        OmsAttachment.delete(file.attachmentId).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功删除附件' + file.attachmentFileName + '"'
          });
        }).catch(() => {
          this.$notify.error({
            duration: 2000,
            message: '删除失败'
          });
        });
      },
      changePhoto: function (photo) {
        this.$emit('change', photo.response);
      },
      handleAvatarSuccess(file) {
        this.imageUrl = file.url;
        this.$notify.success({
          duration: 2000,
          message: '上传图片成功'
        });
      },
      beforeAvatarUpload(file) {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          this.$notify.error({
            duration: 2000,
            message: '上传附件大小不能超过 10MB!'
          });
          return false;
        }
      },
      error(err) {
        this.$notify.error({
          duration: 2000,
          message: '上传附件失败' + err
        });
      }
    }
  };
</script>
