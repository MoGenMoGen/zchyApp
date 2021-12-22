<template>
    <div class="detailMain">
      <div class="tab">
		<div>
			<p @click="currentType=item.cd" :class="{active:currentType==item.cd}" v-for="(item,index) in tabList" :key="index" v-if="item.type.indexOf(type)>-1">
			  <span>{{item.nm}}</span>
			</p>
		</div>
        
      </div>
      <div>
        <div class="detailDesc" v-show="currentType=='detail'" style="padding-bottom: 0.2rem;">
          <!--仅船舶产品和船舶方案有下面的参数-->
          <div class="infoParam" v-if="info.ship || type=='manage'">
             <p><span class="lineC"></span>船舶主要参数</p>
            <ul>
              <li>船舶类型：{{param.typesNm}}</li><li>船体材质：{{param.hullMaterialNm}}</li>
              <li>船籍：{{param.registry}}</li><li>船舶状态：{{param.statusNm}}</li>
              <li>船舶航区：{{param.sailingAreaNm}}</li><li>完工日期：{{param.completeDate}}</li>
              <li>船舶证书签发日期：{{param.signDate}}</li><li>船舶总长(m)：{{param.totalLen}}</li>
              <li>公约船长(m)：{{param.pactLen}}</li><li>船舶型宽(m)：{{param.width}}</li>
              <li>船舶型深(m)：{{param.deep}}</li><li>满载吃水(m)：{{param.loadDraught}}</li>
              <li>满载排水(t)：{{param.loadDisplacement}}</li><li>船舶航速(m/s)：{{param.speed}}</li>
              <li>船舶定员：{{param.complement}}</li><li>总吨位：{{param.totalTon}}</li>
              <li>净吨位：{{param.netTon}}</li><li>主机型号：{{param.hostBrandModel}}</li>
              <li>主机功率(kW)：{{param.hostPower}}</li><li>齿轮箱型号：{{param.gearModel}}</li>
              <li>发电机组型号：{{param.generatorSetBrandModel}}</li><li>发电机组功率(kW)：{{param.generatorSetPower}}</li>
              <li>制冷机组功率(kW)：{{param.refrigeratorPower}}</li><li></li>
              <!-- <li>公约长度：{{param.lengthNm}}</li>
              <li>主机品牌：{{param.hostBrand}}</li>
              <li>齿轮箱品牌：{{param.gearBrand}}</li>
              <li>发电机组品牌：{{param.generatorSetBrand}}</li>
              <li>制冷机组品牌：{{param.refrigeratorBrand}}</li> -->
              <li v-for="item in paramList">
                <span v-show="item.colNm">{{item.colNm}}：</span>{{item.value}}
              </li>
            </ul>
			<div class="info">
			  <p>船舶名称：{{param.nm}}</p>
			  <p>船舶所有权人：中创海洋</p>
			  <p v-if="param.cd">中创船型编码：{{param.cd}}</p>
			  <p v-if="info.supplier">承建船厂：<span @click="toPage()">{{info.supplier}}</span></p>
			</div>
          </div>
          <div v-html="info.cont || info.intro"></div>
          <!--船舶管理详情不显示下面的东西-->
         <!-- <service v-if="!shipShow"></service>
          <div class="title"  v-if="!shipShow">本店精选商品</div>
          <featured :list="proList" :type="type"  v-if="!shipShow" /> -->
        </div>
        <!--仅船舶产品和船舶方案有下面的设备-->
        <ship-equip v-show="currentType ==='equip'" :id="currentId" :types="types"></ship-equip>
        <certificate v-if="currentType ==='certificate'"></certificate>
        <!--监理建造-->
        <jianlijianzao v-show="currentType ==='service1'" ref="jianlijianzao"></jianlijianzao>
        <!--检验检测-->
        <jianyanjiance v-show="currentType ==='service2'" ref="jianyanjiance"></jianyanjiance>
          
      </div>
    </div>
</template>

