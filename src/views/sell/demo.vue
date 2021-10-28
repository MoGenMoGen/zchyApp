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
                   v-if="permission.demo_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="newsType">
        <el-tag>{{row.$newsType}}</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/sell/demo";
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
          "headerAlign": "center",
          "align": "center",
          "height": "auto",
          "calcHeight": 30,
          "tip": true,
          columnBtn: false,
          "searchShow": true,
          "searchMenuSpan": 6,
          "border": true,
          "index": true,
          "viewBtn": true,
          "selection": true,
          "excelBtn": true,
          "dialogClickModal": false,
          delBtn: false,
          defaultSort: {prop: 'nm', order: 'ascending'},//ascending descending
          "column": [
            {
              "label": "主要内容",
              "children": [
                {
                  "label": "名称",
                  "prop": "nm",
                  type: "input",
                  "rules": [
                    {
                      "required": true,
                      "message": "请输入名称",
                      "trigger": "blur"
                    }
                  ]
                },
                {
                  "label": "内容",
                  "prop": "cont",
                  "span": 24,
                  "minRows": 6,
                  "type": "textarea",
                  "showOverflowTooltip": false,
                  overHidden: true,
                  "rules": [
                    {
                      "required": true,
                      "message": "请输入名称",
                      "trigger": "blur"
                    }
                  ]
                }
              ]
            },
            {
              "label": "类型",
              "type": "select",
              "dataType": "number",
              "slot": false,
              "prop": "type",
              "search": true,
              "dicData": [
                {
                  "label": "热门",
                  "value": 1
                },
                {
                  "label": "今日头条",
                  "value": 2
                }
              ],
              "clearable": true,
              "filterable": true
            },
            {
              "label": "新闻类型",
              "type": "select",
              dicFlag: true,
              "dicUrl": "/api/blade-system/dict/dictionary?code=notice",
              "props": {
                "label": "dictValue",
                "value": "dictKey"
              },
              "dataType": "number",
              "slot": true,
              prop: "newsType",
              "search": true,
              "rules": [
                {
                  "required": true,
                  "message": "请输入通知类型",
                  "trigger": "blur"
                }
              ],
              "dicMethod": "get"
            },
            {
              "label": "发布时间",
              "prop": "sendTime",
              "type": "date",
              "format": "yyyy-MM-dd HH:mm:ss",
              "valueFormat": "yyyy-MM-dd HH:mm:ss",
              "searchRange": true,
              "addDisplay": true,
              "editDisplay": true,
              "viewDisplay": true,
              "search": true,
              "rules": [
                {
                  "required": true,
                  "message": "请输入发布时间",
                  "trigger": "blur"
                }
              ]
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
          addBtn: this.vaildData(this.permission.demo_add, false),
          viewBtn: this.vaildData(this.permission.demo_view, false),
          delBtn: this.vaildData(this.permission.demo_delete, false),
          editBtn: this.vaildData(this.permission.demo_edit, false)
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
