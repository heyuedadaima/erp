<template>
    <div>
      <el-dialog title="订单添加" :visible.sync="dialogFormVisible2">
        <!-- 自动上传区域 -->
        <el-upload
          class="upload-demo"
          drag
          action="http://47.109.188.197:5000/upload1"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :before-upload="beforeUpload"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
  
        <!-- 显示列映射表单 -->
        <div v-if="columnsMapping && columnsMapping.length > 0">
          <el-form label-width="120px">
            <!-- 遍历 columnsMapping 显示每一行映射 -->
            <el-form-item v-for="(column, index) in columnsMapping" :key="index" :label="column.databaseColumn">
              <el-row>
                <el-col :span="8">
                  <el-input v-model="column.databaseColumn" disabled placeholder="数据库列名" />
                </el-col>
                <el-col :span="16">
                  <el-select v-model="column.mappedColumn" placeholder="请选择文件列名">
                    <el-option
                      v-for="(option, idx) in column.options"
                      :key="idx"
                      :label="option"
                      :value="option"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <el-input v-model="defaultCustomerValue" placeholder="如果对应列没客户，在此输入客户"></el-input>
        </div>
  
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="processFileMapping">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        dialogFormVisible2: false,
        columnsMapping: [],  // 存储文件列映射
        fileData: null,  // 存储上传的文件信息
        databaseColumns: ['模号', '件号', '品名', '规格', '数量', '客户', '制单日期'],  // 预定义的数据库列名
        defaultCustomerValue:'',
      };
    },
    methods: {
      // 上传成功的回调
      handleUploadSuccess(response, file, fileList) {
        console.log('文件上传成功:', response);
  
        // 假设后端返回列名映射数据
        if (response.columnsMap) {
          // 填充列映射
          this.columnsMapping = this.databaseColumns.map((column) => ({
            databaseColumn: column,  // 左侧显示的数据库列名
            mappedColumn: '',  // 用于用户选择的映射
            options: response.columnsMap,  // 从后端获取的文件列名
          }));
          console.log(this.columnsMapping);
        }
      },
  
      // 上传失败的回调
      handleUploadError(error, file, fileList) {
        console.error('文件上传失败:', error);
      },
  
      // 在上传前进行检查
      beforeUpload(file) {
        const allowedExtensions = ['pdf', 'xls', 'xlsx'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          this.$message.error('不支持的文件类型');
          return false;  // 返回 false 阻止上传
        }
        return true;  // 允许上传
      },
  
      // 点击“确定”时提交文件和列映射信息
      processFileMapping() {
  // 检查是否完成列映射（至少有一个字段映射）
  const hasMapping = this.columnsMapping.some((column) => column.mappedColumn);

  if (!hasMapping) {
    this.$message.error('请至少选择一个列映射');
    return;
  }

  // 获取当前日期（格式：YYYY-MM-DD）
  const currentDate = new Date().toISOString().split('T')[0];

  // 将制单日期加入到列映射中
  const orderData = {
    columnsMap: this.columnsMapping,  // 包含映射关系的数组
    createdAt: currentDate,  // 添加制单日期
    client:this.defaultCustomerValue,
  };

  axios.post('http://47.109.188.197:5000/process-uploaded-file', orderData)
    .then(response => {
      this.$message.success('数据已成功处理并保存到数据库');
      // 清空数据
      this.fileData = null;
      this.columnsMapping = [];
      this.dialogFormVisible2 = false;
      // 发送事件到父组件，要求刷新订单数据
      this.$emit('refreshOrders');
    })
    .catch(error => {
      this.$message.error('数据处理失败');
      console.error(error.response.data);  // 查看具体的错误信息
    });
},
cancel(){
  this.fileData = null;
      this.columnsMapping = [];
      this.dialogFormVisible2 = false;
},
    },
  };
  </script>
  
  <style scoped>
  .upload-demo {
    border: 2px dashed #ddd;
    padding: 20px;
  }
  
  .column-mapping-row {
    margin-bottom: 10px;
  }
  
  .el-form-item {
    margin-bottom: 10px;
  }
  </style>
  