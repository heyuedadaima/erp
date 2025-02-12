<template>
  <div>
    <el-dialog title="产品添加" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="产品名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
  
        <!-- 上传文件 -->
        <el-form-item label="上传文件" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :file-list="fileList"
            :auto-upload="false"
            :on-success="handleUploadSuccess"
            :on-change="handleFileChange"
            :on-remove="handleRemove"
            :limit="1"
            >
            
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button slot="upload" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
  
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
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
        name: '',
      },
      formLabelWidth: '120px',
      uploadUrl: 'http://47.109.188.197:5000/upload', // 修改为你的后端接口地址
      fileList: []
    };
  },
  methods: {
    async submitUpload() {
      const formData = new FormData();
      
      // 添加 name 字段
      formData.append('name', this.form.name);

      // 确保 fileList 已经更新，获取上传的文件
      if (this.fileList.length > 0) {
        this.fileList.forEach(file => {
          if (file.raw) {
            formData.append('file', file.raw);
          }
        });
      } else {
        this.$message.error('没有文件选中');
        return;
      }

      
      // 发送请求到后端
      try {
        const response = await axios.post(this.uploadUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // 需要设置为 multipart/form-data 来处理文件上传
          }
        });
        //console.log('上传成功:', response.data);
        // 上传成功后关闭弹窗
        this.$message({
          message: '添加成功',
          type: 'success'
        });

        // 触发父组件方法来更新表格数据
        this.$emit('refreshProducts'); // 触发 refreshProducts 事件
        // 清空 fileList 和 form.name，准备二次添加
        this.fileList = [];  // 清空文件列表
        this.form.name = '';  // 清空产品名称
        this.dialogFormVisible = false;
      } catch (error) {
        this.$message.error('上传失败:', error.response || error);

      }
    },

    // 处理文件上传成功的回调
    handleUploadSuccess(response, file, fileList) {
      //console.log('文件上传成功:', response);
      //console.log('文件信息:', file);
      this.fileList = fileList;  // 更新 fileList
    },

    // 处理文件列表变化的回调
    handleFileChange(file, fileList) {
      //console.log('文件状态改变:', file);
      //console.log('当前文件列表:', fileList);
      this.fileList = fileList;  // 更新 fileList
    },

    // 处理文件删除的回调
    handleRemove(file, fileList) {
      //console.log('文件被删除:', file);
      this.fileList = fileList;  // 更新 fileList
    }
  },
  cancel(){
    this.fileList = [];  // 清空文件列表
        this.form.name = '';  // 清空产品名称
        this.dialogFormVisible = false;
  },
};
</script>

<style lang="less" scoped>
.upload-demo {
  display: inline-block;
  margin-top: 10px;
}
</style>
