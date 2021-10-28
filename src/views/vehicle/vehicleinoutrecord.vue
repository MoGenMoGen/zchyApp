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
                   v-if="permission.vehicleinoutrecord_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/vehicle/vehicleinoutrecord";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
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
          searchSpan: 4,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          addBtn: false,
          editBtn: false,
          delBtn: false,
          selection: true,
          dialogClickModal: false,
          column: [
            // {
            //   label: "事件ID",
            //   prop: "eventId",
            //   rules: [{
            //     required: true,
            //     message: "请输入事件ID",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "事件类型",
            //   prop: "eventType",
            //   rules: [{
            //     required: true,
            //     message: "请输入事件类型",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "设备资源编号",
            //   prop: "srcIndex",
            //   rules: [{
            //     required: true,
            //     message: "请输入设备资源编号",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "车主姓名",
              prop: "personName",
              rules: [{
                required: true,
                message: "请输入车牌号",
                trigger: "blur"
              }]
            },
            {
              label: "车牌号",
              prop: "plateNo",
              search: true,
              rules: [{
                required: true,
                message: "请输入车牌号",
                trigger: "blur"
              }]
            },

            // {
            //   label: "停车场编号",
            //   prop: "parkIndex",
            //   rules: [{
            //     required: true,
            //     message: "请输入停车场编号",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "停车场",
              prop: "parkName",
              rules: [{
                required: true,
                message: "请输入停车场",
                trigger: "blur"
              }]
            },
            // {
            //   label: "车道编号",
            //   prop: "roadwayIndex",
            //   rules: [{
            //     required: true,
            //     message: "请输入车道编号",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "车道名",
              prop: "roadwayName",
              search: true,
              rules: [{
                required: true,
                message: "请输入车道名",
                trigger: "blur"
              }]
            },
            {
              label: "状态",
              prop: "releaseResultEx",
              dicData: [
                {
                  label: "未放行",
                  value: 0
                },
                {
                  label: "正常放行",
                  value: 1
                },
                {
                  label: "离线放行",
                  value: 2
                }
              ],
              rules: [{
                required: true,
                message: "请输入车道名",
                trigger: "blur"
              }]
            },
            // {
            //   label: "车道类型",
            //   prop: "roadwayType",
            //   rules: [{
            //     required: true,
            //     message: "请输入车道类型",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "车牌颜色",
            //   prop: "plateColor",
            //   rules: [{
            //     required: true,
            //     message: "请输入车牌颜色",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "车辆分类信息",
            //   prop: "vehicleClass",
            //   rules: [{
            //     required: true,
            //     message: "请输入车辆分类信息",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "车辆类型",
            //   prop: "vehicleType",
            //   rules: [{
            //     required: true,
            //     message: "请输入车辆类型",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "车辆颜色",
            //   prop: "vehicleColor",
            //   rules: [{
            //     required: true,
            //     message: "请输入车辆颜色",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "进出时间",
              startPlaceholder: "开始时间",
              endPlaceholder: "结束时间",
              prop: "happenTime",
              type: "datetime",
              format:'yyyy-MM-dd HH:mm:ss',
              valueFormat:'yyyy-MM-dd HH:mm:ss',
              searchRange: true, //搜索时为日期时间区间
              search: true,      //开启搜索
              searchSpan: 8,
              rules: [{
                required: true,
                message: "请输入进出时间",
                trigger: "blur"
              }]
            },
            // {
            //   label: "车牌类型",
            //   prop: "plateType",
            //   rules: [{
            //     required: true,
            //     message: "请输入车牌类型",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "图片服务器编号",
            //   prop: "svrIndex",
            //   rules: [{
            //     required: true,
            //     message: "请输入图片服务器编号",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "车牌图片",
            //   prop: "platePicUrl",
            //   rules: [{
            //     required: true,
            //     message: "请输入车牌图片",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "车辆图片",
            //   prop: "vehiclePicUrl",
            //   rules: [{
            //     required: true,
            //     message: "请输入车辆图片",
            //     trigger: "blur"
            //   }]
            // },
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
          addBtn: this.vaildData(this.permission.vehicleinoutrecord_add, false),
          viewBtn: this.vaildData(this.permission.vehicleinoutrecord_view, false),
          delBtn: this.vaildData(this.permission.vehicleinoutrecord_delete, false),
          editBtn: this.vaildData(this.permission.vehicleinoutrecord_edit, false)
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
        const {happenTime} = this.query
        this.loading = true;
        let values = {
          ...params
        }
        if (happenTime) {
          values = {
            ...params,
            happenTime_ge: happenTime[0],
            happenTime_le: happenTime[1],
            ...this.query
          }
        }
        values.happenTime = null;
        this.query.happenTime = null;
        getList(page.currentPage, page.pageSize, Object.assign(params, values)).then(res => {
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
