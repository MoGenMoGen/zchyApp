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
<!--                   v-if="permission.payrefund_delete"-->
<!--                   @click="handleDelete">删 除-->
<!--        </el-button>-->
<!--      </template>-->
      <template slot="types" slot-scope="scope">
        <el-tag v-if="scope.row.types === 1" size="small">退款</el-tag>
        <el-tag v-if="scope.row.types === 2" size="small" type="warning">通知</el-tag>
      </template>
      <template slot="channel" slot-scope="scope">
        <el-tag v-if="scope.row.channel === 'wxPay'" size="small">微信</el-tag>
        <el-tag v-if="scope.row.channel === 'ALIPAYACCOUNT'" size="small" type="warning">支付宝</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/pay/payrefund";
  import {mapGetters} from "vuex";

  var DIC = {
      types: [{
          label: '退款',
          value: 1
      }, {
          label: '通知',
          value: 2
      }],
      channel: [{
          label: '微信',
          value: 'wxPay'
      }, {
          label: '支付宝',
          value: 'ALIPAYACCOUNT'
      }]
  }

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
          editBtn: false,
          delBtn: false,
          addBtn: false,
          selection: true,
          menuWidth: 100,
          dialogClickModal: false,
          column: [
            // {
            //   label: "订单主键",
            //   prop: "orderId",
            //   overHidden: true,
            //   search: true,
              // rules: [{
              //   required: true,
              //   message: "请输入订单号",
              //   trigger: "blur"
              // }]
            // },
            {
              label: "支付订单号",
              prop: "tradeNo",
              overHidden: true,
              // rules: [{
              //   required: true,
              //   message: "请输入支付订单号",
              //   trigger: "blur"
              // }]
            },
            {
              label: "商户订单号",
              prop: "outTradeNo",
              overHidden: true,
              width:130,
              // rules: [{
              //   required: true,
              //   message: "请输入商户订单号",
              //   trigger: "blur"
              // }]
            },
            {
              label: "退款单号",
              prop: "outRefundNo",
              overHidden: true,
              width:130,
              // rules: [{
              //   required: true,
              //   message: "请输入退款单号",
              //   trigger: "blur"
              // }]
            },
            {
              label: "总金额",
              prop: "totalAmount",
              type: 'number',
              slot: true,
              width:100,
              // rules: [{
              //   required: true,
              //   message: "请输入总金额",
              //   trigger: "blur"
              // }]
            },
            {
              label: "退款金额",
              prop: "refundAmount",
              type: 'number',
              slot: true,
              width:100,
              // rules: [{
              //   required: true,
              //   message: "请输入退款金额",
              //   trigger: "blur"
              // }]
            },
            // {
            //   label: "用户标识",
            //   prop: "openId",
            //   rules: [{
            //     required: true,
            //     message: "请输入用户标识",
            //     trigger: "blur"
            //   }]
            // },
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
              label: "退款时间",
              prop: "refundDate",
              type: "datetime",
              format: 'yyyy-MM-dd HH:mm:ss',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
              width:130,
              // rules: [{
              //   required: true,
              //   message: "请输入退款时间",
              //   trigger: "blur"
              // }]
            },
            // {
            //   label: "通知地址",
            //   prop: "notifyUrl",
            //   rules: [{
            //     required: true,
            //     message: "请输入通知地址",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "通知时间",
            //   prop: "noticeTm",
            //   rules: [{
            //     required: true,
            //     message: "请输入通知时间",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "状态",
              prop: "types",
              type: "radio",
              width:100,
              search: true,
              dicData: DIC.types,
              mock: {
                  type: 'dic'
              },
              slot: true,
              // rules: [{
              //   required: true,
              //   message: "请输入状态（1：退款，2：通知）",
              //   trigger: "blur"
              // }]
            },
            {
              label: "退款渠道",
              prop: "channel",
              type: "radio",
              search: "true",
              width:100,
              dicData: DIC.channel,
              mock: {
                  type: 'dic'
              },
              slot: true,
              rules: [{
                required: true,
                message: "请输入退款渠道(微信,支付宝等)",
                trigger: "blur"
              }]
            },
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
          addBtn: this.vaildData(this.permission.payrefund_add, false),
          viewBtn: this.vaildData(this.permission.payrefund_view, false),
          delBtn: this.vaildData(this.permission.payrefund_delete, false),
          editBtn: this.vaildData(this.permission.payrefund_edit, false)
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
