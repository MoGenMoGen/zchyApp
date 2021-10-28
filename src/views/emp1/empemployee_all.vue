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
      <!--<template slot="menuLeft">-->
        <!--&lt;!&ndash;<el-button type="success"&ndash;&gt;-->
                   <!--&lt;!&ndash;size="small"&ndash;&gt;-->
                   <!--&lt;!&ndash;plain&ndash;&gt;-->
                   <!--&lt;!&ndash;icon="el-icon-upload2"&ndash;&gt;-->
                   <!--&lt;!&ndash;@click="handleImport">导入&ndash;&gt;-->
        <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;        <el-button type="warning"&ndash;&gt;-->
        <!--&lt;!&ndash;                   size="small"&ndash;&gt;-->
        <!--&lt;!&ndash;                   plain&ndash;&gt;-->
        <!--&lt;!&ndash;                   icon="el-icon-download"&ndash;&gt;-->
        <!--&lt;!&ndash;                   @click="handleExport">导出&ndash;&gt;-->
        <!--&lt;!&ndash;        </el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-button type="danger"&ndash;&gt;-->
                   <!--&lt;!&ndash;size="small"&ndash;&gt;-->
                   <!--&lt;!&ndash;icon="el-icon-delete"&ndash;&gt;-->
                   <!--&lt;!&ndash;plain&ndash;&gt;-->
                   <!--&lt;!&ndash;v-if="permission.empemployee_delete"&ndash;&gt;-->
                   <!--&lt;!&ndash;@click="handleDelete">删 除&ndash;&gt;-->
        <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-button type="primary"&ndash;&gt;-->
                   <!--&lt;!&ndash;size="small"&ndash;&gt;-->
                   <!--&lt;!&ndash;icon="el-icon-s-check"&ndash;&gt;-->
                   <!--&lt;!&ndash;plain&ndash;&gt;-->
                   <!--&lt;!&ndash;@click="openDialog()">批量审核&ndash;&gt;-->
        <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-button type="primary"&ndash;&gt;-->
                   <!--&lt;!&ndash;size="small"&ndash;&gt;-->
                   <!--&lt;!&ndash;icon="el-icon-s-check"&ndash;&gt;-->
                   <!--&lt;!&ndash;plain&ndash;&gt;-->
                   <!--&lt;!&ndash;@click="openDialog2()">批量下发权限&ndash;&gt;-->
        <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-button type="primary"&ndash;&gt;-->
                   <!--&lt;!&ndash;size="small"&ndash;&gt;-->
                   <!--&lt;!&ndash;icon="el-icon-s-check"&ndash;&gt;-->
                   <!--&lt;!&ndash;plain&ndash;&gt;-->
                   <!--&lt;!&ndash;@click="getStatusAll(1)">批量入职&ndash;&gt;-->
        <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;        <el-button type="primary"&ndash;&gt;-->
        <!--&lt;!&ndash;                   size="small"&ndash;&gt;-->
        <!--&lt;!&ndash;                   icon="el-icon-s-check"&ndash;&gt;-->
        <!--&lt;!&ndash;                   plain&ndash;&gt;-->
        <!--&lt;!&ndash;                   @click="getTest()">测试路由&ndash;&gt;-->
        <!--&lt;!&ndash;        </el-button>&ndash;&gt;-->

        <!--&lt;!&ndash;        v-if="userInfo.role_name.includes('admin')"&ndash;&gt;-->
        <!--&lt;!&ndash;        <el-button type="primary" @click="handleExcel">导出excel</el-button>&ndash;&gt;-->
      <!--</template>-->
      <!--<template slot="menu" slot-scope="{row}">-->
        <!--&lt;!&ndash;        v-show="row.audit !== 2"&ndash;&gt;-->
                <!--<el-button icon="el-icon-check" size="mini" type="text" @click="getStatus(row,1)" v-show="row.state === 2">入职</el-button>-->
        <!--<el-button icon="el-icon-close" size="mini" type="text" @click="getStatus(row,2)" v-show="row.state === 1">离职-->
        <!--</el-button>-->
        <!--<el-button icon="el-icon-s-check" size="mini" type="text" @click="openDialog1(row)" v-show=" row.audit!==2">审核-->
        <!--</el-button>-->
      <!--</template>-->

      <!--        1.审批中,2.已通过,3.已驳回,4.已取消-->
      <template slot="audit" slot-scope="scope">
        <el-tag v-if="scope.row.audit === 1 " type="warning">审批中</el-tag>
        <el-tag v-else-if="scope.row.audit === 2 " type="success">已通过</el-tag>
        <el-tag v-else-if="scope.row.audit === 3 " type="danger">已驳回</el-tag>
        <el-tag v-else type="info">已取消</el-tag>
      </template>

      <!--      1 内部员工 2 外部员工-->
      <template slot="types" slot-scope="scope">
        <el-tag v-if="scope.row.types === 1 " type="primary">内部员工</el-tag>
        <el-tag v-else type="warning">外部员工</el-tag>
      </template>
      <!--      1 在职 2 离职-->
      <template slot="state" slot-scope="scope">
        <el-tag v-if="scope.row.state === 1 " type="primary">在职</el-tag>
        <el-tag v-else-if="scope.row.state === 3 " type="warning">待定</el-tag>
        <el-tag v-else type="danger">离职</el-tag>
      </template>


    </avue-crud>
  </basic-container>
