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
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.quesanswer_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/ques/quesanswer";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
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
          searchSpan: 4,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "活动主题id",
              prop: "topicId",
              rules: [{
                required: true,
                message: "请输入活动主题id",
                trigger: "blur"
              }]
            },
            {
              label: "题目id",
              prop: "questionId",
              rules: [{
                required: true,
                message: "请输入题目id",
                trigger: "blur"
              }]
            },
            {
              label: "用户答案",
              prop: "optionsIds",
              rules: [{
                required: true,
                message: "请输入用户答案",
                trigger: "blur"
              }]
            },
            {
              label: "用户答案选项编码",
              prop: "optionsCds",
              rules: [{
                required: true,
                message: "请输入用户答案选项编码",
                trigger: "blur"
              }]
            },
            {
              label: "标准答案",
              prop: "answerIds",
              rules: [{
                required: true,
                message: "请输入标准答案",
                trigger: "blur"
              }]
            },
            {
              label: "标准答案选项编码",
              prop: "answerCds",
              rules: [{
                required: true,
                message: "请输入标准答案选项编码",
                trigger: "blur"
              }]
            },
            {
              label: "用户id",
              prop: "userId",
              rules: [{
                required: true,
                message: "请输入用户id",
                trigger: "blur"
              }]
            },
            {
              label: "用户id",
              prop: "empId",
              rules: [{
                required: true,
                message: "请输入用户id",
                trigger: "blur"
              }]
            },
            {
              label: "用户姓名",
              prop: "empNm",
              rules: [{
                required: true,
                message: "请输入用户姓名",
                trigger: "blur"
              }]
            },
            {
              label: "用户openId",
              prop: "openId",
              rules: [{
                required: true,
                message: "请输入用户openId",
                trigger: "blur"
              }]
            },
            {
              label: "是否正确(1：答题正确，2：答题错误)",
              prop: "types",
              rules: [{
                required: true,
                message: "请输入是否正确(1：答题正确，2：答题错误)",
                trigger: "blur"
              }]
            },
            {
              label: "本题得分",
              prop: "scores",
              rules: [{
                required: true,
                message: "请输入本题得分",
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
          addBtn: this.vaildData(this.permission.quesanswer_add, false),
          viewBtn: this.vaildData(this.permission.quesanswer_view, false),
          delBtn: this.vaildData(this.permission.quesanswer_delete, false),
          editBtn: this.vaildData(this.permission.quesanswer_edit, false)
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
