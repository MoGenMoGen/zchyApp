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
                   v-if="permission.stcont_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>

      <!--      类型(图文,视频)-->
      <!--      <template slot="types" slot-scope="scope">-->
      <!--        <el-tag v-if="scope.row.types === 1 " type="primary">图文</el-tag>-->
      <!--&lt;!&ndash;        <el-tag v-else-if="scope.row.types === 2 " type="success">启用</el-tag>&ndash;&gt;-->
      <!--        <el-tag v-else type="success">视频</el-tag>-->
      <!--      </template>-->

      <template slot="linkUrlForm">
        <!--      <template slot-scope="scope" slot="contForm">-->
        <div style="display: flex;">
          <!--          <el-button type="primary" @click="addQuestions" >选择课程资源</el-button>-->
          <el-button type="primary" @click="addCourse">选择课程资源</el-button>
        </div>
      </template>

      <template slot-scope="{row}" slot="courseSeqForm">
        <el-input-number></el-input-number>
        <!--        <el-input-number v-model="row.$index+1"></el-input-number>-->
        <!--        <el-input :value="getLetter(row)"></el-input>-->
      </template>

    </avue-crud>

    <el-dialog title="提示" :visible.sync="courseVisible" width="60%" append-to-body>
      <!--    <el-dialog title="提示" :visible.sync="checkVisible" width="60%" :before-close="handleClose" append-to-body>-->
      <!--      <quesCheck @child-event="pushQues" ref="quesCheck"></quesCheck>-->
      <courseSrcCheck @child-event="pushCourse" ref="courseSrcCheck"></courseSrcCheck>

      <span slot="footer" class="dialog-footer">
        <el-button @click="courseVisible = false">取 消</el-button>
        <!--        <el-button @click="checkVisible = false">取 消</el-button>-->
        <!--        <el-button type="primary" @click="checkQuestions()">确 定</el-button>-->
        <el-button type="primary" @click="checkCourse()">确 定</el-button>
      </span>
    </el-dialog>

  </basic-container>
</template>

<script>
import {add, getDetail, getList, remove, update} from "@/api/study/stcont";
import {mapGetters} from "vuex";
import courseSrcCheck from "./stcoursesrc-check";

