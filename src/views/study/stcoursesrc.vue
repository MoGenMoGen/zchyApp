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
               :upload-before="uploadBefore"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.stcoursesrc_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>

      <template slot="linkUrlForm">
          <span>
            <el-input v-model="form.linkUrl" label="相关链接" clearable>
             <el-button type="primary" style="background-color: #409EFF; color: #FFFFFF" slot="prepend" @click="uploadHandle">视频上传</el-button>
            </el-input>
              <iframe frameborder="0" :src="form.linkUrl" allowFullScreen="true" width="300px" height="240px"></iframe>
          </span>
      </template>

      <!--        (1.图文,2.视频,3.音频,4.PDF)-->
      <template slot="types" slot-scope="scope">
        <el-tag v-if="scope.row.types === 1 " type="primary">图文</el-tag>
        <el-tag v-else-if="scope.row.types === 2 " type="success">视频</el-tag>
        <el-tag v-else-if="scope.row.types === 4 " type="danger">PDF</el-tag>
        <el-tag v-else type="warning">音频</el-tag>
      </template>


    </avue-crud>

    <vod v-if="vodVisible" ref="vod" @getFileUrl="getFileUrl"></vod>
  </basic-container>
</template>

<script>
import {add, getDetail, getList, remove, update} from "@/api/study/stcoursesrc";
import {mapGetters} from "vuex";
import vod from "./stcourseCont-vod";

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      vodVisible: false,
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
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
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
            propsHttp: {
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
            type: "radio",
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
            label: "资源链接",
            prop: "linkUrl",
            type: "upload",
            labelWidth: 120,
            span: 24,
            dataType: "string",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
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
            },
            // listType: 'picture-img',
            tip: '',
            // loadText: '文件上传中，请稍等',
            hide: true,
            formslot: true,
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
          {
            label: "课时内容",
            prop: "cont",
            labelWidth: 120,
            span: 24,
            component: 'AvueUeditor',
            hide: true,
            overHidden: true,
            rules: [{
              required: false,
              message: "请输入本课时介绍",
              trigger: "blur"
            }]
          },
          {
            label: "排序",
            prop: "seq",
            type: "number",
            labelWidth: 120,
            span: 24,
            value: 1,
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
  watch: {
    'form.types': {
      handler(val) {
        console.log(val)
        let linkUrl = this.findObject(this.option.column, "linkUrl")
        let duration = this.findObject(this.option.column, "duration")
        let cont = this.findObject(this.option.column, "cont")
        // (1.图文,2视频,3音频,4PDF)
        if (val === 1) {
          linkUrl.addDisplay = false
          linkUrl.editDisplay = false
          linkUrl.viewDisplay = false
          duration.addDisplay = false
          duration.editDisplay = false
          duration.viewDisplay = false
          cont.addDisplay = true
          cont.editDisplay = true
          cont.viewDisplay = true
        } else if (val === 2) {
          linkUrl.addDisplay = true
          linkUrl.editDisplay = true
          linkUrl.viewDisplay = true
          linkUrl.formslot = true
          duration.addDisplay = true
          duration.editDisplay = true
          duration.viewDisplay = true
          cont.addDisplay = true
          cont.editDisplay = true
          cont.viewDisplay = true
        } else if (val == 3) {
          linkUrl.type = "upload"
          linkUrl.component = ""
          linkUrl.options = ""
          linkUrl.action = '/api/blade-resource/oss/endpoint/put-file'
          linkUrl.propsHttp = {
            res: 'data',
            url: 'link'
          }
          linkUrl.formslot = false
          linkUrl.addDisplay = true
          linkUrl.editDisplay = true
          linkUrl.viewDisplay = true
          duration.addDisplay = true
          duration.editDisplay = true
          duration.viewDisplay = true
          cont.addDisplay = true
          cont.editDisplay = true
          cont.viewDisplay = true
        } else if (val == 4) {
          linkUrl.type = "upload"
          linkUrl.component = ""
          linkUrl.options = ""
          linkUrl.action = '/api/blade-resource/oss/endpoint/put-file'
          linkUrl.propsHttp = {
            res: 'data',
            url: 'link'
          }
          linkUrl.formslot = false
          duration.addDisplay = false
          duration.editDisplay = false
          duration.viewDisplay = false
        }
      },
      immediate: true
    },
  },
  components: {
    vod
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
  methods: {
    // 上传视频
    uploadHandle() {
      this.vodVisible = true
      this.$nextTick(() => {
        this.$refs.vod.init()
      })
    },
    // 获取视频和封面图的url
    getFileUrl(val) {
      console.log("----getFileUrl----")
      console.log(val)
      let end = val.fileURL.indexOf('?')
      if (end !== -1) {
        this.form.linkUrl = val.fileURL.substring(0, end)
      } else {
        this.form.linkUrl = val.fileURL
      }
      // console.log(this)
      if (this.form.imgUrl === null || this.form.imgUrl === undefined || this.form.imgUrl === '') {
        let end1 = val.coverURL.lastIndexOf('?Expires=')
        if (end1 !== -1) {
          this.form.imgUrl = val.coverURL.substring(0, end1)
        } else {
          this.form.imgUrl = val.coverURL
        }
      }
      console.log(this.form.imgUrl)
      this.form.duration = this.getDuration(val.duration)

    },
    // 获取时长
    uploadBefore(file, done, loading, column) {
      // console.log(123)
      console.log(column)
      // 文件类型进行判断 格式筛选
      // console.log( file.type)
      const isAudio = file.type === "video/mp4" || file.type === "audio/mpeg" || file.type === "audio/mp3";
      // console.log(isAudio)
      // 获取时长
      this.getTimes(file);


      if ((this.form.types == 2 || this.form.types == 3) && isAudio) {
        console.log("上传的是视频|是音频")

      } else if ((this.form.types == 2 || this.form.types == 3) && !isAudio && column.prop === "linkUrl") {
        // if (file.type !== "audio/mp3") {
        this.$message.error("上传文件只能是Mp4/Mp3格式!");
        loading(false)
        return;

      }


      done() // 执行上传
    },
    getTimes(file) {
      var content = file;
      //获取录音时长
      var url = URL.createObjectURL(content);
      //经测试，发现audio也可获取视频的时长
      var audioElement = new Audio(url);
      // console.log(audioElement)
      console.log(audioElement.addEventListener("loadedmetadata", (e) => {
        let second = parseInt(audioElement.duration);

        this.form.duration = this.getDuration(second);
        console.log(e)
      }))
      // .target.getAttribute("duration"))
      // var audioElement = new VideoPlayer(url);
      // var video/mp4
      // audioElement.addEventListener(e, () => {
      //     // console.log((new Date()).getTime(),e);
      //     console.log(e.);
      //     // this.form.duration = parseInt(e.duration);
      //     // console.log(this.audioDuration);
      // });
    },
    // 获取时分秒
    getDuration(second) {

      let hour = parseInt(second / 3600)
      second = second % 3600
      let minute = parseInt(second / 60)
      second = Math.round(second % 60)
      return hour + "时/" + minute + "分/" + second + "秒"
    },
    rowSave(row, done, loading) {
      if (typeof row.linkUrl != 'string') {
        row.linkUrl = row.linkUrl.join(',')
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
      if (typeof row.linkUrl != 'string') {
        row.linkUrl = row.linkUrl.join(',')
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
