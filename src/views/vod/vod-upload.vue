<template>
  <div class="mod-vod-upload">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="small" @click="addHandle()">添加视频</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border stripe style="width: 100%;">
      <el-table-column prop="index" label="视频" header-align="center" align="center">
        <template slot-scope="scope">
          <div :class="scope.row.index">
            <uploadVod @my-event="getMyEvent"></uploadVod>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import uploadVod from '@/components/aliyunUploadVod'
export default {
  components: {
    uploadVod
  },
  data () {
    return {
      count: 0,
      dataList: [{index: this.count}]
    }
  },
  methods: {
    init () {
      // this.$refs.childVod.emitEventVod()
    },
    addHandle () {
      this.count++
      this.dataList.push({
        index: this.count
      })
    },
    getMyEvent (vid) {
      console.log('接收的数据--------->' + vid)
      this.$message({
        message: '接收的数据---->' + vid,
        type: 'success'
      })
    }
  }
}
</script>
<style>
  /* .upload-type-switch {
    text-align: center;
  }
  .container {
    width: 1200px;
    margin: 0 auto;
  }
  .input-control {
    margin: 5px 0;
  }
  .input-control label {
    font-size: 14px;
    color: #333;
    width: 30%;
    text-align: right;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }
  .input-control input {
    width: 30%;
    height: 30px;
    padding: 0 5px;
  }
  .upload {
    padding: 30px 50px;
  }
  .progress {
    font-size: 14px;
  }
  .progress i {
    font-style: normal;
  }
  .upload-type {
    color: #666;
    font-size: 12px;
    padding: 10px 0;
  }
  .upload-type button {
    margin: 0 10px 0 20px;
  }
  .status {
    font-size: 14px;
    margin-left: 30px;
  }
  .info {
    font-size: 14px;
    padding-left: 30px;
  } */
</style>