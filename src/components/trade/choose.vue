<template>
  <div class="choose">
	  <div class="chooseMain">
		  <div class="classifyList" v-for="(item,index) in allList" :key="index">
			  <p>
				  <b>{{item.fl}}级分类</b>
				  <span v-if="item.list.length>6" @click="change(item)">
					  全部
					  <van-icon name="arrow-up" v-show="!item.ifAll" />
					  <van-icon name="arrow-down" v-show="item.ifAll"/>
				  </span>
			  </p>

			  <ul v-show="!item.ifAll">
				  <li v-for="(v,i) in item.list.slice(0,6)" :key="i" :class="{active:v.id==checkLists[index]}"  @click="toCheck(v.id,index)">
					  {{v.nm}}
				  </li>
			  </ul>
			  <ul v-show="item.ifAll">
				  <li v-for="(v,i) in item.list" :key="i" :class="{active:v.id==checkLists[index]}" @click="toCheck(v.id,index)">
					  {{v.nm}}
				  </li>
			  </ul>

		  </div>
	  </div>
	  <div class="btn">
		  <p @click="reset">重置</p><p @click="confirm">确定</p>
	  </div>
  </div>
</template>
<script>
  import {mapState} from "vuex";
  export default {
      props:['type'],
    data(){
      return{
          allList:[],
          checkLists:[],
      }
    },
    components: {
    },
    watch:{


    },
    computed: {
    },
    mounted(){

    },
    methods:{
          //重置
        reset(){
            this.checkLists = []
			this.allList.splice(1)
		},
        confirm(){
            this.$emit('confirm',this.checkLists)
		},
        change(item){
          item.ifAll =   !item.ifAll
		},
		//选中
        toCheck(id,index){
            this.checkLists[index] = id
			this.checkLists.splice(index+1)
			// this.allList.splice(index)
			this.getShipClassify(id,index+1)
		},
		//船舶信息
        async getShip(checkList,id){
            this.checkLists = JSON.parse(JSON.stringify(checkList))
			console.log(this.checkLists)
            this.allList = []
			if(this.type=='ship'){  //船舶，直接调接口获取船舶分类下的所有分类列表作为一级分类
                this.getShipClassify(id,0)
			}else { //产品，需要先获取除把船舶排除掉的其他分类作为一级分类
                let qry = this.query.new()
                this.query.toWNull(qry,'pid')
                this.query.toW(qry,'id',this.$store.state.shipId,'NE')
                this.query.toO(qry,'seq','asc')
                let data =await this.api.getClassify(this.query.toEncode(qry))
                this.allList.push({
					list:data,
					fl:'一'
				})
				if(this.checkLists.length>0){ //如果一级有选中的则继续获取二级分类
                    this.getShipClassify(this.checkLists[0],1)
                }
			}

		},
        //船舶分类
		async getShipClassify(id,index){ //id是父级的id，index是当前的索引值
            // console.log(id)
            let qry = this.query.new()
            this.query.toW(qry,'pid',id,'EQ')
            this.query.toO(qry,'seq','asc')

            let data = await this.api.getClassify(this.query.toEncode(qry))
            if(data.length==0 ){ //当前分类没有数据停止
                // console.log('没有了')
                this.checkLists.splice(index+1)
                this.allList.splice(index+1)
                // console.log(this.allList)
                return
            }
			let fl =''
            if(index==0){
               fl='一'
            }
            if(index==1){
                fl='二'
            }
            if(index==2){
                fl='三'
            }
            let info = {
                list:data,
                fl:fl,
				ifAll:false,
            }

            // this.allList.push(info)

            this.$set(this.allList,index,info)
            if( !this.checkLists[index]){ //当前分类没有选中的，停止
                // console.log('没有了')
                this.checkLists.splice(index+1)
                this.allList.splice(index+1)
                // console.log(this.allList)
                return
            }
            if(this.checkLists[index]){
                this.getShipClassify(this.checkLists[index],index+1)
            }
		},

    }
  }
</script>
<style lang="less">
  @import url("../../assets/css/mobile.less");
  .choose{
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
	font-size: 0.24rem;
	height: 100%;
	.chooseMain{
		flex: 1;
		height: 100%;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
	}
	  .btn{
		  width: 100%;
		  display: flex;
		  display: -webkit-flex;
		  p{
			  flex: 1;
			  text-align: center;
			  font-size: 0.3rem;
			  height: 0.9rem;
			  line-height: 0.9rem;
			  &:first-of-type{
				  border-top: 1px solid #9A9A9A;
				  color: #666666;
			  }
			  &:last-of-type{
				  border-top: 1px solid @themeColor;
				  background: @themeColor;
				  color: #FFFFFF;
			  }
		  }
	  }
    .classifyList{
		border-bottom: 1px solid rgba(0,0,0,0.1);
		padding: 0 0.3rem;
		&:last-of-type{
			border-bottom: 0;
		}
		>p{
			display: flex;
			display: -webkit-flex;
			width: 100%;
			padding-top: 0.4rem;
			margin-bottom: 0.3rem;
			align-items: center;
			b{
				font-size: 0.28rem;
				color: #343434;
				flex: 1;
			}
			span{
				font-size: #9a9a9a;
				display: flex;
				display: -webkit-flex;
				align-items: center;
			}
		}

		ul{
			overflow: hidden;
			display: flex;
			display: -webkit-flex;
			flex-wrap: wrap;
			li{
				border-radius: 0.05rem;
				float: left;
				border: 1px solid #CCCCCC;
				color: #9a9a9a;
				width: 30%;
				height: 0.45rem;
				text-align: center;
				line-height: 0.45rem;
				margin-bottom: 0.3rem;
				box-sizing: border-box;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				&:nth-of-type(3n+2){
					margin: 0 5%;
				}
			}
			li.active{
				background: @themeColor;
				color: #FFFFFF;
				border: 1px solid @themeColor;
			}
		}
	}
  }
</style>

