<template>
  <div>
    <div style="border: 1px solid #eee" ref="canvasBox">
      <canvas class="canvasId"/>
    </div>
    <div class="btnBox">
      <van-button round type="info" @click="clear">重签</van-button>
      <van-button round type="info" @click="save">确定</van-button>
    </div>
  </div>
</template>

<script>
  import SignaturePad from 'signature_pad';
  import {Button,Notify} from 'vant'
    export default {
        name: "signature",
      components: {
        [Button.name]:Button,
        [Notify.Component.name]: Notify.Component,
      },
      data () {
        return {
          SignaturePad:null,
          config:{
            penColor: "#000000",   //笔刷颜色
            minWidth:3,       //最小宽度
          }
        }
      },
      mounted() {
        this.getCanvas()
      },
      methods: {
        getCanvas() {
          var canvas = document.querySelector('.canvasId');
          this.signaturePad = new SignaturePad(canvas, this.config);
          canvas.height = 200;
          canvas.width = this.$refs.canvasBox.clientWidth;
        },
        //保存
        save(){
          //默认保存为png格式
          // console.log(this.signaturePad.toDataURL())
          // console.log(this.signaturePad.toDataURL('image/jpeg'))
          // console.log(this.signaturePad.toDataURL('image/svg+xml'))
          // console.log(this.signaturePad.isEmpty())  //判断画布有没有内容,布尔型
          if(this.signaturePad.isEmpty()){
            Notify({ type: 'danger', message: '电子签名不能为空' });
          }else{
            this.$emit('setSign',this.signaturePad.toDataURL())
          }

        },
        //清除
        clear() {
          //清除画布内容
          this.signaturePad.clear();
        },
      }
    }
</script>

<style scoped lang="scss">
  .btnBox {
    padding: 10px;
    text-align: center;
  /deep/ .van-button--info {
    height: 30px;
    padding: 0 30px;
  &:first-child {
     margin-right: 30px;
   }
  }
  }
</style>