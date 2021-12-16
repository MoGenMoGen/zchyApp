<template>
  <!--	资金管理-付款记录-->
  <div id="container">
    <pen-header title="合同详情"></pen-header>
    <div class="body">
      <div class="list-cont">
        <div class="list-item">
          <van-row class="row" type="flex">
            <van-col span="6"><p>合同编号:</p></van-col>
            <van-col span="18"
              ><p>{{ info.contractNo }}</p></van-col
            >
          </van-row>
          <van-row class="row" type="flex">
            <van-col span="6"><p>船舶名称:</p></van-col>
            <van-col span="18"
              ><p>{{ info.nm }}</p></van-col
            >
          </van-row>
          <van-row class="row" type="flex">
            <van-col span="6"><p>签约日期:</p></van-col>
            <van-col span="18"
              ><p>{{ info.signTm }}</p></van-col
            >
          </van-row>
          <van-row class="row" type="flex">
            <van-col span="6"><p>交付日期:</p></van-col>
            <van-col span="18"
              ><p>{{ info.deliveryTm }}</p></van-col
            >
          </van-row>
          <van-row class="row" type="flex">
            <van-col span="6"><p>合同总额:</p></van-col>
            <van-col span="18"
              ><p style="color: #ff2727">
                ￥<span style="color: #ff2727">{{ fmoney(info.totalPrice) }}</span>
              </p></van-col
            >
          </van-row>

          <van-row class="row" type="flex">
            <van-col span="6"><p>付款分期:</p></van-col>
            <van-col span="18"
              ><p>{{ info.installment }}</p></van-col
            >
          </van-row>

          <van-row class="row" type="flex">
            <van-col span="6"><p>已付金额:</p></van-col>
            <van-col span="18"
              ><p>￥{{ fmoney(info.paid) }}</p></van-col
            >
          </van-row>

          <van-row class="row" type="flex">
            <van-col span="6"><p>未付金额:</p></van-col>
            <van-col span="18"
              ><p>￥{{ fmoney(info.totalPrice - info.paid) }}</p></van-col
            >
          </van-row>

          <van-row class="row" type="flex">
            <van-col span="6"><p>乙方公司:</p></van-col>
            <van-col span="18"
              ><p>{{ info.partybNm }}</p></van-col
            >
          </van-row>
        </div>

        <div class="list-item">
          <van-row
            class="row2"
            type="flex"
            align="center"
            v-for="(item, index) in attachList"
            :key="index"
          >
            <van-col span="6"
              ><p>合同附件{{ index + 1 }}:</p></van-col
            >
            <van-col span="2" offset="1"><img :src="item.img" /></van-col>
            <van-col span="10" offset="1"
              ><p>{{ item.fileNm }}</p></van-col
            >
            <van-col span="4"
              ><p class="btn" @click="toDown(item)">下载</p></van-col
            >
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import penHeader from "../../../components/personal/penHeader";
import { mixDtl } from "../mixins/mixDtl";
import { mapState } from "vuex";
export default {
  mixins: [mixDtl],
  data() {
    return {
      excel:
        "https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png",
      ppt: "https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png",
      word: "https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png",
      pdf: "https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png",
      attachList: [], //附件列表
    };
  },
  components: {
    penHeader,
  },
  computed: {
    ...mapState(["serverAddr"]),
  },
  async created() {},

  filters: {
    numFilter(value) {
      const realVal = parseFloat(value).toFixed(2);
      return realVal;
    },
  },
  async mounted() {
    this.id = this.until.getQueryString("id");
    this.getDtl(this.id);
    this.changeDevice();
    window.onresize = () => {
      this.changeDevice();
    };
  },
  methods: {
	  fmoney(s, n) {
	      n = n > 0 && n <= 20 ? n : 2;
	      s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	      var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
	      var t = "";
	      for (let i = 0; i < l.length; i++) {
	          t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	      }
	      return t.split("").reverse().join("") + "." + r;
	  },
    //切换设备
    changeDevice() {
      console.log("=========== " + window.location.pathname + " ===========");
      let isPC = this.app.IsPC();
      if (isPC) {
        window.location.href =
          window.location.origin +
          this.serverAddr +
          "/personal/contractDetail?id=" +
          this.id;
      }
    },
    //下载按钮
    toDown(item) {
      window.open(item.url);
      console.log(item);
    //   this.$bridge.callHandler("h5_load", item.url, (res) => {
    //     console.log("res", res);
    //   });
    },

    async getDtl(id) {
      let res = await this.api.contractDetail(id);
      this.info = res.data;
      this.attachList = this.info.attachment.split(",");
      console.log(this.attachList);
      let imgList = [];
      this.attachList.forEach((item) => {
        let type = item.split(".")[item.split(".").length - 1];

        let nm = item.split(" ")[1];
        console.log(nm);
        if (type == "pdf") {
          imgList.push({ url: item, img: this.pdf, fileNm: nm });
        } else if (type == "doc" || type == "docx") {
          imgList.push({ url: item, img: this.word, fileNm: nm });
        } else if (type == "ppt" || type == "pptx") {
          imgList.push({ url: item, img: this.ppt, fileNm: nm });
        } else if (type == "xls" || type == "xlsx") {
          imgList.push({ url: item, img: this.excel, fileNm: nm });
        } else {
          imgList.push({ url: item, img: item, fileNm: nm });
        }
      });
      this.attachList = imgList;
    },
  },
};
</script>
<style lang="less" scoped>
@import url("../../../assets/css/mobile.less");
#container {
  .searchView {
    position: fixed;
    top: 1rem;
    left: 0;
    right: 0;
  }
  .searchPlace {
    height: 1.3rem;
  }
  .body {
    font-size: 0.29rem;
    background: @backgroundColor;
    padding: 0.2rem;

    .list-cont {
      .list-item {
        border-radius: 5px;
        position: relative;
        width: 100%;

        margin-bottom: 0.2rem;
        padding: 0.15rem 0;
        background: white;
        .row {
          padding: 0.1rem 0.4rem;
          color: #343434;
        }
        .row2 {
          padding: 0.1rem 0.4rem;
          color: #343434;
          .btn {
            width: 100%;
            height: 0.5rem;
            font-size: 0.2rem;
            background: #2878be;
            border-radius: 3px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            &:active {
              opacity: 0.5;
            }
          }
        }
      }
    }
  }
}
</style>
