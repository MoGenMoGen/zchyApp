<template>
<!--  建造流程-->
  <div>
<van-overlay :show="show" @click="closeMask">
			<div class="wrapper" @click.stop>
				<div class="block">
					<p style="text-align: center;font-size: 0.3rem;margin-top: 0.2rem;">新增</p>
					<div class="list">
						<van-field readonly clickable label="分类" :value="value1" placeholder="选择分类"
							@click="showPickerOne = true" />
						<van-popup v-model="showPickerOne" round position="bottom">
							<van-picker show-toolbar :columns="tabList" @cancel="showPickerOne = false"
								@confirm="onConfirmOne" value-key='nm' />
						</van-popup>
					</div>
					<div class="list">
						<van-field readonly clickable label="建造过程" :value="value2" placeholder="选择分类"
							@click="showPickerTwo = true" />
						<van-popup v-model="showPickerTwo" round position="bottom">
							<van-picker show-toolbar :columns="tabListTwo" @cancel="showPickerTwo = false"
								@confirm="onConfirmTwo" value-key='nm' />
						</van-popup>
					</div>
					<div class="list">
						<van-cell-group>
							<van-field v-model="value3" label="标题" placeholder="请输入标题" />
						</van-cell-group>
					</div>
					<div class="list">
						<van-field readonly clickable label="建造单位" :value="value4" placeholder="选择分类"
							@click="showPickerFour = true" />
						<van-popup v-model="showPickerFour" round position="bottom">
							<van-picker show-toolbar :columns="tabListTwo" @cancel="showPickerFour = false"
								@confirm="onConfirmFour" value-key='nm' />
						</van-popup>
					</div>
					<div class="list">
						<van-field readonly clickable label="时间" :value="value5" placeholder="选择时间"
							@click="showPickerFive = true" />
						<van-popup v-model="showPickerFive" round position="bottom">
							<van-datetime-picker v-model="currentDate" type="datetime" title="选择时间"
								@confirm='confirmTime' @cancel='cancelTime' />
						</van-popup>
					</div>
					<div class="list" style="display: flex; margin: 0.2rem 0;">
										<div class="listTitle" style="margin-left: 0.3rem;
					width: 6.7em;">上传图片</div>
										<van-uploader v-model="imgList" :after-read="afterRead" :before-delete="deleteImg" />
					</div>
					<div class="list" style="display: flex; margin: 0.2rem 0;">
						<div class="listTitle" style="margin-left: 0.3rem;
					width: 6.7em;">上传文档</div>
						<van-uploader v-model="fileList" :after-read="afterReadFile"
							:before-delete="deleteFile">
							<div
								style="width:1.6rem; height:0.6rem; background-color:#2778be;text-align: center;line-height: 0.6rem;color: #ffffff;">
								选择文档
							</div>
						</van-uploader>
					</div>
					<div class="bottomBtn">
						<div class="leftBtn" @click="cancel">
							取消
						</div>
						<div class="rightBtn" @click="save">
							保存
						</div>
					</div>
				</div>
			</div>
</van-overlay>
    <ul class="tab">
      <li v-for="item in tabList" :key="item.id" @click="toChoose(item)" >
        <p :class="{tabAct:tabId==item.id}">{{item.nm}}</p>
      </li>
    </ul>

    <div v-for="item in list" :key="item.id">
      <div class="title" @click="item.show=!item.show">

        <span>{{item.nm}}</span>
        <p>
          <span style="white-space: nowrap">{{item.actDt}}</span>
          <img :src="arrowDown" v-if="item.show">
          <img :src="arrowUp" v-else>
        </p>

      </div>
<!--      <div class="date">{{item.actDt}}</div>-->
      <div class="rich" v-if="item.show">

        <p v-html="item.attachment"></p>
		<p>{{item.nm}}报告：</p>
		<div class="imgBox" >
			
		<img :src="item1" v-for="(item1,index1) in item.imgUrl" :key="index1" >
		</div>
<!--       <p class="desc">-->
<!--          {{item.description}}-->
<!--        </p>-->
<!--        <div class="doc">-->
<!--          <p v-for="j in item.imgList" @click="toLink(j.url)">-->
<!--            <img :src="j.img">-->
<!--          </p>-->
<!--          <p v-for="j in item.fileList" @click="toLink(j.url)">-->
<!--            <img :src="j.img">-->
<!--            <span>{{j.fileNm}}</span>-->
<!--          </p>-->
<!--        </div> -->
      </div>

    </div>
<!-- <div class="addNew" v-if="currentRole.identityCd=='identity40'" @click="addNew">
			新增
		</div> -->
  </div>

</template>

