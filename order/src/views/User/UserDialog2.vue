<template>
    <div>
      <el-dialog title="订单详情" :visible.sync="dialogFormVisible" width="600px">
        <!-- 表格显示selectData内容 -->
        <el-table
          :data="selectData"
          border
          style="width: 100%; font-size: 14px;" 
        >
          <el-table-column prop="模号" label="模号"></el-table-column>
          <el-table-column prop="品名" label="品名"></el-table-column>
          <el-table-column prop="客户" label="客户"></el-table-column>
          <el-table-column prop="制单日期" label="制单日期"></el-table-column>
        </el-table>
        
        <!-- 选择出库格式 -->
        <el-form :model="formData" label-width="120px" style="margin-top: 20px;">
          <el-form-item label="请选择出库格式">
            <el-select v-model="formData.outboundFormat" placeholder="请选择出库格式" style="font-size: 14px;">
              <el-option label="锦运出货单" value="锦运出货单"></el-option>
              <el-option label="福耀出货单" value="福耀出货单"></el-option>
              <el-option label="三捷出货单" value="三捷出货单"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
  
        <!-- 底部按钮 -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" style="font-size: 14px;">取 消</el-button>
          <el-button type="primary" @click="confirmData" style="font-size: 14px;">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      selectData: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        dialogFormVisible: false,
        formData: {
          outboundFormat: '', // 用来存储选择的出库格式
        },
      };
    },
    methods: {
      // 点击确定后，将数据发送到后端
      confirmData() {
  if (!this.formData.outboundFormat) {
    this.$message.warning('请选择出库格式！');
    return;
  }

  // 组合要发送的数据
  const postData = {
    selectData: this.selectData,
    outboundFormat: this.formData.outboundFormat,
  };

  // 发送请求到后端
  axios
    .post('http://47.109.188.197:5000/endpoint', postData, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob', // 指定响应类型为 blob（处理文件）
    })
    .then(response => {
      console.log(postData);

      // 创建一个下载链接并触发下载
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = '出库单.xlsx'; // 设置下载文件的名称
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      // 提示成功信息
      this.$message.success('文件已生成并开始下载！');

      // 清空 selectData
      this.$emit('clear-select-data');
      this.dialogFormVisible = false;
    })
    .catch(error => {
      // 错误处理
      this.$message.error('提交数据时发生错误！');
      console.error(error);
      console.log(postData);
    });
},
},
  };
  </script>
  
  <style lang="less" scoped>
  .el-dialog {
    font-size: 14px;
  }
  .el-table {
    font-size: 14px;
  }
  </style>
  