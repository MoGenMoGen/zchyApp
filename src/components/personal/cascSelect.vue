<template>
<!--
级联选择器-2级别

-->
  <div id="addr">
      <van-row @click="showPop = true" class="select-row" >
          <van-col span="20" offset="1">
              <input v-model="name" :placeholder="place" disabled>
          </van-col>
          <van-col span="2">
              <van-icon name="arrow-down" />
          </van-col>
      </van-row>

<!--	  show-toolbar是否显示顶部栏-->
	<van-popup v-model="showPop" position="bottom" >
		<van-picker show-toolbar
					:columns="list"
					value-key="nm"
					@cancel="onCancel"
					@confirm="onConfirm"
					@change='onChange'
					ref="picker">
		</van-picker>
	</van-popup>
  </div>
</template>
<script>
  export default {
    props:{

		//占位提示
		place:{
			type:String,
			default:"请选择"
		}
	},


    data(){
      return{
        addr:{
          province:'',
			provinceId:'',
          city:'',
			cityId:'',

        },
          proviceIndex:0,//省级列表索引
          cityIndex:0,//市级列表索引
          provinceList:[],//选中省级列表
          cityList:[],//选中市级列表
          ifFirst:true,//首次加载

		list:[{ values: [] }, { values: [] }],
		name:'',//组件中最后选择地址的值，
		  showPop:false,//是否显示弹框
      }
    },
    components: {
    },
    watch:{
		showPop(newVal,oldVal){
			if(newVal && !oldVal){
				//首先获得省级数据
				if(this.ifFirst){
					this.getProvice('100000')
					this.ifFirst=false
				}

			}
		}
    },
    computed: {
    },
    mounted(){

    },
    methods:{
		onCancel(){
			this.showPop=false
		},
       //
		onConfirm(values) {
			this.showPop=false
			window.console.log("选中的值》》》")
			window.console.log(values)

		},
		//Picker 实例，values所有列选中值，index当前列对应的索引,index==0省级数据变动,index==1市级数据变动,index==2县级数据变动
		onChange(picker, values,index){

			let indexList=this.$refs.picker.getIndexes()
			if(index==0){
				//省级数据变动
                this.proviceIndex=indexList[0]
				window.console.log("省级索引："+this.proviceIndex)
				this.cityIndex=0
				this.addr.province=values[0].nm
				this.addr.provinceId=values[0].id
				this.getCity(this.provinceList[this.proviceIndex].id)
			}else if(index==1){
				this.cityIndex=indexList[1]
				this.addr.city=values[1].nm
				this.addr.cityId=values[1].id
                this.$emit('change',this.addr)
                this.setName()
			}

		},

      async getProvice(pid){
        this.provinceList = await this.api.getClassify2(pid)
         // this.provinceList=this.list
          this.list[0].values =this.provinceList
          this.addr.province=this.provinceList[0].nm
          this.addr.provinceId=this.provinceList[0].id

//选中第一条数据
        this.getCity(this.provinceList[this.proviceIndex].id)
      },
		async getCity(pid){
			this.cityList = await this.api.getShipClassify(pid)
			this.list[1].values = this.cityList
			this.addr.city=this.cityList[0].nm
			this.addr.cityId=this.cityList[0].id
            this.$emit('change',this.addr)
            this.setName()

		},

		/*
           设置默认值，用于父组件调用子组件方法
           this.$refs.addSelect.setDefault("浙江省-宁波市-宁海县")
            */
		setDefault(val){
			this.name=val
		},
		setName(){
			this.name=this.addr.province+"-"+this.addr.city
		}

    }
  }
</script>
<style lang="less" scoped>

  #addr{
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

