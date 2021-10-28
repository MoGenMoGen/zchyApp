<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :search.sync="search"
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
                   v-if="permission.vehicle_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="menuLeft">
        <el-button type="warning"
                   size="small"
                   icon="el-icon-edit"
                   plain
                   v-if="permission.vehicleinoutrecord_edit"
                   @click="handleSync">同 步
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-s-check"
                   plain
                   @click="addWhitelist">批量加入白名单
        </el-button>
      </template>
      <template slot="personNameSearch" slot-scope="{disabled,size}">
        <el-input placeholder="人员" v-model="search.personName" clearable></el-input>
      </template>
      <template slot="dateranges" slot-scope="{type,size,row}">
        <div v-for="daterange in row.dateranges" :key="daterange.daterange">
          <el-tag
            :type="daterange.type">
            {{ daterange.daterange }}
          </el-tag>
        </div>
      </template>
    </avue-crud>
    <!--选择车主 dialog-->
    <el-dialog title="选择车主" :visible.sync="dialogVisible" width="65%" append-to-body>
      <emp @personSelected="selectPerson"></emp>
    </el-dialog>
  </basic-container>
</template>

<script>
import {sync, getList, getDetail, add, update, remove, addToWhitelist} from "@/api/vehicle/vehicle";
import {mapGetters} from "vuex";
import emp from "../../components/emp/emp";

