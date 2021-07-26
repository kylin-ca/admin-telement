<template>
  <div class="hello">
    <el-upload
      class="upload-demo"
      action
      :http-request="handleUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      multiple
      :limit="limit"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :list-type="listType"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">{{ tip }}</div>
    </el-upload>
  </div>
</template>

<script>
import { put, getFileNameUUID } from "@/utils/ali-oss";

export default {
  name: "Upload",
  props: {
    tip: {
      type: String,
      default: "上传大小不能超过2M",
    },
    limit: {
      type: Number,
      default: 1,
    },
    action: {
      type: String,
      default: "",
    },
    headers: {
      type: Object,
      default: () => {},
    },
    name: {
      type: String,
      default: "",
    },
    listType: {
      type: String,
      default: "text",
    },
    uploadType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      fileList: [],
    };
  },
  methods: {
    beforeUpload(file) {
      console.log(file.type)
      if (this.uploadType === "img") {
        const isJPG = file.type === "image/jpeg" || file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isJPG) {
          this.warning("文件格式错误");
        }
        if (!isLt2M) {
          this.warning("上传头像图片大小不能超过 1MB!");
        }
        return isJPG&&isLt2M;
      } else if (this.uploadType === "bin") {
        const isBIN = file.type === "application/octet-stream";
        const isLt2M = file.size / 1024 / 1024 < 3;
        if (!isBIN) {
          this.warning("文件格式错误");
        }
        if (!isLt2M) {
          this.warning("上传大小不能超过3M");
        }
        return isBIN&&isLt2M;
      }
    },
    handleRemove(file, fileList) {
      this.$emit("on-remove", file, fileList);
    },
    handlePreview(file) {
      this.$emit("on-preview", file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`每次只能上传 ${this.limit} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleSuccess(response, file, fileList) {
      // this.fileList = fileList;
      // console.log(222)
      // this.$emit("on-success", file, fileList);
    },
    /**
     * 自定义上传方法
     */
    handleUpload(option) {
      // 生成的文件名称
      let objName = getFileNameUUID();

      // 调用 ali-oss 中的方法
      put(`aaaaaa${objName}`, option.file).then((res) => {
        this.$emit("on-success", res, option);
      });
    },
  },
};
</script>

<style scoped></style>

