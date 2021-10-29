<template>
  <div id="wangeEitor">
    <div ref="wangeditor"></div>
  </div>
</template>
<script>
  import E from 'wangeditor'

  // import {baseUrl} from "../../assets/js/util";

  export default{
    name: 'wangeditor',
    data () {
      return {
        editorContents: '',
        editor: null
      }
    },
    props: ['getEditConts', 'insertImg'],
    mounted () {
      let _this = this
      this.editor = new E(this.$refs.wangeditor)
      // 开启上传base64
      // this.editor.customConfig.uploadImgShowBase64 = true
      // editor.customConfig.onchangeTimeout = 500;

      this.editor.customConfig.onchange = (html) => {
        this.editorContents = html
        this.getEditConts(html)
      }

      let baseUrl='https://www.sinovatocean.com'
      this.editor.customConfig.uploadImgServer = `${baseUrl}/general/oss/upload`
      // let baseUrl = process.env.NODE_ENV !== 'production'  ? '/api/' : config.serverUrl

      /*
      可以不写baseurl
      */
      // this.editor.customConfig.uploadImgServer = '/general/oss/upload2'
      // editor.customConfig.uploadFileName = '自定义的文件名'
      this.editor.customConfig.uploadImgHeaders = {
        'Accept': '*/*',
        'sinovat-token':  this.until.loGet('token')    // 头部token
      }

      this.editor.customConfig.menus = [          // 菜单配置
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        'video',  // 插入视频
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ]
      /*
      以通过lang配置项配置多语言，其实就是通过该配置项中的配置，将编辑器显示的文字，替换成你需要的文字。
      以下代码中的链接文字要写在链接前面，上传图片要写在上传前面，因为前者包含后者。如果不这样做，可能会出现替换不全的问题，切记切记！
       */


      this.editor.customConfig.lang = {
        '设置标题': 'title',
        '正文': 'p',
        '链接文字': 'link text',
        '链接': 'link',
        '上传图片': 'upload image',
        '上传': 'upload',
        '创建': 'init',
        '网络图片':'network picture',
        '对齐方式':'Alignment mode',
        '靠左':'left',
        '居中':'center',
        '靠右':'right',
        '插入表格':'Insert form',
        '插入视频':'Insert video',
        '插入':'insert',//插入要放在插入视频后边，否则会转换不全
        '背景色':'background',
        '文字颜色':'font color',
        '设置列表':'Set list',
        '有序列表':'Ordered list',
        '无序列表':'Unordered list',

        // 还可自定添加更多
      }



      this.editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
        },
        success: function (xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        fail: function (xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function (xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function (xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          if (Object.prototype.toString.call(_this.insertImg) === '[object Function]') {
            _this.insertImg(result, insertImg, editor)
          }
          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      }
// 使用英语
//       this.editor.config.lang = E.langs['en'];
      // 创建编辑器
      this.editor.create()
    },
    methods: {
      init () {
        this.editorContents = ''
        this.editor.txt.html('')
      },
      setEditorContent (value) {
        this.editorContents = value
        this.editor.txt.html(value)
      },
      setEditorDisable () {
        this.editor.$textElem.attr('contenteditable', false)
      },
      setEditorEnable () {
        this.editor.$textElem.attr('contenteditable', true)
      }
    }
  }
</script>

<style>
  /*适配移动端*/
  .w-e-toolbar{
    flex-wrap: wrap;
  }
  .w-e-toolbar .w-e-menu{
    display: inline-block;
    /*用class覆盖style样式*/
    z-index: 50 !important;
  }
  .w-e-text-container{
    z-index: 50 !important;
  }

</style>
