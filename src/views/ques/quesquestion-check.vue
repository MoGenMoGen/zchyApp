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
               @select="select"
               @select-all="selectAll"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot-scope="{row}" slot="cdForm">
        <el-input :value="getLetter(row)"></el-input>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {getList, getDetail, add, update, remove} from "@/api/ques/quesquestion";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      form: {},
      query: {},
      options: [],
      loading: true,
      page: {
        pageSizes: [5, 10, 20, 30, 40, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      questions: [],
      option: {
        height: 'auto',
        dialogWidth: '50%',
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        searchSpan: 4,
        border: true,
        index: true,
        menuWidth: 80,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "所属类目",
            prop: "cids",
            type: "select",
            search: true,
            multiple: true,
            dicUrl: "/api/blade-ques/quescat/listCat",
            props: {
              label: "nm",
              value: "id"
            },
            dataType: "string",
            span: 24,
            rules: [{
              required: false,
              message: "请选择所属类目",
              trigger: "blur"
            }]
          },
          {
            label: "题目",
            prop: "nm",
            type: "textarea",
            maxRows: 2,
            search: true,
            overHidden: true,
            span: 24,
            rules: [{
              required: true,
              message: "请输入题目",
              trigger: "blur"
            }]
          },
          {
            label: "题型",
            prop: "types",
            dataType: "number",
            width: 60,
            span: 12,
            type: "select",
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=QUES_TYPE",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            rules: [{
              required: true,
              message: "请输入答题类型 [r]（1：单选题，2：多选题，3：填空题）",
              trigger: "blur"
            }]
          },
          {
            label: "分值",
            prop: "scores",
            type: "number",
            width: 60,
            value: 2,
            span: 12,
            rules: [{
              required: true,
              message: "请输入本题分数",
              trigger: "blur"
            }]
          },
          // {
          //   label: "标准答案id",
          //   prop: "answerIds",
          //   rules: [{
          //     required: true,
          //     message: "请输入标准答案id",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "标准答案编号(A,B,C等)",
          //   prop: "answerCds",
          //   rules: [{
          //     required: true,
          //     message: "请输入标准答案编号(A,B,C等)",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "图片",
            prop: "imgUrl",
            dataType: 'string',
            type: 'upload',
            listType: 'picture-card',
            limit: 5,
            loadText: '附件上传中，请稍等',
            width: 100,
            span: 24,
            propsHttp: {
              res: 'data',
              url: 'link',
            },
            action: "/api/blade-resource/oss/endpoint/put-file-attach",
            rules: [{
              required: false,
              message: "请输入上传图片",
              trigger: "blur"
            }]
          },
          {
            label: "语音",
            prop: "voiceUrl",
            dataType: 'string',
            width: 100,
            overHidden: true,
            span: 24,
            type: 'upload',
            limit: 1,
            loadText: '附件上传中，请稍等',
            propsHttp: {
              res: 'data',
              url: 'link',
            },
            action: "/api/blade-resource/oss/endpoint/put-file-attach",
            rules: [{
              required: false,
              message: "请输入上传语音",
              trigger: "blur"
            }]
          },
          // {
          //   label: "视频封面",
          //   prop: "vedioCover",
          //   rules: [{
          //     required: false,
          //     message: "请输入视频封面",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "视频",
          //   prop: "vedioUrl",
          //   rules: [{
          //     required: false,
          //     message: "请输入上传视频",
          //     trigger: "blur"
          //   }]
          // },
          //------------------子表单开始-----------------------
          {
            label: '答案',
            prop: 'options',
            type: 'dynamic',
            span: 24,
            children: {
              align: 'center',
              headerAlign: 'center',
              rowAdd: (done) => {
                // this.$message.success('新增回调');
                done();
              },
              rowDel: (row, done) => {
                // this.$message.success('删除回调'+JSON.stringify(row));
                done();
              },
              column: [{
                width: 80,
                label: '答案编码',
                prop: "cd",
                formslot: true,
              }, {
                label: '答案内容',
                prop: "nm",
                type: 'input',
                rules: [{
                  type: 'string',
                  required: true,
                  message: '请输入答案内容',
                }]
              }, {
                width: 200,
                label: '是否正确答案',
                prop: "type",
                type: 'radio',
                button: true,
                dicData: [{
                  label: '正确答案',
                  value: 1
                }, {
                  label: '错误答案',
                  value: 0
                }],
                rules: [{
                  type: 'number',
                  required: true,
                  message: '请选择是否是正确答案',
                }]
              }]
            }
          },
          //------------------子表单结束-----------------------
          {
            label: "答题提示",
            prop: "hint",
            type: "textarea",
            span: 24,
            overHidden: true,
            rules: [{
              required: false,
              message: "请输入题目提示",
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
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.quesquestion_add, false),
        viewBtn: this.vaildData(this.permission.quesquestion_view, false),
        delBtn: this.vaildData(this.permission.quesquestion_delete, false),
        editBtn: this.vaildData(this.permission.quesquestion_edit, false)
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
  updated() {
    this.toggleRow()
  },
  methods: {
    select(rows, row) {
      let selected = rows.length && rows.indexOf(row) !== -1
      console.log(selected)  // true就是选中，0或者false是取消选中
      if (selected) {
        this.questions.push(row)
      } else {
        this.questions = this.questions.filter(item => item.id != row.id)
      }
    },
    selectAll(rows) {
      this.questions = this.unique(this.questions.concat(rows))
    },
    checkQues() {
      this.$emit('child-event', this.questions)
    },
    openPage(questions) {
      let that = this
      this.$nextTick(() => {
        this.questions = questions
        that.selectionClear()
        this.toggleRow()
      })
    },
    toggleRow() {
      this.data.forEach(item => {
        this.questions.forEach(ques => {
          if (ques.id == item.id) {
            this.$refs.crud.toggleRowSelection(item, true);
          }
        })
      })
    },
    unique(arr) {
      let result = []
      let map = {}
      for (let i = 0; i < arr.length; i++) {
        if (!map[arr[i].id]) {
          result.push(arr[i]);
          map[arr[i].id] = true;
        }
      }
      return result
    },
    getLetter(row) {
      let letterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
      row.cd = letterArr[row.$index]
      return letterArr[row.$index]
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
