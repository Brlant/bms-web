<template>
  <div>
    <oms-el-upload
      :action="uploadUrl"
      :before-upload="beforeAvatarUpload"
      :data="uploadData"
      :formData="formData"
      :on-change="changePhoto"
      :on-error="error"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
      :show-file-list="false"
      class="avatar-user-uploader"
      name="file"
    >
      <img :src="imageUrl" class="avatar-user" slot="trigger" v-if="imageUrl">
      <img class="avatar-user" slot="trigger" src="/static/img/userpic.png" v-else>
    </oms-el-upload>
  </div>
</template>

<style lang="scss" scoped>
  .avatar-user-uploader .el-upload {
    border: 0;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-user-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-user {
    margin-right: 10px;
    border-radius: 50%;
    height: 30px;
    width: 30px;
    border: 1px solid #eee
  }
</style>

<script>
  import {http, OmsAttachment} from '../../../resources';
  import OmsElUpload from './upload/src/index.vue';

  export default {
    props: ['photoUrl', 'formData'],
    components: {
      OmsElUpload
    },
    name: 'omsPhotoUpload',
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
    computed: {
      user: function () {
        return Object.assign({}, {userName: '', userAccount: '', userLastLoginTime: 0}, this.$store.state.user);
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
        this.changPhoto(file);
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
          message: '更换头像失败' + err
        });
      },
      changPhoto: function (photo) {
        let user = this.user;
        let obj = {
          id: user.userId,
          photoId: photo.attachmentId
        };
        if (user.userId) {
          http.put('/oms/user/' + user.userId + '/icon', obj).then(() => {
            this.user.userIcon = photo.url;
            this.$store.commit('initUser', this.user);
            this.$notify.success({
              title: '成功',
              message: '更换头像成功'
            });
          }).catch(() => {
            this.user.userIcon = '';
            this.$notify.error({
              title: '失败',
              message: '更换头像失败'
            });
          });
        }
      }
    }
  };
</script>

