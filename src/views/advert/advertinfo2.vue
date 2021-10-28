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
                   v-if="permission.advertinfo_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{type,size,row}" slot="menu">
        <el-button icon="el-icon-edit" :size="size" :type="type" @click="adScheBtn(row)">编辑广告档期</el-button>
      </template>
      <template slot="type" slot-scope="scope">
        <el-tooltip :content="'状态: ' + (scope.row.type === 1 ? '上架' : '下架')" placement="top" >
          <el-switch
            v-model="scope.row.type"
            @change="statusChange(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value=1
            :inactive-value=2>
          </el-switch>
        </el-tooltip>
      </template>
    </avue-crud>
    <el-dialog title="广告档期信息" :close-on-click-modal="false" :visible.sync="scheShow" append-to-body width="80%">
      <ad-sche :infoId="infoId"></ad-sche>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList, getDetail, getPosDetail, add, update, remove, getPositionList} from "@/api/advert/advertinfo";
  import {mapGetters} from "vuex";
  import adSche from "./advertschedule2"

  var DIC = {
      type: [ {
          label: '上架',
          value: 1
      },{
          label: '下架',
          value: 2
      }]
  }

  export default {
    props:['positionId'],
    data() {
      return {
        scheShow: false,
        form: {},
        infoId: '',
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          // viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "所属广告位置",
              prop: "posId",
              change: ({value, column}) => {
                if (value) {
                  getPosDetail(value).then(res => {
                    let pos = res.data.data;
                    this.form.imgTip = '建议图片宽度:'+pos.width+'px, 图片高度:'+pos.height+'px, 大小限制:'+pos.imgSize+'KB。'
                  });
                }
              },
              type: "select",
              dicData: [],
              disabled: true,
              showColumn: false,
              props: {
                label: "nm",
                value: "id"
              },
              labelWidth: 120,
              rules: [{
                required: true,
                message: "请输入所属广告位置",
                trigger: "blur"
              }]
            },
            {
              label: "所属广告位置",
              prop: "dictValue",
              addDisplay:false,
              editDisplay:false,
              labelWidth: 120,
              rules: [{
                  required: true,
                  message: "请输入所属广告位置",
                  trigger: "blur"
              }]
            },
            {
              label: "名称",
              prop: "nm",
              span: 24,
              search: true,
              rules: [{
                required: true,
                message: "请输入名称",
                trigger: "blur"
              }]
            },
            {
              label: "显示内容",
              prop: "content",
              overHidden: true,
              span: 24,
              rules: [{
                required: false,
                message: "请输入显示内容",
                trigger: "blur"
              }]
            },
            {
              label: "状态",
              prop: "type",
              type: "radio",
              search: true,
              addDisplay:false,
              editDisplay:false,
              dicData: DIC.type,
              mock:{
                type:'dic'
              },
              slot:true,
              rules: [{
                required: true,
                message: "请输入类型",
                trigger: "blur"
              }]
            },
            {
              label: "",
              prop: "imgTip",
              type:'title',
              hide: true,
              span: 24,
              styles:{
                color:'red',
                fontSize:'14px'
              }
            },
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
                required: true,
                message: "请输入图片地址",
                trigger: "blur"
              }]
            },
            {
              label: "链接URL",
              prop: "locUrl",
              span: 24,
              showColumn: false,
              // rules: [{
              //   required: true,
              //   message: "请输入链接URL",
              //   trigger: "blur"
              // }]
            },
            // {
            //   label: "价格(单位:元)",
            //   prop: "price",
            //   rules: [{
            //     required: true,
            //     message: "请输入价格(单位:元)",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "审核状态(0:未审核,1:等待审核,2:审核通过,3:审核未通过)",
            //   prop: "audit",
            //   rules: [{
            //     required: true,
            //     message: "请输入审核状态(0:未审核,1:等待审核,2:审核通过,3:审核未通过)",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "排序",
              prop: "seq",
              type: "number",
              value: 1,
              rules: [{
                required: true,
                message: "请输入排序",
                trigger: "blur"
              }]
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.advertinfo_add, false),
          viewBtn: this.vaildData(this.permission.advertinfo_view, false),
          delBtn: this.vaildData(this.permission.advertinfo_delete, false),
          editBtn: this.vaildData(this.permission.advertinfo_edit, false)
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
    components:{
      adSche
    },
    methods: {
      statusChange (val) {
        update(val).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          loading();
        });
      },
      listPosition() {
        getPositionList().then(res => {
          const column = this.findObject(this.option.column, "posId");
          column.dicData = res.data.data.records;
          this.form.posId = this.positionId
        });
      },
      adScheBtn(row){
        this.scheShow = true
        this.infoId = row.id
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
        if (["add", "edit"].includes(type)) {
          this.listPosition();
        }
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
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query), this.positionId).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    },
    watch: {
      positionId:function(newVal) {
        this.loading = true;
        getList(this.page.currentPage, this.page.pageSize, Object.assign(this.query, this.query), newVal).then(res => {
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
