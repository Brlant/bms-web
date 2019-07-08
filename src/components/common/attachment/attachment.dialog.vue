<style lang="scss">
  .attachment-dialog {
    .el-dialog {
      width: 100%;
      transform: none;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.5);
      box-shadow: none;
      margin-bottom: 0;
    }

    .el-dialog__header {
      padding: 10px 20px;
      position: relative;
      z-index: 200;
      background: #fff;

      .el-dialog__headerbtn {
        display: block;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);

      }
    }

    .el-dialog__body {
      position: absolute;
      top: 37px;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0;

      .dialog-image-rap {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);

        img {
          max-width: 95vh;
          max-height: 95vh;
        }
      }

      .img-tools {
        position: absolute;
        bottom: 35px;
        right: 35px;
      }

      .attachment-doc-body {
        height: 100%;
      }
    }

    .attachment-dialog-head {
      display: flex;
      justify-content: space-between;
      margin-right: 25px;

      a {
        font-size: 16px;
        display: inline-block;
        margin-left: 8px;
        cursor: pointer;
        color: #999;

        &:hover {
          color: #333
        }

        user-select: none;
      }
    }
  }

</style>
<template>
  <el-dialog v-model="dialogVisible" :before-close="close"
             class="attachment-dialog"
             :class="{'docview':type=='doc','img-view':type=='image'}" top="0">
    <div slot="title" class="attachment-dialog-head">
      <div>{{Attachment.attachmentFileName}}</div>
      <div v-if="groupLen>1">
        {{currentIndex + 1}}/{{groupLen}}
        <el-tooltip content="前一个资源">
          <a @click.prevent.stop="goPrev()">
            <f-a name="prev"></f-a>
          </a>
        </el-tooltip>
        <el-tooltip content="后一个资源">
          <a @click.prevent.stop="goPrev()">
            <f-a name="next"></f-a>
          </a>
        </el-tooltip>

      </div>
    </div>
    <transition name="el-fade-in">
      <div @click.stop="closeDialog" style="height:100%;width:100%;">
        <div v-if="type=='image'" class="dialog-image-rap">
          <img :src="fileUrl" alt=''
               :style="'transform: rotate('+currentZ+'deg)'" @click.stop="stop">
        </div>
        <div class="img-tools" v-if="type=='image'" @click.stop="stop">

          <el-button type="default" @click.stop="changeZ(1)"><i class="el-icon-t-rotate"></i>
          </el-button>

        </div>
        <div v-if="type=='doc'" class="attachment-doc-body" @click.stop="stop">
          <iframe :src="docViewUrl" width="100%" height="100%" frameborder="0"></iframe>
        </div>
      </div>
    </transition>
  </el-dialog>
</template>
<script>
  import {http} from '../../../resources';
  import utils from '@/tools/utils';

  export default {
    data() {
      return {
        dialogVisible: false,
        Attachment: {},
        type: '',
        currentZ: 0,
        attachmentId: '',
        currentIndex: 1
      };
    },
    computed: {
      currentId: function () {
        return this.$store.state.attachmentDialog.attachmentId;
      },
      attachmentList: function () {
        return this.$store.state.attachmentDialog.attachmentList;
      },
      groupLen: function () {
        return this.$store.state.attachmentDialog.attachmentList.length;
      },
      fileUrl: function () {
        return this.Attachment.attachmentStoragePath;
      },
      docViewUrl: function () {
        return 'https://doc-view.sinopharm-bio.com/view/url?url=' + encodeURIComponent(this.Attachment.attachmentStoragePath);
      },
      stateDialogVisible: function () {
        return this.$store.state.attachmentDialog.open;
      }
    },
    watch: {
      stateDialogVisible: function (val) {
        if (val === true) {
          this.showAttachment();
        }
      },
      currentId: function (val) {
        this.attachmentId = val;
        this.getAttachment();
      }
    },

    methods: {
      getAttachment: function () {
        this.currentZ = 0;
        let getServer = true;
        if (this.attachmentId) {
          if (this.attachmentList.length > 0) {
            this.attachmentList.forEach(item => {
              if (item.attachmentId === this.attachmentId) {
                getServer = false;
                this.Attachment = item;
                this.$nextTick(function () {
                  this.showAttachment();
                });
              }
            });
            this.getCurrentIndex();
          } else {
            this.currentIndex = 1;
          }
          if (getServer) {
            http.get('/omsAttachment/' + this.attachmentId).then(res => {
              this.Attachment = res.data;
              this.$nextTick(function () {
                this.showAttachment();
              });
            });
          }
        }
      },
      showAttachment: function () {
        if (!this.Attachment.attachmentStoragePath) {
          return false;
        }
        this.type = this.getType();
        if (this.type === 'image' || this.type === 'doc') {
          this.dialogVisible = true;
        } else {
          utils.download(this.Attachment.attachmentStoragePath, this.Attachment.attachmentFileName);
          this.$store.commit('closeAttachmentDialog');
        }
      },
      getType: function () {
        let type = '';
        let url = this.Attachment.attachmentStoragePath;
        let images = ['jpg', 'png', 'gif', 'jpeg'];
        let docs = ['txt', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'];
        if (url) {
          // 去除签名
          url = url.split('?')[0];
          type = url.substring(url.lastIndexOf('.'));
        }
        if (type) {
          type = type.substring(1).toLowerCase();
        }
        if (docs.indexOf(type) !== -1) {
          type = 'doc';
        } else if (images.indexOf(type) !== -1) {
          type = 'image';
        }
        return type;
      },
      close: function () {
        this.$store.commit('closeAttachmentDialog');
        this.dialogVisible = false;
      },
      changeZ: function (type) {
        this.currentZ = (this.currentZ + type * 90) % 360;
      },
      stop: function () {
      },
      closeDialog: function () {
        this.$store.commit('closeAttachmentDialog');
        this.dialogVisible = false;
      },
      getCurrentIndex: function (type) {
        let currentIndex = 0;
        let len = this.attachmentList.length;
        this.attachmentList.forEach((item, index) => {
          if (item.attachmentId === this.attachmentId) {
            currentIndex = index;
          }
        });
        if (type === 'next') {
          currentIndex++;
        } else if (type === 'prev') {
          currentIndex--;
        } else if (type) {
          currentIndex = type;
        }
        if (len <= currentIndex) {
          currentIndex = 0;
        }
        if (currentIndex < 0) {
          currentIndex = len - 1;
        }
        this.currentIndex = currentIndex;
        return currentIndex;
      },
      goNext: function () {
        let targetIndex = this.getCurrentIndex('next');
        this.attachmentId = this.attachmentList[targetIndex].attachmentId;
        this.getAttachment();
      },
      goPrev: function () {
        let targetIndex = this.getCurrentIndex('prev');
        this.attachmentId = this.attachmentList[targetIndex].attachmentId;
        this.getAttachment();
      }
    }
  };
</script>