<script>
    export default {
        name: "fangansheji",
        data(){
            return{
			show:false,
              excel:'https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png',
              ppt: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png',
              word:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png',
              pdf:'https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png',
              arrowDown: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/aba3c08269364bb08d852ae96bedfed0_arrowDown.png',
              arrowUp:'https://sinovat.oss-cn-shanghai.aliyuncs.com/fc38e664383c43bbab909b95c712ba7b_arrowUp.png',
                currentRole:{},
                list:[],
              tabList:[],
              tabId:'',
              catCd:'',
			  value1:'',
			  value1Cd:'',
			  showPickerOne:false,
			  value2:'',
			  value2Cd:'',
			  showPickerTwo:false,
			  tabListTwo:[],
			  value3:'',
			  value4:'',
			  value4Cd:'',
			  showPickerFour:false,
			  
			  
            }
        },
        mounted() {
          this.id= this.until.getQueryString('id')
          this.getTab()
        },

        watch:{
          catCd(newVal,oldVal){
            this.list=[]
            this.getInfo(newVal)
          }
        },
        methods:{
			onConfirmOne(val) {
				this.value1 = val.nm
				this.value1Cd = val.cd
				this.showPickerOne = false
			},
			onConfirmTwo(val){
				this.value2 = val.nm
				this.value2Cd = val.cd
				this.showPickerTwo = false
			},
			cancel(){
				this.closeMask()
			},
			save(){
				this.closeMask()
			},
			closeMask(){
				this.show=false
			},
			addNew() {
				this.show = true
			},
          toChoose(item){
            if(item.id!=this.tabId){
              this.tabId=item.id
              this.catCd=item.cd
            }
          },
          async getTab(){
             this.tabList= await this.api.dataDictionary("DOCS_BUILD_SHIP_CAT")
              this.tabId=this.tabList[0].id
              this.catCd=this.tabList[0].cd
          },

          async getInfo(cd){
            this.currentRole=JSON.parse(this.until.loGet('currentRole'))
            let qry = this.query.new()
            this.query.toW(qry,'docsId',this.id,'EQ')
            this.query.toW(qry,'catCd',cd,'EQ')
            let data=await this.api.buildStep(this.query.toEncode(qry))
            data.forEach((item,index)=>{
              item.show=false
			  if(item.imgUrl){
				  item.imgUrl=item.imgUrl.split(',')
			  }
			  if(item.attachment){
				  item.attachment = this.until.imgTagAddStyle(item.attachment)
			  }
            })
            console.log(data)
            this.list=data
          },
          toLink(url){
            console.log(url)
            window.open(url)
          },
        }


    }
</script>
<style lang="less">
	.van-cell {
		margin-top: 0.2rem;
	}

	.van-cell::after {
		border-bottom: 0;
	}

	.van-hairline--top-bottom::after,
	.van-hairline-unset--top-bottom::after {
		border-width: 0
	}

	.van-uploader__wrapper {
		max-width: 4rem;
	}
</style>
<style scoped lang="less">
.addNew {
		width: 100%;
		height: 1rem;
		background-color: #2778BE;
		text-align: center;
		line-height: 1rem;
		font-size: 0.28rem;
		color: #FFFFFF;
		position: fixed;
		bottom: 0;
	}
		.wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 1.5rem auto;
		
			width: 80%;
			height: 80%;
		
			.block {
				width: 100%;
				height: 100%;
				background-color: #fff;
				overflow: scroll;
				.bottomBtn{
					margin-top: 0.4rem;
					padding-bottom: 0.6rem;
					display: flex;
					width: 100%;
					justify-content: space-around;
					.leftBtn{
						width: 1.2rem;
						height: 0.8rem;
						text-align: center;
						line-height: 0.8rem;
						background-color: #ffffff;
						border: 1px solid #cccccc;
					}
					.rightBtn{
						width: 1.2rem;
						height: 0.8rem;
						text-align: center;
						line-height: 0.8rem;
						background-color: #2778BE;
						color: #ffffff;
					}
				}
			}
		}

  .tab{
    display: flex;
    align-items: center;
    overflow-x: scroll;

    li{
      padding: 0rem 0.2rem;
      p{
        padding: 0.1rem 0;
        white-space: nowrap;
        color: #999999;
        font-size: 0.24rem;
      }
    }
  }


  .title{
    margin-bottom: 10px;
    font-size: 0.24rem;
    height: 40px;
    color: #666666;
    padding:0 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    border-top: 1px solid rgba(0,0,0,0.1);

    &:hover{
      cursor: pointer;
    }
    p:nth-of-type(1){
      flex-shrink: 0;
      display: flex;
      align-items: center;
      img{
        width: 12px;
        margin-left: 25px;
      }
    }
  }
  .date{
    padding:0 28px;
    /*border-bottom: 1px solid rgba(0,0,0,0.1);*/
    font-size: 0.22rem;
  }
  .rich{
      padding: 24px 28px;
      .desc{
        color: #666666;
      }
  }

  .tabAct{
    color: #333333 !important;
    font-size: 0.28rem !important;
    border-bottom:2px solid #2778BE !important;
  }
</style>
