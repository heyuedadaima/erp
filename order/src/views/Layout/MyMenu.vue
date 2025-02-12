<template>
  <div>
    <el-row class="tac">
  <el-col :span="12">
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      background-color="#3498db"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      >
      <el-menu-item >
        <span slot="title" class="a">锦运订单管理系统</span>
      </el-menu-item>
      <el-menu-item index="/product">
        <i class="el-icon-s-shop"></i>
        <span slot="title">产品管理</span>
      </el-menu-item>
      <el-menu-item index="/order">
        <i class="el-icon-s-order"></i>
        <span slot="title">订单管理</span>
      </el-menu-item>
      <el-menu-item index="/user">
        <i class="el-icon-user"></i>
        <span slot="title">打印管理</span>
      </el-menu-item>

    </el-menu>
  </el-col>
</el-row>
  </div>
</template>

<script>
export default {
};
</script>

<style lang='less' scoped>
  .a{
      font-size: 20px;
  }

  .el-menu{
    border-right: 0;
    width: 200px;
    .el-menu-item.is-active{
      background-color: #054476 !important;
    }
  }

</style>