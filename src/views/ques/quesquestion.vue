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
                   v-if="permission.quesquestion_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="menuLeft">
        <el-button type="primary"
                   size="small"
                   icon="el-icon-download"
                   plain
                   v-if="permission.quesquestion_delete"
                   @click="handleExport">导出
        </el-button>
        <el-button type="success"
                   size="small"
                   plain
                   icon="el-icon-upload2"
                   @click="handleImport">导入
        </el-button>
      </template>
      <template slot-scope="{row}" slot="cdForm">
        <el-input :value="getLetter(row)"></el-input>
      </template>
    </avue-crud>

    <el-dialog title="题库数据导入"
               append-to-body
               :visible.sync="excelShow"
               width="555px">
      <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
        <template slot-scope="scope" slot="excelTemplate">
          <el-button type="primary" @click="exportTemplate">下载模板</el-button>
        </template>
      </avue-form>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/ques/quesquestion";
  import {mapGetters} from "vuex";
  import {getToken} from '@/util/auth';

  export default {
    data() {
      return {
        form: {
          options1:""
        },
        query: {},
        options: [],
        excelShow: false,
        excelForm: {},
        excelOption: {
          submitBtn: false,
          emptyBtn: false,
          column: [
              {
                  label: '数据上传',
                  prop: 'excelFile',
                  type: 'upload',
                  drag: true,
                  loadText: '模板上传中，请稍等',
                  span: 24,
                  propsHttp: {
                      res: 'data'
                  },
                  tip: '请上传 .xls,.xlsx 标准格式文件',
                  action: "/api/blade-ques/quesquestion/importExcel"
              },
              {
                  label: '模板下载',
                  prop: 'excelTemplate',
                  formslot: true,
                  span: 24,
              }
          ]
        },
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height:'auto',
          dialogWidth: '50%',
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
              label: "本题分数",
              prop: "scores",
              type: "number",
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
              span:24,
              display:true,
              children: {
                align: 'center',
                headerAlign: 'center',
                rowAdd:(done)=>{
                  // this.$message.success('新增回调');
                  done();
                },
                rowDel:(row,done)=>{
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
                  rules:[{
                    type:'string',
                    required:true,
                    message:'请输入答案内容',
                  }]
                },{
                  width: 200,
                  label: '是否正确答案',
                  prop: "type",
                  type: 'radio',
                  button:true,
                  dicData: [{
                    label: '正确答案',
                    value: 1
                  }, {
                    label: '错误答案',
                    value: 0
                  }],
                  rules:[{
                    type:'number',
                    required:true,
                    message:'请选择是否是正确答案',
                  }]
                }]
              }
            },
            {
                label: '答案',
                prop: 'options1',
                display:false,
                span:24,
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
    watch: {
      'form.types': {
          handler(val) {
              console.log(val)
              let optionsCol = this.findObject(this.option.column, 'options') // 答案
              let options1Col = this.findObject(this.option.column, 'options1') // 答案
              // console.log(optionsCol)
              optionsCol.display = true
              options1Col.display = false
              if(val === 3) {
                  optionsCol.display = false
                  options1Col.display = true
              }


          },
        },
        immediate: true

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
    methods: {
      handleImport() {
        this.excelShow = true;
      },
      uploadAfter(res, done, loading, column) {
        window.console.log(column);
        this.excelShow = false;
        this.refreshChange();
        done();
      },
      exportTemplate() {
        window.open(`/api/blade-ques/quesquestion/exportTemplate?${this.website.tokenHeader}=${getToken()}`);
      },
      getLetter(row) {
        let letterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
        console.log(row)
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
      handleExport() {
        this.$confirm("确定将选择数据导出?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
              window.open(`/api/blade-ques/quesquestion/export?${this.website.tokenHeader}=${getToken()}&ids=`+this.ids);
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
