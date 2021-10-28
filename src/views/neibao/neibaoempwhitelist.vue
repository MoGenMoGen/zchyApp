<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               :search.sync="search"
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
                   v-if="permission.neibaoempwhitelist_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="personNameSearch" slot-scope="{disabled,size}">
        <el-input placeholder="人员" v-model="search.personName" clearable></el-input>
      </template>
    </avue-crud>
    <el-dialog title="选择人员" :visible.sync="dialogVisible" width="65%" append-to-body>
      <emp @personSelected="selectPerson"></emp>
    </el-dialog>
  </basic-container>
</template>

<script>
import {getList, getDetail, add, update, remove} from "@/api/neibao/neibaoempwhitelist";
import {mapGetters} from "vuex";
import emp from "../../components/emp/emp";

export default {
  data() {
    return {
      form: {},
      search: {},
      query: {},
      loading: true,
      dialogVisible: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
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
          //   label: "人员",
          //   prop: "personId",
          //   type: "select",
          //   span: 24,
          //   filterable: "true",
          //   searchFilterable: "true",
          //   dicUrl: "/api/blade-emp/empemployee/tlistAll",
          //   dataType: "string",
          //   props: {
          //     label: "name",
          //     desc: "deptNm",
          //     value: "personId"
          //   },
          //   search: true,
          //   rules: [{
          //     required: false,
          //     message: "请选择人员",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "人员",
            prop: "personName",
            span: 24,
            search: true,
            click: () => {
              this.dialogVisible = true
            },
            rules: [{
              required: false,
              message: "请选择人员",
              trigger: "blur"
            }]
          },
          {
            label: "备注",
            prop: "rmks",
            span: 24,
            search: true,
            type: "textarea",
            overHidden: true,
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
        addBtn: this.vaildData(this.permission.neibaoempwhitelist_add, false),
        viewBtn: this.vaildData(this.permission.neibaoempwhitelist_view, false),
        delBtn: this.vaildData(this.permission.neibaoempwhitelist_delete, false),
        editBtn: this.vaildData(this.permission.neibaoempwhitelist_edit, false)
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
      this.form.personId = row.personId
      this.form.personName = row.name
      this.dialogVisible = false
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
