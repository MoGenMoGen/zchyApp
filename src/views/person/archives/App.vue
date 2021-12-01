<template>
  <!--	消息详情-->
  <div id="container">
    <pen-header title="船舶档案"></pen-header>

    <div class="body">
      <div class="list-cont">
        <div class="line1">
          <p
            v-for="(item, index) in tab1"
            :key="item.id"
            @click="chooseTab1(item, index)"
          >
            <span :class="{ active: tab1Id == item.id }">{{ item.nm }}</span>
          </p>
        </div>
        <div class="line2" v-if="!showWeiBao && !showYunXing">
          <p
            v-for="(item, index) in selectList"
            :key="item.id"
            @click="chooseTab2(item, index)"
          >
            <span :class="{ active2: tab2Id == item.id }">{{ item.nm }}</span>
          </p>
        </div>
        <div v-if="showWeiBao">
          <weibao />
        </div>
        <div v-if="showYunXing">
          <yunxing />
        </div>

        <div style="padding-bottom: 0.2rem" v-if="!showWeiBao && !showYunXing">
          <base-info1 v-if="tab2Id == 20" :info="shipBaseInfo1"></base-info1>
          <ship-equip :id="id" v-if="tab2Id == 21"></ship-equip>
          <certificate v-if="tab2Id == 22"></certificate>
          <historyPic v-if="tab2Id == 23"></historyPic>
          <contract v-if="tab2Id == 24"></contract>
          <base-info2 v-if="tab2Id == 10"></base-info2>
          <fangansheji
            v-show="(tab2Id == 11 || tab2Id == 12 || tab2Id == 13) && from == 1"
            :title="designTitle"
            ref="fangan"
          ></fangansheji>
          <sheji-edit
            v-if="
              (tab2Id == 11 || tab2Id == 12 || tab2Id == 13) &&
              from == 2 &&
              currentRole.identityCd == 'identity20'
            "
            :title="designTitle"
            :flowCd="tab2Id"
          ></sheji-edit>

          <base-info3 v-if="tab2Id == 30"></base-info3>
          <jianzaoguocheng v-if="tab2Id == 31 && buildW == 1"></jianzaoguocheng>
          <build-edit
            v-if="
              tab2Id == 31 &&
              buildW == 2 &&
              currentRole.identityCd == 'identity30'
            "
          ></build-edit>

          <jianlijianzao v-if="tab2Id == 32"></jianlijianzao>
          <jianyanjiance v-if="tab2Id == 33"></jianyanjiance>
          <yunjianzao v-if="tab2Id == 34"></yunjianzao>
          <yunjianyan v-if="tab2Id == 35"></yunjianyan>
        </div>
      </div>
      <div
        class="list-cont"
        style="margin-top: 0.2rem; padding-bottom: 0.2rem"
        v-if="tab2Id == 20"
      >
        <base-info11 v-if="tab2Id == 20" :info="shipBaseInfo1"></base-info11>
      </div>
      <div
        class="list-cont"
        style="margin-top: 0.2rem; padding-bottom: 0.2rem"
        v-if="tab2Id == 20"
      >
        <base-info12
          v-if="tab2Id == 20"
          :info="shipBaseInfo1"
          :paraList="paraList"
        ></base-info12>
      </div>
    </div>
  </div>
</template>

