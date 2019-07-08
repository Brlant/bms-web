<template>
  <div>
    <upload-list :files=uploadingFiles :list-type="type" @remove="cancelUpload"
                 style="padding-bottom:10px;" v-if="!showFileList"></upload-list>
    <oms-el-upload
      :action="uploadUrl"
      :before-upload="beforeAvatarUpload"
      :data="uploadData"
      :file-list="fileLists"
      :formData="formData"
      :limit="limit"
      :list-type="type"
      :multiple="multiple"
      :on-change="changeFile"
      :on-error="error"
      :on-preview="handlePreview"
      :on-progress="showProgress"
      :on-remove="handleRemove"
      :on-success="success"
      :onExceed="onExceed"
      :show-file-list="showFileList"
      class="upload-demo"
      name="file"
      ref="upload">
      <el-button size="mini" slot="trigger" type="primary">选取文件</el-button>
      <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
    </oms-el-upload>

  </div>
</template>

<script>
  import {OmsAttachment} from '../../../resources';
  import UploadList from './upload.file.list.vue';
  import OmsElUpload from './upload/src/index.vue';

  export default {
    name: 'omsUpload',
    components: {
      OmsElUpload,
      UploadList
    },
    props: {
      fileList: {
        type: Array,
        default: function () {
          return [];
        }
      },
      type: {
        type: String,
        default: 'text'
      },
      showFileList: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: true
      },
      formData: {
        type: Object
      },
      limit: Number
    },

    data() {
      return {
        fileLists: this.fileList,
        dialogImageUrl: '',
        dialogVisible: false,
        uploadData: {},
        uploadUrl: '/omsAttachment',
        uploadingFiles: [],
        currentList: []
      };
    },

    watch: {
      fileList: function (val) {
        val.forEach(file => {
          file.url = file.attachmentStoragePath;
          file.name = file.attachmentFileName;
        });
        this.fileLists = val;
      }
    },

    methods: {
      changeFile: function (file, fileList) {
        if (file.response) {
          file.attachmentId = file.response.attachmentId;
          file.name = file.attachmentFileName = file.response.original;
          file.url = file.attachmentStoragePath = file.response.url;
        }
        this.$emit('change', fileList);
        this.fileLists = fileList;
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        // 将附件从列表中移除
        let index = fileList.indexOf(file);
        fileList.splice(index, 0);
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
        this.$emit('change', fileList);
        this.fileLists = fileList;
      },
      handlePreview(file) {
        this.$store.commit('changeAttachment', {currentId: file.attachmentId, attachmentList: this.fileLists});
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
        // 如果上传的是图片类型文件，则进行过滤
        if (this.type === 'picture') {
          if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {

          } else {
            this.$notify.error({
              duration: 2000,
              message: '请上传文件格式为JPG/JPEG/PNG的图片!'
            });
            return false;
          }
        }
        this.uploadingFiles.push(file);
      },
      success(response, file, fileList) {
        this.uploadingFiles = this.uploadingFiles.filter(item => item.uid !== file.uid);
        if (response) {
          this.$notify.success({
            duration: 2000,
            message: '上传附件成功'
          });
        } else {
          this.$notify.error({
            duration: 2000,
            message: '上传附件失败'
          });
        }
      },
      error(err) {
        this.$notify.error({
          duration: 2000,
          message: '上传附件失败' + err
        });
      },
      showProgress(event, file, fileList) {
        let index = -1;
        for (let i = 0, len = this.uploadingFiles.length; i < len; i++) {
          if (file.uid === this.uploadingFiles[i].uid) {
            index = i;
          }
        }
        if (index !== -1) {
          this.uploadingFiles.splice(index, 1, file);
        }
      },
      cancelUpload: function (file) {
        this.$refs['upload'].abort(file);
        this.uploadingFiles = this.uploadingFiles.filter(item => item.uid !== file.uid);
      },
      onExceed() {
        this.$notify.info({
          duration: 2000,
          message: `只能选择${this.limit}文件`
        });
      }
    }
  };
</script>
