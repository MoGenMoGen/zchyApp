<template>
  <el-dialog :title="dialogTitle" width="1200px" :visible.sync="formVisible"
             append-to-body>
    <avue-form :option="option" v-model="msg" ref="msgForm" @submit="submitMsg">
      <template slot-scope="scope" slot="userLinkList">
        <div>
          <el-transfer filterable="true" v-model="msg.userLinkList" :data="userList"></el-transfer>
        </div>
      </template>
    </avue-form>

    <!--    <el-form :model="vote" :rules="rules" ref="voteForm">-->
    <!--      <el-form-item label="标题" prop="title" label-width="55px">-->
    <!--        <el-input v-model="vote.title" autocomplete="off"></el-input>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="时间" label-width="55px">-->
    <!--        <el-date-picker-->
    <!--          v-model="vote.time"-->
    <!--          style="width: 100%;"-->
    <!--          type="date"-->
    <!--          value-format="yyyy-MM-dd"-->
    <!--          placeholder="选择日期"-->
    <!--          autocomplete="off">-->
    <!--        </el-date-picker>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="内容" label-width="55px">-->
    <!--        <el-input v-model="vote.content" autocomplete="off" type="textarea" :rows="5"></el-input>-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->
    <!--    <div slot="footer" class="dialog-footer">-->
    <!--      <el-button @click="formVisible = false">取 消</el-button>-->
    <!--      <el-button type="primary" @click="submitVote('voteForm')">确 定</el-button>-->
    <!--    </div>-->
  </el-dialog>
</template>

<script>
  import {getDetail, add} from "@/api/msg/msg";

  export default {
    data() {
      return {
        userList: [],
        // 是否显示
        formVisible: false,
        // dialog标题
        dialogTitle: '',
        // 表单映射模型
        msg: {
          id: '',
          title: '',
          content: '',
          type: '',
          pushType: '',
          publishTime: '',
          publisherId: '',
          userLinkList: []
        },
        msgUserLink: {
          id: '',
          title: '',
          content: '',
          type: '',
          publishTime: '',
          publisher: '',
          userLinkList: []
        },
        option: {
          emptyBtn: false,
          height:'auto',
          width: '600',
          calcHeight: 30,
          column: [
            {
              label: '发布类型',
              prop: 'pushType',
              span:24,
              dataType: "number",
              type: 'checkbox',
              border:true,
              dicData:[
                {
                  label: "短信",
                  value: 1
                },
                {
                  label: "邮件",
                  value: 2
                },{
                  label: "极光推送",
                  value: 3
                }
              ],
              rules: [{
                required: true,
                message: "请选择发布类型",
                trigger: "blur"
              }]
            },{
              label: "标题",
              prop: "title",
              rules: [{
                required: true,
                message: "请输入标题",
                trigger: "blur"
              }]
            },
            {
              label: "消息类型",
              prop: "type",
              type: "select",
              dicData: [
                {
                  label: "系统消息",
                  value: 1
                },
                {
                  label: "个人消息",
                  value: 2
                }],
              change: ({value}) => {
                this.msg.type = value
                if(value === 2) {
                  this.getUserList()
                  let column = this.findObject(this.option.column,'userLinkList')
                  column.display = true
                }
              },
              rules: [{
                required: true,
                message: "请选择消息类型(1:系统消息 ,2:个人消息)",
                trigger: "blur"
              }]
            },
            {
              label: "发布时间",
              prop: "publishTime",
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              rules: [{
                required: true,
                message: "请输入发布时间",
                trigger: "blur"
              }]
            },
            {
              label: "发布人",
              prop: "publisher",
              display: false,
              rules: [{
                required: true,
                message: "请输入发布人",
                trigger: "blur"
              }]
            },
            {
              label: "内容",
              prop: "content",
              component: "AvueUeditor",
              params:{
                options:{
                  action: '/api/blade-resource/oss/endpoint/put-file',
                  props: {
                    res: "data",
                    url: "link",
                  }
                }
              },
              span: 24,
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }]
            },
            {
              label: "消息接收用户",
              labelWidth: 120,
              span: 24,
              display: false,
              prop: "userLinkList",
              formslot:true,
              props: {
                label: "realName",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请选择消息接收用户",
                trigger: "blur"
              }]
            },
          ]
        }
      }
    },
    methods: {
      init(row) {
        this.userList = []
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs['msgForm'].resetFields()
          if (row) {
            this.dialogTitle = '修改'
            getDetail(row.id).then(res =>{
              if(res.data.code !== 200){
                return this.$message.error(res.msg)
              } else {
                this.msg = {
                  ...this.msg,
                  ...res.data.data
                }
              }
            })
          } else {
            this.dialogTitle = '新增'
          }
        })
      },
      // 获取全部用户
      getUserList() {
        this.$http.get(`/api/blade-user/user-list`).then(({data: res}) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          for (let i = 0; i < res.data.length; i++) {
            // 设置左边的data
            this.userList.push({
              key: res.data[i].id,
              label: res.data[i].realName
            })
          }
        }).catch(() => {
        })
      },

      submitMsg(msgForm,done){
        // 表单验证
        this.$refs['msgForm'].validate((valid) =>{
          if(valid){
            add(this.msg).then(res =>{
              if(res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功！'
                })
                this.formVisible = false
                setTimeout(()=>{
                  done()
                },1000)
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
            })
          }
        })
      }
    }
  }
</script>

