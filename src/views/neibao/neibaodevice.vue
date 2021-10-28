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
                   v-if="permission.neibaodevice_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {getList, getDetail, add, update, remove} from "@/api/neibao/neibaodevice";
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
          {
            label: "设备",
            prop: "id",
            span: 24,
            type: 'select',
            dicUrl: "/api/blade-neibao/neibaodevice/allList",
            props: {
              label: "name",
              value: "id"
            },
            dataType: "string",
            filterable: true,
            rules: [{
              required: true,
              message: "请输入门禁设备",
              trigger: "blur"
            }]
          },
          {
            label: "设备类型",
            prop: "sblx",
            span: 24,
            type: "select",
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=SBLX",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            dataType: "string",
            rules: [{
              required: true,
              message: "请输入设备类型",
              trigger: "blur"
            }]
          },
          {
            label: "设备编码",
            prop: "sbbm",
            span: 24,
            addDisplay: false,
            editDisplay: false,
            hide: true,
            rules: [{
              required: true,
              message: "请输入设备编码",
              trigger: "blur"
            }]
          },
          {
            label: "设备安装部位",
            prop: "sbazbw",
            span: 24,
            type: "select",
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=SBAZBW",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            dataType: "string",
            rules: [{
              required: true,
              message: "请输入设备安装部位",
              trigger: "blur"
            }]
          },
          {
            label: "实际单位名称",
            prop: "xqmc",
            span: 24,
            addDisplay: false,
            editDisplay: false,
            rules: [{
              required: true,
              message: "请输入实际单位名称",
              trigger: "blur"
            }]
          },
          {
            label: "单位编码",
            prop: "ssxqbm",
            span: 24,
            addDisplay: false,
            editDisplay: false,
            rules: [{
              required: true,
              message: "请输入单位编码",
              trigger: "blur"
            }]
          },
          {
            label: "所属单位名称",
            prop: "ssxqmc",
            span: 24,
            addDisplay: false,
            editDisplay: false,
            rules: [{
              required: true,
              message: "请输入所属单位名称",
              trigger: "blur"
            }]
          },
          {
            label: "具体地址",
            prop: "jtdz",
            span: 24,
            addDisplay: false,
            editDisplay: false,
            rules: [{
              required: true,
              message: "请输入具体地址",
              trigger: "blur"
            }]
          },
          {
            label: "纬度",
            prop: "latitude",
            span: 24,
            addDisplay: false,
            editDisplay: false,
            rules: [{
              required: true,
              message: "请输入纬度",
              trigger: "blur"
            }]
          },
          {
            label: "经度",
            prop: "longitude",
            span: 24,
            addDisplay: false,
            editDisplay: false,
            rules: [{
              required: true,
              message: "请输入经度",
              trigger: "blur"
            }]
          },
          {
            label: "行政区划代码",
            prop: "xzqhdm",
            span: 24,
            addDisplay: false,
            editDisplay: false,
            rules: [{
              required: true,
              message: "请输入行政区划代码",
              trigger: "blur"
            }]
          },
          {
            label: "运营商代码",
            prop: "yysdm",
            span: 24,
            addDisplay: false,
            editDisplay: false,
            rules: [{
              required: true,
              message: "请输入运营商代码",
              trigger: "blur"
            }]
          },
          {
            label: "平台厂商名称",
            prop: "csmc",
            span: 24,
            addDisplay: false,
            editDisplay: false,
            rules: [{
              required: true,
              message: "请输入平台厂商名称",
              trigger: "blur"
            }]
          },
          {
            label: "设备朝向",
            prop: "sbcx",
            span: 24,
            type: "select",
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=SBCX",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            dataType: "string",
            rules: [{
              required: false,
              message: "设备朝向",
              trigger: "blur"
            }]
          },
          {
            label: "场所类型",
            prop: "cslx",
            span: 24,
            type: "select",
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=CSLX",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            dataType: "string",
            addDisplay: false,
            editDisplay: false,
            rules: [{
              required: false,
              message: "请输入场所类型",
              trigger: "blur"
            }]
          },
          // {
          //   label: "备注",
          //   prop: "rmks",
          //   rules: [{
          //     required: true,
          //     message: "请输入备注",
          //     trigger: "blur"
          //   }]
          // }
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.neibaodevice_add, false),
        viewBtn: this.vaildData(this.permission.neibaodevice_view, false),
        delBtn: this.vaildData(this.permission.neibaodevice_delete, false),
        editBtn: this.vaildData(this.permission.neibaodevice_edit, false)
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
      if ((row.sblx == 3 || row.sblx == 4) && !row.sbcx) {
          this.$message({
            type: "warning",
            message: "设备类型为车辆道闸或人脸门禁（道闸）时,设备朝向必填!"
          });
          return;
      } else {
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
      }
    },
    rowUpdate(row, index, done, loading) {
      if ((row.sblx == 3 || row.sblx == 4) && !row.sbcx) {
        this.$message({
          type: "warning",
          message: "设备类型为车辆道闸或人脸门禁（道闸）时,设备朝向必填!"
        });
        console.log(done)
        console.log(loading)
        loading();
        return;
      } else {
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
      }
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