<script>
import penHeader from "../../../components/personal/penHeader";
import baseInfo1 from "../../../components/personal/shipInfo/baseInfo1";
import baseInfo2 from "../../../components/personal/shipInfo/baseInfo2";
import baseInfo11 from "../../../components/personal/shipInfo/baseInfo11";
import baseInfo12 from "../../../components/personal/shipInfo/baseInfo12";
import certificate from "../../../components/personal/shipInfo/certificate";
import historyPic from "../../../components/personal/shipInfo/historyPic";
import contract from "../../../components/personal/shipInfo/contract";
import baseInfo3 from "../../../components/personal/shipInfo/baseInfo3";
import jianzaoguocheng from "../../../components/personal/shipInfo/jianzaoguocheng";
import jianyanjiance from "../../../components/personal/shipInfo/jianyanjiance";
import jianlijianzao from "../../../components/personal/shipInfo/jianlijianzao";
import yunjianzao from "../../../components/personal/shipInfo/yunjianzao";
import yunjianyan from "../../../components/personal/shipInfo/yunjianyan";
import weibao from "../../../components/personal/shipInfo/weibao";
import yunxing from "../../../components/personal/shipInfo/yunxing";
import shipEquip from "../../../components/shipEquip";
import fangansheji from "../../../components/personal/shipInfo/fangansheji";
import shejiEdit from "../../../components/personal/shipInfo/shejiEdit";
import buildEdit from "../../../components/personal/shipInfo/buildEdit";

