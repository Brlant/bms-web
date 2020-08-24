<style lang="scss">

/*.d-table {*/
/*min-height: 500px;*/
/*}*/

.btn-left-list-more {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;

  .el-button {
    border: none;
    color: #666;
    background: 0 0;
    padding-left: 0;
    padding-right: 0;

    &:hover {
      color: #333
    }
  }
}

.min-div {
  height: 0;
  width: 0;
  display: inline;
  overflow: hidden;
  line-height: 0;
}

.app-body-org {
  padding-top: 0;

  .layer-loading {
    top: 0
  }
}

.main-body__el-scrollbar {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .app-content-view {
    padding: 0 10px;
  }
}

</style>
<template>
  <div class="app-body full-width" :style="'padding-left:'+bodyLeft">
    <app-header/>
    <div class="main-body">
      <el-scrollbar :style="{height: '100%'}" class="main-body__el-scrollbar">
        <transition name="scale" mode="out-in" appear>
          <router-view class="app-content-view"></router-view>
        </transition>
      </el-scrollbar>
    </div>
    <attachmentDialog/>
    <print-dialog/>
    <q-code-dialog ref="qrCode" @closeQcode="closeQcode"/>
  </div>
</template>

<script>
import AppHeader from './app.header.vue';
import AppFooter from './app.footer.vue';
import attachmentDialog from '../common/attachment/attachment.dialog.vue';
import printDialog from '../common/print.loading.vue';
import QCodeDialog from './../q-code/q-code-dialog';

export default {
  components: {
    AppHeader,
    AppFooter,
    attachmentDialog,
    printDialog,
    QCodeDialog
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  data: function () {
    return {loopQuery: false};
  },
  methods: {
    setBodyHeight: function () {
      this.$store.commit('setBodyHeight', window.innerHeight - 200 + 'px');
    },
    closeQcode: function () {
      this.loopQuery = false;
    },
    queryUserwehcatInfo: function () {
      // 查询用户绑定微信信息，未绑定微信时弹出二维码进行关注绑定
      this.$http.get('/wechat/user-info/current-user', {}).then(res => {
        let data = res.data;
        if (data.code && 404 === data.code) {
          this.getQCode();
        }
      }).catch(() => {
      });
    },
    getQCode() {
      let item = {
        ticket: '',
        loading: false,
        openId: ''
      };
      let params = {
        userId: this.$store.state.user.userId
      };
      // 获取二维码
      this.$http.get('/wechat/user-info/queryWechatQrCode', {params}).then(res => {
        item.ticket = res.data.ticket;
        if (!res.data.path) {
          this.$refs.qrCode.show();
        } else {
          this.$refs.qrCode.open(res.data.path, item);
        }
      });
      // 已经在轮询中, 返回
      if (item.loading) return;
      this.loopQuery = true;
      // 轮询查询关注信息
      setTimeout(() => {
        item.loading = true;
        this.loopQueryInfo(item);
      }, 3000);
    },
    loopQueryInfo(item) {
      if (item.openId || !this.loopQuery) return;
      let code = this.$refs.qrCode;
      this.$http.get(`/wechat/user-info/queryWeChatTicketInfo/${code.ticket}`).then(res => {
        item.loading = false;
        if (res.data.openId === '400') {
          this.$notify.info({
            duration: 2000,
            message: '该微信账号已绑定用户，请取消关注后再操作'
          });
          this.$emit('closeDialog');
        } else {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '关注成功'
          });
          item.openId = res.data.openId;
          this.$refs.qrCode.close();
        }
      }).catch(() => {
        setTimeout(() => {
          this.loopQueryInfo(item, code.ticket);
        }, 3000);
      });
    }
  },
  computed: {
    bodyLeft: function () {
      return this.$store.state.bodySize['left'];
    }
  }
  ,
  mounted: function () {
    window.addEventListener('resize', (e) => {
      this.setBodyHeight();
    });
    this.setBodyHeight();
    let list = [];
    this.$store.state.costTypes.forEach(i => {
      list.push(...i.items);
    });
    this.$store.commit('initBillItemList', list);
    // 查询登录用户微信绑定信息
    this.queryUserwehcatInfo();
  }
}
;
</script>