export default {
  data() {
    return {
      form: {
        courseData: []
      },
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      courseVisible: false,
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
        align: "center",
        column: [
          {
            label: "分类",
            prop: "cid",
            type: "tree",
            dicUrl: "/api/blade-study/stcat/treelist",
            dicMethod: "get",
            props: {
              label: "title",
              value: "id"
            },
            dataType: "string",
            filterable: true,
            search: true,
            display: false,
            span: 24,
            rules: [{
              required: true,
              message: "请输入分类",
              trigger: "blur"
            }]
          },
          {
            label: "分类",
            prop: "cids",
            type: "cascader",
            expandTrigger: "hover",
            dicUrl: "/api/blade-study/stcat/treelist",
            dicMethod: "get",
            props: {
              label: "title",
              value: "id"
            },
            hide: true,
            dataType: "string",
            filterable: true,
            span: 24,
            rules: [{
              required: true,
              message: "请选择分类",
              trigger: "blur"
            }]
          },
          {
            label: "内容标题",
            prop: "title",
            span: 24,
            rules: [{
              required: true,
              message: "请输入标题",
              trigger: "blur"
            }]
          },

          {
            label: "讲师",
            prop: "lecturer",
            span: 12,
            rules: [{
              required: false,
              message: "请输入讲师",
              trigger: "blur"
            }]
          },


          {
            label: "封面图",
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
              message: "请输入封面图",
              trigger: "blur"
            }]
          },
          {
            label: "课程介绍",
            prop: "cont",
            span: 24,
            component: 'AvueUeditor',
            dataType: "string",
            options: {
              action: '/api/blade-resource/oss/endpoint/put-file-attach',
              props: {
                res: "data",
                url: "link",
              }
            },
            hide: true,
            rules: [{
              required: true,
              message: "请输入课程介绍",
              trigger: "blur"
            }]
          },
          {
            label: "课程资源",
            prop: "linkUrl",
            span: 24,
            formslot: true,
            hide: true,
            rules: [{
              required: false,
              message: "请输入内容",
              trigger: "blur"
            }]
          },
          //------------------子表单开始-----------------------
          {
            label: '已选资源',
            prop: 'courseData',
            type: 'dynamic',
            span: 24,
            display: true,
            children: {
              align: 'center',
              headerAlign: 'center',
              addBtn: false,
              // index: true,
              rowAdd: (done) => {
                // this.$message.success('新增回调');
                done();
              },
              rowDel: (row, done) => {
                done();
                // this.totalScores()
              },
              column: [
                {
                  label: 'ID',
                  prop: "id",
                  type: 'input',
                  hide: true,
                  rules: [{
                    type: 'string',
                    required: false,
                    message: '缺少ID',
                  }]
                },
                {
                  label: '标题',
                  prop: "title",
                  type: 'input',
                  disabled: true,
                  rules: [{
                    type: 'string',
                    required: false,
                    message: '缺少题目',
                  }]
                },
                {
                  width: 150,
                  label: '类型',
                  prop: "types",
                  type: "select",
                  value: 1,
                  dataType: 'number',
                  disabled: true,
                  // slot: true,
                  dicData: [
                    {
                      label: "图文",
                      value: 1
                    },
                    {
                      label: "视频",
                      value: 2
                    },
                    {
                      label: "音频",
                      value: 3
                    },
                    {
                      label: "PDF",
                      value: 4
                    }
                  ],
                  rules: [{
                    required: false,
                    type: 'number',
                    message: "请输入类型(1.图文,2视频,3音频,4PDF)",
                    trigger: "blur"
                  }]
                },
                {
                  width: 150,
                  label: '讲师',
                  prop: "lecturer",
                  type: 'input',
                  disabled: true,
                  rules: [{
                    type: 'string',
                    required: false,
                    message: '缺少讲师',
                  }]
                },
                {
                  width: 150,
                  label: '排序',
                  prop: "courseSeq",
                  type: 'number',
                  // formslot: true,
                  // value: this.scope.$index,
                  rules: [{
                    type: 'number',
                    required: false,
                    message: '确少排序信息',
                  }]
                }
              ]
            }
          },
          //------------------子表单结束-----------------------
          {
            label: "排序",
            prop: "seq",
            type: "number",
            span: 24,
            value: 1,
            rules: [{
              required: false,
              message: "请输入排序",
              trigger: "blur"
            }]
          },
          // 保留的字段
          // {
          //     label: "一级栏目",
          //     prop: "cid1",
          //     hide: true,
          //     addDisplay: false,
          //     editDisplay: false,
          //     viewDisplay: false,
          //     rules: [{
          //         required: false,
          //         message: "请输入一级栏目",
          //         trigger: "blur"
          //     }]
          // },
          // {
          //     label: "二级栏目",
          //     prop: "cid2",
          //     hide: true,
          //     addDisplay: false,
          //     editDisplay: false,
          //     viewDisplay: false,
          //     rules: [{
          //         required: false,
          //         message: "请输入二级栏目",
          //         trigger: "blur"
          //     }]
          // },
          // {
          //     label: "副标题",
          //     prop: "subTitle",
          //     span: 24,
          //     hide: true,
          //     // addDisplay: false,
          //     // editDisplay: false,
          //     // viewDisplay: false,
          //     display: true,
          //     rules: [{
          //         required: false,
          //         message: "请输入副标题",
          //         trigger: "blur"
          //     }]
          // },
          // {
          //     label: "类型",
          //     prop: "types",
          //     type: "radio",
          //     span: 24,
          //     value: 1,
          //     hide: true,
          //     display: false,
          //     dicData: [
          //         {
          //             label: "图文",
          //             value: 1
          //         },
          //         {
          //             label: "视频",
          //             value: 2
          //         }
          //     ],
          //     slot: true,
          //     rules: [{
          //         required: true,
          //         message: "请输入类型(1.图文,2视频)",
          //         trigger: "blur"
          //     }]
          // },
          // {
          //     label: "视频上传",
          //     prop: "linkUrl",
          //     type: 'upload',
          //     accept:"video/mp4",
          //     dataType: "string",
          //     propsHttp: {
          //         res: 'data',
          //         url: 'link'
          //         // home: 'https://www.w3school.com.cn'
          //     },
          //     listType: 'picture-img',
          //     span: 24,
          //     tip: '建议上传mp4的视频文件,大文件上传请耐心等等',
          //     // loadText: '文件上传中，请稍等',
          //     action: '/api/blade-resource/oss/endpoint/put-file-attach',
          //     hide: true,
          //     // addDisplay: false,
          //     // viewDisplay: false,
          //     display: false,
          //     rules: [{
          //         required: false,
          //         message: "请输入链接",
          //         trigger: "blur"
          //     }]
          // },
          // {
          //     label: "发布时间",
          //     prop: "releTm",
          //     type: "datetime",
          //     format:'yyyy-MM-dd HH:mm:ss',
          //     valueFormat:'yyyy-MM-dd HH:mm:ss',
          //     span: 12,
          //     hide: true,
          //     display: true,
          //     rules: [{
          //         required: false,
          //         message: "请输入发布时间",
          //         trigger: "blur"
          //     }]
          // },
          {
            label: "备注",
            prop: "rmks",
            type: "textarea",
            span: 24,
            hide: true,
            display: false,
            rules: [{
              required: false,
              message: "请输入备注",
              trigger: "blur"
            }]
          },
        ]
      },
      data: []
    };
  },
  components: {
    courseSrcCheck
  },
  watch: {
    'form.cids': {
      handler(val) {
        // console.log(val)
        if (val && val.length != 0) {
          var cids = val.split(",");
          let len = cids.length
          this.form.cid = cids[len - 1]
        }
        // console.log(this.form)
        // if(val == 1){
        //   // console.log(Item)
        //   Item.addDisplay = false
        //   Item.editDisplay = false
        //   Item.viewDisplay = false
        // }else{
        //   Item.addDisplay = true
        //   Item.editDisplay = true
        //   Item.viewDisplay = true
        // }
      },
      immediate: true
    },
  },

  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.stcont_add, false),
        viewBtn: this.vaildData(this.permission.stcont_view, false),
        delBtn: this.vaildData(this.permission.stcont_delete, false),
        editBtn: this.vaildData(this.permission.stcont_edit, false)
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
    pushCourse(data) {
      for (let i = 1; i <= data.length; i++) {
        data[i - 1].courseSeq = i
      }
      console.log(data)
      this.$set(this.form, "courseData", data)
    },
    //
    addCourse() {
      this.courseVisible = true
      // this.$refs.quesCheck.openPage(this.form.questions)
      this.$nextTick(() => {
        this.$refs.courseSrcCheck.openPage(this.form.courseData)
      })

      // console.log("addCourse")
    },
    checkCourse() {
      // console.log(this)
      this.courseVisible = false
      this.$nextTick(() => {
        this.$refs.courseSrcCheck.checkCourse()
      })
      // this.$refs.quesCheck.checkQues()
      // this.checkVisible = false
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
