<template>
  <basic-container>
    <el-row class="block-col-2">
      <el-col :span="6">
        <el-card class="box-card" shadow="hover" style="height: 790px">
          <avue-crud :data="mpList" :option="option"
                     @row-click="handleRowClick"
                     @refresh-change="refreshChange"
          ></avue-crud>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card" shadow="hover" style="height: 790px">
          <span style="text-align: center;display:block;">{{appMpNm}}</span>
          <avue-crud :option="menuOption" :data="menuData" v-model="form"
                     @refresh-change="menuRefreshChange"
                     @row-del="rowDel"
          >
            <template slot-scope="scope" slot="menuLeft">
              <el-button type="primary" icon="el-icon-plus" size="small" plain @click.stop="handleAdd()">新增</el-button>
              <el-button type="success" icon="el-icon-plus" size="small" plain @click.stop="createMenu()">发布菜单</el-button>
            </template>
            <template slot-scope="scope" slot="menu" >
              <el-button type="text" icon="el-icon-edit" size="small" @click.stop="handleUpd(scope.row)" >修改</el-button>
            </template>
          </avue-crud>
        </el-card>
      </el-col>
    </el-row>
    <!--新增修改-->
    <el-dialog :title="dialogTitle" width="70%" :visible.sync="formVisible"
               append-to-body @close="resetForm">
      <avue-form v-model="form" :option="menuOption" @submit="submit" v-if="formVisible"></avue-form>
    </el-dialog>
  </basic-container>

</template>

<script>
  import {getMpList, getTreeMenuList, getDetail, remove, add, update, listByNullPid, createMenu} from "@/api/wxmp/menuconfig";

  export default {
    data() {
      return {
        // 是否显示
        formVisible: false,
        // dialog标题
        dialogTitle: '',
        //当前切换的公众号appId
        appId: '',
        appMpNm: '',
        form: {
          type: ''
        },
        mpList: [],
        option: {
          columnBtn: false,
          refreshBtn: true,
          addBtn: false,
          menu: false,
          page: false,
          align: 'center',
          menuAlign: 'center',
          height: '700',
          column: [
            {
              label: '公众号名称',
              prop: 'name'
            }
          ]
        },
        menuData: [],
        menuOption: {
          headerAlign: 'center',
          align: 'center',
          border: false,
          index: false,
          addBtn: false,
          columnBtn: false,
          editBtn: false,
          page: false,
          defaultExpandAll: true,
          column: [
            {
              label: "上级",
              prop: "pid",
              type: "select",
              hide: true,
              props: {
                label: "name",
                value: "id"
              },
            }, {
              label: "标题",
              prop: "name",
              align: 'left',
              rules: [{
                required: true,
                message: "请输入标题",
                trigger: "blur"
              }]
            },
            {
              label: "响应动作类型",
              type: "select",
              prop: "type",
              dicData: [
                {
                  label: "跳转链接",
                  value: 'view'
                },
                {
                  label: "跳转程序",
                  value: 'miniprogram'
                }
              ],
              rules: [{
                required: true,
                message: "请输入响应动作类型",
                trigger: "blur"
              }]
            }
            ,
            {
              label: "网页链接",
              prop: "url",
              hide: true,
              display: false,
              rules: [{
                required: true,
                message: "请输入网页链接",
                trigger: "blur"
              }]
            },
            {
              label: "小程序的appid",
              prop: "appid",
              hide: true,
              display: false,
              rules: [{
                required: true,
                message: "请输入小程序的appid",
                trigger: "blur"
              }]
            },
            {
              label: "小程序的页面路径",
              prop: "pagepath",
              hide: true,
              display: false,
              rules: [{
                required: true,
                message: "请输入小程序的页面路径",
                trigger: "blur"
              }]
            },
            {
              label: "排序",
              prop: "seq",
              rules: [{
                required: true,
                message: "请输入排序",
                trigger: "blur"
              }]
            }
          ],
        }
      };
    },
    computed: {},
    watch: {
      'form.type'() {
        let url =this.findObject(this.menuOption.column,'url');
        let appid =this.findObject(this.menuOption.column,'appid');
        let pagepath =this.findObject(this.menuOption.column,'pagepath');
        if (this.form.type !== '' && this.form.type === 'view') {
          url.display = true
          appid.display = false
          pagepath.display = false
        }else{
          url.display = false
          appid.display = true
          pagepath.display = true
        }
      },
      'form.pid'() {
        if(this.form.pid === -1) this.form.pid = null
        if(this.form.pid === '-1') this.form.pid = null
      }
      ,
      'appId'() {
        this.getPidList()
      }
    },
    methods: {
      getMpList() {
        getMpList().then(res => {
          this.mpList = res.data.data
          if (this.mpList.length != 0) {
            this.appId = this.mpList[0].appId
            this.appMpNm = this.mpList[0].name
            this.form.wxMpAppId = this.appId
          }
          this.getTreeMenuList();
        });
      },
      refreshChange() {
        this.getMpList()
      },
      handleRowClick(row) {
        this.appId = row.appId
        this.appMpNm = row.name
        this.getTreeMenuList();
        this.form.wxMpAppId = this.appId
      },
      getTreeMenuList() {
        getTreeMenuList(this.appId).then(res => {
          this.menuData = res.data.data
        });
        this.getPidList()// 如果一级菜单发生改变需要刷新列表
      },
      menuRefreshChange() {
        this.getTreeMenuList()
      },
      handleAdd() {
        this.form.type = 'view'
        this.formVisible = true
        this.dialogTitle = '新增'
      },
      createMenu() {
        createMenu(this.appId).then(() => {
          this.$message({
            type: "success",
            message: "创建成功!"
          });
          setTimeout(()=>{
          },1000)
        }, error => {
          window.console.log(error);
        });
      },
      handleUpd(row) {
        getDetail(row.id).then(res => {
          this.form = res.data.data;
          this.form.pid = res.data.data.pid.toString()
          this.formVisible = true
          this.dialogTitle = '修改'
        });
      },
      getPidList() {
        listByNullPid(this.appId).then(res => {
          let pid =this.findObject(this.menuOption.column,'pid');
          pid.dicData = res.data.data
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
            this.getTreeMenuList()
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      resetForm() { this.form = {}},
      submit(form,done) {
        this.form.wxMpAppId = this.appId
        if(this.form.id){
          update(this.form).then(() => {
            this.getTreeMenuList();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.formVisible = false
            setTimeout(()=>{
              done()
            },1000)
          }, error => {
            window.console.log(error);
          });
        }else{
          add(this.form).then(() => {
            this.getTreeMenuList();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.formVisible = false
            setTimeout(()=>{
              done()
            },1000)
          }, error => {
            window.console.log(error);
          });
        }
      },

    }
    ,
    mounted() {
      this.getMpList()
    }
  }
  ;
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>
