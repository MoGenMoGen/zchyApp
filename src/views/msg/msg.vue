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
      <template slot="menuLeft">
        <el-button type="primary" icon="el-icon-plus" size="small" plain @click.stop="rowSave()">新增</el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.msg_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="button" class="el-button el-button--text el-button--small" @click.stop="rowSave(scope.row)">
          <i class="el-icon-edit"></i>
          <span>编辑</span>
        </el-button>
        <el-button v-if="scope.row.status === 0" type="button" class="el-button el-button--text el-button--small" @click.stop="push(scope.row)">
          <i class="el-icon-s-promotion"></i>
          <span>发布</span>
        </el-button>
        <el-button v-if="scope.row.status === 1" type="button" class="el-button el-button--text el-button--small" @click.stop="rePush(scope.row)">
          <i class="el-icon-s-promotion"></i>
          <span>重新发布</span>
        </el-button>
        <el-button type="button" class="el-button el-button--text el-button--small" @click.stop="userLink(scope.row)">
          <span>查看关联用户</span>
        </el-button>
        <el-button type="button" class="el-button el-button--text el-button--small" @click.stop="userLinkLog(scope.row)">
          <span>查看消息发送日志</span>
        </el-button>
      </template>
    </avue-crud>
    <!-- 弹窗, 新增 / 修改 -->
    <addData v-if="formVisible" ref="addData" @refreshDataList="onLoad(this.page)"></addData>
    <!-- 弹窗, 新增 / 修改 -->
    <msgUserLink v-if="linkFormVisible" ref="msgUserLink" @refreshDataList="onLoad(this.page)"></msgUserLink>
    <!-- 弹窗, 新增 / 修改 -->
    <msgUserLinkLog v-if="linkLogFormVisible" ref="msgUserLinkLog" @refreshDataList="onLoad(this.page)"></msgUserLinkLog>
  </basic-container>
</template>

<script>
  import {getList, getDetail, update, remove} from "@/api/msg/msg";
  import msgUserLink from './msguserlinkDialog'
  import msgUserLinkLog from './msguserlinklogDialog'
  import {mapGetters} from "vuex";
  import addData from './msg-add';

  export default {
    data() {
      return {
        formVisible: false,
        linkFormVisible: false,
        linkLogFormVisible: false,
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
          addBtn: false,
          editBtn:false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "标题",
              prop: "title",
              rules: [{
                required: true,
                message: "请输入标题",
                trigger: "blur"
              }]
            },
            {
              label: "内容",
              prop: "content",
              hide: true,
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }]
            },
            {
              label: "消息类型",
              prop: 'type',
              type: "select",
              dicData: [
                {
                  label: "系统消息",
                  value: 1
                },
                {
                  label: "个人消息",
                  value: 2
                }],
              rules: [{
                required: true,
                message: "请选择消息类型(1:系统消息 ,2:个人消息)",
                trigger: "blur"
              }]
            },
            {
              label: "发布时间",
              prop: "publishTime",
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              rules: [{
                required: true,
                message: "请输入发布时间",
                trigger: "blur"
              }]
            },
            {
              label: "发布人",
              prop: "publisherId",
              display: false,
              dicUrl: "/api/blade-user/user-list",
              props: {
                label: 'realName',
                value: 'id'
              },
              rules: [{
                required: true,
                message: "请输入发布人",
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
          addBtn: this.vaildData(this.permission.msg_add, false),
          viewBtn: this.vaildData(this.permission.msg_view, false),
          delBtn: this.vaildData(this.permission.msg_delete, false),
          editBtn: this.vaildData(this.permission.msg_edit, false)
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
      addData, msgUserLinkLog, msgUserLink
    },
    methods: {
      push (row) {
        this.$confirm(`是否发布?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/api/blade-msg/msg/push', {
            ...row
          }).then(({data: res}) => {
            if (res && res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 500,
                onClose: () => {
                  this.onLoad(this.page)
                }
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {})
      },
      rePush (row) {
        this.$confirm(`是否重新发布?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/api/blade-msg/msg/rePush', {
            ...row
          }).then(({data: res}) => {
            if (res && res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 500,
                onClose: () => {
                  this.onLoad(this.page)
                }
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {})
      },
      rowSave(row) {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.addData.init(row)
        })
      },
      userLink(row) {
        this.linkFormVisible = true
        this.$nextTick(() => {
          this.$refs.msgUserLink.init(row)
        })
      },
      userLinkLog(row) {
        this.linkLogFormVisible = true
        this.$nextTick(() => {
          this.$refs.msgUserLinkLog.init(row)
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
