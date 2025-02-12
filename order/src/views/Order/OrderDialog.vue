<template>
    <div>
      <el-dialog title="订单添加" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="模号" :label-width="formLabelWidth">
            <el-input v-model="form.模号" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="件号" :label-width="formLabelWidth">
            <el-input v-model="form.件号" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="品名" :label-width="formLabelWidth">
            <el-input v-model="form.品名" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="规格" :label-width="formLabelWidth">
            <el-input v-model="form.规格" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="数量" :label-width="formLabelWidth">
            <el-input v-model="form.数量" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户" :label-width="formLabelWidth">
            <el-input v-model="form.客户" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
    
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        dialogFormVisible: false,
        form: {
          模号: '',
          件号: '',
          品名: '',
          规格: '',
          数量: '',
          客户: '',
        },
        formLabelWidth: '120px',
      };
    },
    methods: {
        // 处理确认按钮点击事件
    async handleSubmit() {
      try {
        // 获取当前日期，格式为 YYYY-MM-DD
        const currentDate = new Date().toISOString().split('T')[0];

        // 组织数据
        const formData = {
          ...this.form,
          制单日期: currentDate,  // 添加制单日期
        };

        // 发送请求到后端，保存数据
        const response = await axios.post('http://47.109.188.197:5000/orders', formData);

        this.$message({
          message: '订单添加成功',
          type: 'success',
        });
        // 添加成功后清空表单
        this.form = {
          模号: '',
          件号: '',
          品名: '',
          规格: '',
          数量: '',
          客户: '',
        };
        this.dialogFormVisible = false;

        // 提示父组件刷新数据
        this.$emit('refreshOrders'); // 触发父组件刷新数据
      } catch (error) {
        console.error('添加订单失败:', error);
        this.$message.error('添加订单失败');
      }
    },
    
    },
  };
  </script>
  
  <style lang="less" scoped>
  .upload-demo {
    display: inline-block;
    margin-top: 10px;
  }
  </style>
  