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
        <template slot-scope="scope" slot="userId">
          <a href="#" @click="face(scope.row)" style="color: dodgerblue">{{scope.row.userId}}</a>
        </template>
        <template slot="menuLeft">
          <el-button type="primary" icon="el-icon-plus" size="small" plain @click.stop="rowSave()">新增</el-button>
          <el-button type="danger"
                     size="small"
                     icon="el-icon-delete"
                     plain
                     v-if="permission.faceuser_delete"
                     @click="handleDelete">删 除
          </el-button>
        </template>
      </avue-crud>
      <!-- 弹窗, 新增 -->
      <faceAdd v-if="formVisible" ref="faceAdd" @refreshDataList="onLoad(this.page)"></faceAdd>
      <!-- 弹窗, 人脸列表 -->
      <face v-if="faceVisible" ref="face" @refreshDataList="onLoad(this.page)"></face>
    </basic-container>
  </el-dialog>
</template>

<script>
  import {getList, getDetail, update, remove} from "@/api/face/faceuser";
  import {mapGetters} from "vuex";
  import faceAdd from './face-user-add'
  import face from './face'

  export default {
    data() {
      return {
        formVisible: false,
        faceVisible: false,
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
          viewBtn: true,
          editBtn: false,
          addBtn: false,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "用户id",
              prop: "userId",
              slot: true,
              rules: [{
                required: true,
                message: "请输入用户id",
                trigger: "blur"
              }]
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.faceuser_add, false),
          viewBtn: this.vaildData(this.permission.faceuser_view, false),
          delBtn: this.vaildData(this.permission.faceuser_delete, false),
          editBtn: this.vaildData(this.permission.faceuser_edit, false)
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
      faceAdd, face
    },
    methods: {
      init (id) {
        this.visible = true;
        this.form.groupId = id;
        this.query.groupId = id;
        this.onLoad(this.page)
      },
      face(row) {
        this.faceVisible = true;
        this.$nextTick(() => {
          this.$refs.face.init(row)
        })
      },
      rowSave() {
        this.formVisible = true;
        this.$nextTick(() => {
          this.$refs.faceAdd.init(this.form.groupId)
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
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
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
      }
    }
  };
</script>

<style>
</style>
