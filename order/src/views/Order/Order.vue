<template>
  <div class="order">
    <div class="head">
      <el-date-picker
        v-model="selectedDate"
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
        @change="handleDateFilterChange"
      />
      <el-button type="primary" @click="addDialog">手动添加</el-button>
      <el-button type="primary" @click="addDialog2">导入pdf或excel</el-button>
      <el-button type="primary" @click="handleDelete">删除</el-button>

      <!-- 单日筛选 -->
    </div>
    <div class="wrapper">
      <el-table :data="tableData" border style="width: 100%" ref="multipleTable"  @selection-change="handleSelectionChange" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="模号" label="模号"></el-table-column>
        <el-table-column prop="件号" label="件号"></el-table-column>
        <el-table-column prop="品名" label="品名"></el-table-column>
        <el-table-column prop="规格" label="规格"></el-table-column>
        <el-table-column prop="数量" label="数量"></el-table-column>
        <el-table-column prop="客户" label="客户"></el-table-column>
        <el-table-column prop="制单日期" label="制单日期"></el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>
    <OrderDialog ref="dialog" @refreshOrders="getOrders" />
    <OrderDialog2 ref="dialog2" @refreshOrders="getOrders" />
  </div>
</template>

<script>
import axios from 'axios';
import OrderDialog from './OrderDialog.vue';
import OrderDialog2 from './OrderDialog2.vue';

export default {
  components:{
    OrderDialog,
    OrderDialog2,
  },
  data() {
    return {
      tableData: [],
      totalCount: 0,
      page: 1, // 当前页
      pageSize: 10, // 每页显示条数
      selectedDate: null, // 选择的日期
      selectedRows: [], // 存储选中的行
    };
  },
  mounted() {
    this.getOrders();
  },
  methods: {
    async getOrders() {
      try {
        const params = {
          page: this.page,
          page_size: this.pageSize,
        };

        // 如果存在日期筛选条件，将其添加到请求参数中
        if (this.selectedDate) {
          params.date = this.selectedDate;
        }

        const response = await axios.get('http://47.109.188.197:5000/orders', {
          params,
        });

        this.tableData = response.data.orders;
        this.totalCount = response.data.total_count; // 总记录数
      } catch (error) {
        console.error('获取订单数据时出错:', error);
      }
    },

    handlePageChange(page) {
      this.page = page;
      this.getOrders(); // 页码改变时重新加载数据
    },

    // 处理日期筛选变化
    handleDateFilterChange() {
      this.page = 1; // 重置为第一页
      this.getOrders(); // 重新加载数据
    },
  
  // 监听选中的行
  handleSelectionChange(selectedRows) {
      this.selectedRows = selectedRows; // 更新选中的行
     
    },
  
     // 批量删除
async handleDelete() {
  const selectedRows = this.selectedRows;
  if (selectedRows.length === 0) {
    this.$message.warning('请选择要删除的订单');
    return;
  }

  try {
    await axios.delete('http://47.109.188.197:5000/orders', {
      data: {
        products: selectedRows.map(row => ({ 序列: row.序列 }))  // 传递正确的字段 '序列'
      }
    });

    this.$message({
      message: '删除成功',
      type: 'success'
    });

    // 从表格中删除
    this.tableData = this.tableData.filter(item => !selectedRows.some(row => row.序列 === item.序列));

    this.totalCount -= selectedRows.length; // 更新总记录数
    this.selectedRows = []; // 清空选中
  } catch (error) {
    console.error('删除失败:', error);
    this.$message.error('删除失败');
  }
},
    //添加产品
    addDialog(){
    
    this.$refs.dialog.dialogFormVisible=true;
    
  },
  addDialog2(){
    
    this.$refs.dialog2.dialogFormVisible2=true;
    
  },
  },
};
</script>

<style lang="less" scoped>
.order {
  padding: 20px;
  .head {
    display: flex;
    justify-content: flex-end;
    button {
      margin-left: 20px;
    }
  }
  .wrapper {
    padding: 20px 0px;
  }
}
</style>
