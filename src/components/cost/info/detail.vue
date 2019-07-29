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
      <oms-row label="模型类型" :span="5">{{formItem.billingModelTemplate === '0' ? '普通计费模型' : '计费模板'}}</oms-row>
      <oms-row label="状态" :span="5">
        {{formItem.billingModelState === '0' ? '停用': '启用'}}
      </oms-row>
      <oms-row label="计费项" :span="5" v-show="formItem.billingModelTemplate === '1'">
        <ul class="show-list">
          <li class="show-item" v-for="item in billingItemList">{{item.billingItemName}}</li>
        </ul>
      </oms-row>
    </div>
  </div>
</template>
<script>
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
        billingItemList: []
      };
    },
    methods: {
      queryItems() {
        if (this.formItem.billingModelTemplate === '0') return;
        this.$http.get(`/bms-billing-item/query-item/${this.formItem.billingModelId}`).then(res => {
          if (res.data.code === 200) {
            this.billingItemList = res.data.data;
          }
        });
      }
    }
  };
</script>
