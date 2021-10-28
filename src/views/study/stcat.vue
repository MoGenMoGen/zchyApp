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
                   v-if="permission.stcat_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>

      <!--        // (1.图文 2.全文字 3.视频)-->
      <template slot="showType" slot-scope="scope">
        <el-tag v-if="scope.row.showType === 1 " type="primary">图文</el-tag>
        <el-tag v-else-if="scope.row.showType === 2 " type="info">全文字</el-tag>
        <el-tag v-else type="success">视频</el-tag>
      </template>
      <!--      state   (1编辑中；2启用；3禁用。默认为1)-->
      <template slot="state" slot-scope="scope">
        <el-tag v-if="scope.row.state === 1 " type="warning">编辑中</el-tag>
        <el-tag v-else-if="scope.row.state === 2 " type="success">启用</el-tag>
        <el-tag v-else type="danger">禁用</el-tag>
      </template>

    </avue-crud>
  </basic-container>
</template>

<script>
import {getTreeList, getDetail, add, update, remove} from "@/api/study/stcat";
// import {getList, getDetail, add, update, remove, audit} from "@/api/emp/empemployee";
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
        tree: true,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        searchSpan: 4,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        align: "center",
        dialogClickModal: false,
        column: [
          {
            label: "ID",
            prop: "id",
            span: 24,
            align: "left",
            width: 230,
            overHidden: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            rules: [{
              required: false,
              message: "请输入标题",
              trigger: "blur"
            }]
          },
          {
            label: "分类名称",
            prop: "title",
            span: 24,
            overHidden: true,
            search: true,
            rules: [{
              required: true,
              message: "请输入标题",
              trigger: "blur"
            }]
          },

          {
            label: "上级分类",
            prop: "parentId",
            type: "tree",
            hide: true,
            span: 24,
            dicUrl: "/api/blade-study/stcat/treelist",
            dicMethod: "get",
            props: {
              label: "title",
              value: "id"
            },
            dataType: "string",
            // addDisplay: false,
            // editDisplay: false,
            // viewDisplay: false,
            rules: [{
              required: false,
              message: "请输入上级分类ID",
              trigger: "blur"
            }]
          },
          {
            label: "顶级ID",
            prop: "tid",
            hide: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            rules: [{
              required: false,
              message: "请输入顶级ID",
              trigger: "blur"
            }]
          },
          {
            label: "图片",
            prop: "imgUrl",
            type: "upload",
            dataType: "string",
            listType: "picture-card",
            tip: "图片规格说明",
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            action: "/api/blade-resource/oss/endpoint/put-file-attach",
            span: 24,
            rules: [{
              required: false,
              message: "请输入图片",
              trigger: "blur"
            }]
          },
          {
            label: "图片2",
            prop: "imgUrl2",
            hide: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            rules: [{
              required: false,
              message: "请输入图片2",
              trigger: "blur"
            }]
          },
          {
            label: "图标",
            prop: "icon",
            hide: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            rules: [{
              required: false,
              message: "请输入图标",
              trigger: "blur"
            }]
          },
          {
            label: "图标2",
            prop: "icon2",
            hide: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            rules: [{
              required: false,
              message: "请输入图标2",
              trigger: "blur"
            }]
          },
          {
            label: "列表展现方式",
            prop: "showType",
            type: "radio",
            // search: true,
            // searchLabelWidth: 100,
            labelWidth: 100,
            slot: true,
            dicData: [
              {
                label: "图文",
                value: 1
              },
              {
                label: "全文字",
                value: 2
              },
              {
                label: "视频",
                value: 3
              }
            ],
            value: 1,
            span: 12,
            hide: true,
            display: false,
            rules: [{
              required: false,
              message: "请输入列表展现方式(1.图文 2.全文字 3.视频)",
              trigger: "blur"
            }]
          },
          // {
          //   label: "状态",
          //   prop: "state",
          //   type: "radio",
          //   search: true,
          //   slot: true,
          //   dicData: [
          //     {
          //       label: "编辑中",
          //       value: 1
          //     },
          //     {
          //       label: "启用",
          //       value: 2
          //     },
          //     {
          //       label: "禁用",
          //       value: 3
          //     }
          //   ],
          //   span: 12,
          //   value: 1,
          //   rules: [{
          //     required: false,
          //     message: "请输入状态(1编辑中；2启用；3禁用。默认为1)",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "显示位置",
            prop: "showPos",
            type: "checkbox",
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=SHOWPOS",
            dicMethod: 'get',
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            dataType: "string",
            span: 24,
            rules: [{
              required: false,
              message: "请输入显示位置",
              trigger: "blur"
            }]
          },
          {
            label: "排序",
            prop: "seq",
            type: "number",
            value: 1,
            span: 24,
            rules: [{
              required: false,
              message: "请输入排序",
              trigger: "blur"
            }]
          },
          {
            label: "备注",
            prop: "rmks",
            type: "textarea",
            hide: true,
            span: 24,
            rules: [{
              required: false,
              message: "请输入备注",
              trigger: "blur"
            }]
          },
          // 不用的字段
          {
            label: "栏目编码",
            prop: "cd",
            span: 24,
            hide: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            rules: [{
              required: false,
              message: "请输入栏目编码",
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
        addBtn: this.vaildData(this.permission.stcat_add, false),
        viewBtn: this.vaildData(this.permission.stcat_view, false),
        delBtn: this.vaildData(this.permission.stcat_delete, false),
        editBtn: this.vaildData(this.permission.stcat_edit, false)
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
      getTreeList(page.currentPage, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        // this.page.total = data.total;
        // this.data = data.records;
        this.data = data;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style>
</style>
