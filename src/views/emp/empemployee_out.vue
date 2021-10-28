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
        <el-button type="success"
                   size="small"
                   plain
                   icon="el-icon-upload2"
                   @click="handleImport">导入
        </el-button>
        <el-button type="primary"
                   size="small"
                   plain
                   icon="el-icon-download"
                   @click="exportTemplate">模板下载
        </el-button>
        <el-button type="warning"
                  size="small"
                  plain
                  icon="el-icon-download"
                  @click="handleExport">导出
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.empemployee_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-s-check"
                   plain
                   @click="openDialog">批量审核
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-s-check"
                   plain
                   @click="openDialog2()">批量下发权限
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-s-check"
                   plain
                   @click="getStatusAll(1)">批量激活
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-s-check"
                   plain
                   @click="addWhitelist">批量加入白名单
        </el-button>
        <!--        <el-button type="primary" @click="handleExcel">导出excel</el-button>-->
      </template>
      <template slot="menu" slot-scope="{row}">
        <!--        v-show="row.audit !== 2"-->
        <!--        <el-button icon="el-icon-s-check" size="mini" type="text" @click="openDialog1(row)">审核</el-button>-->
        <el-button icon="el-icon-check" size="mini" type="text" @click="getStatus(row,1)" v-show="row.state === 2">激活
        </el-button>
        <el-button icon="el-icon-close" size="mini" type="text" @click="getStatus(row,2)" v-show="row.state === 1">拉黑
        </el-button>
        <el-button icon="el-icon-s-check" size="mini" type="text" @click="openDialog1(row)" v-show=" row.audit!==2">审核
        </el-button>
      </template>

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
        <el-tag v-if="scope.row.state === 1 " type="success">激活</el-tag>
        <el-tag v-if="scope.row.state === 2 " type="danger">拉黑</el-tag>
        <el-tag v-if="scope.row.state === 3 " type="primary">待定</el-tag>
        <el-tag v-if="scope.row.state === 4 " type="warning">已过期</el-tag>
      </template>
      <template slot="photoForm" slot-scope="scope">
        <photo @getImg="getPhoto"></photo>
      </template>

    </avue-crud>
    <el-dialog title="批量员工审核" :visible.sync="dialogVisible" width="45%" append-to-body>
      <el-form :model="info" ref="info" label-width="120px">
        <!--      <el-form :model="info" :rules="dataRule" ref="info" label-width="120px">-->
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="审核意见">
              <el-input v-model="info.options" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="22">-->
          <!--            <el-form-item label="权限有效期">-->
          <!--              <el-date-picker-->
          <!--                v-model="info.validityTm"-->
          <!--                type="datetime"-->
          <!--                style="width: 100%"-->
          <!--                format="yyyy-MM-dd HH:mm:ss"-->
          <!--                placeholder="选择日期时间">-->
          <!--              </el-date-picker>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="22" style="text-align: center">
            <p><font color="red">批量审批，默认A门禁点权限</font></p>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer">
         <el-button type="success" @click="auditBatch(2)">审核通过</el-button>
         <el-button @click="dialogVisible = false">取 消</el-button>
         <el-button type="danger" @click="auditBatch(3)">审核不通过</el-button>
        <!--       <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      </span>
    </el-dialog>

    <el-dialog title="员工审核" :visible.sync="dialogVisible1" width="45%" append-to-body :before-close="getClose">

      <avue-form :option="option" v-model="auditInfo"></avue-form>

      <el-form :model="info" ref="info" label-width="120px">
        <!--      <el-form :model="info" :rules="dataRule" ref="info" label-width="120px">-->
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="审核意见">
              <el-input v-model="info.options" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="22">-->
          <!--            <el-form-item label="权限有效期">-->
          <!--              <el-date-picker-->
          <!--                v-model="info.validityTm"-->
          <!--                type="datetime"-->
          <!--                style="width: 100%"-->
          <!--                format="yyyy-MM-dd HH:mm:ss"-->
          <!--                placeholder="选择日期时间">-->
          <!--              </el-date-picker>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :span="22" style="text-align: center">-->
          <!--            <p> <font color="red">门禁点权限</font> </p>-->
          <!--          </el-col>-->
        </el-row>
      </el-form>


      <span slot="footer">
         <el-button type="success" @click="auditItem(2)">审核通过</el-button>
         <el-button @click="dialogVisible1 = false">取 消</el-button>
         <el-button type="danger" @click="auditItem(3)">审核不通过</el-button>
        <!--       <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      </span>
    </el-dialog>

    <el-dialog title="外部员工数据导入"
               append-to-body
               :visible.sync="excelBox"
               width="555px">
      <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
        <template slot="excelTemplate">
          <el-button type="primary" @click="handleTemplate">
            点击下载<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </template>
      </avue-form>
    </el-dialog>

    <!--    批量分配权限 dialog -->
    <el-dialog title="批量分配权限" :visible.sync="dialogVisible2" width="65%" append-to-body>

      <avue-form :option="permissionOption" v-model="permissionForm" ref="perm"></avue-form>

      <span slot="footer">
         <el-button type="success" @click="permissionSubmit">下发权限</el-button>
        <!--        @click=""-->
         <el-button @click="dialogVisible2 = false">取 消</el-button>
      </span>
    </el-dialog>


  </basic-container>
