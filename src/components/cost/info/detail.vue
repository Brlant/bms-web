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
      <oms-row label="模型名称" :span="5">{{ formItem.billingModelName }}</oms-row>
      <oms-row label="状态" :span="5">
        {{formItem.billingModelState === '0' ? '停用': '启用'}}
      </oms-row>
      <h2>计费项</h2>
      <cost-table-util :data="data.billingItems"/>
    </div>
  </div>
</template>
<script>
  import costTableUtil from './costTableUtil';
  import {costModel} from '@/resources';

  export default {
    props: {
      formItem: {
        type: Object,
        required: true
      },
      index: Number
    },
    components: {costTableUtil},
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
