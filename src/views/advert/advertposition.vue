<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               @cell-click="pageto"
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
                   v-if="permission.advertposition_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{type,size,row}" slot="menu">
        <el-button icon="el-icon-edit" :size="size" :type="type" @click="adInfoBtn(row)">编辑广告信息</el-button>
      </template>
      <template slot-scope="{row}"
                slot="cd">
        <el-tag>{{row.nm}}</el-tag>
      </template>
      <template slot-scope="{row}"
                slot="cd">
        <el-tag>{{row.nm}}</el-tag>
      </template>
    </avue-crud>
    <el-dialog title="广告信息" :close-on-click-modal="false" :visible.sync="infoShow" append-to-body width="80%">
      <ad-info :positionId="posId"></ad-info>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/advert/advertposition";
  import {mapGetters} from "vuex";
  import adInfo from "./advertinfo2"

  export default {
    data() {
      return {
        infoShow: false,
        form: {},
        posId: '',
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
          dialogWidth: '30%',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          // viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "广告位置",
              prop: "cd",
              type: "select",
              search: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=ADPOS",
              props: {
                  label: "dictValue",
                  value: "dictKey"
              },
              dataType: "string",
              slot: true,
              labelWidth: 150,
              span: 24,
              rules: [{
                required: true,
                message: "请输入广告位置编码",
                trigger: "blur"
              }]
            },
            // {
            //   label: "位置名称",
            //   prop: "nm",
            //   rules: [{
            //     required: true,
            //     message: "请输入位置名称",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "广告图片宽度（px）",
              prop: "width",
              labelWidth: 150,
              span: 24,
              type: "number",
              // rules: [{
              //   required: true,
              //   message: "请输入广告图片规格宽度（px）",
              //   trigger: "blur"
              // }]
            },
            {
              label: "广告图片高度（px）",
              prop: "height",
              labelWidth: 150,
              span: 24,
              type: "number",
              // rules: [{
              //   required: true,
              //   message: "请输入广告图片规格高度（px）",
              //   trigger: "blur"
              // }]
            },
            {
              label: "图片限制大小（KB）",
              prop: "imgSize",
              labelWidth: 150,
              span: 24,
              type: "number",
              // rules: [{
              //   required: true,
              //   message: "请输入图片上传限制大小，单位KB",
              //   trigger: "blur"
              // }]
            },
            // {
            //   label: "排序",
            //   prop: "seq",
            //   labelWidth: 150,
            //   type: "number",
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
          addBtn: this.vaildData(this.permission.advertposition_add, false),
          viewBtn: this.vaildData(this.permission.advertposition_view, false),
          delBtn: this.vaildData(this.permission.advertposition_delete, false),
          editBtn: this.vaildData(this.permission.advertposition_edit, false)
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
      adInfo
    },
    methods: {
      adInfoBtn(row){
        this.infoShow = true
        this.posId = row.id
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
