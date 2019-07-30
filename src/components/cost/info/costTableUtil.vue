<template>
  <el-table :data="data" border class="clearfix" ref="orderDetail">
    <el-table-column prop="operationTime" label="计费类型" width="200">
      <template slot-scope="scope">{{scope.row.name}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="业务类型">
      <template slot-scope="scope">{{scope.row.name}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="计费项">
      <template slot-scope="scope">{{scope.row.name}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="是否阶梯">
      <template slot-scope="scope">{{scope.row.name}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="单价">
      <template slot-scope="scope">{{scope.row.name}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="上限">
      <template slot-scope="scope">{{scope.row.name}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="下限">
      <template slot-scope="scope">{{scope.row.name}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="计费规则">
      <template slot-scope="scope">{{scope.row.name}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="单位">
      <template slot-scope="scope">{{scope.row.name}}</template>
    </el-table-column>
    <el-table-column prop="actionType" label="操作">
      <des-btn icon="edit">编辑</des-btn>
      <des-btn icon="delete">编辑</des-btn>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    props: ['data']
  }
</script>
