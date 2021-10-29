<template>

    <div id="select">
        <van-row @click="showPicker = true" class="select-row" type="flex" align="center">
            <van-col span="20" offset="1"  >
                <p v-if="result.length>0">{{name}}</p>
                <p v-else class="place">{{place}}</p>

            </van-col>
            <van-col span="2">
                <van-icon name="arrow-down" />
            </van-col>
        </van-row>
        <van-popup v-model="showPicker" position="bottom":style="{ height: '40%' }">
            <div class="group">
                <van-row class="pop-row" type="flex" align="center"
                         v-for="(item,index) in list"
                         :key="index"
                         @click="toChoose(index)">
                    <van-col span="20" offset="1"><p>{{item[text]}}</p></van-col>
                    <van-col span="2" >
                        <img :src="icChecked" class="check" v-if="result.indexOf(index)>-1">
                    </van-col>
                </van-row>

            </div>
        </van-popup>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                icChecked:'https://sinovat.oss-cn-shanghai.aliyuncs.com/e8f80bca212b425c81bd0b1fa523a51c_multe-checked.png',
                name: "",//input 显示的值
                showPicker: false,
                result:[],//结果列表，['a', 'b'],以逗号分隔
            };
        },
        props:{
          //  键值，需要显示的选中值的属性名
          text:{
              type:String,
          },
          //  数组选择器显示的数组
          list:{
              type:Array,

          },
            //占位提示
            place:{
                type:String,
                default:"请选择"
            }



        },
        watch:{
          result(){
              this.name=''
              this.result.forEach(item =>{
                  this.name=this.name+this.list[item].nm+","
              })
              if(this.name.length >0){
              //    去掉最后一个逗号
                  this.name = this.name.substring(0, this.name.lastIndexOf(','));
              }
              //将选中索引列表发送给父组件
              this.$emit('change',JSON.stringify(this.result))
          }
        },

        methods: {
            toChoose(index){
                if(this.result.indexOf(index) > -1){
                //    包含某元素，则将其移除
                    let dex=-1
                    for(let i=0;i<this.result.length;i++){
                        if(this.result[i]==index){
                            dex=i;
                            break
                        }
                    }
                    this.result.splice(dex,1)
                }else{
                    this.result.push(index)
                }
            }

        },

    };
</script>

<style lang="less" scoped>
    #select {
        box-sizing: border-box;
        width: 100%;
        border-radius: 5px;
        border: 1px solid rgba(0,0,0,0.1);
        padding: 0.12rem 0;
        /*padding: 8px 0;*/
        .select-row{
            .place{
                color: #B8B8B8;
            }

        }
    }
    /*弹框*/
    .group{

        padding: 0 20px;
        .pop-row{

            padding: 10px 30px;
            color: #343434;
            border-bottom: 1px solid rgba(0,0,0,0.1);

            /*选中图标*/
            .check{
                width: 50%;
            }

        }


    }
</style>
