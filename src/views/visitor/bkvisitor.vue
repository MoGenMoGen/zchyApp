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
                   v-if="permission.bkvisitor_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-s-check"
                   plain
                   @click="addWhitelist">批量加入白名单
        </el-button>
      </template>
      <template slot="menu" slot-scope="{row}">
        <!--        v-show="row.audit !== 2"-->
        <!--        <el-button icon="el-icon-s-check" size="mini" type="text" @click="openDialog(row)" >审核</el-button>-->
        <el-button icon="el-icon-check" size="mini" type="text" @click="getStatus(row,2)" v-show="row.state === 1">入场
        </el-button>
        <el-button icon="el-icon-close" size="mini" type="text" @click="getStatus(row,3)" v-show="row.state === 2">离场
        </el-button>
        <el-button icon="el-icon-tickets" size="mini" type="text" @click="openDialog1(row)">操作记录</el-button>
      </template>


      <!--        1.审批中,2.已通过,3.已驳回,4.已取消-->
      <template slot="audit" slot-scope="scope">
        <el-tag v-if="scope.row.audit === 1 " type="warning">审批中</el-tag>
        <el-tag v-else-if="scope.row.audit === 2 " type="success">已通过</el-tag>
        <el-tag v-else-if="scope.row.audit === 3 " type="danger">已驳回</el-tag>
        <el-tag v-else type="info">已取消</el-tag>
      </template>

      <!--      1:未入场,2:迟到,3:失效,5:超期自动签离,6:已签离,7:超期未签离,8:已入场-->
      <template slot="visitorStatus" slot-scope="scope">
        <el-tag v-if="scope.row.visitorStatus === 1 " type="primary">未入场</el-tag>
        <el-tag v-else-if="scope.row.visitorStatus === 2 " type="warning">迟到</el-tag>
        <el-tag v-else-if="scope.row.visitorStatus === 5 " type="info">超期自动签离</el-tag>
        <el-tag v-else-if="scope.row.visitorStatus === 6 " type="info">已签离</el-tag>
        <el-tag v-else-if="scope.row.visitorStatus === 7 " type="info">超期未签离</el-tag>
        <el-tag v-else-if="scope.row.visitorStatus === 8 " type="success">已入场</el-tag>
        <el-tag v-else type="info">已失效</el-tag>
      </template>
      <!--      <template  slot="downOn" slot-scope="scope" >-->
      <!--        <el-tag v-if="scope.row.downOn === 1 " type="success">全站开启点踩</el-tag>-->
      <!--        <el-tag v-else type="danger">全站关闭点踩</el-tag>-->
      <!--      </template>-->

      <!--      <template slot-scope="scope" slot="menuForm">-->
      <!--        <el-button @click="" style="margin-left: 20px" type="success">审核通过</el-button>-->
      <!--        &lt;!&ndash;        <el-button @click="" style="margin-left: 20px" type="danger">审核不通过</el-button>&ndash;&gt;-->
      <!--      </template>-->
      <!--      <template slot="dialog">-->
      <!--        <el-button @click="" style="margin-left: 20px" type="success">审核通过</el-button>-->
      <!--        <el-button @click="" style="margin-left: 20px" type="danger">审核不通过</el-button>-->
      <!--      </template>-->


    </avue-crud>

    <el-dialog title="访客预约审核" :visible.sync="dialogVisible" width="80%" append-to-body :before-close="getClose">


      <avue-form :option="option" v-model="info"></avue-form>

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
       <el-button type="success" @click="getAudit(2)">审核通过</el-button>
       <el-button @click="getClose()">取 消</el-button>
      <el-button type="danger" @click="getAudit(3)">审核不通过</el-button>
        <!--       <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      </span>
    </el-dialog>

    <el-dialog title="操作记录" :visible.sync="dialogVisible1" width="80%" append-to-body>

      <el-table :data="oprInfo" border style="width: 100%">
        <el-table-column prop="types" label="操作类型" width="180" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.types === 1 " type="success">入场</el-tag>
            <el-tag v-else-if="scope.row.types === 2 " type="danger">离场</el-tag>
            <el-tag v-else type="info">未入场</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operatorNm" label="操作人" width="180" align="center"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
      </el-table>
      <span slot="footer">
       <el-button @click="dialogVisible1 = false">取 消</el-button>
      </span>
    </el-dialog>


  </basic-container>
