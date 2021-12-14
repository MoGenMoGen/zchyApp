<template>
  <!-- 全部投标 -->
  <div class="container">
    <van-dialog
      v-model="bail"
      title="保证金上传"
      show-cancel-button
      @cancel="cancelTo"
      @confirm="confirmTo"
      :before-close="onBeforeClose"
    >
      <div class="popBox">
        <div class="boxList">
          <div class="listLeft">保证金金额：</div>
          <div class="listRight">
            <input
              type=""
              name=""
              v-model="depositAmt"
              placeholder="请输入保证金金额"
              :disabled="
                !(
                  (applyInfo.despoit &&
                    applyInfo.despoit.shipBidDepositVo.audit != 2) ||
                  !applyInfo.despoit
                )
              "
            />
          </div>
          <!-- <div class="" style="font-size: 0.22rem; margin-left: 0.1rem;">
						万元
					</div> -->
        </div>
        <div class="boxList">
          <div class="listLeft">保证金凭证：</div>
          <div class="listRight" style="width: 4rem">
            <van-uploader
              :after-read="afterRead"
              v-model="imgList"
              :before-delete="deleteImg"
              :disabled="
                !(
                  (applyInfo.despoit &&
                    applyInfo.despoit.shipBidDepositVo.audit != 2) ||
                  !applyInfo.despoit
                )
              "
              :deletable="
                (applyInfo.despoit &&
                  applyInfo.despoit.shipBidDepositVo.audit != 2) ||
                !applyInfo.despoit
              "
            />
          </div>
        </div>
      </div>
    </van-dialog>
    <!-- 	<van-dialog v-model="bailDetail" title="保证金" show-cancel-button @cancel="cancelTo3" @confirm='confirmTo3'
			:before-close="onBeforeClose3">
			<div class="popBox">
				<div class="boxList">
					<div class="listLeft">
						投标金额：
					</div>
					<div class="listRight">
					</div>
					<div class="" style="font-size: 0.22rem; margin-left: 0.1rem;">
						万元
					</div>
				</div>
				<div class="boxList">
					<div class="listLeft">
						保证金凭证：
					</div>
					<div class="listRight" style="width: 4rem;">
					</div>
				</div>
			</div>
		</van-dialog> -->
    <van-dialog
      v-model="offer"
      title="资料上传"
      show-cancel-button
      @cancel="cancelTo2"
      @confirm="confirmTo2"
      :before-close="onBeforeClose2"
    >
      <div class="popBox">
        <!-- 	<div class="boxList">
					<div class="listLeft">
						投标金额：
					</div>
					<div class="listRight">
						<input type="" name="" v-model="offerAmt" placeholder="请输入投标金额"  :disabled="!(!applyInfo.bidDecideTm&&returnDate(2,applyInfo.bidEndTm))"/>
					</div>
				</div> -->
        <div class="boxList">
          <div class="listLeft">附件上传：</div>
          <div class="listRight" style="width: 4rem">
            <van-uploader
              @click-preview="filePreview"
              accept=".pdf,.doc,.docx,.ppt"
              :after-read="afterRead2"
              v-model="fileList"
              :before-delete="deleteFile"
              :disabled="
                !(!applyInfo.bidDecideTm && returnDate(2, applyInfo.bidEndTm))
              "
              :deletable="
                !applyInfo.bidDecideTm && returnDate(2, applyInfo.bidEndTm)
              "
            >
              <!--  <div style="background-color:#2778BE ; color: #ffffff; width: 1.3rem; height: 0.6rem; font-size: 10px; text-align: center;line-height: 0.6rem;border-radius: 0.1rem;" >
						  	文件上传
						  </div> -->
              <van-button
                icon="plus"
                type="primary"
                style="
                  background-color: #2778be;
                  color: #ffffff;
                  height: 0.6rem;
                  font-size: 10px;
                "
                >上传文件</van-button
              >
            </van-uploader>
          </div>
        </div>
      </div>
    </van-dialog>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getBidData"
      :immediate-check="immediate"
    >
      <div
        class="bodyList"
        v-for="(item, index) in list"
        :key="index"
        @click="toDetail(item.bidId)"
      >
        <div class="listContent">
          <div class="left">项目信息：</div>
          <div class="right">
            {{ item.nm }}
          </div>
        </div>
        <div class="listContent">
          <div class="left">项目编号：</div>
          <div class="right">
            {{ item.cd }}
          </div>
        </div>
        <div class="listContent">
          <div class="left">采购金额：</div>
          <div class="right">
            {{ item.budget }}
          </div>
        </div>
        <div class="listContent">
          <div class="left">开标时间：</div>
          <div class="right">
            {{ item.bidOpenTm }}
          </div>
        </div>

        <div class="listContent">
          <div class="left">状态：</div>
          <div class="right" v-if="item.bidDecideTm" style="color: #E4393C">
            已定标
          </div>
          <div
            class="right"
            v-else-if="returnDate(1, item.bidOpenTm)"
            style="color: #2778BE"
          >
            评标中
          </div>
          <div
            class="right"
            v-else-if="returnDate(1, item.bidEndTm)"
            style="color: #3FAB2E"
          >
            投标中
          </div>
          <div class="right" v-else style="color: #FF3C00">待开标</div>
        </div>
        <div class="listContent">
          <div class="left">保证金：</div>
          <div
            class="rightBtn"
            v-if="item.depositStatus == 2 && returnDate(2, item.bidEndTm)"
            @click.stop="openBail(item)"
          >
            保证金上传
          </div>
          <div
            class="rightBtn"
            v-if="item.depositStatus == 3"
            @click.stop="openBailDetail(item)"
          >
            查看保证金
          </div>
        </div>
        <div class="listContent">
          <div class="left">投标文件：</div>
          <div
            class="rightBtn"
            v-if="
              !item.bidDecideTm && returnDate(2, item.bidEndTm) && !item.offer
            "
            @click.stop="openOffer(item)"
          >
            资料上传
          </div>
          <div
            class="rightBtn"
            v-if="item.offer"
            @click.stop="openOfferDetail(item)"
          >
            查看资料
          </div>
        </div>
        <div class="listContent">
          <div class="left">签到：</div>
          <div
            class="rightBtn"
            v-if="
              (item.depositStatus == 1 || item.depositStatus == 3) &&
              item.signin.shipBidSigninVo.signinStatus == 0 &&
              !item.bidDecideTm &&
              returnDate(1, item.bidOpenTm)
            "
            @click.stop="sign(item)"
          >
            签到
          </div>
          <div
            class="right"
            v-if="
              (item.depositStatus == 1 || item.depositStatus == 3) &&
              item.signin.shipBidSigninVo.signinStatus == 1 &&
              !item.bidDecideTm &&
              returnDate(1, item.bidOpenTm)
            "
            style="color: #2778be"
          >
            已签到
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { Notify } from "vant";
export default {
  name: "BidRegistration",
  props: {},
  data() {
    return {
      loading: false,
      finished: false,
      immediate: false,
      list: [],
      pageNo: 1,
      pageSize: 5,
      imgTip: "",
      orgEnterId: "",
      identityCd: "",
      currentRoleId: "",
      nowDate: "",
      applyInfo: [],
      bail: false,
      bailDetail: false,
      offer: false,
      depositAmt: "", //保证金金额
      offerAmt: "", //投标金额
      imgListUpd: [],
      imgList: [],
      fileList: [],
      fileListUpd: [],
      completeTm: "",
    };
  },
  computed: {
    returnDate() {
      return (type, date) => {
        if (type == 1) {
          if (new Date(date).getTime() < this.nowDate) {
            return true;
          } else {
            return false;
          }
        } else if (type == 2) {
          if (new Date(date).getTime() > this.nowDate) {
            return true;
          } else {
            return false;
          }
        }
      };
    },
  },
  methods: {
    bidDetail(item) {
      this.until.href(
        `./myBillDetail.html?id=${item.id}&orderCd=${item.orderCd}`
      );
    },
    applyBid(item) {
      this.until.href(
        `./myBillApply.html?id=${item.id}&orderCd=${item.orderCd}`
      );
    },
    toDetail(id) {
      this.until.href(`./isbidDetail.html?id=${id}`);
    },
    getBidData() {
      let qry = this.query.new();
      this.query.toO(qry, "publishTm", "desc");
      this.query.toP(qry, this.pageNo, this.pageSize);
      this.query.toW(qry, "viewRangeCd", this.identityCd + "", "LK");
      this.api
        .getMyBidList(this.query.toEncode(qry), this.currentRoleId)
        .then((res) => {
          this.list.push(...res.data.list);
          // 加载状态结束
          console.log("长度。。。。。。" + this.list.length);
          console.log("总数。。。。。。" + res.page.total);
          this.finished = this.list.length >= res.page.total;
          this.loading = false;
          this.pageNo++;
        });
    },
    openBail(item) {
      this.bail = true;
      this.applyInfo = item;
    },
    openBailDetail(item) {
      this.bail = true;
      this.applyInfo = item;
      console.log(item);
      this.depositAmt = item.depositMoney;
      let urlStr = item.despoit.shipBidDepositVo.depositImgUrl.split(",");
      urlStr.forEach((item) => {
        let obj = new Object();
        obj.url = item;
        this.imgList.push(obj);
        this.imgListUpd.push(obj.url);
      });
      console.log(789, this.imgList);
    },
    openOffer(item) {
      this.offer = true;
      this.applyInfo = item;
    },
    openOfferDetail(item) {
      this.offer = true;
      this.applyInfo = item;
      console.log(777, this.applyInfo);
      this.nowDate = new Date().getTime();
      this.completeTm = this.applyInfo.bidEndTm;
      //已经报价过
      // if(this.applyInfo.offer){
      this.offerAmt = this.applyInfo.offer.shipBidOfferVo.offerAmt;
      if (this.applyInfo.offer.shipBidOfferVo.attachment) {
        this.fileList = [];
        this.fileListUpd = [];
        let urlStr = this.applyInfo.offer.shipBidOfferVo.attachment.split(",");
        urlStr.forEach((item) => {
        //   this.fileList = [];
        //   this.fileListUpd = [];
          console.log(123, item);
          let obj = new Object();
          let index = item.indexOf("_");
          obj.url = item.substring(index + 1, item.length);
          obj.openUrl = item;
          this.fileList.push(obj);
          this.fileListUpd.push(item);
        });
      }
      if (this.applyInfo.offer.shipBidOfferVo.attachDecode) {
        this.fileList = [];
        this.fileListUpd = [];
        let urlStr =
          this.applyInfo.offer.shipBidOfferVo.attachDecode.split(",");
        urlStr.forEach((item) => {
          let obj = new Object();
          let index = item.indexOf("_");
          obj.url = item.substring(index + 1, item.length);
          obj.openUrl = item;
          this.fileList.push(obj);
          this.fileListUpd.push(item);
        });
      }
	   // else {
    //     this.fileList = [];
    //     this.fileListUpd = [];
    //   }
      // }
    },
    filePreview(file) {
      console.log(111, file);
      window.open(file.openUrl);
    },
    afterRead(file) {
      if (file instanceof Array && file.length) {
        file.forEach((item) => {
		  item.message='上传中...'
		  file.status = 'uploading';
          let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
          formData.append("file", item.file); //接口需要传的参数
          this.api.uploadImg4(formData).then((res) => {
			item.message='上传成功'
			file.status = 'success';
            this.imgListUpd.push(res);
            console.log(this.imgList);
          });
        });
      } else {
		  file.status = 'uploading';
		  file.message='上传中...'
		  console.log(file, 111111);
        let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
        formData.append("file", file.file); //接口需要传的参数
        this.api.uploadImg4(formData).then((res) => {
          console.log(res, 111111);
		  file.status = 'success';
		   file.message='上传成功'
          this.imgListUpd.push(res);
          console.log(this.imgListUpd);
        });
      }
    },
    afterRead2(file) {
      console.log(file);
      if (file instanceof Array && file.length) {
        file.forEach((item) => {
			item.status = 'uploading';
			item.message='上传中...'
          let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
          formData.append("file", item.file); //接口需要传的参数
          this.api.uploadImg3(formData).then((res) => {
            console.log(res, 111111);
			item.status = 'success';
			item.message='上传成功'
            this.fileListUpd.push(res);
          });
        });
      } else {
		  file.status = 'uploading';
		  file.message='上传中...'
		  console.log(file, 111111);
        let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
        formData.append("file", file.file); //接口需要传的参数
        this.api.uploadImg3(formData).then((res) => {
		  file.status = 'success';
		  file.message='上传成功'
          this.fileListUpd.push(res);
          console.log(22,this.fileList,this.fileListUpd);
        });
      }
    },
    deleteImg(file, detail) {
      console.log(detail);
      this.imgListUpd.splice(detail.index, 1);
      this.imgList.splice(detail.index, 1);
      console.log(this.imgListUpd);
    },
    deleteFile(file, detail) {
      this.fileListUpd.splice(detail.index, 1);
      this.fileList.splice(detail.index, 1);
      console.log(this.fileListUpd);
    },
    cancelTo() {
      this.depositAmt = "";
      this.imgList = [];
      this.imgListUpd = [];
    },
    cancelTo2() {
      console.log("sb");
      this.offerAmt = "";
      this.fileList = [];
      this.fileListUpd = [];
    },
    confirmTo() {
      console.log(this.applyInfo);
      if (!this.depositAmt) {
        Notify("请填写保证金金额");
        return false;
      }
      if (this.imgListUpd.length == 0) {
        Notify("请选择凭证");
        return false;
      }
      let obj = {
        orgId: this.applyInfo.orgId,
        orgNm: this.applyInfo.orgNm,
        bidId: this.applyInfo.bidId,
        bidNm: this.applyInfo.bidNm,
        depositAmt: this.depositAmt,
        depositImgUrl: this.imgListUpd.join(","),
      };
      if (this.applyInfo.despoit) {
        obj.id = this.applyInfo.despoit.shipBidDepositVo.id;
        this.api.bidBailUpd(obj).then(() => {
          Notify({ type: "success", message: "修改成功" });
          this.depositAmt = "";
          this.imgListUpd = [];
          this.imgList = [];
          this.pageNo = 1;
          this.list = [];
          this.getBidData();
        });
      } else {
        this.api.bidBail(obj).then((res) => {
          Notify({ type: "success", message: "上传成功" });
          this.depositAmt = "";
          this.imgListUpd = [];
          this.imgList = [];
          this.pageNo = 1;
          this.list = [];
          this.getBidData();
        });
      }
	  this.bail = false
    },


    confirmTo2() {
      // if (!this.offerAmt) {
      // 	Notify('请填写投标金额');
      // 	return false
      // }
      if (this.fileListUpd.length == 0) {
        Notify("请选择附件");
        return false;
      }
      if (this.until.TimeStep2(this.completeTm) >= 0) {
        // Notify("已经过了截止时间");
		this.offer = false
        return;
      }
      let obj = {
        orgId: this.applyInfo.orgId,
        orgNm: this.applyInfo.orgNm,
        bidId: this.applyInfo.bidId,
        bidNm: this.applyInfo.bidNm,
        offerAmt: this.offerAmt,
        attachment: this.fileListUpd.join(","),
      };
      if (this.applyInfo.offer) {
        obj.id = this.applyInfo.offer.shipBidOfferVo.id;
      }
      if (!this.applyInfo.offer) {
        this.api.bidOffer(obj).then((res) => {
          Notify({ type: "success", message: "上传成功" });
          this.offerAmt = "";
          this.fileListUpd = [];
          this.fileList = [];
          this.pageNo = 1;
          this.list = [];
          this.getBidData();
        });
      } else {
        this.api.bidOfferUpd(obj).then((res) => {
          Notify({ type: "success", message: "修改成功" });
          this.offerAmt = "";
          this.fileListUpd = [];
          this.fileList = [];
          this.pageNo = 1;
          this.list = [];
          this.getBidData();
        });
      }
	  this.offer = false
    },
    onBeforeClose(action, done) {
      console.log(this.imgListUpd);
      if (
        action === "confirm" &&
        this.depositAmt &&
        this.imgListUpd.length > 0
      ) {
        return done();
      } else if (action === "cancel") {
        return done();
      } else {
        return done(false);
      }
    },
    onBeforeClose2(action, done) {
      if (
        action === "confirm" &&
        this.offerAmt &&
        this.fileListUpd.length > 0
      ) {
        return done();
      } else if (action === "cancel") {
        return done();
      } else {
        return done(false);
      }
    },
    sign(item) {
      let id = item.signin.shipBidSigninVo.id;
	  this.api.bidSign(id).then(res => {
	   Notify({ type: 'success', message: '签到成功' });
	   this.pageNo=1
	   this.list=[]
	   this.getBidData()
	  })

			},
			// afterRead2(file){
			// 	console.log(file);
			// 	if (file instanceof Array && file.length) {
			// 		file.forEach(item => {
			// 			let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
			// 			formData.append('file', item.file); //接口需要传的参数
			// 			this.api.uploadImg3(formData).then(res => {
			// 				console.log(res, 111111);
			// 				this.fileListUpd.push(res)
			// 			})
			// 		})
			// 	} else {
			// 		let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
			// 		formData.append('file', file.file); //接口需要传的参数
			// 		this.api.uploadImg3(formData).then(res => {
			// 			console.log(res, 111111);
			// 			this.fileListUpd.push(res)
			// 			console.log(this.fileListUpd);
			// 		})
			// 	}
			// },
			deleteImg(file, detail) {
			console.log(detail);
				this.imgListUpd.splice(detail.index, 1)
				this.imgList.splice(detail.index, 1)
				console.log(this.imgListUpd);
			},
			deleteFile(file,detail){
				this.fileListUpd.splice(detail.index, 1)
				this.fileList.splice(detail.index, 1)
				console.log(this.fileListUpd);
			},
			cancelTo() {
				this.depositAmt = ''
				this.imgList = []
				this.imgListUpd = []
			},
			cancelTo2() {
				console.log('sb');
				this.offerAmt = ''
				this.fileList = []
				this.fileListUpd = []
			},
			confirmTo() {
				console.log(this.applyInfo);
				if (!this.depositAmt) {
					Notify('请填写保证金金+额');
					return false
				}
				if(this.imgListUpd.length==0){
					Notify('请选择凭证');
					return false
				}
				let obj={
					orgId:this.applyInfo.orgId,
					orgNm:this.applyInfo.orgNm,
					bidId:this.applyInfo.bidId,
					bidNm:this.applyInfo.bidNm,
					depositAmt:this.depositAmt,
					depositImgUrl:this.imgListUpd.join(",")
				}
				if(this.applyInfo.despoit){
					obj.id = this.applyInfo.despoit.shipBidDepositVo.id
					this.api.bidBailUpd(obj).then(() => {
					 Notify({ type: 'success', message: '修改成功' });
					 this.depositAmt=''
					 this.imgListUpd=[]
					 this.imgList=[]
					 this.pageNo=1
					 this.list=[]
					 this.getBidData()
					})
				}
				else{
					this.api.bidBail(obj).then(res=>{
						Notify({ type: 'success', message: '上传成功' });
						this.depositAmt=''
						this.imgListUpd=[]
						this.imgList=[]
						this.pageNo=1
						this.list=[]
						this.getBidData()
						
					})
				}
			
			},
			
			
		
			
			


    
    },
  
  created() {
    this.identityCd = JSON.parse(this.until.loGet("currentRole")).identityCd;
    this.currentRoleId = JSON.parse(this.until.loGet("currentRole")).id;
    console.log(this.orgEnterId);
    this.nowDate = new Date().getTime();
    this.getBidData();
  },
};
</script>

