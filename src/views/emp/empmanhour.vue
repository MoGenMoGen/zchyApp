<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               :search.sync="search"
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
                   v-if="permission.empmanhour_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="empNmSearch" slot-scope="{disabled,size}">
        <el-input placeholder="员工" v-model="search.empNm" clearable></el-input>
      </template>
      <template slot="menuLeft">
        <el-button type="primary"
                   size="small"
                   plain
                   icon="el-icon-download"
                   v-if="permission.empmanhour_delete"
                   @click="handleExport">导出
        </el-button>
      </template>
      <template slot="menuLeft">
        <el-tag type="success" v-if="sum">当前页面所有记录的总工时：{{sum.toFixed(2)}}小时</el-tag>
      </template>
    </avue-crud>
    <el-dialog title="选择员工" :visible.sync="dialogVisible" width="65%" append-to-body>
      <emp @personSelected="selectPerson"></emp>
    </el-dialog>
  </basic-container>
</template>

<script>
import {getList, getDetail, add, update, remove} from "@/api/emp/empmanhour";
import {mapGetters} from "vuex";
import {getToken} from '@/util/auth';
import emp from "../../components/emp/emp";

export default {
  data() {
    return {
      form: {},
      search:{},
      query: {},
      loading: true,
      dialogVisible: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10,20,30,50,100,300,500,1000]
      },
      selectionList: [],
      sum: '',
      option: {
        height:'auto',
        calcHeight: 30,
        dialogWidth: '35%',
        searchSpan: 4,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        column: [
          // {
          //   label: "用户ID",
          //   prop: "userId",
          //   rules: [{
          //     required: true,
          //     message: "请输入用户ID",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "员工",
          //   prop: "empId",
          //   type: "select",
          //   span: 24,
          //   filterable: true,
          //   searchFilterable: "true",
          //   dicUrl: "/api/blade-emp/empemployee/tlist",
          //   dataType: "string",
          //   search: true,
          //   props: {
          //     label: "name",
          //     desc: "deptNm",
          //     value: "id"
          //   },
          //   rules: [{
          //     required: true,
          //     message: "请输入员工",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "员工",
            prop: "empNm",
            span: 24,
            search: true,
            searchslot: true,
            click: () => {
              this.dialogVisible = true
            },
            rules: [{
              required: true,
              trigger: "click"
            }]
          },
          {
            label: "员工类型",
            prop: "empType",
            type: "radio",
            search: true,
            value: 1,
            addDisplay: false,
            editDisplay: false,
            span: 12,
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
          {
            label: "单位/部门",
            prop: "deptIds",
            type: "cascader",
            span: 24,
            filterable: true,
            searchFilterable: "true",
            dicUrl: "/api/blade-system/dept/tree",
            dataType: "string",
            search: true,
            props: {
              label: "title",
              value: "id"
            },
            rules: [{
              required: true,
              message: "请输入单位/部门",
              trigger: "blur"
            }]
          },
          // {
          //   label: "员工姓名",
          //   prop: "empNm",
          //   rules: [{
          //     required: true,
          //     message: "请输入员工姓名",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "工作日期",
            prop: "workDt",
            span: 24,
            searchSpan: 8,
            type: "date",
            format:'yyyy-MM-dd',
            valueFormat:'yyyy-MM-dd',
            searchRange: true, //搜索时为日期时间区间
            search: true,      //开启搜索
            rules: [{
              required: true,
              message: "请输入工作日期",
              trigger: "blur"
            }]
          },
          {
            label: "有无工时",
            prop: "hasManHour",
            type: "select",
            display: false,
            hide: true,
            search: true,
            dicData: [
              {
                label: "工时为0",
                value: 0
              },
              {
                label: "工时不为0",
                value: 1
              }
            ],
          },
          {
            label: "净工时",
            prop: "manHour",
            span: 24,
            type: "number",
          },
          {
            label: "备注",
            prop: "rmks",
            type: "textarea",
            overHidden: true,
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
        addBtn: this.vaildData(this.permission.empmanhour_add, false),
        viewBtn: this.vaildData(this.permission.empmanhour_view, false),
        delBtn: this.vaildData(this.permission.empmanhour_delete, false),
        editBtn: this.vaildData(this.permission.empmanhour_edit, false)
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
  components: {emp},
  methods: {
    selectPerson(row) {
      this.form.empId = row.id
      this.form.empNm = row.name
      this.dialogVisible = false
    },
    handleExport(params = {}) {
      let assign = Object.assign(params, this.query);
      let str = JSON.stringify(assign)
      str = str.substring(1, str.length-1)
      this.$confirm("是否导出员工数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        window.open(`/api/blade-emp/empmanhour/exportEmpManHour?${this.website.tokenHeader}=${getToken()}&p=`+str+`&ids=`+this.ids);
      });
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
      const {workDt} = this.query;
      this.loading = true;
      let values = {
        ...params,
        ...this.query
      }
      if (workDt) {
        values = {
          ...params,
          workDt_ge: workDt[0],
          workDt_le: workDt[1],
          ...this.query
        }
      }
      values.workDt = null;
      this.query.workDt = null;
      console.log(values)
      getList(page.currentPage, page.pageSize, Object.assign(params, values)).then(res => {
        const data = res.data.data;
        this.page.total = data.pages.total;
        this.data = data.pages.records;
        this.sum = data.sum
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style>
</style>
