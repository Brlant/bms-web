<style lang="scss" scoped="">
  @import "../../.././assets/scss/mixins";

  $leftWidth: 0;
  .content-part {
    .content-left {
      width: $leftWidth;
    }

    .content-right {
      > h3 {
        left: $leftWidth;
      }
      padding-left: 10px;
      padding-right: 10px;
      left: $leftWidth;
    }
  }

  .oms-row {
    margin-bottom: 10px;
  }

</style>
<template>
  <div class="content-part">
    <div class="content-right min-gutter">
      <h3 class="clearfix">详情</h3>
    </div>
  </div>
</template>
<script>
  import {costModel} from '@/resources';

  export default {
    props: {
      formItem: {
        type: Object,
        required: true
      },
      index: Number
    },
    watch: {
      index(val) {
        if (val !== 1) return;
        this.queryItems();
      }
    },
    data() {
      return {
        data: {
          billingItems: []
        }
      };
    },
    methods: {
      queryItems() {
        costModel.queryDetail(this.formItem).then(res => {
          if (res.data.code === 200) {
            this.data = res.data.data;
          } else {
            this.data = {
              billingItems: []
            };
          }
        });
      }
    }
  };
</script>
