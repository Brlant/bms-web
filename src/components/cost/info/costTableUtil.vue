<template>
  <el-table :data="data" border class="clearfix" ref="orderDetail">
    <el-table-column prop="operationTime" label="计费类型" width="100">
      <template slot-scope="scope">{{formatBillingType(scope.row)}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="业务类型">
      <template slot-scope="scope">{{formatBusinessType(scope.row)}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="计费项" width="140">
      <template slot-scope="scope">{{formatBillingItemName(scope.row)}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="是否阶梯">
      <template slot-scope="scope">{{scope.row.ladderState === '1' ? '是' : '否'}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="单价">
      <template slot-scope="scope">{{scope.row.unitPrice | formatMoney}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="下限">
      <template slot-scope="scope">{{scope.row.lowerLimit}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="上限">
      <template slot-scope="scope">{{scope.row.upperLimit}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="计费规则" width="150px">
      <template slot-scope="scope">{{scope.row.billingRules}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="单位">
      <template slot-scope="scope">{{scope.row.billingUnit}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="操作" :width="isShowEdit ? '150px' : '100px'" fixed="right" v-if="showBtn">
      <template slot-scope="scope">
        <des-btn icon="edit" v-if="isShowEdit" @click="$emit('edit', scope.row)">编辑</des-btn>
        <des-btn icon="delete" @click="$emit('remove', scope.row)">删除</des-btn>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    props: {
      data: Array,
      showBtn: {
        type: Boolean,
        default: true
      },
      isShowEdit: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      formatBillingType(item) {
        let bill = this.$store.state.costTypes.find(f => f.id === item.billingType) || {};
        return bill.name;
      },
      formatBusinessType(item) {
        let bill = this.$store.state.costTypes.find(f => f.id === item.billingType);
        let biz = bill.bizTypes.find(f => f.id === item.businessType) || {};
        return biz.name;
      },
      formatBillingItemName(item) {
        let bill = this.$store.state.costTypes.find(f => f.id === item.billingType);
        let billIem = bill.items.find(f => f.id === item.billingItemNo) || {};
        return billIem.name;
      }
    }
  };
</script>
