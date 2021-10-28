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
                   v-if="permission.quesanswerstat_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-download"
                   plain
                   v-if="permission.quesquestion_delete"
                   @click="handleExport">导出
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/ques/quesanswerstat";
  import {mapGetters} from "vuex";
  import {getToken} from '@/util/auth';

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
          dialogWidth: "35%",
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          searchSpan: 4,
          border: true,
          index: true,
          viewBtn: true,
          addBtn: true,
          editBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            // {
            //   label: "活动主题id",
            //   prop: "topicId",
            //   rules: [{
            //     required: true,
            //     message: "请输入活动主题id",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "考试主题",
              prop: "nm",
              type: "select",
              span: 24,
              dicUrl: `/api/blade-ques/questopic/tlist`,
              props: {
                label: "nm",
                value: "id"
              },
              overHidden: true,
              search: true,
              filterable: true,
              viewDisplay: false,
            },
            {
              label: "合格分数",
              prop: "passScores",
              type: "number",
              span: 24,
              rules: [{
                required: true,
                message: "请输入合格分数",
                trigger: "blur"
              }]
            },
            // {
            //   label: "用户id",
            //   prop: "userId",
            //   rules: [{
            //     required: true,
            //     message: "请输入用户id",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "用户",
              prop: "empId",
              type: "select",
              span: 24,
              dicUrl: `/api/blade-emp/empemployee/tlist?types=2`,
              filterable: true,
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请选择用户",
                trigger: "blur"
              }]
            },
            // {
            //   label: "用户openId",
            //   prop: "openId",
            //   rules: [{
            //     required: true,
            //     message: "请输入用户openId",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "姓名",
            //   prop: "empNm",
            //   search: true,
            //   rules: [{
            //     required: true,
            //     message: "请输入姓名",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "昵称",
            //   prop: "nickname",
            //   search: true,
            //   rules: [{
            //     required: true,
            //     message: "请输入昵称",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "单位/部门",
              prop: "deptNm",
              search: true,
              span: 24,
              rules: [{
                required: false,
                message: "请输入单位/部门",
                trigger: "blur"
              }]
            },
            {
              label: "头像",
              prop: "imgUrl",
              type: "upload",
              dataType: "string",
              listType: "picture-card",
              value: " ",
              propsHttp:{
                  res: 'data',
                  url: 'link'
              },
              action: "/api/blade-resource/oss/endpoint/put-file-attach",
              span: 24,
              addDisplay: false,
              editDisplay: false,
              rules: [{
                required: false,
                message: "请输入头像",
                trigger: "blur"
              }]
            },
            {
              label: "答题时长",
              prop: "duration",
              span: 24,
              rules: [{
                required: false,
                message: "请输入答题时长",
                trigger: "blur"
              }]
            },
            {
              label: "本次得分",
              prop: "scores",
              span: 24,
              rules: [{
                required: true,
                message: "请输入本次得分",
                trigger: "blur"
              }]
            },
            {
              label: "答对题数",
              prop: "correct",
              span: 24,
              rules: [{
                required: false,
                message: "请输入答对题数",
                trigger: "blur"
              }]
            },
            {
              label: "答错题数",
              prop: "wrong",
              span: 24,
              rules: [{
                required: false,
                message: "请输入答错题数",
                trigger: "blur"
              }]
            },
            {
              label: "总题数",
              prop: "total",
              span: 24,
              rules: [{
                required: false,
                message: "请输入总题数",
                trigger: "blur"
              }]
            },
            {
              label: "正确率",
              prop: "accuracy",
              span: 24,
              rules: [{
                required: false,
                message: "请输入正确率",
                trigger: "blur"
              }]
            },
            {
              label: "考试时间",
              prop: "recordTime",
              span: 24,
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              rules: [{
                required: true,
                message: "请输入考试时间",
                trigger: "blur"
              }]
            },
            {
              label: "到期时间",
              prop: "expirTime",
              span: 24,
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              rules: [{
                required: true,
                message: "请输入到期时间",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "rmks",
              hide: true,
              span: 24,
              rules: [{
                required: false,
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
          addBtn: this.vaildData(this.permission.quesanswerstat_add, false),
          viewBtn: this.vaildData(this.permission.quesanswerstat_view, false),
          delBtn: this.vaildData(this.permission.quesanswerstat_delete, false),
          editBtn: this.vaildData(this.permission.quesanswerstat_edit, false)
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
      handleExport() {
        this.$confirm("确定将选择数据导出?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            window.open(`/api/blade-ques/quesanswerstat/export?${this.website.tokenHeader}=${getToken()}&ids=`+this.ids);
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

          for (let item of this.data) {
              item.accuracy = item.accuracy+"%"
          }
        });
      }
    }
  };
</script>

<style>
</style>
