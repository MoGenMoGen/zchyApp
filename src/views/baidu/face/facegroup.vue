<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot-scope="scope" slot="groupId">
        <a href="#" @click="face(scope.row)" style="color: dodgerblue">{{scope.row.groupId}}</a>
      </template>
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.facegroup_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
    <!-- 弹窗, 用户 -->
    <faceUser v-if="faceVisible" ref="faceUser" @refreshDataList="onLoad(this.page)"></faceUser>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, remove} from "@/api/face/facegroup";
  import {mapGetters} from "vuex";
  import faceUser from './faceuser'

  export default {
    data() {
      var validateGroupId = (rule, value, callback)=>{
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          for(let i = 0;i < value.length;i++) {
            let n = value.charCodeAt(i); //把字符串中第i个字符的ASCALL值赋给变量n
            if (!((n >= 48 && n <= 57) || (n >= 65 && n <= 90) || (n >= 97 && n <= 122) || n == 95)) { //48=0，57=9,65=A,90=Z,97=a,122=z,95=_,.=46,@=64
              callback("用户名只能由数字、英文字母和下划线组成");
            }
          }
          callback();
        }
      };
      return {
        form: {},
        query: {},
        loading: true,
        faceVisible: false,
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
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "用户组id",
              prop: "groupId",
              slot: true,
              rules: [{ validator: validateGroupId, trigger: 'blur' }]
            },
            {
              label: "修改时间",
              prop: "updateTime",
              display: false,
              rules: [{
                required: true,
                message: "请输入修改时间",
                trigger: "blur"
              }]
            }
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission","faceRoutes"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.facegroup_add, false),
          viewBtn: this.vaildData(this.permission.facegroup_view, false),
          delBtn: this.vaildData(this.permission.facegroup_delete, false),
          editBtn: this.vaildData(this.permission.facegroup_edit, false)
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
      faceUser
    },
    methods: {
      face(row) {
        this.faceVisible = true;
        this.$nextTick(() => {
          this.$refs.faceUser.init(row.groupId)
        })
      },
      rowSave(row, done, loading) {
        add(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          loading();
          window.console.log(error);
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
