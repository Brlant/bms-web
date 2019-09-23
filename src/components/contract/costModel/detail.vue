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
      <oms-row label="计费模型名称" :span="5">{{ formItem.billingModelName }}</oms-row>
      <oms-row label="合同" :span="5">{{formItem.contractName}}</oms-row>
      <oms-row label="是否绑定货品计费" :span="5">{{formItem.bindingGoodStatus === '1' ? '是' : '否'}}</oms-row>
      <h2>计费项</h2>
      <cost-table-util :data="data.billingItems" :showBtn="false"/>
    </div>
  </div>
</template>
<script>
  import costTableUtil from '../../cost/info/costTableUtil';
  import {contractCostModel} from '@/resources';

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
        data: {}
      };
    },
    methods: {
      queryItems() {
        contractCostModel.queryDetail(this.formItem).then(res => {
          this.data = res.data.data;
        });
      }
    }
  };
</script>