</template>

<script>
import {add, audit, getDetail, getList, remove, state, update} from "@/api/emp/empemployee";
// import {getRoleTree} from "@/api/system/role";
// import { getDeptLazyTree} from "@/api/system/dept";  // 延迟加载
import {mapGetters} from "vuex";
// import website from '@/config/website';
import {getToken} from '@/util/auth';
import request from '@/router/axios'
import {cardid, isvalidatemobile} from "@/util/validate";

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]));
      } else {
        callback();
      }
    };
    // const validateIdcard = (rule, value, callback) => {
    //   if (cardid(value)[0]) {
    //     callback(new Error(cardid(value)[1]));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      form: {},
      loading: true,
      dialogVisible: false, // 批量审核
      dialogVisible1: false, // 审核界面
      dialogVisible2: false, // 批量下发权限
      auditInfo: {},
      info: { // 审核时使用
        options: ""
        // validityTm: ""
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      excelBox: false,
      excelForm: {},
      excelOption: {
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: '模板上传',
            prop: 'excelFile',
            type: 'upload',
            drag: true,
            loadText: '模板上传中，请稍等',
            span: 24,
            // accept:"xls/xlsx",
            propsHttp: {
              res: 'data'
            },
            tip: '请上传 .xls,.xlsx 标准格式文件',
            // action: "/api/blade-user/import-user"
            action: "/api/blade-emp/empemployee/import-empemployee"
          },
          {
            label: "数据覆盖",
            prop: "isCovered",
            type: "switch",
            align: "center",
            width: 80,
            dicData: [
              {
                label: "否",
                value: 0
              },
              {
                label: "是",
                value: 1
              }
            ],
            value: 0,
            slot: true,
            rules: [
              {
                required: true,
                message: "请选择是否覆盖",
                trigger: "blur"
              }
            ]
          },
          {
            label: '模板下载',
            prop: 'excelTemplate',
            formslot: true,
            span: 24,
          }
        ]
      },
      permissionForm: {},
      permissionOption: {
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: '权限列表',
            prop: 'id',
            type: 'select',
            dicUrl: "/api/blade-emp/acsdoor/list",
            props: {
              label: "doorName",
              value: "doorIndexCode"
            },
            span: 24,
            filterable: true,
            // drag: true,
            multiple: true,
            // loadText: '模板上传中，请稍等',
          },
        ]
      },
      option: {
        addBtn: false,
        menu: false,
        height: 'auto',
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        searchSpan: 3,
        border: true,
        index: true,
        viewBtn: false,
        selection: false,
        excelBtn: false,
        dialogClickModal: false,
        align: "center",
        title: '内部员工管理导出',
        column: [
          {
            label: "工号",
            prop: "cd",
            hide: true,
            span: 24,
            rules: [{
              required: false,
              message: "请输入编号",
              trigger: "blur"
            }]
          },
          {
            label: "人脸图片",
            prop: "faceUrl",
            type: "upload",
            dataType: "string",
            listType: "picture-img",
            tip: "图片规格说明",
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            action: "/api/blade-resource/oss/endpoint/put-face",
            hide: true,
            span: 24,
            rules: [{
              required: false,
              message: "人脸图片",
              trigger: "blur"
            }]
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
            label: "所在区域",
            prop: "region",
            search: false,
            span: 12,
            dicData: [
              {
                label: "装置区",
                value: 1
              }
            ],
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
            label: "部门",
            prop: "deptId",
            type: "tree",
            hide: true,
            dicUrl: "/api/blade-system/dept/tree",
            dicMethod: 'get',
            dicData: [],
            viewDisplay: false,
            props: {
              label: "title",
              value: "id"
            },
            // 延迟加载后期处理
            // nodeKey: 'deptId',
            // lazy: true,
            // treeLoad: function (node, resolve) {
            //     const parentId = (node.level === 0) ? 0 : node.data.id;
            //     getDeptLazyTree(parentId).then(res => {
            //         resolve(res.data.data.map(item => {
            //             return {
            //                 ...item,
            //                 leaf: !item.hasChildren
            //             }
            //         }))
            //     });
            // },
            // props: {
            //     labelText: '标题',
            //     label: 'title',
            //     value: 'value',
            //     children: 'children'
            // },
            size: 'small',
            // slot: true,
            search: true,
            span: 12,
            rules: [{
              required: true,
              message: "请输入部门ID",
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
            label: "班别",
            prop: "classId",
            type: "select",
            span: 12,
            hide: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            display: false,
            value: 0,
            rules: [{
              required: false,
              message: "请输入班别ID",
              trigger: "blur"
            }]
          },
          {
            label: "班别",
            prop: "classNm",
            hide: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            display: false,
            rules: [{
              required: false,
              message: "请输入班别",
              trigger: "blur"
            }]
          },
          {
            label: "工种",
            prop: "workType",
            type: "select",
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=WORK_TYPE",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            dataType: "number",
            span: 12,
            hide: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            display: false,
            rules: [{
              required: false,
              message: "请输入工种",
              trigger: "blur"
            }]
          },
          {
            label: "手机号",
            prop: "mob",
            search: true,
            span: 12,
            rules: [{
              required: true,
              validator: validatePhone,
              message: "请输入正确的手机号",
              trigger: "blur"
            }]
          },
          {
            label: "员工类型",
            prop: "types",
            type: "radio",
            // search: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            span: 12,
            slot: true,
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
            label: "身份证",
            prop: "idcardUrl",
            type: "upload",
            dataType: "string",
            listType: "picture-img",
            tip: "图片规格说明",
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            action: "/api/blade-resource/oss/endpoint/put-file",
            hide: true,
            span: 12,
            rules: [{
              required: false,
              message: "请输入身份证(正面)",
              trigger: "blur"
            }]
          },
          {
            label: "工作证照片",
            prop: "empCardUrl",
            type: "upload",
            dataType: "string",
            listType: "picture-img",
            tip: "图片规格说明",
            hide: true,
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            action: "/api/blade-resource/oss/endpoint/put-file",
            span: 12,
            rules: [{
              required: false,
              message: "请输入工作证照片",
              trigger: "blur"
            }]
          },
          {
            label: "备注",
            prop: "rmks",
            span: 24,
            hide: true,
            rules: [{
              required: false,
              message: "请输入备注",
              trigger: "blur"
            }]
          }
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
  methods: {
    // getTest(){
    //   let route ={
    //     path: '/emp/test',
    //     component: () => import(`@/views/emp/test`),
    //     name: '/emp/test',
    //     // meta: {
    //     //     ...window.SITE_CONFIG['contentTabDefault'],
    //     //     menuId: this.$route.meta.menuId,
    //     //     title: `${this.$route.meta.title} - ${row.nm}`
    //     // }
    //   }
    //   console.log(this.$router)
    //   console.log(this)
    //   // this.$router.push(route)
    // },
    // 导入操作 待开发
    handleImport() {
      this.excelBox = true;
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
        window.open(`/api/blade-emp/empemployee/export-empemployee?${this.website.tokenHeader}=${getToken()}`);
      });
    },
    handleTemplate() {
      window.open(`/api/blade-emp/empemployee/export-template?${this.website.tokenHeader}=${getToken()}`);
    },
    // 下方权限提交
    permissionSubmit() {
      // console.log(this)
      let ids = this.permissionForm.id

      if (!ids || ids.length == 0) {
        this.$message.warning("请选择至少一条权限数据");
        return;
      }
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
      params.region = 1;
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