</template>

<script>
import {add, getDetail, getList, remove, sendAudit, update, addToWhitelist} from "@/api/visitor/bkvisitor";
import {getVisitorList} from "@/api/visitor/bkvisitoroprlog";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      dialogVisible: false,
      dialogVisible1: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        height: 'auto',
        detail: false,
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        addBtn: false,
        editBtn: false,
        viewBtn: true,
        viewBtnText: "详情",
        // defaultSort: {prop:'plannedStartTime',order:'descending'},
        selection: true,
        align: "center",
        dialogClickModal: false,
        column: [
          {
            label: "来访单位",
            prop: "visitorDepartName",
            search: true,
            display: false
          },
          {
            label: "访客姓名",
            search: true,
            searchLabelWidth: "100",
            prop: "visitorName",
            display: false
          },
          {
            label: "来访人照片",
            prop: "visitorPhoto",
            type: "upload",
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            display: false,
          },
          {
            label: "联系电话",
            prop: "visitorMobile",
            search: true,
            display: false,
          },

          {
            label: "来访车辆牌号",
            prop: "visitorVehicle",
            display: false
          },
          {
            label: "区域",
            prop: "visitRegion",
            type: "select",
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=VISITOR_AREA",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            search: true,
            dataType: "number",
            display: false
          },

          {
            label: "状态",
            prop: "visitorStatus",
            type: "select",
            search: true,
            span: 16,
            dicData: [
              {
                label: "正常",
                value: 1
              },
              {
                label: "迟到",
                value: 2
              },
              {
                label: "失效",
                value: 3
              },
              {
                label: "超期自动签离",
                value: 5
              },
              {
                label: "已签离",
                value: 6
              },
              {
                label: "超期未签离",
                value: 7
              },
              {
                label: "已到达",
                value: 8
              }
            ],
            slot: true,
            display: false
          },
          {
            label: "审核状态",
            prop: "audit",
            type: "select",
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=VISTOR_AUDIT",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            labelWidth: "150",
            slot: true,
            span: 24,
            dataType: "number",
            display: false
          },
          // {
          //   label: "事由",
          //   prop: "reasons",
          //   type: "select",
          //   dicUrl: "/api/blade-system/dict-biz/dictionary?code=VISTOR_REASONS",
          //   props: {
          //       label: "dictValue",
          //       value: "dictKey"
          //   },
          //   dataType: "number",
          //   display: false
          // },
          {
            label: "预计来访时间",
            prop: "plannedStartTime",
            searchLabelWidth: "150",
            sortable: true,
            // search: true,
            type: "datetime",
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            display: false
          },
          {
            label: "预计离开时间",
            prop: "plannedEndTime",
            searchLabelWidth: 150,
            // search: true,
            sortable: true,
            type: "datetime",
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            display: false
          }

        ],
        group: [
          {
            icon: 'el-icon-info',
            label: '基本信息',
            collapse: true,
            prop: 'group0',
            column: [
              {
                label: "预计来访时间",
                prop: "plannedStartTime",
                type: "datetime",
                // type: 'datetimerange',
                // pickerOptions:{
                //     plannedStartTime: '',
                //     plannedEndTime:''
                // },
                format: 'yyyy-MM-dd HH:mm:ss',
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                pickerOptions: {
                  disabledDate(time) {
                    let bg = Date.now() // - 1*3600000*24
                    let ed = Date.now() + 7 * 3600000 * 24
                    return time.getTime() < bg || time.getTime() > ed;
                  }
                },
                labelWidth: "150",
                span: 24,
                rules: [{
                  required: true,
                  message: "请输入预约访问时间(起)",
                  trigger: "blur"
                }]
              },
              {
                label: "预计离开时间",
                prop: "plannedEndTime",
                type: "datetime",
                labelWidth: "150",
                format: 'yyyy-MM-dd HH:mm:ss',
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                pickerOptions: {
                  disabledDate(time) {
                    let bg = Date.now() // - 1*3600000*24
                    let ed = Date.now() + 7 * 3600000 * 24
                    return time.getTime() < bg || time.getTime() > ed;
                  }
                },
                span: 24,
                rules: [{
                  required: true,
                  message: "请输入预约访问时间(至)",
                  trigger: "blur"
                }]
              },
              {
                label: "入场时间",
                prop: "visitStartTime",
                type: "datetime",
                // type: 'datetimerange',
                // pickerOptions:{
                //     plannedStartTime: '',
                //     plannedEndTime:''
                // },
                format: 'yyyy-MM-dd HH:mm:ss',
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                labelWidth: "150",
                span: 24,
                editDisplay: false,
                addDisplay: false,
                rules: [{
                  required: false,
                  message: "请输入预约访问时间(起)",
                  trigger: "blur"
                }]
              },
              {
                label: "离场时间",
                prop: "visitEndTime",
                type: "datetime",
                labelWidth: "150",
                format: 'yyyy-MM-dd HH:mm:ss',
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                span: 24,
                editDisplay: false,
                addDisplay: false,
                rules: [{
                  required: false,
                  message: "请输入预约访问时间(至)",
                  trigger: "blur"
                }]
              },
              {
                label: "访问区域",
                prop: "visitRegion",
                type: "select",
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=VISITOR_AREA",
                props: {
                  label: "dictValue",
                  value: "dictKey"
                },
                dataType: "number",
                span: 24,
                labelWidth: "150",
                // width: 120,
                rules: [{
                  required: false,
                  message: "请输入访问区域(1.办公区,2.生产区,3.物流门)",
                  trigger: "blur"
                }]
              },
              {
                label: "入口",
                prop: "entryDoor",
                labelWidth: "150",
                span: 12,
                rules: [{
                  required: false,
                  message: "请输入入口",
                  trigger: "blur"
                }]
              },
              {
                label: "出口",
                prop: "exitDoor",

                span: 12,
                rules: [{
                  required: false,
                  message: "请输入出口",
                  trigger: "blur"
                }]
              },

              {
                label: "随车来访",
                type: "radio",
                prop: "hasVehicle",
                labelWidth: "150",
                span: 24,
                dicData: [
                  {
                    label: "是",
                    value: 1
                  },
                  {
                    label: "否",
                    value: 2
                  }
                ],
                value: 1,
                // row: true,
                rules: [{
                  required: true,
                  message: "请输入随车来访(1.是,2否)",
                  trigger: "blur"
                }]
              },
              {
                label: "状态",
                prop: "visitorStatus",
                type: "select",
                labelWidth: "150",
                span: 24,
                value: 1,
                //  1:正常,2:迟到,3:失效,5:超期自动签离,6:已签离,7:超期未签离,8:已到达
                dicData: [
                  {
                    label: "未入场",
                    value: 1
                  },
                  {
                    label: "迟到",
                    value: 2
                  },
                  {
                    label: "已失效",
                    value: 3
                  },
                  {
                    label: "未入场",
                    value: 5
                  },
                  {
                    label: "迟到",
                    value: 6
                  },
                  {
                    label: "已失效",
                    value: 7
                  },
                  {
                    label: "已入场",
                    value: 8
                  }

                ],
                rules: [{
                  required: true,
                  message: "请输入状态(1.未入场,2.已入场,3.已失效)",
                  trigger: "blur"
                }]
              },
              {
                label: "车辆类别",
                prop: "vehicleSort",
                type: "select",
                labelWidth: "140",
                // dicUrl: "/api/blade-system/dict-biz/dictionary?code=PLATE_TYPE",
                // props: {
                //     label: "dictValue",
                //     value: "dictKey"
                // },
                dicData: [{
                  label: "蓝牌",
                  value: 1
                }, {
                  label: "黄牌",
                  value: 2
                }, {
                  label: "其它",
                  value: 3
                }],
                dataType: "number",
                span: 24,
                rules: [{
                  required: false,
                  message: "请输入车辆类别(1.蓝牌,2.黄牌,3.其它)",
                  trigger: "blur"
                }]
              },
              {
                label: "来访车辆牌号",
                prop: "visitorVehicle",
                labelWidth: "140",
                span: 24,
                rules: [{
                  required: false,
                  message: "请输入来访车辆牌号",
                  trigger: "blur"
                }]
              },
              {
                label: "车辆进出次数",
                prop: "entryTimes",
                type: "select",
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=VISITOR_ENTRYTIMES",
                props: {
                  label: "dictValue",
                  value: "dictKey"
                },
                filterable: true,
                dataType: "number",
                labelWidth: "140",
                span: 24,
                rules: [{
                  required: false,
                  message: "请输入车辆进出次数(0：无限制；1：一天；2：两天；3：三天；4：四天；5：五天；6：六天；7：七天；60：六小时；12：十二小时)",
                  trigger: "blur"
                }]
              },

              {
                label: "审核状态",
                prop: "audit",
                type: "select",
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=VISTOR_AUDIT",
                props: {
                  label: "dictValue",
                  value: "dictKey"
                },
                labelWidth: "140",
                span: 24,
                dataType: "number",
                value: 1,
                // addDisplay: false,
                // editDisplay: false,
                rules: [{
                  required: false,
                  message: "请输入审核状态(1.审批中,2.已通过,3.已驳回,4.已取消)",
                  trigger: "blur"
                }]
              },
              {
                label: "事由",
                prop: "reasons",
                // type: "select",
                // dicUrl: "/api/blade-system/dict-biz/dictionary?code=VISTOR_REASONS",
                // props: {
                //     label: "dictValue",
                //     value: "dictKey"
                // },
                // dataType: "number",
                span: 24,
                hide: true,
                labelWidth: "140",
                rules: [{
                  required: true,
                  message: "请输入事由(1.工作交流,2.拜访,3.参观,4.开会,5.面试,6.其它)",
                  trigger: "blur"
                }]
              },
              // 隐藏字段
              {
                label: "审核意见",
                prop: "options",
                hide: true,
                labelWidth: "150",
                addDisplay: false,
                editDisplay: false,
                // viewDisplay: true,
                // display:false,
                rules: [{
                  required: false,
                  message: "请输入审核意见",
                  trigger: "blur"
                }]
              },
              {
                label: "备注",
                prop: "rmks",
                labelWidth: "140",
                hide: true,
                span: 24,
                // addDisplay: false,
                // editDisplay: false,
                // viewDisplay: false,
                rules: [{
                  required: false,
                  message: "请输入备注",
                  trigger: "blur"
                }]
              },
            ]
          },
          {
            icon: 'el-icon-s-custom',
            label: '来访人信息',
            collapse: true,
            prop: 'group1',
            column: [
              {
                label: "来访人照片",
                prop: "visitorPhoto",
                type: "upload",
                dataType: "string",
                listType: "picture-card",
                tip: "图片规格说明",
                propsHttp: {
                  res: 'data',
                  url: 'link'
                },
                action: "/api/blade-resource/oss/endpoint/put-face",
                span: 24,
                labelWidth: "130",
                rules: [{
                  required: true,
                  message: "请输入来访人照片",
                  trigger: "blur"
                }]
              },
              {
                label: "来访人姓名",
                prop: "visitorName",
                span: 24,
                labelWidth: "130",
                rules: [{
                  required: true,
                  message: "请输入来访人姓名",
                  trigger: "blur"
                }]
              },
              // gender
              {
                label: "来访人性别",
                prop: "gender",
                type: "radio",
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
                value: 1,
                span: 24,
                labelWidth: "130",
                rules: [{
                  required: false,
                  message: "来访人性别",
                  trigger: "blur"
                }]
              },
              {
                label: "来访人电话",
                prop: "visitorMobile",
                span: 24,
                labelWidth: "130",
                rules: [{
                  required: true,
                  message: "请输入来访人电话",
                  trigger: "blur"
                }]
              },
              {
                label: "来访人单位",
                prop: "visitorDepartName",
                labelWidth: "130",
                span: 24,
                rules: [{
                  required: true,
                  message: "请输入来访人单位",
                  trigger: "blur"
                }]
              },
              {
                label: "来访人身份证号",
                prop: "visitorIdCard",
                labelWidth: "130",
                span: 24,
                rules: [{
                  required: true,
                  message: "请输入来访人身份证号",
                  trigger: "blur"
                }]
              },

            ]
          },
          {
            icon: 'el-icon-user-solid',
            label: '受访人信息',
            collapse: true,
            prop: 'group2',
            column: [
              // {
              //     label: "受访人微信用户ID",
              //     prop: "visiteeUserId",
              //     labelWidth: "140",
              //     span: 24,
              //     // value: 1,
              //     hide: true,
              //     // addDisplay: false,
              //     // editDisplay: false,
              //     // viewDisplay: false,
              //     rules: [{
              //         required: true,
              //         message: "请输入受访人微信用户ID",
              //         trigger: "blur"
              //     }]
              // },
              // {
              //     label: "受访人员工ID",
              //     prop: "visiteeEmpId",
              //     type: "select",
              //     dicUrl: "/api/blade-emp/empemployee/tlist?types=1",
              //     dicMethod:'get',
              //     dicData: [],
              //     props: {
              //         label: "name",
              //         mob:"mob",
              //         value: "id"
              //     },
              //     span: 24,
              //     labelWidth: "120",
              //     change:({value})=>{
              //       // console.log(this.option.group)
              //
              //       var c1= this.findObject(this.option.group, "visiteeName");
              //       var c2= this.findObject(this.option.group, "visiteeMobile");
              //       var c3 = this.findObject(this.option.group, "visiteeEmpId");
              //
              //       // console.log(this)
              //
              //
              //       c1.value=c3.props.name
              //       c2.value=c3.props.mob
              //     },
              //     hide: true,
              //     addDisplay: false,
              //     editDisplay: false,
              //     viewDisplay: false,
              //
              //     rules: [{
              //         required: false,
              //         message: "请输入受访人员工表ID",
              //         trigger: "blur"
              //     }]
              // },
              {
                label: "受访人姓名",
                prop: "visiteeName",
                search: true,
                searchLabelWidth: "150",
                span: 24,
                labelWidth: "120",
                rules: [{
                  required: true,
                  message: "请输入受访人姓名",
                  trigger: "blur"
                }]
              },
              {
                label: "受访人电话",
                prop: "visiteeMobile",
                labelWidth: "120",
                span: 24,
                rules: [{
                  required: true,
                  message: "请输入受访人电话",
                  trigger: "blur"
                }]
              },
              {
                label: "受访人职务",
                prop: "visiteePosition",
                span: 24,
                labelWidth: "120",
                rules: [{
                  required: true,
                  message: "请输入受访人职务",
                  trigger: "blur"
                }]
              },
              {
                label: "受访人单位",
                prop: "visiteeDepartName",
                span: 24,
                labelWidth: "120",
                rules: [{
                  required: true,
                  message: "请输入受访人单位",
                  trigger: "blur"
                }]
              },
            ]
          }
        ]
      },
      data: [],
      info: {},
      oprInfo: {}
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.bkvisitor_add, false),
        viewBtn: this.vaildData(this.permission.bkvisitor_view, false),
        delBtn: this.vaildData(this.permission.bkvisitor_delete, false),
        editBtn: this.vaildData(this.permission.bkvisitor_edit, false)
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
    getStatus(row, val) {
      this.info = row;
      this.info.state = val;
      // console.log(this.info)
      // console.log(val)
      update(this.info).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        console.log(error);
      });
    },
    getAudit(audit) {
      this.info.audit = audit
      sendAudit(this.info).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        // loading();
        console.log(error);
      });
      this.getClose()
    },
    openDialog(row) {
      this.info = row;
      // console.log(this.info)
      this.option.detail = true
      // this.info.options.detail=true
      this.dialogVisible = true;
    },
    openDialog1(row) {
      let visitorId = row.id
      let that = this
      getVisitorList(visitorId).then(res => {
        that.oprInfo = res.data.data;
        console.log(that.oprInfo)
        that.dialogVisible1 = true;
      })

    },
    getClose() {
      this.dialogVisible = false
      this.option.detail = false
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
      // console.log(row)
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
      // console.log(this)
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.option.detail = false
        this.selectionClear();
      });
    }
  }
};
</script>

<style>
</style>
