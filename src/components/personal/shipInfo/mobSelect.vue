<template>
    <div id="select">
        <van-row @click="showPicker = true" class="select-row" >
            <van-col span="20" offset="1">
                <input v-model="name" :placeholder="place" disabled>
            </van-col>
            <van-col span="2">
                <van-icon name="arrow-down" />
            </van-col>
        </van-row>
        <van-popup v-model="showPicker" position="bottom":style="{ height: '40%' }">
            <van-picker
                    :value-key="text"
                    show-toolbar
                    :columns="list"
                    @cancel="showPicker = false"
                    @confirm="onConfirm"
            />
        </van-popup>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: "",//input 显示的值
                showPicker: false,
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
        //当列表切换的时候，清空name的值
        watch:{

        },

        methods: {
            //设置默认值
            setDefault(nm){
                this.name=nm
            },

            onConfirm(item) {
                //切换账号
                this.showPicker = false;
                this.name = item[this.text];

                this.$emit("change",item)
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
            input{
                width: 100%;
                color: #343434;
                border: none;
                background: none;
            }
            input::-webkit-input-placeholder {
                color: #B8B8B8;
            }

            input::-moz-placeholder {
                /* Mozilla Firefox 19+ */
                color: #B8B8B8;
            }

            input:-moz-placeholder {
                /* Mozilla Firefox 4 to 18 */
                color: #B8B8B8;
            }

            input:-ms-input-placeholder {
                /* Internet Explorer 10-11 */
                color: #B8B8B8;
            }
        }
    }
</style>
