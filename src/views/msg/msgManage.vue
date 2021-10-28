<template>
  <basic-container>
    <avue-tabs :option="option" @change="handleChange"></avue-tabs>
    <span v-if="type.prop==='msg'"><msg ref="msg"></msg></span>
    <span v-else-if="type.prop==='msgUserLink'"><msgUserLink ref="msgUserLink"></msgUserLink></span>
    <span v-else-if="type.prop==='msgUserLinkLog'"><msgUserLinkLog ref="msgUserLinkLog"></msgUserLinkLog></span>
  </basic-container>
</template>

<script>
  import msg from './msg'
  import msgUserLink from './msguserlink'
  import msgUserLinkLog from './msguserlinklog'
  export default {
    data () {
      return {
        type: {},
        option:{
          column: [{
            icon:'iconfont iconicon_sms',
            label: '消息表',
            prop: 'msg',
          }, {
            icon:'iconfont iconicon_scan_namecard',
            label: '消息用户关联表',
            prop: 'msgUserLink',
          }, {
            icon:'iconfont iconicon_doc',
            label: '消息推送日志表',
            prop: 'msgUserLinkLog',
          }]
        }
      }
    },
    created(){
      this.type = this.option.column[0];
      console.log(this.type)
    },
    components: {
      msg, msgUserLink, msgUserLinkLog
    },
    methods:{
      handleChange(column) {
        this.type = column
      }
    }
  }
</script>

