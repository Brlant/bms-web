<style lang="scss" scoped="">
  $activeColor: #00bff3;
  .main-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    background: #454647;
    color: #bcbcbc;

    a {
      color: #bcbcbc;
    }

    padding: 5px;

    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    p {
      padding: 0;
      margin: 0;
    }

    .footer-left {
      display: flex;
      align-items: center;

      img {
        margin-right: 20px
      }
    }

    .footer-right {
      display: flex;
      align-items: center;

      .footer-right-item {
        margin-right: 20px;

        &:last-child {
          margin-right: 0
        }
      }
    }
  }

  .img-police {
    vertical-align: middle;
    margin-left: 10px;
  }
</style>


<template>
  <footer class="main-footer">
    <div class="container">
      <div>国药控股上海生物医药有限公司版权所有</div>
      <div class="col-xs-12 col-md-7 pl-0 pr-0 police-part">
        <span class="mr-10">沪ICP备10213462号-2</span>
        <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011502006135" target="_blank">
          <img src="/static/img/police_logo.png" class="img-police"> 公安部备案号 31011502006135号</a>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {}
  };
</script>
