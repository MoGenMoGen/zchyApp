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
               @row-dblclick="rowDblclick"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
    </avue-crud>
  </basic-container>
</template>

<script>
import {add, audit, getDetail, getList, remove, state, update} from "@/api/emp/empemployee";
import {mapGetters} from "vuex";
import {getToken} from '@/util/auth';
import request from '@/router/axios'
import photo from "../photo"

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      auditInfo: {},
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
        searchSpan: 4,
        border: true,
        index: true,
        addBtn: false,
        viewBtn: true,
        selection: false,
        dialogClickModal: false,
        menu: false,
        align: "center",
        column: [
          {
            label: "人脸图片",
            prop: "faceUrl",
            type: "upload",
            dataType: "string",
            listType: "picture-img",
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            action: "/api/blade-resource/oss/endpoint/put-face",
            hide: false,
            span: 12,
            rules: [{
              required: false,
              message: "人脸图片",
              trigger: "blur"
            }]
          },
          {
            label: "",
            prop: "photo",
            dataType: "string",
            formslot: true,
            hide: true,
            viewDisplay: false
          },
          {
            label: "姓名",
            prop: "name",
            search: true,
            span: 12,
            rules: [{
              required: true,
              message: "请输入姓名",
              trigger: "blur"
            }]
          },
          {
            label: "工号",
            prop: "cd",
            // hide: true,
            search: true,
            span: 12,
            rules: [{
              required: false,
              message: "请输入编号",
              trigger: "blur"
            }]
          },
          {
            label: "性别",
            prop: "sex",
            type: "radio",
            width: "80",
            span: 12,
            value: 1,
            dicData: [
              {
                label: "男",
                value: 1
              },
              {
                label: "女",
                value: 2
              }
            ],
            rules: [{
              required: false,
              message: "请输入性别(1.男,2.女,0.未知)",
              trigger: "blur"
            }]
          },
          {
            label: "部门名称",
            prop: "deptNm",
            width: "150",
            overHidden: true,
            addDisplay: false,
            editDisplay: false,
            rules: [{
              required: false,
              message: "请输入部门名称",
              trigger: "blur"
            }]
          },
          {
            label: "手机号",
            prop: "mob",
            search: true,
            span: 12
          },
          {
            label: "员工类型",
            prop: "types",
            type: "radio",
            dicData: [
              {
                label: "内部员工",
                value: 1
              },
              {
                label: "外部员工",
                value: 2
              }
            ],
            rules: [{
              required: true,
              message: "请输入类型(1.内部员工,2.外部员工)",
              trigger: "blur"
            }]
          },
        ]
      },
      data: [],
      infos: {} // 改变激活/拉黑-入职/离职时使用
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.empemployee_add, false),
        viewBtn: this.vaildData(this.permission.empemployee_view, false),
        delBtn: this.vaildData(this.permission.empemployee_delete, false),
        editBtn: this.vaildData(this.permission.empemployee_edit, false)
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
    'excelForm.isCovered'() {
      if (this.excelForm.isCovered !== '') {
        const column = this.findObject(this.excelOption.column, "excelFile");
        column.action = `/api/blade-emp/empemployee/import-empemployee?isCovered=${this.excelForm.isCovered}`;
      }
    }
  },
  components: {photo},
  methods: {
    rowDblclick(row) {
      this.$emit('personSelected', row)
    },
    getPhoto(val) {
      this.form.faceUrl = val
    },
    // 导入操作 待开发
    handleImport() {
      this.excelBox = true;
    },
    exportTemplate() {
      window.open(`/api/blade-emp/empemployee/export-template?${this.website.tokenHeader}=${getToken()}`);
    },
    uploadAfter(res, done, loading, column) {
      window.console.log(column);
      this.excelBox = false;
      this.refreshChange();
      done();
    },
    handleExport() {
      this.$confirm("是否导出用户数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        window.open(`/api/blade-emp/empemployee/export?${this.website.tokenHeader}=${getToken()}&ids=` + this.ids);
      }).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.$refs.crud.toggleSelection();
      });
    },
    handleTemplate() {
      window.open(`/api/blade-emp/empemployee/export-template?${this.website.tokenHeader}=${getToken()}`);
    },
    // 下方权限提交
    permissionSubmit() {
      // console.log(this)
      let ids = this.permissionForm.id

      // if (!ids || ids.length == 0) {
      //   this.$message.warning("请选择至少一条权限数据");
      //   return;
      // }
      let orginDate = this.$refs.perm.DIC.id // 下拉框里的原始数据
      let requstData = []
      let selectEmpIds = this.ids;
      orginDate.forEach(item => {
        if (ids.indexOf(item.doorIndexCode) !== -1) {
          requstData.push(item)
        }
      })
      // 发送请求
      request({
        url: '/api/blade-emp/acsdoor/submit',
        method: 'post',
        data: {
          "permEmpIds": selectEmpIds,
          "sendPermList": requstData
        }
      }).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.dialogVisible2 = false
      }, error => {
        window.console.log(error);
        this.onLoad(this.page);
        this.dialogVisible2 = false
      });

    },
    // 改变状态
    getStatus(row, val) {
      this.infos = row;
      this.infos.state = val;
      // console.log(this.info)
      // console.log(val)
      state(this.infos.id, this.infos.state).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        console.log(error);
      });
    },
    getStatusAll(val) {
      let stateType = val
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      console.log(this.ids)
      // console.log(val)
      state(this.ids, stateType).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        console.log(error);
      });
    },
    auditBatch(types) {
      // ids, optinos,  validityTm,auditType
      audit(this.ids, this.info.options, types).then(() => {
        this.getClose();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.$refs.crud.toggleSelection();
      })
    },
    auditItem(types) {
      audit(this.auditInfo.id, this.info.options, types).then(() => {
        this.getClose();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.$refs.crud.toggleSelection();
      })
      this.getClose();
    },
    openDialog() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.dialogVisible = true
    },
    openDialog1(row) {
      this.auditInfo = row;
      // console.log(this.info)
      this.option.detail = true
      // this.info.options.detail=true
      this.dialogVisible1 = true;
    },
    openDialog2() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.dialogVisible2 = true
    },
    getClose() {
      this.dialogVisible1 = false
      this.dialogVisible = false
      this.option.detail = false
    },
    rowSave(row, done, loading) {
      if (Array.isArray(row.permissions)) {
        row.permissions = ''
      }
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
      if (Array.isArray(row.permissions)) {
        row.permissions = ''
      }
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
    // initData(tenantId) {
    //     // console.log(tenantId)
    //     getRoleTree(tenantId).then(res => {
    //         const column = this.findObject(this.option.column, "role");
    //         column.dicData = res.data.data;
    //     });
    // },
    beforeOpen(done, type) {
      // console.log(this.$store.getters.userInfo.tenant_id)
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.query.types = 1;
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.query.types = 1;
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
