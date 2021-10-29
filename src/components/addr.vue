<template>
  <div id="addr">
	<van-popup v-model="showProvr" position="bottom">
	    <van-picker
	      show-toolbar
	      :columns="list"
		  value-key="nm"
	      @cancel="showProvr = false"
	      @confirm="onConfirm"
		  @change='onChange'
	    />
	</van-popup>
    <span @click="showProvr=true" :class="ifBorder?'borderS':''">{{addr.province?addr.province:'省'}}</span>
	<span @click="showProvr=true" :class="ifBorder?'borderS':''">{{addr.city?addr.city:'市'}}</span>
	<span @click="showProvr=true" :class="ifBorder?'borderS':''">{{addr.region?addr.region:'区'}}</span>
  </div>
</template>
<script>
  import {mapState} from "vuex";
  export default {
    props:['ifBorder','addrNm'],
    data(){
      return{
		  showProvr:false,	//省级显示
		  showCity:false,	//市级显示
		  showRegion:false,	//区级显示
        addr:{
          province:'',
          provinceId:'',
          city:'',
          cityId:'',
          region:'',
          regionId:''
        },
        addrInfo:[],
		provinceList:[],
		cityList:[],
		regionList:[],
		list:[
            {
                values: '',
				defaultIndex:0
            },{
                values: '',
                defaultIndex: 0
            },{
                values: '',
                defaultIndex: 0
            }
		],
      }
    },
    components: {
    },
    watch:{
      addrInfo(){

      },
      'addr.provinceId'(id){
        this.getCity(id)
      },
      'addr.cityId'(id){
        this.getRegion(id)
      }
    },
    computed: {
    },
    mounted(){
		if(this.addrNm){
			this.getProvice(this.addrNm)
		}else{
			this.getProvice()
		}
    },
    methods:{
		onConfirm(value) {
			console.log(value)
			this.$emit('changeAddr',JSON.stringify(this.addr))
		    this.showProvr = false;
		},
		onChange(picker, values,index){
			console.log(values)
			this.list[0].defaultIndex=0
			this.list[1].defaultIndex=0
			this.list[2].defaultIndex=0
			if(index==0){
				this.addr.province = values[0].nm
				this.addr.provinceId = values[0].id
			}else if(index==1){
				this.addr.city = values[1].nm
				this.addr.cityId = values[1].id
			}else if(index==2){
				this.addr.region = values[2].nm
				this.addr.regionId = values[2].id
			}
			this.$emit('changeAddr',JSON.stringify(this.addr))
		},
      async getProvice(data){
        let qry = this.query.new()
        this.query.toW(qry,'pid','100000','EQ')
        this.provinceList = await this.api.getAddr(this.query.toEncode(qry))
		if(data){
		  this.addrInfo=data.split('-')
		}
		if(this.addrInfo[0]){
		  this.addr.province = this.addrInfo[0]
		  let info = this.provinceList.find(item=>item.nm==this.addr.province)
		  let index = this.provinceList.findIndex(item=>item.nm==this.addr.province)
		  if(info){
			this.addr.provinceId = info.id
			this.addrInfo[0]=''
			this.list[0].defaultIndex=index
		  // this.onChange('',[info],0)
		  }
		}else{
		  this.addr.province = this.provinceList[0].nm
		  this.addr.provinceId = this.provinceList[0].id
		}

		this.list[0].values = Object.values(this.provinceList).map(function(e){
		    return {nm:e.nm,id:e.id}
		})


		 // this.getCity(this.addr.provinceId)
      },
      async getCity(id){
        let qry = this.query.new()
        this.query.toW(qry,'pid',id,'EQ')
        this.cityList = await this.api.getAddr(this.query.toEncode(qry))
        if(this.addrInfo[1]){
          this.addr.city = this.addrInfo[1]
          let info = this.cityList.find(item=>item.nm==this.addr.city)
		  let index = this.cityList.findIndex(item=>item.nm==this.addr.city)
		  if(info){
			this.addr.cityId = info.id
			this.addrInfo[1]=''
			this.list[1].defaultIndex=index
		  }
		  // this.onChange('',['',info],1)
        }else {
          this.addr.city = this.cityList[0].nm
          this.addr.cityId= this.cityList[0].id
        }
		this.list[1].values = Object.values(this.cityList).map(function(e){
		    return {nm:e.nm,id:e.id}
		})
		// this.getRegion(this.addr.cityId)
      },
      async getRegion(id){
        let qry = this.query.new()
        this.query.toW(qry,'pid',id,'EQ')
        this.regionList = await this.api.getAddr(this.query.toEncode(qry))
        if(this.addrInfo[2]){
		  // console.log(this.regionList)
		  // console.log(this.addrInfo)
          this.addr.region = this.addrInfo[2]
          let info = this.regionList.find(item=>item.nm==this.addr.region)
		  let index = this.regionList.findIndex(item=>item.nm==this.addr.region)
		  if(info){
			this.addr.regionId = info.id
			this.addrInfo[2]=''
			this.list[2].defaultIndex=index
		  }

		  // this.onChange('',['','',info],2)
        }else {
          this.addr.region = this.regionList[0].nm
          this.addr.regionId = this.regionList[0].id
        }
		this.list[2].values = Object.values(this.regionList).map(function(e){
		    return {nm:e.nm,id:e.id}
		})
		this.$emit('changeAddr',JSON.stringify(this.addr))
      }
    }
  }
</script>
<style lang="less">
  @import url("../assets/css/mobile.less");
  #addr{
    width: 100%;
    display: flex;
    display: -webkit-flex;
    align-items: center;
	justify-content: space-between;
    padding-right: 0.55rem;
	flex: 1;
	font-size: 0.24rem;
    .borderS{
		border: 1px solid #DDDDDD;
		margin-right: 0.23rem;
		height: 0.6rem;
		flex: 1;
		line-height: 0.6rem;
		text-align: center;
		white-space:nowrap;
	}
	.borderS:last-child{
		margin-right: 0;
	}
  }
</style>

