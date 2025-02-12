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
      <el-button type="primary" @click="addDialog">生成标签</el-button>
      <el-button type="primary" @click="handleCheckout">出库</el-button>
      <el-button type="primary" @click="addDialog2">生成出库单</el-button>
    </div>
    <div class="wrapper">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="模号" label="模号"></el-table-column>
        <el-table-column prop="件号" label="件号"></el-table-column>
        <el-table-column prop="品名" label="品名"></el-table-column>
        <el-table-column prop="规格" label="规格"></el-table-column>
        <el-table-column prop="数量" label="数量"></el-table-column>
        <el-table-column prop="客户" label="客户"></el-table-column>
        <el-table-column prop="制单日期" label="制单日期"></el-table-column>
      </el-table>

      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>
    <UserDialog ref="dialog" :selectedRows="selectedRows" />
    <UserDialog2 ref="dialog2" :selectData="selectData"  @clear-select-data="clearSelectData"/>
  </div>
</template>

<script>
import axios from "axios";
import UserDialog from "./UserDialog.vue";
import UserDialog2 from "./UserDialog2.vue";



export default {
  components: {
    UserDialog,
    UserDialog2,
  },
  data() {
    return {
      tableData: [],
      totalCount: 0,
      page: 1, // 当前页
      pageSize: 10, // 每页显示条数
      selectedDate: null, // 选择的日期
      selectedRows: [], // 当前选中的行
      selectData: [], // 已出库的数据
    };
  },
  mounted() {
    this.getOrders();
  },
  methods: {
    // 清空selectData的方法
    clearSelectData() {
      this.selectData = [];
    },
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

        const response = await axios.get("http://47.109.188.197:5000/orders", {
          params,
        });

        this.tableData = response.data.orders;
        this.totalCount = response.data.total_count; // 总记录数
      } catch (error) {
        console.error("获取订单数据时出错:", error);
      }
    },

    // 处理日期筛选变化
    handleDateFilterChange() {
      this.page = 1; // 重置为第一页
      this.getOrders(); // 重新加载数据
    },

    handlePageChange(page) {
      this.page = page;
      this.getOrders(); // 页码改变时重新加载数据
    },

    // 监听选中的行
    handleSelectionChange(selectedRows) {
      this.selectedRows = selectedRows; // 更新选中的行
    },

    // 出库操作
    handleCheckout() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请选择要出库的行！");
        return;
      }

      // 将选中的行加入 selectData
      this.selectData = [...this.selectData, ...this.selectedRows];

      // 提示成功
      this.$message.success("选中数据已成功出库！");

      // 清空当前的选中状态
      this.$refs.multipleTable.clearSelection();
    },

    addDialog() {
      this.$refs.dialog.dialogFormVisible = true;
    },
    addDialog2() {
      this.$refs.dialog2.dialogFormVisible = true;
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
    position: sticky; /* 固定头部 */
    top: 0; /* 距离顶部的距离 */
    z-index: 10; /* 确保固定部分在最前 */
    background-color: #fff; /* 防止透明 */
    padding: 10px 20px; /* 保持样式一致 */
    border-bottom: 1px solid #ebeef5; /* 添加底边分隔线 */
    button {
      margin-left: 20px;
    }
  }
  .wrapper {
    padding: 20px 0px;
  }
}
</style>
