<template>
  <!--<el-card class="main-card-box">-->
  <!--<el-alert-->
  <!--title="404 走丢了"-->
  <!--type="warning"-->
  <!--description="系统错误"-->
  <!--show-icon>-->
  <!--</el-alert>-->
  <!--</el-card>-->
  <div></div>
</template>
<script>
  import {Auth} from '@/resources';

  export default {
    name: 'error',
    mounted() {
      Auth.checkLogin().then(() => {
        this.$router.replace('/');
      }).catch(() => {
        this.$router.replace('/login');
      });
    }
  };
</script>