</template>

<script>
import {add, audit, getDetail, getList, remove, state, update, addToWhitelist} from "@/api/emp/empemployee";
// import {getRoleTree} from "@/api/system/role";
// import { getDeptLazyTree} from "@/api/system/dept";  // 延迟加载
import {mapGetters} from "vuex";
import {getToken} from '@/util/auth';
import request from '@/router/axios'
import photo from "../../components/photo"

export default {
  data() {
    return {
      form: {},
      query: {
        types: 2
      },
      loading: true,
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false, // 批量下发权限
      auditInfo: {},
      info: {
        options: ""
        // validityTm: ""
      },
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
            type: 'checkbox',
            dicUrl: "/api/blade-emp/acsdoor/list",
            props: {
              label: "doorName",
              value: "doorIndexCode"
            },
            all: true,
            dataType: "string",
            span: 24,
            filterable: true,
            // drag: true,
            multiple: true,
            // loadText: '模板上传中，请稍等',
          },
          {
            label: "到期时间",
            prop: "endTime",
            type: "datetime",
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            span: 24,
            // editDisplay:false,
            // addDisplay:false,
            // rules: [{
            //     required: false,
            //     message: "请输入预约访问时间(至)",
            //     trigger: "blur"
            // }]
          },
        ]
      },
      infos: {},
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
        viewBtn: true,
        selection: true,
        // excelBtn: true,
        dialogClickModal: false,
        align: "center",
        title: '外协员工管理导出',
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
            disabled: false,
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
            label: "部门",
            prop: "deptId",
            type: "tree",
            hide: true,
            dicUrl: "/api/blade-system/dept/tree",
            dicMethod: 'get',
            dataType: "string",
            props: {
              label: "title",
              value: "key"
            },
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
            viewDisplay: false,
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
            rules: [{
              required: true,
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
              message: "请输入手机号",
              trigger: "blur"
            }]
          },
          {
            label: "员工类型",
            prop: "types",
            type: "radio",
            hide: true,
            // search: true,
            value: 2,
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
            label: "身份证号",
            prop: "idcard",
            span: 12,
            rules: [{
              required: false,
              message: "请输入身份证号",
              trigger: "blur"
            }]
          },
          {
            label: "角色",
            prop: "role",
            type: "tree",
            dataType: "string",
            dicUrl: "/api/blade-system/role/tree?tenantId=" + this.$store.getters.userInfo.tenant_id,
            hide: true,
            props: {
              label: "title",
              value: "id"
            },
            span: 12,
            // hide: true,
            // type: "select",
            // addDisplay: false,
            // editDisplay: false,
            // viewDisplay: false,
            // checkStrictly: true,
            // slot: true,
            rules: [{
              required: false,
              message: "请输入角色",
              trigger: "blur"
            }]
          },


          {
            label: "身份证",
            prop: "idcardUrl",
            type: "upload",
            dataType: "string",
            listType: "picture-img",
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
            hide: true,
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            action: "/api/blade-resource/oss/endpoint/put-file?code=ali",
            span: 12,
            rules: [{
              required: false,
              message: "请输入工作证照片",
              trigger: "blur"
            }]
          },
          {
            label: "工作证到期日",
            prop: "empCardExpire",
            type: "date",
            format:'yyyy-MM-dd',
            valueFormat:'yyyy-MM-dd',
            span: 12,
            rules: [{
              required: false,
              message: "请输入工作证过期时间",
              trigger: "blur"
            }]
          },
          {
            label: "审核状态",
            prop: "audit",
            type: "select",
            search: true,
            value: 1,
            span: 12,
            addDisplay: false,
            editDisplay: false,
            dicData: [
              {
                label: "审批中",
                value: 1
              },
              {
                label: "已通过",
                value: 2
              },
              {
                label: "已驳回",
                value: 3
              },
              {
                label: "已取消",
                value: 4
              }
            ],
            // dicUrl: "/api/blade-system/dict-biz/dictionary?code=VISTOR_AUDIT",
            // props: {
            //     label: "dictValue",
            //     value: "dictKey"
            // },
            // labelWidth: "150",
            slot: true,
            dataType: "number"
          },
          {
            label: "状态",
            prop: "state",
            type: "radio",
            search: true,
            slot: true,
            span: 12,
            value: 3,
            addDisplay: false,
            editDisplay: false,
            dicData: [
              {
                label: "激活",
                value: 1
              },
              {
                label: "拉黑",
                value: 2
              },
              {
                label: "待定",
                value: 3
              },
              {
                label: "已过期",
                value: 4
              }
            ],
            rules: [{
              required: false,
              message: "请输入员工状态(1.激活,2.拉黑)",
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
          },
          {
            label: "门禁权限",
            prop: "permissions",
            span: 24,
            type: 'select',
            dataType: 'string',
            filterable: true,
            multiple: true,
            overHidden: true,
            dicUrl: "/api/blade-emp/acsdoor/listNull",
            props: {
              label: "doorName",
              value: "doorIndexCode"
            },
            search: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            rules: [{
              required: false,
              message: "请输入门禁权限",
              trigger: "blur"
            }]
          },
          {
            label: "到期时间",
            prop: "expiryTime",
            type: "datetime",
            span: 24,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            rules: [{
              required: false,
              message: "请输入到期时间",
              trigger: "blur"
            }]
          },
          // {
          //   label: "更新时间",
          //   prop: "updateTime",
          //   span: 24,
          //   addDisplay: false,
          //   editDisplay: false,
          //   viewDisplay: false,
          //   rules: [{
          //     required: false,
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
        addBtn: this.vaildData(this.permission.empemployee_add_out, false),
        viewBtn: this.vaildData(this.permission.empemployee_view_out, false),
        delBtn: this.vaildData(this.permission.empemployee_delete_out, false),
        editBtn: this.vaildData(this.permission.empemployee_edit_out, false)
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
    getPhoto(val) {
      this.form.faceUrl = val
    },
    // 导入操作 待开发
    // handleGet(){
    //   window.open('/cdn/demo.xlsx')
    // },
    // handleChange(file, fileLis) {
    //   this.$export.xlsx(file.raw)
    //     .then(data => {
    //         this.data=data.results;
    //     })
    // },
    // handleExcel() {
    //     let opt = {
    //         title: '员工表导出',
    //         column: this.option.column,
    //         data: this.data
    //     }
    //     this.$export.excel({
    //         title: opt.title || new Date().getTime(),
    //         columns: opt.column,
    //         data: opt.data
    //     });
    // },
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
        window.open(`/api/blade-emp/empemployee/export?git${this.website.tokenHeader}=${getToken()}&ids=` + this.ids);
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
    // 下放权限提交
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
          "sendPermList": requstData,
          "endTime": this.permissionForm.endTime
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
      });

    },
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
      // console.log(this.ids)
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
    addWhitelist() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据加入白名单?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return addToWhitelist(this.ids);
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
    auditBatch(types) {
      audit(this.ids, this.info.options, types).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.$refs.crud.toggleSelection();
        this.getClose();
      })
    },
    auditItem(types) {
      audit(this.auditInfo.id, this.info.options, types).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.$refs.crud.toggleSelection();
        this.getClose();
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
      this.dialogVisible = false
      this.dialogVisible1 = false
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
    //   handleAudit() {
    //     if (this.selectionList.length === 0) {
    //         this.$message.warning("请选择至少一条数据");
    //         return;
    //     }
    //     this.$confirm("确定将选择数据审核通过?", {
    //         confirmButtonText: "确定",
    //         cancelButtonText: "取消",
    //         type: "warning"
    //     })
    //     .then(() => {
    //         return audit(this.ids);
    //     })
    //     .then(() => {
    //         this.onLoad(this.page);
    //         this.$message({
    //             type: "success",
    //             message: "操作成功!"
    //         });
    //         this.$refs.crud.toggleSelection();
    //     });
    // },
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
      this.query.types = 2;
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.query.types = 2;
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
