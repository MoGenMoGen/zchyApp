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
                   v-if="permission.quesexpirydateconfig_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>

      <template slot="states" slot-scope="scope">
        <el-tag v-if="scope.row.states === 1 " type="success">启用</el-tag>
        <el-tag v-else type="info">禁用</el-tag>
      </template>

      <template slot="expiryDay" slot-scope="scope">
        {{ scope.row.expiryDay === 0 ? '' : scope.row.expiryDay }}
      </template>


    </avue-crud>
  </basic-container>
</template>

<script>
import {getList, getDetail, add, update, remove} from "@/api/ques/quesexpirydateconfig";
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
        height: 'auto',
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        align: "center",
        dialogClickModal: false,
        column: [
          {
            label: "模式",
            prop: "mode",
            type: "select",
            span: 24,
            labelWidth: 120,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=EXPIRY_MODE",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            dataType: "number",
            rules: [{
              required: true,
              message: "请选中模式",
              trigger: "blur"
            }]
          },
          {
            label: "延长有效天数",
            prop: "expiryDay",
            type: "number",
            value: 0,
            slot: true,
            span: 24,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            labelWidth: 120,
            rules: [{
              required: true,
              message: "请输入延长有效天数",
              trigger: "blur"
            }]
          },
          {
            label: "延长有效期至",
            prop: "expiryTime",
            type: "datetime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            span: 24,
            labelWidth: 120,
            addDisplay: true,
            editDisplay: true,
            viewDisplay: true,
            rules: [{
              required: true,
              message: "请输入有效期截止日期",
              trigger: "blur"
            }]
          },
          {
            label: "状态",
            prop: "states",
            type: "radio",
            value: 0,
            labelWidth: 120,
            dicData: [
              {
                label: "禁用",
                value: 0
              },
              {
                label: "启用",
                value: 1
              }
            ],
            slot: true,
            span: 24,
            rules: [{
              required: true,
              message: "请输入状态[0：禁用，1：启用]",
              trigger: "blur"
            }]
          },
          {
            label: "门禁权限",
            prop: "permissions",
            type: "select",
            dataType: "string",
            dicUrl: "/api/blade-emp/acsdoor/list",
            props: {
              label: "doorName",
              value: "doorIndexCode"
            },
            span: 24,
            labelWidth: 120,
            filterable: true,
            // drag: true,
            multiple: true,
            rules: [{
              required: true,
              message: "请选择门禁权限",
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
        addBtn: this.vaildData(this.permission.quesexpirydateconfig_add, false),
        viewBtn: this.vaildData(this.permission.quesexpirydateconfig_view, false),
        delBtn: this.vaildData(this.permission.quesexpirydateconfig_delete, false),
        editBtn: this.vaildData(this.permission.quesexpirydateconfig_edit, false)
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
  watch: {
    'form.mode': {
      handler(val) {
        let expiryDay = this.findObject(this.option.column, 'expiryDay')
        let expiryTime = this.findObject(this.option.column, 'expiryTime')
        if (val === 1) {
          expiryDay.addDisplay = true
          expiryDay.editDisplay = true
          expiryDay.viewDisplay = true
          expiryTime.addDisplay = false
          expiryTime.editDisplay = false
          expiryTime.viewDisplay = false
        } else if (val === 2) {
          expiryDay.addDisplay = false
          expiryDay.editDisplay = false
          expiryDay.viewDisplay = false
          expiryTime.addDisplay = true
          expiryTime.editDisplay = true
          expiryTime.viewDisplay = true
        }
      },
      immediate: true
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
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
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
