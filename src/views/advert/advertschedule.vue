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
                   v-if="permission.advertschedule_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="shelvesStatus" slot-scope="scope">
        <el-tag v-if="scope.row.shelvesStatus === 1" size="small">上架</el-tag>
        <el-tag v-if="scope.row.shelvesStatus === 0" size="small" type="danger">下架</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove, getInfoList} from "@/api/advert/advertschedule";
  import {mapGetters} from "vuex";

  // var DIC = {
  //     shelves: [ {
  //         label: '上架',
  //         value: 1
  //     },{
  //         label: '下架',
  //         value: 0
  //     }]
  // }

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
          dialogWidth: "30%",
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          addBtn: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "广告名称",
              prop: "advertId",
              type: "select",
              span :24,
              search: true,
              dicData: [],
              showColumn: false,
              props: {
                label: "nm",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请选择广告名称",
                trigger: "blur"
              }]
            },
            {
              label: "广告名称",
              prop: "adInfoNm",
              span: 24,
              addDisplay:false,
              editDisplay:false
            },
            {
              label: "开始时间",
              prop: "vldFrTm",
              span: 24,
              type: "datetime",
              format: 'yyyy-MM-dd HH:mm:ss',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
              rules: [{
                required: true,
                message: "请输入开始时间",
                trigger: "blur"
              }]
            },
            {
              label: "结束时间",
              prop: "vldToTm",
              span: 24,
              type: "datetime",
              format: 'yyyy-MM-dd HH:mm:ss',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
              rules: [{
                required: true,
                message: "请输入结束时间",
                trigger: "blur"
              }]
            },
            // {
            //   label: "上架状态",
            //   prop: "shelvesStatus",
            //   type: "radio",
            //   dicData: DIC.shelves,
            //   mock:{
            //     type:'dic'
            //   },
            //   slot:true,
            //   search: true,
            //   rules: [{
            //     required: true,
            //     message: "请选择是否上架",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "排序",
              // prop: "seq",
              // type: "number",
              // rules: [{
              //   required: true,
              //   message: "请输入排序",
              //   trigger: "blur"
              // }]
            // },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.advertschedule_add, false),
          viewBtn: this.vaildData(this.permission.advertschedule_view, false),
          delBtn: this.vaildData(this.permission.advertschedule_delete, false),
          editBtn: this.vaildData(this.permission.advertschedule_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
    },
    mounted() {
      this.listAdInfo()
    },
    methods: {
      listAdInfo() {
        getInfoList().then(res => {
          const column = this.findObject(this.option.column, "advertId");
          column.dicData = res.data.data.records;
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
        if (["add", "edit"].includes(type)) {
          this.listAdInfo();
        }
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