<script>
  import certificate from './certificate'
  // import service from './service'
  // import featured from './featured'
  import shipEquip from '../shipEquip'
  import jianlijianzao from './pinzhibaozhang' //监理建造
  import jianyanjiance from '../personal/shipInfo/jianyanjiance' //检验检测
    export default {
      props:['info','shipShow','types'],
      data(){
          return{
            currentId:'',
            // serviceList:[],
            proList:[],
            // ceList:[],
            currentType:'detail',
            type:'',
            tabList:[{
               nm:'详细描述',
               cd:'detail',
               type:'product,ship,manage',
            },{
              nm:'船舶设备',
              cd:'equip',
              type:'ship,manage',
            },{
              nm:'检验证书',
              cd:'certificate',
              type:'product'
            }
            // ,{
            //   nm:'建造监理',
            //   cd:'service1',
            //   type:'',
            // },{
            //   nm:'检验检测',
            //   cd:'service2',
            //   type:'',
            // }
			],
            param:{},
            paramList:[]
          }
      },
      components:{shipEquip,certificate,jianlijianzao,jianyanjiance},
      computed:{

      },
      watch:{
        info(){
          this.getData()
        },
      },
      methods:{
        async getData(){
          this.type = this.info.ship ? 'ship' : 'product'
          if(this.shipShow){ //船舶管理
            this.type = 'manage'
            this.param = this.info
            this.currentId = this.info.id
            let arr = JSON.parse(this.param.mainParam)
						this.paramList.push(...arr.args)
						console.log(this.paramList)
          }else { //在线交易
            //本店精选
            this.proList = await this.api.proDetailChoice(this.info.id)
            //检测证书
            // this.ceList = await this.api.proDetailCeList(this.info.id)
            // this.serviceList = await this.api.shipDetailSurvey(this.info.id)
          }

        },
        async getInfo(id){  //船舶参数信息
		console.log('二级')
          this.currentId = id
          this.param = await this.api.shipInfo(id)
          let arr = JSON.parse(this.param.mainParams)
          this.paramList.push(...arr.args)
		//检验证书
          // this.ceList = await this.api.shipDetailCeList(this.info.id)
          //品质保障
          // this.serviceList = await this.api.shipDetailSurvey(this.info.id)
          this.$refs.jianyanjiance.getInfo(id)
          this.$refs.jianlijianzao.getInfo(id)
        }
      }
    }
</script>

<style lang="less" scoped>
  @import url("../../assets/css/mobile.less");
  .detailMain{
    .tab{
		border-bottom: 0.01rem solid rgba(0,0,0,0.1);
		height: 0.8rem;
		width: 100%;
		overflow: auto;
		>div{
			/*width: 135%;*/
            width: 100%;
			display: flex;
			>p{
				flex: 1;
				display: flex;
				justify-content: center;
				height: 0.8rem;
				line-height: 0.8rem;
				>span{
					font-size: 0.28rem;
					color: #9a9a9a;
				    padding: 0 0.2rem;
				}
			}
			.active{
				>span{
					color: #343434;
					font-weight: 600;
					border-bottom: 0.04rem solid @themeColor;
				}
			}
		}
		
	}
	.infoParam{
		>p{
			display: flex;
			align-items: center;
			font-size: 0.28rem;
			color: #343434;
			padding:0.36rem 0 0.38rem 0.36rem;
			box-sizing: border-box;
			.lineC{
				width: 0.04rem;
				height: 0.3rem;
				margin-right: 0.2rem;
				background-color: @themeColor;
			}
		}
		>ul{
			padding: 0 0.36rem 0.18rem;
			border-bottom: 0.01rem solid rgba(0,0,0,0.1);
			>li{
				display: inline-block;
				width: 50%;
				font-size: 0.24rem;
				color: #666666;
				margin-bottom: 0.2rem;
			}
		}
		.info{
			padding: 0.35rem 0.36rem 0.18rem;
			font-size: 0.24rem;
			color: #666666;
			>p{margin-bottom: 0.2rem;}
		}
	}
  }

</style>