<style scoped lang="less">
.container {
  .bodyList {
    width: 7.09rem;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 0.4rem 0.3rem;
    box-sizing: border-box;
    border-radius: 0.12rem;
    margin-bottom: 0.2rem;

    .listContent {
      margin-top: 0.3rem;
      display: flex;

      .left {
        width: 1.8rem;
        font-size: 0.24rem;
        font-weight: 500;
      }

      .right {
        margin-left: 0.1rem;
        font-size: 0.24rem;
        font-weight: 500;
      }

      .rightBtn {
        padding: 0.15rem 0.27rem;
        box-sizing: border-box;
        color: #ffffff;
        font-size: 0.24rem;
        background-color: #2778be;
        border-radius: 0.05rem;
      }
    }
  }

  .popBox {
    padding: 0.3rem 0.5rem;
    box-sizing: border-box;
    border-top: 0.01rem solid #dddddd;

    .boxList {
      display: flex;
      align-items: center;
      margin-top: 0.6rem;

      .listLeft {
        font-size: 0.24rem;
        color: #333333;
        width: 1.5rem;
      }

      .listRight {
        margin-left: 0.1rem;

        input {
          width: 3rem;
          padding-left: 0.2rem;
          box-sizing: border-box;
          height: 0.6rem;
          font-size: 0.22rem;
          border: 0.01rem solid #dddddd;
          line-height: 0.6rem;
        }

        input::placeholder {
          font-size: 0.22rem;
          color: #999999;
        }
      }
    }
  }
}
</style>
