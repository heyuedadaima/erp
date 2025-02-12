<template>
  <div class="product">
    <div class="head">
      <el-button type="primary" @click="handleDelete">删除</el-button>
      <el-button type="primary" @click="addDialog">添加</el-button>
    </div>
    <div class="wrapper">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="名字"
        ></el-table-column>
        <el-table-column
          prop="address"
          label="位置"
        ></el-table-column>
      </el-table>
    </div>
    <ProductDialog ref="dialog" @refreshProducts="getProduct"/>
  </div>
</template>

<script>
import axios from 'axios';
import ProductDialog from './ProductDialog.vue'
export default {
  components:{
    ProductDialog,
  },
  mounted() {
    // 在组件挂载时自动调用获取数据的方法
    this.getProduct();
  },
  data() {
    return {
      keyword: '',
      tableData: [],
      selectedRows: [] // 存储选中的行
    };
  },

  methods: {
    async getProduct() {
      try {
        // 发起 GET 请求
        const response = await axios.get('http://47.109.188.197:5000/products');
        // 将获取到的数据赋值给组件中的变量
        this.tableData = response.data;
      } catch (error) {
        console.error('获取产品数据时出错:', error);
      }
    },

    handleSelectionChange(val) {
      // 更新选中的行
      this.selectedRows = val;
    },

    async handleDelete() {
    if (this.selectedRows.length === 0) {
      this.$message.warning('请先选择要删除的行');
      return;
    }

    // 获取选中的产品的 name 和 address
    const productsToDelete = this.selectedRows.map(row => ({
      name: row.name,
      address: row.address
    }));

    try {
      // 发送 DELETE 请求到后端，传递要删除的产品信息
      const response = await axios.delete('http://47.109.188.197:5000/products', {
        headers: { 'Content-Type': 'application/json' }, // 确保发送的是 JSON 格式
        data: { products: productsToDelete }
      });

      // 删除成功后更新表格数据
      this.tableData = this.tableData.filter(
        row => !productsToDelete.some(product => product.name === row.name && product.address === row.address)
      );

      this.$message.success('删除成功');
    } catch (error) {
      console.error('删除产品时出错:', error);
      this.$message.error('删除失败');
    }
  },
  //添加产品
  addDialog(){
    
    this.$refs.dialog.dialogFormVisible=true;
    
  },
  },
  
 
};
</script>

<style lang='less' scoped>
.product {
  padding: 20px;
  .head {
    display: flex;
    justify-content: flex-end; /* 使按钮靠右对齐 */
    button {
      margin-left: 20px;
    }
  }
  .wrapper {
    padding: 20px 0px;
  }
}
</style>
