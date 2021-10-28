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
                   v-if="permission.questopic_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="modelForm">
        <div style="display: flex;">
          <el-select v-model="scope.row.model" clearable placeholder="选题模式">
            <el-option label="随机选题" :value= 1 />
            <el-option label="自主选题" :value= 2 />
          </el-select>
          <el-button type="primary" @click="addQuestions" :disabled="scope.row.model === 1">选择题目</el-button>
        </div>
      </template>
    </avue-crud>
    <el-dialog title="提示" :visible.sync="checkVisible" width="60%"  append-to-body>
<!--    <el-dialog title="提示" :visible.sync="checkVisible" width="60%" :before-close="handleClose" append-to-body>-->
      <quesCheck @child-event="pushQues" ref="quesCheck"></quesCheck>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkQuestions()">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {add, getDetail, getList, remove, update} from "@/api/ques/questopic";
import {mapGetters} from "vuex";
import quesCheck from "./quesquestion-check"

export default {
  data() {
    return {
      form: {
        questions: []
      },
      query: {},
      // questions: [],
      checkVisible: false,
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
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        searchSpan: 4,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "关联课程",
            prop: "stContIds",
            type: "select",
            overhide: true,
            multiple: true,
            filterable: true,
            search: true,
            searchSpan: 4,
            dicUrl: "/api/blade-study/stcont/listCont",
            display: false,
            props: {
              label: "title",
              value: "id"
            },
            dataType: "string"
          },
          {
            label: "考试主题",
            prop: "nm",
            search: true,
            searchSpan: 4,
            display: false,
          },
          {
            label: "封面图",
            prop: "imgCover",
            type: "upload",
            dataType: "string",
            display: false,
          },
          {
            label: "背景图",
            prop: "imgBack",
            type: "upload",
            dataType: "string",
            display: false,
          },
          {
            label: "选题模式",
            prop: "model",
            type: "select",
            span: 12,
            display: false,
            dicData: [{
              label: "随机选题",
              value: 1
            }, {
              label: "自主选题",
              value: 2
            }],
          },
          {
            label: "考试限时(0代表不限)",
            prop: "timeLimit",
            type: "number",
            display: false,
          },
          {
            label: "次数限制(0代表不限)",
            prop: "examTimes",
            type: "number",
            display: false,
          },
          {
            label: "通过分数",
            prop: "passScores",
            type: "number",
            display: false,
          },
          {
            label: "有效类型",
            prop: "validType",
            type: "radio",
            value: 1,
            display: false,
            dicData: [{
              label: "永久有效",
              value: 1
            },
              {
                label: "限时有效",
                value: 2
              }],
            rules: [{
              required: true,
              message: "请输入有效类型(1永久有效,2限时有效)",
              trigger: "blur"
            }]
          },
          {
            label: "有效开始时间",
            prop: "actFrTm",
            type: "datetime",
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            display: false,
          },
          {
            label: "有效结束时间",
            prop: "actToTm",
            type: "datetime",
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            display: false,
          },
          {
            label: "状态",
            prop: "state",
            type: "radio",
            search: true,
            searchSpan: 4,
            display: false,
            dicData: [{
              label: "编辑中",
              value: 1
            }, {
              label: "启用",
              value: 2
            }, {
              label: "禁用",
              value: 3
            }]
          },
        ],
        group: [
          {
            icon: 'el-icon-info',
            label: '主题配置',
            collapse: true,
            prop: 'group1',
            column: [
              {
                label: "关联课程",
                prop: "stContIds",
                type: "select",
                multiple: true,
                filterable: true,
                dicUrl: "/api/blade-study/stcont/listCont",
                props: {
                  label: "title",
                  value: "id"
                },
                dataType: "string",
                rules: [{
                  required: true,
                  message: "请输入关联培训内容",
                  trigger: "blur"
                }]
              },
              {
                label: "考试主题",
                prop: "nm",
                span: 24,
                rules: [{
                  required: true,
                  message: "请输入考试主题",
                  trigger: "blur"
                }]
              },
              {
                label: "封面图",
                prop: "imgCover",
                type: "upload",
                dataType: "string",
                listType: "picture-card",
                //tip: "图片规格说明",
                propsHttp: {
                  res: 'data',
                  url: 'link'
                },
                action: "/api/blade-resource/oss/endpoint/put-file-attach",
                span: 12,
                rules: [{
                  required: true,
                  message: "请输入封面图",
                  trigger: "blur"
                }]
              },
              {
                label: "背景图",
                prop: "imgBack",
                type: "upload",
                dataType: "string",
                listType: "picture-card",
                //tip: "图片规格说明",
                propsHttp: {
                  res: 'data',
                  url: 'link'
                },
                action: "/api/blade-resource/oss/endpoint/put-file-attach",
                span: 12,
                rules: [{
                  required: false,
                  message: "请输入背景图",
                  trigger: "blur"
                }]
              },
              {
                label: "考试细则",
                prop: "descr",
                span: 24,
                component: "AvueUeditor",
                options: {
                  action: '/api/blade-resource/oss/endpoint/put-file-attach',
                  props: {
                    res: "data",
                    url: "link",
                  }
                },
                rules: [{
                  required: true,
                  message: "请输入考试细则",
                  trigger: "blur"
                }]
              },
            ]
          }, {
            icon: 'el-icon-info',
            label: '选题配置',
            collapse: true,
            prop: 'group2',
            column: [
              {
                label: "选题模式",
                prop: "model",
                type: "select",
                span: 12,
                value: 1,
                formslot: true,
                dicData: [{
                  label: "随机选题",
                  value: 1
                },
                  {
                    label: "自主选题",
                    value: 2
                  }],
                rules: [{
                  required: true,
                  message: "请选择选题模式",
                  trigger: "blur"
                }]
              },
              {
                label: "已选题总分数",
                prop: "total",
                type: "input",
                disabled: true,
                labelWidth: 150,
                span: 12,
                value: 0
              },
              //------------------子表单开始-----------------------
              {
                label: '已选题目',
                prop: 'questions',
                type: 'dynamic',
                span: 24,
                children: {
                  align: 'center',
                  headerAlign: 'center',
                  addBtn: false,
                  rowAdd: (done) => {
                    // this.$message.success('新增回调');
                    done();
                  },
                  rowDel: (row, done) => {
                    done();
                    this.totalScores()
                  },
                  column: [{
                    label: 'ID',
                    prop: "id",
                    type: 'input',
                    hide: true,
                    rules: [{
                      type: 'string',
                      required: true,
                      message: '缺少ID',
                    }]
                  }, {
                    label: '题目',
                    prop: "nm",
                    type: 'input',
                    disabled: true,
                    rules: [{
                      type: 'string',
                      required: false,
                      message: '缺少题目',
                    }]
                  }, {
                    width: 150,
                    label: '题型',
                    prop: "types",
                    type: 'select',
                    disabled: true,
                    dataType: 'number',
                    dicUrl: "/api/blade-system/dict-biz/dictionary?code=QUES_TYPE",
                    props: {
                      label: "dictValue",
                      value: "dictKey"
                    },
                    rules: [{
                      type: 'number',
                      required: false,
                      message: '缺少题型',
                    }]
                  }, {
                    width: 150,
                    label: '分数',
                    prop: "scores",
                    type: 'input',
                    disabled: true,
                    rules: [{
                      type: 'number',
                      required: false,
                      message: '缺少分数',
                    }]
                  }]
                }
              },
              //------------------子表单结束-----------------------
              {
                label: "题目总数",
                prop: "quesNum",
                type: "number",
                dataType: "number",
                display: true,
                value: 0,
                span: 12,
                rules: [{
                  required: true,
                  message: "请输入题目总数",
                  trigger: "blur"
                }]
              },
              {
                label: "单选题数",
                prop: "singleNum",
                type: "number",
                dataType: "number",
                display: true,
                value: 0,
                change: ({value}) => {
                    if(value) {
                        this.$refs.crud.tableForm.quesNum = value + this.$refs.crud.tableForm.multiNum + this.$refs.crud.tableForm.gapNum
                    }
                },
                rules: [{
                  required: true,
                  message: "请输入单选题数量",
                  trigger: "blur"
                }]
              },
              {
                label: "多选题数.",
                display: true,
                type: "number",
                dataType: "number",
                prop: "multiNum",
                value: 0,
                change: ({value}) => {
                  if(value) {
                      this.$refs.crud.tableForm.quesNum = value + this.$refs.crud.tableForm.singleNum + this.$refs.crud.tableForm.gapNum
                  }
                },
                rules: [{
                  required: true,
                  message: "请输入多选题数量",
                  trigger: "blur"
                }]
              },
              {
                  label: "填空题数.",
                  display: true,
                  type: "number",
                  dataType: "number",
                  prop: "gapNum",
                  change: ({value}) => {
                    if(value) {
                        this.$refs.crud.tableForm.quesNum = value + this.$refs.crud.tableForm.singleNum + this.$refs.crud.tableForm.multiNum
                    }
                  },
                  value: 0,
                  rules: [{
                      required: true,
                      message: "请输入填空题数量",
                      trigger: "blur"
                  }]
              },
            ]
          }, {
            icon: 'el-icon-info',
            label: '其它配置',
            collapse: true,
            prop: 'group3',
            column: [
              {
                label: "考试限时(0代表不限)",
                prop: "timeLimit",
                type: "number",
                append: "分钟",
                rules: [{
                  required: true,
                  message: "请输入考试限时(分钟)(0代表不限)",
                  trigger: "blur"
                }]
              },
              {
                label: "次数限制(0代表不限)",
                prop: "examTimes",
                type: "number",
                append: "次",
                rules: [{
                  required: true,
                  message: "请输入考试次数限制(0代表不限)",
                  trigger: "blur"
                }]
              },
              {
                label: "通过分数",
                prop: "passScores",
                type: "number",
                rules: [{
                  required: true,
                  message: "请输入考试通过分数",
                  trigger: "blur"
                }]
              },
              {
                label: "有效类型",
                prop: "validType",
                type: "radio",
                value: 1,
                dicData: [{
                  label: "永久有效",
                  value: 1
                },
                  {
                    label: "限时有效",
                    value: 2
                  }],
                rules: [{
                  required: true,
                  message: "请输入有效类型(1永久有效,2限时有效)",
                  trigger: "blur"
                }]
              },
              {
                label: "有效开始时间",
                prop: "actFrTm",
                type: "datetime",
                format: 'yyyy-MM-dd HH:mm:ss',
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                display: true,
                rules: [{
                  required: true,
                  message: "请输入有效开始时间",
                  trigger: "blur"
                }]
              },
              {
                label: "有效结束时间",
                prop: "actToTm",
                type: "datetime",
                format: 'yyyy-MM-dd HH:mm:ss',
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                display: false,
                rules: [{
                  required: true,
                  message: "请输入有效结束时间",
                  trigger: "blur"
                }]
              },
              {
                label: "状态",
                prop: "state",
                type: "radio",
                value: 1,
                dicData: [{
                  label: "编辑中",
                  value: 1
                }, {
                  label: "启用",
                  value: 2
                }, {
                  label: "禁用",
                  value: 3
                }],
                rules: [{
                  required: true,
                  message: "请输入状态(1编辑中；2启用；3禁用)",
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
              // },
            ]
          }
        ]
      },
      data: []
    };
  },
  components: {
    quesCheck
  },
  watch: {
    'form.model': {
      handler(val) {
        let quesNumCol = this.findObject(this.option.group, 'quesNum') // 题目总数
        let singleNumCol = this.findObject(this.option.group, 'singleNum') // 单选题总数
        let multiNumCol = this.findObject(this.option.group, 'multiNum') // 多选题总数
        let gapNumCol = this.findObject(this.option.group, 'gapNum') // 填空题总数
        let questionsCol = this.findObject(this.option.group, 'questions') // 自主选题表格
        let totalCol = this.findObject(this.option.group, 'total') // 已选题总分数
        if (val === 1) {
          quesNumCol.display = true
          singleNumCol.display = true
          multiNumCol.display = true
          gapNumCol.display = true
          questionsCol.display = false
          totalCol.display = false
        } else {
          quesNumCol.display = false
          singleNumCol.display = false
          multiNumCol.display = false
          gapNumCol.display = false
          questionsCol.display = true
          totalCol.display = true
        }
      },
      immediate: true
    },
    'form.validType': {
      handler(val) {
        let actFrTmCol = this.findObject(this.option.group, 'actFrTm') // 有效开始时间
        let actToTmCol = this.findObject(this.option.group, 'actToTm') // 有效结束时间
        if (val === 2) {
          actFrTmCol.display = true
          actToTmCol.display = true
        } else {
          actFrTmCol.display = false
          actToTmCol.display = false
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.questopic_add, false),
        viewBtn: this.vaildData(this.permission.questopic_view, false),
        delBtn: this.vaildData(this.permission.questopic_delete, false),
        editBtn: this.vaildData(this.permission.questopic_edit, false)
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
    pushQues(data) {
      this.form.questions = data
      this.totalScores() //计算已选题的总分数
    },
    checkQuestions() { // 确定按钮
      this.checkVisible = false
      this.$nextTick(() => {
        this.$refs.quesCheck.checkQues()
      })
    },
    addQuestions() { //选题按钮
      this.checkVisible = true
      this.$nextTick(() => {
        this.$refs.quesCheck.openPage(this.form.questions)
      })
    },
    totalScores() {
      let arr = this.form.questions
      let total = 0
      for (let i = 0; i < arr.length; i++) {
        total += arr[i].scores
      }
      this.form.total = total
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
          this.totalScores()
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
