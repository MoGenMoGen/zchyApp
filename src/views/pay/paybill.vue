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
<!--      <template slot="menuLeft">-->
<!--        <el-button type="danger"-->
<!--                   size="small"-->
<!--                   icon="el-icon-delete"-->
<!--                   plain-->
<!--                   v-if="permission.paybill_delete"-->
<!--                   @click="handleDelete">删 除-->
<!--        </el-button>-->
<!--      </template>-->
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/pay/paybill";
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
          border: true,
          index: true,
          viewBtn: true,
          addBtn: false,
          editBtn: false,
          delBtn: false,
          selection: true,
          dialogClickModal: false,
          menuWidth: 100,
          column: [
            {
              label: "交易时间",
              prop: "transDate",
              type: "datetime",
              format:'yyyy-MM-dd HH:mm:ss',
              valueFormat:'yyyy-MM-dd HH:mm:ss',
              width:130,
              rules: [{
                required: true,
                message: "请输入交易时间",
                trigger: "blur"
              }]
            },
            // {
            //   label: "公众账号ID",
            //   prop: "commonId",
            //   rules: [{
            //     required: true,
            //     message: "请输入公众账号ID",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "商户号",
            //   prop: "businessNo",
            //   rules: [{
            //     required: true,
            //     message: "请输入商户号",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "特约商户号",
            //   prop: "childBusinessNo",
            //   rules: [{
            //     required: true,
            //     message: "请输入特约商户号",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "设备号",
            //   prop: "equipmentNo",
            //   rules: [{
            //     required: true,
            //     message: "请输入设备号",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "微信订单号",
              prop: "wxOrderNo",
              width:150,
              overHidden: true,
              rules: [{
                required: true,
                message: "请输入微信订单号",
                trigger: "blur"
              }]
            },
            {
              label: "商户订单号",
              prop: "businessOrderNo",
              width:100,
              overHidden: true,
              rules: [{
                required: true,
                message: "请输入商户订单号",
                trigger: "blur"
              }]
            },
            {
              label: "用户标识",
              prop: "userIdentity",
              width:150,
              overHidden: true,
            //   rules: [{
            //     required: true,
            //     message: "请输入用户标识",
            //     trigger: "blur"
            //   }]
            },
            {
              label: "交易类型",
              prop: "transType",
              rules: [{
                required: true,
                message: "请输入交易类型",
                trigger: "blur"
              }]
            },
            {
              label: "交易状态",
              prop: "transStatus",
              rules: [{
                required: true,
                message: "请输入交易状态",
                trigger: "blur"
              }]
            },
            {
              label: "付款银行",
              prop: "paymentBank",
              rules: [{
                required: true,
                message: "请输入付款银行",
                trigger: "blur"
              }]
            },
            {
              label: "货币种类",
              prop: "currency",
              rules: [{
                required: true,
                message: "请输入货币种类",
                trigger: "blur"
              }]
            },
            {
              label: "应结订单金额",
              prop: "totalAmount",
              rules: [{
                required: true,
                message: "请输入应结订单金额",
                trigger: "blur"
              }]
            },
            {
              label: "代金券金额",
              prop: "voucherAmount",
              rules: [{
                required: true,
                message: "请输入代金券金额",
                trigger: "blur"
              }]
            },
            {
              label: "微信退款单号",
              prop: "wxRefundNo",
              overHidden: true,
              width:150,
              rules: [{
                required: true,
                message: "请输入微信退款单号",
                trigger: "blur"
              }]
            },
            {
              label: "商户退款单号",
              prop: "businessRefundNo",
              overHidden: true,
              width:150,
              rules: [{
                required: true,
                message: "请输入商户退款单号",
                trigger: "blur"
              }]
            },
            {
              label: "退款金额",
              prop: "refundAmount",
              rules: [{
                required: true,
                message: "请输入退款金额",
                trigger: "blur"
              }]
            },
            {
              label: "充值券退款金额",
              prop: "voucherRefundAmount",
              rules: [{
                required: true,
                message: "请输入充值券退款金额",
                trigger: "blur"
              }]
            },
            {
              label: "退款类型",
              prop: "refundType",
              rules: [{
                required: true,
                message: "请输入退款类型",
                trigger: "blur"
              }]
            },
            {
              label: "退款状态",
              prop: "refundStatus",
              rules: [{
                required: true,
                message: "请输入退款状态",
                trigger: "blur"
              }]
            },
            {
              label: "商品名称",
              prop: "businessName",
              overHidden: true,
              width:150,
              rules: [{
                required: true,
                message: "请输入商品名称",
                trigger: "blur"
              }]
            },
            {
              label: "商户数据包",
              prop: "businessData",
              rules: [{
                required: true,
                message: "请输入商户数据包",
                trigger: "blur"
              }]
            },
            {
              label: "手续费",
              prop: "fee",
              rules: [{
                required: true,
                message: "请输入手续费",
                trigger: "blur"
              }]
            },
            {
              label: "费率",
              prop: "rate",
              rules: [{
                required: true,
                message: "请输入费率",
                trigger: "blur"
              }]
            },
            {
              label: "订单金额",
              prop: "orderAmount",
              rules: [{
                required: true,
                message: "请输入订单金额",
                trigger: "blur"
              }]
            },
            {
              label: "申请退款金额",
              prop: "amountRefundApplication",
              rules: [{
                required: true,
                message: "请输入申请退款金额",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "rmks",
              rules: [{
                required: true,
                message: "请输入备注",
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
          addBtn: this.vaildData(this.permission.paybill_add, false),
          viewBtn: this.vaildData(this.permission.paybill_view, false),
          delBtn: this.vaildData(this.permission.paybill_delete, false),
          editBtn: this.vaildData(this.permission.paybill_edit, false)
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
