<template>
  <el-upload
    class="upload-demo"
    action
    multiple
    list-type="text"
    :on-preview="handlePreview"
    :on-progress="onDocUpload"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :limit="limit"
    :on-exceed="handleExceed"
    :before-upload="beforeUpload"
    :file-list="fileList"
    :http-request="docUpload"
  >
    <el-button size="small" type="primary">{{ title }}</el-button>
    <div slot="tip" class="el-upload__tip">{{ tips }}</div>
    <el-progress
      :percentage="loadProgress"
      :format="format"
      v-show="showPorgess"
    ></el-progress>
  </el-upload>
</template>
<script>
import axios from "axios";
// import { Base64 } from "js-base64";
import { getToken, setToken } from "@/utils/auth";
export default {
  name: "docUpload",
  props: {
    title: {
      type: String,
      default: "点击上传",
    },
    tips: {
      type: String,
      // required: true,
      // default: "222",
    },
    rename: {
      type: Number,
      default: 0
    },
    typeCheck: {
      type: Function,
      required: true,
      default: null,
    },
    type: {
      type: Number,
      default: "99",
    },
    limit: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      fileList: [],
      imgurl: "",
      fd: null,
      file: "",
      loadProgress: 0,
      showPorgess: false,
    };
  },
  methods: {
    handleRemove(file, fileList) {
      this.$emit("on-remove", file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`每次只能上传 ${this.limit} 个文件`);
    },
    docUpload(raw) {
      let userid = this.$store.getters.userid.toString();
      this.fd = new FormData();
      this.fd.append("file", raw.file); //传文件
      let param = JSON.stringify({
        uid: userid,
        rename: this.rename,
        type: this.type,
      });
      this.fd.append("param", param);
      let access_token = getToken() ? JSON.parse(getToken()).access_token : "";
      axios({
        method: "post",
        url: "upload/upload/web/file",
        data: this.fd,
        headers: {
          "Content-Type": "multipart/form-data",
          AccessToken: access_token,
        },
      })
        .then((res) => {
          if (res.data.status != 200) {
            this.failed("Error");
          } else {
            this.succeed("Upload successfully");
            this.file = res.data.data[0].url;
            this.$emit("file", this.file, raw);
          }
        })
        .catch((err) => {
          this.failed("Upload failed");
        });
    },

    handlePreview(file, fileList) {
      console.log(fileList);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Are you sure to delete ${file.name}?`);
    },
    beforeUpload(file) {
      let bool = this.typeCheck(file);
      console.log(bool)
      return bool;
    },
    onDocUpload(event) {
      this.showPorgess = true;
      this.loadProgress = Math.floor(event.percent); //这就是当前上传的进度
      console.log(this.loadProgress);
    },
    handleChange() {
      this.showPorgess = false;
    },
    format(percentage) {
      return `${percentage}%`;
    },
    clearFile() {
      this.fileList = [];
    },
  },
};
</script>
<style lang="sass" scoped>
</style>