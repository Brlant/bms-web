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
  </div>
</template>

<script>
  import AppHeader from './app.header.vue';
  import AppFooter from './app.footer.vue';
  import attachmentDialog from '../common/attachment/attachment.dialog.vue';
  import printDialog from '../common/print.loading.vue';

  export default {
    components: {
      AppHeader,
      AppFooter,
      attachmentDialog,
      printDialog
    },
    beforeRouteUpdate(to, from, next) {
      next();
    },
    methods: {
      setBodyHeight: function () {
        this.$store.commit('setBodyHeight', window.innerHeight - 200 + 'px');
      }
    },
    computed: {
      bodyLeft: function () {
        return this.$store.state.bodySize['left'];
      }
    },
    mounted: function () {
      window.addEventListener('resize', (e) => {
        this.setBodyHeight();
      });
      this.setBodyHeight();
    }
  };
</script>
