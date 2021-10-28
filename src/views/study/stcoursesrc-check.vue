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
<!--      <template slot="menuLeft">-->
<!--        <el-button type="danger"-->
<!--                   size="small"-->
<!--                   icon="el-icon-delete"-->
<!--                   plain-->
<!--                   v-if="permission.stcoursesrc_delete"-->
<!--                   @click="handleDelete">删 除-->
<!--        </el-button>-->
<!--      </template>-->


      <!--        (1.图文,2.视频,3.音频,4.PDF)-->
      <template  slot="types" slot-scope="scope" >
        <el-tag v-if="scope.row.types === 1 " type="primary">图文</el-tag>
        <el-tag v-else-if="scope.row.types === 2 " type="success">视频</el-tag>
        <el-tag v-else-if="scope.row.types === 4 " type="danger">PDF</el-tag>
        <el-tag v-else type="warning">音频</el-tag>
      </template>


    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/study/stcoursesrc";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSizes: [5, 10, 20, 30, 40, 50, 100],
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        sourceSelect:[],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          searchSpan: 4,
          border: true,
          index: true,
          viewBtn: true,
          editBtn: false,
          delBtn: false,
          selection: true,
          dialogClickModal: false,
          addBtn:false,
          column: [
            {
              label: "课程资源标题",
              prop: "title",
              labelWidth: 120,
              span: 24,
              rules: [{
                required: true,
                message: "请输入课程资源标题",
                trigger: "blur"
              }]
            },
            {
              label: "讲师",
              prop: "lecturer",
              labelWidth: 120,
              span: 12,
              rules: [{
                required: false,
                message: "请输入讲师",
                trigger: "blur"
              }]
            },
            {
              label: "发布时间",
              prop: "releTm",
              type: "datetime",
              format:'yyyy-MM-dd HH:mm:ss',
              valueFormat:'yyyy-MM-dd HH:mm:ss',
              span: 12,
              rules: [{
                required: true,
                message: "请输入发布时间",
                trigger: "blur"
              }]
            },
            {
              label: "封面图",
              prop: "imgUrl",
              labelWidth: 120,
              type: "upload",
              dataType: "string",
              listType: "picture-card",
              tip: "图片规格说明",
              propsHttp:{
                  res: 'data',
                  url: 'link'
              },
              action: "/api/blade-resource/oss/endpoint/put-file",
              span: 12,
              rules: [{
                required: false,
                message: "请输入封面图",
                trigger: "blur"
              }]
            },
            {
              label: "类型",
              prop: "types",
              type: "select",
              dataType: "number",
              value: 1,
              slot: true,
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
                message: "请输入类型(1.图文,2视频,3音频,4PDF)",
                trigger: "blur"
              }]
            },
            {
              label: "资源内容",
              prop: "linkUrl",
              type: "upload",
              labelWidth: 120,
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
              propsHttp: {
                  res: 'data',
                  url: 'link'
                  // home: 'https://www.w3school.com.cn'
              },
              // listType: 'picture-img',
              tip: '',
              // loadText: '文件上传中，请稍等',
              hide: true,
              action: '/api/blade-resource/oss/endpoint/put-file',
              rules: [{
                required: true,
                message: "请输入链接",
                trigger: "blur"
              }]
            },
            {
              label: "视频/音频时长",
              prop: "duration",
              labelWidth: 120,
              span: 24,
              hide: true,
              addDisplay: false,
              editDisplay: false,
              rules: [{
                required: false,
                message: "请输入视频/音频时长",
                trigger: "blur"
              }]
            },
            // {
            //   label: "课时介绍",
            //   prop: "cont",
            //   labelWidth: 120,
            //   span: 24,
            //   overHidden: true,
            //   rules: [{
            //     required: false,
            //     message: "请输入本课时介绍",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "排序",
            //   prop: "seq",
            //   type: "number",
            //   labelWidth: 120,
            //   span: 24,
            //   value: 1,
            //   rules: [{
            //     required: false,
            //     message: "请输入排序",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "备注",
              prop: "rmks",
              type: "textarea",
              labelWidth: 120,
              span: 24,
              hide: true,
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
    watch:{
        'form.types' :{
            handler(val){
              console.log(val)
              let item = this.findObject(this.option.column,"linkUrl")
              let item1 =  this.findObject(this.option.column,"duration")
              item1.addDisplay = false
              item1.editDisplay = false

              // console.log(item)
              // (1.图文,2视频,3音频,4PDF)
              if (val === 1 || val === 2) {
                  item.type=""
                  item.component = 'AvueUeditor'
                  item.options = {
                      action: '/api/blade-resource/oss/endpoint/put-file-attach',
                      props: {
                          res: "data",
                          url: "link",
                      }
                  }
                  item.action = ""
                  item.propsHttp= ""
                  // 选择视频 显示 时长栏
                  if(val === 2){
                      item1.addDisplay = true
                      item1.editDisplay = true
                  }


              } else if(val == 3){
                  item.type="upload"
                  item.component = ""
                  item.options = ""
                  item.action = '/api/blade-resource/oss/endpoint/put-file'
                  item.propsHttp= {
                      res: 'data',
                      url: 'link'
                      // home: 'https://www.w3school.com.cn'
                  }
                  item1.addDisplay = true
                  item1.editDisplay = true
              } else if(val == 4){
                  item.type="upload"
                  item.component = ""
                  item.options = ""
                  item.action = '/api/blade-resource/oss/endpoint/put-file'
                  item.propsHttp= {
                      res: 'data',
                      url: 'link'
                      // home: 'https://www.w3school.com.cn'
                  }
                  item1.addDisplay = true
                  item1.editDisplay = true
              }

                // dataType: "string",
                //     propsHttp: {
                //     res: 'data',
                //         url: 'link'
                //     // home: 'https://www.w3school.com.cn'
                // },
                // listType: 'picture-img',
                //     span: 24,
                //     tip: '建议上传mp4的视频文件,大文件上传请耐心等等',
                //     // loadText: '文件上传中，请稍等',
                //     action: '/api/blade-resource/oss/endpoint/put-file',
            },
            immediate: true
        },
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.stcoursesrc_add, false),
          viewBtn: this.vaildData(this.permission.stcoursesrc_view, false),
          delBtn: this.vaildData(this.permission.stcoursesrc_delete, false),
          editBtn: this.vaildData(this.permission.stcoursesrc_edit, false)
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

      checkCourse() {
        this.$emit('child-event', this.sourceSelect)
      },

      select(rows, row) {
          let selected = rows.length && rows.indexOf(row) !== -1
          console.log(selected)  // true就是选中，0或者false是取消选中
          if (selected) {
              this.sourceSelect.push(row)
          } else {
              this.sourceSelect = this.sourceSelect.filter(item => item.id != row.id)
          }
      },

      selectAll(rows) {
          this.sourceSelect = this.unique(this.sourceSelect.concat(rows))
      },

      openPage(courses) {
        this.$nextTick(() => {
            this.selectionClear()
            this.sourceSelect = courses
            this.toggleRow()
        })

      },
      toggleRow() {
        this.data.forEach(item => {
          this.sourceSelect.forEach(src1 => {
              if (src1.id == item.id) {
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
