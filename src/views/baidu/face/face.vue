<template>
  <el-dialog :title="'用户管理'" width="1200px" :visible.sync="visible"
             append-to-body>
    <basic-container>
      <avue-crud :option="option"
                 :table-loading="loading"
                 :data="data"
                 :page.sync="page"
                 :permission="permissionList"
                 :before-open="beforeOpen"
                 v-model="form"
                 ref="crud"
                 @row-update="rowUpdate"
                 @row-save="rowSave"
                 @row-del="rowDel"
                 @search-change="searchChange"
                 @search-reset="searchReset"
                 @selection-change="selectionChange"
                 @current-change="currentChange"
                 @size-change="sizeChange"
                 @refresh-change="refreshChange"
                 @on-load="onLoad">
        <template slot-scope="scope" slot="imgUrl">
          <img :src="scope.row.imgUrl" style="height: 50px;width: 100px">
        </template>
        <template slot="menuLeft">
          <el-button type="primary" icon="el-icon-plus" size="small" plain @click.stop="rowSave()">新增</el-button>
          <el-button type="danger"
                     size="small"
                     icon="el-icon-delete"
                     plain
                     v-if="permission.face_delete"
                     @click="handleDelete">删 除
          </el-button>
        </template>
      </avue-crud>
      <!-- 弹窗, 新增 -->
      <faceAdd v-if="formVisible" ref="faceAdd" @refreshDataList="onLoad(this.page)"></faceAdd>
    </basic-container>
  </el-dialog>
</template>

<script>
  import {getList, getDetail, update, remove} from "@/api/face/face";
  import {mapGetters} from "vuex";
  import faceAdd from './face-add'

  export default {
    data() {
      return {
        formVisible: false,
        visible: false,
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          addBtn: false,
          editBtn: false,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "用户组id",
              prop: "groupId",
              display: false,
              hide: true,
              rules: [{
                required: true,
                message: "请输入用户组id",
                trigger: "blur"
              }]
            },
            {
              label: "用户id",
              prop: "userId",
              display: false,
              hide: true,
              rules: [{
                required: true,
                message: "请输入用户id",
                trigger: "blur"
              }]
            },
            {
              label: "图片存储地址",
              prop: "imgUrl",
              slot: true,
              rules: [{
                required: true,
                message: "请输入图片存储地址",
                trigger: "blur"
              }]
            },
            {
              label: "人脸图片的唯一标识",
              prop: "faceToken",
              rules: [{
                required: true,
                message: "请输入人脸图片的唯一标识",
                trigger: "blur"
              }]
            }
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.face_add, false),
          viewBtn: this.vaildData(this.permission.face_view, false),
          delBtn: this.vaildData(this.permission.face_delete, false),
          editBtn: this.vaildData(this.permission.face_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    components: {
      faceAdd
    },
    methods: {
      init(row) {
        this.visible = true;
        this.form.faceUserId = row.id;
        this.form.groupId = row.groupId;
        this.query.faceUserId = row.faceUserId;
        this.query.groupId = row.groupId;
        this.onLoad(this.page)
      },
      rowSave(row) {
        this.formVisible = true;
        this.$nextTick(() => {
          this.$refs.faceAdd.init(row,this.form.groupId,this.form.faceUserId)
        })
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          loading();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.query.groupId = this.form.groupId;
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.query.groupId = this.form.groupId;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      // 摄像头拍照方法区*********开始
      // 摄像头初始化
      videoInit () {
        if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
          // 调用用户媒体设备, 访问摄像头
          this.getUserMedia({video: {width: this.videoWidth, height: this.videoHeight, facingMode: 'user'}}, this.success, this.error)
        } else {
          alert('不支持访问用户媒体')
        }
      },
      // 访问用户媒体设备的兼容方法
      getUserMedia (constraints, success, error) {
        if (navigator.mediaDevices.getUserMedia) {
          // 最新的标准API
          navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error)
        } else if (navigator.webkitGetUserMedia) {
          // webkit核心浏览器
          navigator.webkitGetUserMedia(constraints, success, error)
        } else if (navigator.mozGetUserMedia) {
          // firfox浏览器
          navigator.mozGetUserMedia(constraints, success, error)
        } else if (navigator.getUserMedia) {
          // 旧版API
          navigator.getUserMedia(constraints, success, error)
        }
      },
      success (stream) {
        // 兼容webkit核心浏览器
        // let CompatibleURL = window.URL || window.webkitURL
        // 将视频流设置为video元素的源
        console.log(stream);

        // this.video.src = CompatibleURL.createObjectURL(stream)
        this.video.srcObject = stream;
        this.video.play()
      },
      error (error) {
        console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
        alert(`访问用户媒体设备失败${error.name}, ${error.message}`)
      },
      addEventListener () {
        this.context.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);
        let dataurl = this.canvas.toDataURL('image/jpg');
        // console.log(dataurl)
        this.dataForm.headImgUrl = dataurl
      },
      // 摄像头拍照方法区*********结束

      // 图片裁剪
      // 图片裁剪赋值
      cropperOpen () {
        this.option.img = this.dataForm.headImgUrl
      },
      // 图片裁剪提交
      cropperOk () {
        this.$refs.cropper.getCropData((data) => {
          // console.log(data)
          this.dataForm.headImgUrl = data;
          this.option.img = data
        });
        this.cropperVisible = false
      },
    }
  };
</script>

<style>
</style>
