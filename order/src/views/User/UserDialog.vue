<template>
    <div>
      <el-dialog title="标签打印" :visible.sync="dialogFormVisible">
        
    
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmPrint">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
    selectedRows: {
      type: Array,
      required: true,
    },
  },
    data() {
      return {
        dialogFormVisible: false,
      
      };
    },
    methods: {
     

    handlePageChange(page) {
      this.page = page;
      this.getOrders(); // 页码改变时重新加载数据
    },
    async confirmPrint() {
    

    if (!this.$parent.selectedRows || this.$parent.selectedRows.length === 0) {
      this.$message.warning("请选择要打印的行！");
      return;
    }

    try {
      const response = await axios.post('http://47.109.188.197:5000/print-labels', {
        rows: this.selectedRows, // 从父组件传递选中的行数据
        
      });
      
      this.$message.success(response.data.message);
       // 打印成功后，自动触发下载操作
      this.autoDownloadFile();
      this.dialogFormVisible = false; // 关闭弹窗
    } catch (error) {
      console.error('打印失败:', error);
      this.$message.error('打印失败！');
    }
  },
  async autoDownloadFile() {
      try {
        const response = await axios.get('http://47.109.188.197:5000/download-printed-labels', {
          responseType: 'blob',
        });

        // 创建一个链接元素并自动点击下载
        const link = document.createElement('a');
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'printed_labels.xlsx';  // 设置下载文件名
        link.click();
        URL.revokeObjectURL(url);  // 释放URL对象
      } catch (error) {
        console.error('下载失败:', error);
        this.$message.error('下载失败！');
      }
    },
    },
    mounted() {
    
  },
  };
  </script>
  
  <style lang="less" scoped>
  .upload-demo {
    display: inline-block;
    margin-top: 10px;
  }
  </style>
  