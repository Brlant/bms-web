<template>
  <!-- <el-dialog :close-on-click-modal="false" :title="dialogTitle"
              :show-close="false" :close-on-press-escape="false"
              :visible.sync="dialogVisible" center width="350px">-->
  <el-dialog :close-on-click-modal="false" :title="dialogTitle"
             :visible.sync="dialogVisible" center width="500px">
    <div class="text-center" v-loading="!imgUrl">
      <img :src="imgUrl" class="code-img"/>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        imgUrl: '',
        dialogVisible: false,
        dialogTitle: '',
        ticket: ''
      };
    },
    watch: {
      dialogVisible(val) {
        if (!val) {
          this.imgUrl = '';
          this.dialogTitle = '';
          this.$emit('closeQcode');
        }
      }
    },
    methods: {
      open(imgUrl, item) {
        this.imgUrl = imgUrl ? imgUrl : '/static/img/userpic.png';
        this.dialogTitle = '请用微信扫描二维码';
        this.ticket = item.ticket;
        this.show();
      },
      show() {
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
        this.$emit('closeQcode');
      }
    }
  };
</script>
