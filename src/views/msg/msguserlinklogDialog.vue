<template>
  <el-dialog :title="dialogTitle" width="1200px" :visible.sync="formVisible"
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
        <template slot="menuLeft">
          <el-button type="danger"
                     size="small"
                     icon="el-icon-delete"
                     plain
                     v-if="permission.msguserlinklog_delete"
                     @click="handleDelete">删 除
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
  </el-dialog>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/msg/msguserlinklog";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        formVisible: false,
        dialogTitle: '消息发送日志',
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
          addBtn: false,
          editBtn: false,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "唯一标识",
              prop: "uniqueIdentification",
              rules: [{
                required: true,
                message: "请输入唯一标识",
                trigger: "blur"
              }]
            },
            {
              label: "消息类型",
              prop: "type",
              dicData: [{
                label: '短信',
                value: 1
              },{
                label: '邮件',
                value: 2
              },{
                label: '极光推送',
                value: 3
              }],
              rules: [{
                required: true,
                message: "请输入消息类型(1:短信 ,2:邮件,3:极光推送)",
                trigger: "blur"
              }]
            },
            {
              label: "状态（code）",
              prop: "pushStatus",
              rules: [{
                required: true,
                message: "请输入状态（code）",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "rmks",
              rules: [{
                required: true,
                message: "请输入备注",
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
          addBtn: this.vaildData(this.permission.msguserlinklog_add, false),
          viewBtn: this.vaildData(this.permission.msguserlinklog_view, false),
          delBtn: this.vaildData(this.permission.msguserlinklog_delete, false),
          editBtn: this.vaildData(this.permission.msguserlinklog_edit, false)
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
    methods: {
      init (row) {
        this.formVisible = true
        this.form.msgId = row.msgId
        this.query.msgId = row.msgId
        this.onLoad(this.page,{})
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
        this.query.msgId = this.form.msgId
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.query.msgId = this.form.msgId
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
