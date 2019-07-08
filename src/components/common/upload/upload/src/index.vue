<template>
  <div>
    <upload-list :disabled="disabled"
                 :files="uploadFiles"
                 :handlePreview="onPreview"
                 :listType="listType"
                 @remove="handleRemove" v-if="showFileList&&listType == 'picture-card'"></upload-list>

    <upload :accept="accept" :action="action"
            :autoUpload="autoUpload"
            :before-upload="beforeUpload"
            :data="data"
            :disabled="disabled"
            :drag="drag"
            :fileList="uploadFiles"
            :formData="formData"
            :headers="headers"
            :http-request="httpRequest"
            :limit="limit"
            :listType="listType"
            :multiple="multiple"
            :name="name"
            :on-error="handleError"
            :on-exceed="onExceed"
            :on-preview="onPreview"
            :on-progress="handleProgress"
            :on-remove="handleRemove"
            :on-start="handleStart"
            :on-success="handleSuccess"
            :type="type"
            :with-credentials="withCredentials"
            ref="upload-inner">
      <slot name="trigger"></slot>
    </upload>
    <slot name="tip"></slot>
    <upload-list :disabled="disabled"
                 :files="uploadFiles"
                 :handlePreview="onPreview"
                 :listType="listType"
                 @remove="handleRemove" v-if="showFileList&&listType != 'picture-card'"></upload-list>
  </div>
</template>

<script>
  import UploadList from './upload-list';
  import Upload from './upload';
  import ElProgress from 'element-ui/lib/progress';
  import Migrating from 'element-ui/lib/mixins/migrating';

  function noop() {
  }

  export default {
    name: 'ElUpload',

    mixins: [Migrating],

    components: {
      ElProgress,
      UploadList,
      Upload
    },

    provide: {
      uploader: this
    },

    props: {
      action: {
        type: String,
        required: true
      },
      headers: {
        type: Object,
        default() {
          return {};
        }
      },
      data: Object,
      multiple: Boolean,
      name: {
        type: String,
        default: 'file'
      },
      drag: Boolean,
      dragger: Boolean,
      withCredentials: Boolean,
      showFileList: {
        type: Boolean,
        default: true
      },
      accept: String,
      type: {
        type: String,
        default: 'select'
      },
      beforeUpload: Function,
      onRemove: {
        type: Function,
        default: noop
      },
      onChange: {
        type: Function,
        default: noop
      },
      onPreview: {
        type: Function
      },
      onSuccess: {
        type: Function,
        default: noop
      },
      onProgress: {
        type: Function,
        default: noop
      },
      onError: {
        type: Function,
        default: noop
      },
      fileList: {
        type: Array,
        default() {
          return [];
        }
      },
      autoUpload: {
        type: Boolean,
        default: true
      },
      listType: {
        type: String,
        default: 'text' // text,picture,picture-card
      },
      httpRequest: Function,
      disabled: Boolean,
      formData: {},
      limit: Number,
      onExceed: {
        type: Function,
        default: noop
      }
    },

    data() {
      return {
        uploadFiles: [],
        dragOver: false,
        draging: false,
        tempIndex: 1
      };
    },

    watch: {
      fileList: {
        immediate: true,
        handler(fileList) {
          this.uploadFiles = fileList.map(item => {
            item.uid = item.uid || (Date.now() + this.tempIndex++);
            item.status = 'success';
            return item;
          });
        }
      }
    },

    methods: {
      handleStart(rawFile) {
        rawFile.uid = Date.now() + this.tempIndex++;
        let file = {
          status: 'ready',
          name: rawFile.name,
          size: rawFile.size,
          percentage: 0,
          uid: rawFile.uid,
          raw: rawFile
        };

        try {
          file.url = URL.createObjectURL(rawFile);
        } catch (err) {
          console.error(err);
          return;
        }

        this.uploadFiles.push(file);
        this.onChange(file, this.uploadFiles);
      },
      handleProgress(ev, rawFile) {
        const file = this.getFile(rawFile);
        this.onProgress(ev, file, this.uploadFiles);
        file.status = 'uploading';
        file.percentage = ev.percent || 0;
      },
      handleSuccess(res, rawFile) {
        const file = this.getFile(rawFile);

        if (file) {
          file.status = 'success';
          file.response = res;

          this.onSuccess(res, file, this.uploadFiles);
          this.onChange(file, this.uploadFiles);
        }
      },
      handleError(err, rawFile) {
        const file = this.getFile(rawFile);
        const fileList = this.uploadFiles;

        file.status = 'fail';

        fileList.splice(fileList.indexOf(file), 1);

        this.onError(err, file, this.uploadFiles);
        this.onChange(file, this.uploadFiles);
      },
      handleRemove(file, raw) {
        if (raw) {
          file = this.getFile(raw);
        }
        this.abort(file);
        let fileList = this.uploadFiles;
        fileList.splice(fileList.indexOf(file), 1);
        this.onRemove(file, fileList);
      },
      getFile(rawFile) {
        let fileList = this.uploadFiles;
        let target;
        fileList.every(item => {
          target = rawFile.uid === item.uid ? item : null;
          return !target;
        });
        return target;
      },
      abort(file) {
        this.$refs['upload-inner'].abort(file);
      },
      clearFiles() {
        this.uploadFiles = [];
      },
      submit() {
        this.uploadFiles
          .filter(file => file.status === 'ready')
          .forEach(file => {
            this.$refs['upload-inner'].upload(file.raw);
          });
      },
      getMigratingConfig() {
        return {
          props: {
            'default-file-list': 'default-file-list is renamed to file-list.',
            'show-upload-list': 'show-upload-list is renamed to show-file-list.',
            'thumbnail-mode': 'thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan'
          }
        };
      }
    }
  };
</script>
