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
      <template slot="totalAmount" slot-scope="scope">
        {{ (scope.row.totalAmount/100) }}
      </template>
      <template slot="refundAmount" slot-scope="scope">
        {{ (scope.row.refundAmount/100) }}
      </template>
<!--      <template slot="menuLeft">-->
<!--        <el-button type="danger"-->
<!--                   size="small"-->
<!--                   icon="el-icon-delete"-->
<!--                   plain-->
<!--                   v-if="permission.payorder_delete"-->
<!--                   @click="handleDelete">删 除-->
<!--        </el-button>-->
<!--      </template>-->
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/pay/payorder";
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
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          menuWidth: 100,
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
            //   label: "订单主键",
            //   prop: "orderId",
            //   rules: [{
            //     required: true,
            //     message: "请输入订单主键",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "订单号",
              prop: "orderCd",
              search: true,
              // rules: [{
              //   required: true,
              //   message: "请输入订单号",
              //   trigger: "blur"
              // }]
            },
            // {
            //   label: "账户信息主键",
            //   prop: "detailsId",
            //   rules: [{
            //     required: true,
            //     message: "请输入账户信息主键",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "支付单号",
              prop: "outTradeNo",
              overHidden: true,
              search: true,
              // rules: [{
              //   required: true,
              //   message: "请输入支付单号",
              //   trigger: "blur"
              // }]
            },
            {
              label: "交易方式",
              prop: "wayTrade",
              // rules: [{
              //   required: true,
              //   message: "请输入交易方式,例如,网页支付,扫码付等等",
              //   trigger: "blur"
              // }]
            },
            {
              label: "退款金额",
              prop: "refundAmount",
              slot: true,
              // rules: [{
              //   required: true,
              //   message: "请输入退款金额",
              //   trigger: "blur"
              // }]
            },
            {
              label: "总金额",
              prop: "totalAmount",
              type: 'number',
              slot: true,
              // rules: [{
              //   required: true,
              //   message: "请输入总金额",
              //   trigger: "blur"
              // }]
            },
            {
              label: "用户标识",
              prop: "openId",
              overHidden: true,
              // rules: [{
              //   required: true,
              //   message: "请输入用户标识",
              //   trigger: "blur"
              // }]
            },
            {
              label: "商品描述",
              prop: "body",
              overHidden: true,
              // rules: [{
              //   required: true,
              //   message: "请输入商品描述",
              //   trigger: "blur"
              // }]
            },
            {
              label: "账单时间",
              prop: "billDate",
              type: "datetime",
              format: 'yyyy-MM-dd HH:mm:ss',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
              // rules: [{
              //   required: true,
              //   message: "请输入账单时间,具体请查看对应支付平台",
              //   trigger: "blur"
              // }]
            },
            // {
            //   label: "账单类型,具体请查看对应支付平台",
            //   prop: "billType",
            //   rules: [{
            //     required: true,
            //     message: "请输入账单类型,具体请查看对应支付平台",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "备注",
              prop: "rmks",
              showColumn:false,
              // rules: [{
              //   required: true,
              //   message: "请输入备注",
              //   trigger: "blur"
              // }]
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
          addBtn: this.vaildData(this.permission.payorder_add, false),
          viewBtn: this.vaildData(this.permission.payorder_view, false),
          delBtn: this.vaildData(this.permission.payorder_delete, false),
          editBtn: this.vaildData(this.permission.payorder_edit, false)
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