import { mixDtl } from "../mixins/mixDtl";
import { mapState } from "vuex";
export default {
  mixins: [mixDtl],
  data() {
    return {
      value: "",
      tab1Id: -1, //第一个标签页选中
      tab2Id: -1, //第二个标签页选中
      tabIndex: 0, //第二个标签页底部边框偏移
      selectList: [], //选中列表
      showWeiBao: false,
      showYunXing: false,
      designTitle: "方案设计", //设计标题
      id: "",
      tab1: [
        {
          id: 0,
          nm: "船舶资料",
        },
        {
          id: 1,
          nm: "设计档案",
        },
        {
          id: 2,
          nm: "建造档案",
        },
        {
          id: 3,
          nm: "维保记录",
        },
        {
          id: 4,
          nm: "运行记录",
        },
      ],
      tab21: [
        {
          id: 10,
          nm: "基本信息",
        },
        {
          id: 11,
          nm: "方案设计",
        },
        {
          id: 12,
          nm: "送审设计",
        },
        {
          id: 13,
          nm: "生产设计",
        },
      ],
      tab22: [
        {
          id: 20,
          nm: "基本信息",
        },
        {
          id: 21,
          nm: "船舶设备",
        },
        {
          id: 22,
          nm: "检验证书",
        },
        {
          id: 23,
          nm: "历史资料",
        },
        {
          id: 24,
          nm: "合同列表",
        },
      ],
      tab23: [
        {
          id: 30,
          nm: "基本信息",
        },
        {
          id: 31,
          nm: "建造过程",
        },
        {
          id: 32,
          nm: "建造监理",
        },
        {
          id: 33,
          nm: "检验检测",
        },
        {
          id: 34,
          nm: "云监造",
        },
        {
          id: 35,
          nm: "云检验",
        },
      ],
      //tab10显示的值
      shipBaseInfo1: "", //船舶基本信息
      paraList: "", //技术参数列表
      certificate: "", //检验检疫证书
      from: 1, //从哪里进入，默认是1，如果是2，则是在设计院中添加设计
      buildW: 1, ///从哪里进入，默认是1，如果是2，则是在船舶档案中添加设计
    };
  },
  components: {
    penHeader,
    baseInfo1,
    baseInfo11,
    baseInfo12,
    certificate,
    historyPic,
    contract,
    baseInfo3,
    jianzaoguocheng,
    jianyanjiance,
    jianlijianzao,
    yunjianzao,
    yunjianyan,
    baseInfo2,
    weibao,
    yunxing,

    shipEquip,
    fangansheji,
    shejiEdit,
    buildEdit,
  },
  computed: {
    ...mapState(["serverAddr"]),
  },
  async created() {},
  watch: {
    tab2Id(newVal) {
      if (newVal == 11 || newVal == 12 || newVal == 13) {
        console.log("调用接口。。。。" + newVal);
        this.$refs.fangan.getInfo(newVal);
      }
    },
  },
  mounted() {
    this.id = this.until.getQueryString("id");
    let f = this.until.getQueryString("from");
    let buildW = this.until.getQueryString("buildW");
    if (f) {
      this.from = f;
    }
    if (buildW) {
      this.buildW = buildW;
    }
    console.log("from的值：" + this.from);
    console.log(this.id);
    this.chooseTab1(this.tab1[0], 0);
    this.shipInfoBasic();
    this.changeDevice();
    window.onresize = () => {
      this.changeDevice();
    };
  },
  methods: {
    //切换设备
    changeDevice() {
      console.log("=========== " + window.location.pathname + " ===========");
      let isPC = this.app.IsPC();
      if (isPC) {
        id = 5209722284168192;

        if (this.from == 2) {
          window.location.href =
            window.location.origin +
            this.serverAddr +
            "/personal/shipFileDetail?cdType=2&formW=design&id=" +
            this.id;
        } else if (this.buildW == 2) {
          window.location.href =
            window.location.origin +
            this.serverAddr +
            "/personal/shipFileDetail?cdType=3&formW=build&id=" +
            this.id;
        } else {
          window.location.href =
            window.location.origin +
            this.serverAddr +
            "/personal/archives?id=" +
            this.id;
        }
      }
    },
    chooseTab1(item, index) {
      if (item.id != this.tab1Id) {
        this.tab1Id = item.id;
        if (index == 0) {
          this.selectList = this.tab22;
          this.showWeiBao = false;
          this.showYunXing = false;
          this.chooseTab2(this.selectList[0], 0);
        } else if (index == 1) {
          this.selectList = this.tab21;
          this.chooseTab2(this.selectList[0], 0);
          this.showWeiBao = false;
          this.showYunXing = false;
        } else if (index == 2) {
          this.selectList = this.tab23;
          this.chooseTab2(this.selectList[0], 0);
          this.showWeiBao = false;
          this.showYunXing = false;
        } else if (index == 3) {
          this.tab2Id = 0;
          this.showWeiBao = true;
          this.showYunXing = false;
        } else if (index == 4) {
          this.tab2Id = 0;
          this.showWeiBao = false;
          this.showYunXing = true;
        }
      }
    },
    chooseTab2(item, index) {
      if (item.id != this.tab2Id) {
        this.tab2Id = item.id;
        this.tabIndex = index;
        this.designTitle = item.nm;
        // if(this.tab2Id==34){
        //
        //     this.api.getVideoUrl("121b6f4e237c4a889df93a060d428fa0").then(res=>{
        //         console.log("云监造")
        //         console.log(res)
        //         this.until.href(res)
        //     })
        // }
      }
    },
    //船舶基本信息
    async shipInfoBasic() {
      this.shipBaseInfo1 = await this.api.shipInfoBasic(this.id);
      console.log(this.shipBaseInfo1);
      let dataList = JSON.parse(this.shipBaseInfo1.mainParams);
      this.paraList = dataList.args;
    },
  },
};
</script>
<style lang="less" scoped>
@import url("../../../assets/css/mobile.less");
#container {
  .body {
    font-size: 0.29rem;
    background: @backgroundColor;
    padding: 0.2rem 0.2rem;
    .list-cont {
      border-radius: 5px;
      background: white;
      position: relative;
      padding: 0.2rem 0 0 0;

      .line1 {
        width: 100%;
        display: flex;
        background: white;
        height: 0.8rem;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        p {
          font-size: 0.285rem;
          width: 25%;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          /*对所有属性过渡0.2s*/
          transition: all 0.2s;
          color: #666666;
          span {
            height: 100%;
            display: flex;
            align-items: center;
          }
          &:hover {
            cursor: pointer;
          }
        }
      }
      .line2 {
        background: white;
        margin-top: 0.1rem;
        width: 100%;
        display: flex;
        padding: 0.14rem 0;
        align-items: center;
        position: relative;
        justify-content: space-around;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        margin-bottom: 0.2rem;
        p {
          font-size: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #999999;
          /*对所有属性过渡0.2s*/
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}

.active {
  color: #333333;
  border-bottom: 2px solid #2778be !important;
  font-weight: bold;
}
.active2 {
  color: white;
  background: #2778be;
  border-radius: 0.3rem;
  padding: 0.05rem 0.2rem;
}
</style>