export default {
  data() {
    return {
      form: {
        // 博汇
        parkSyscode: "f686b416cc814d67ad8e50d9407eb6a3",
        categoryCode: "",
        plateType: "0",
        plateColor: "0",
        vehicleColor: "1",
        vehicleType: "1",
        validDates: [{
          daterange: []
        }]
      },
      search:{},
      query: {},
      loading: true,
      dialogVisible: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        height: 'auto',
        calcHeight: 30,
        dialogWidth: '35%',
        searchSpan: 4,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "车牌号码",
            prop: "plateNo",
            span: 24,
            search: true,
            rules: [{
              required: true,
              message: "请输入车牌号码",
              trigger: "blur"
            }]
          },
          // {
          //   label: "是否关联人员",
          //   prop: "isBandPerson",
          //   rules: [{
          //     required: false,
          //     message: "请输入是否关联人员",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "车主姓名",
          //   prop: "personId",
          //   type: "select",
          //   span: 24,
          //   filterable: "true",
          //   searchFilterable: "true",
          //   dicUrl: "/api/blade-emp/empemployee/tlistAll",
          //   dataType: "string",
          //   props: {
          //     label: "name",
          //     desc: "deptNm",
          //     value: "personId"
          //   },
          //   search: true,
          //   rules: [{
          //     required: false,
          //     message: "请输入车主姓名",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "车主姓名",
            prop: "personName",
            span: 24,
            search: true,
            searchslot: true,
            click: () => {
              this.dialogVisible = true
            },
            rules: [{
              required: false,
              message: "请输入车主姓名",
              trigger: "blur"
            }]
          },
          {
            label: "卡号",
            prop: "cardNo",
            span: 24,
            hide: true,
            rules: [{
              required: false,
              message: "请输入卡号",
              trigger: "blur"
            }]
          },
          {
            label: "停车库",
            prop: "parkSyscode",
            type: "select",
            span: 24,
            filterable: "true",
            dicUrl: "/api/blade-vehicle/vehicle/parkList",
            hide: true,
            props: {
              label: "parkName",
              value: "parkIndexCode"
            },
            rules: [{
              required: true,
              message: "请输入停车库",
              trigger: "blur"
            }]
          },
          {
            label: '有效期',
            prop: "dateranges",
            addDisplay: false,
            editDisplay: false,
            overHidden: true,
            slot: true
          },
          {
            label: '有效期',
            prop: 'validDates',
            type: 'dynamic',
            span: 24,
            children: {
              align: 'center',
              headerAlign: 'center',
              rowAdd: (done) => {
                // this.$message.success('新增回调');
                done();
                this.addDaterange()
              },
              rowDel: (row, done) => {
                // this.$message.success('删除回调' + JSON.stringify(row));
                done();
              },
              column: [{
                label: '有效期',
                prop: "daterange",
                type: "daterange",
                format: 'yyyy-MM-dd',
                valueFormat: 'yyyy-MM-dd',
              }]
            }
          },
          {
            label: "车辆群组",
            prop: "categoryCode",
            type: "select",
            span: 24,
            filterable: "true",
            dicUrl: "/api/blade-vehicle/vehicle/catList",
            // hide: true,
            props: {
              label: "categoryName",
              value: "categoryCode"
            },
            rules: [{
              required: false,
              message: "请输入车辆群组",
              trigger: "blur"
            }]
          },
          {
            label: "车牌类型",
            prop: "plateType",
            span: 24,
            type: "select",
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=PLATE_TYPE",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            dataType: "string",
            rules: [{
              required: false,
              message: "请输入车牌类型",
              trigger: "blur"
            }]
          },
          {
            label: "车牌颜色",
            prop: "plateColor",
            span: 24,
            type: "select",
            dataType: "string",
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=PLATE_COLOR",
            hide: true,
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            rules: [{
              required: false,
              message: "请输入车牌颜色",
              trigger: "blur"
            }]
          },
          {
            label: "车辆类型",
            prop: "vehicleType",
            span: 24,
            type: "select",
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=VEH_TYPE",
            dataType: "string",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            rules: [{
              required: false,
              message: "请输入车辆类型",
              trigger: "blur"
            }]
          },
          {
            label: "车辆颜色",
            prop: "vehicleColor",
            span: 24,
            type: "select",
            dataType: "string",
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=VEH_COLOR",
            hide: true,
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            rules: [{
              required: false,
              message: "请输入车辆颜色",
              trigger: "blur"
            }]
          },
          {
            label: "车辆描述",
            prop: "description",
            type: "textarea",
            span: 24,
            rules: [{
              required: false,
              message: "请输入车辆描述",
              trigger: "blur"
            }]
          },
        ]
      },
      data: []
    };
  },
  components: {emp},
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.vehicle_add, false),
        viewBtn: this.vaildData(this.permission.vehicle_view, false),
        delBtn: this.vaildData(this.permission.vehicle_delete, false),
        editBtn: this.vaildData(this.permission.vehicle_edit, false)
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
  // mounted() {
  //   this.setDaterange(0,1)
  // },
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
    selectPerson(row) {
      this.form.personId = row.personId
      this.form.personName = row.name
      this.dialogVisible = false
    },
    setDaterange(a, b) {
      this.form.validDates = []
      let daterange = new Array()
      daterange.push(this.getStart(a))
      daterange.push(this.getEnd(b))
      this.form.validDates.push({'daterange': daterange})
    },
    addDaterange() {
      if (this.form.validDates.length > 1) {
        this.form.validDates.pop()
      }
      if (!this.form.validDates || this.form.validDates.length == 0) {
        this.setDaterange(0, 1)
      } else {
        let length = this.form.validDates.length
        let date = this.form.validDates[length - 1]
        let vals = date.daterange[1].split('-')
        let y = vals[0]
        let m = vals[1]
        let d = vals[2]
        let start;
        let end;
        if (m.length == 1) {
          start = y + '-0' + m + '-' + (parseInt(d) + 1)
          end = (parseInt(y) + 1) + '-' + m + '-' + d
        } else {
          start = y + '-' + m + '-' + (parseInt(d) + 1)
          end = (parseInt(y) + 1) + '-' + m + '-' + d
        }
        let daterange = new Array()
        daterange.push(start)
        daterange.push(end)
        this.form.validDates.push({'daterange': daterange})
        console.log(JSON.stringify(this.form.validDates))
      }
    },
    getStart(offset) {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth();
      let d = date.getDate();
      let Y = y + offset;
      let M = m + 1;
      let D = d;
      if (M < 10) {
        if (D < 10) {
          return Y + '-0' + M + '-0' + D;
        } else {
          return Y + '-0' + M + '-' + D;
        }
      } else {
        if (D < 10) {
          return Y + '-0' + M + '-0' + D;
        } else {
          return Y + '-0' + M + '-' + D;
        }
      }
    },
    getEnd(offset) {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth();
      let d = date.getDate();
      let Y = y + offset;
      let M = m + 1;
      let D = d - 1;
      if (M < 10) {
        if (D < 10) {
          return Y + '-0' + M + '-0' + D;
        } else {
          return Y + '-0' + M + '-' + D;
        }
      } else {
        if (D < 10) {
          return Y + '-0' + M + '-0' + D;
        } else {
          return Y + '-0' + M + '-' + D;
        }
      }
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
    handleSync() {
      this.$confirm("确定同步远程数据吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return sync();
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
      if (["add"].includes(type)) {
        this.setDaterange(0, 1)
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
