<template>
  <!--	整改单列表-->
  <div id="container">
    <pen-header title="整改单"></pen-header>
    <!-- <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      @refresh="onRefresh"
    > -->
    <div class="fixInfo">
      <div class="body1">
        <div class="list-cont1">
          <div class="line1">
            <p
              v-for="(item, index) in tab1"
              :key="item.id"
              @click="chooseTab1(item.id)"
            >
              <span :class="{ active: tab1Id == item.id }">{{ item.nm }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="body2">
        <div class="list-cont2">
          <!-- <div class="datebox"> -->
          <div style="position: relative">
            <van-field
              @click="showPicker = true"
              class="datebox"
              readonly
              clickable
              clearable
              label=""
              v-model="searchInfo.IssueDate"
              placeholder="下发日期"
            />
            <van-icon
            v-if="searchInfo.IssueDate"
              @click="searchInfo.IssueDate = ''"
              name="close"
              class="btn_close"
            />
          </div>

          <van-popup v-model="showPicker" round position="bottom">
            <van-datetime-picker
              type="date"
              title="下发日期"
              v-model="datepicker"
              @cancel="showPicker = false"
              @confirm="handleIssue"
            />
          </van-popup>
          <!-- </div> -->
          <!-- <div class="inputbox"> -->
          <van-field
            class="inputbox"
            clickable
            clearable
            label=""
            v-model="searchInfo.content"
            placeholder="整改单号、整改内容"
          />
          <button class="btn" @click="Search">查询</button>
        </div>
        <!-- </div> -->
      </div>
    </div>
    <div class="body3">
      <div class="list-cont3">
        <van-list
          class="list"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="handleLoad"
        >
          <van-cell
            class="item"
            v-for="(item, index) in list"
            :key="index"
            @click="toDetail(item.id)"
          >
            <div class="row">
              <div class="left">整改单号:</div>
              <div class="right">{{ item.cd }}</div>
            </div>
            <div class="row">
              <div class="left">整改内容:</div>
              <div class="right">
                {{ item.rectifyDemand }}
              </div>
            </div>
            <div class="row">
              <div class="left">整改单位:</div>
              <div class="right">{{ item.orgEnterNm }}</div>
            </div>
            <!-- <div class="row">
              <div class="left">检验检测单位:</div>
              <div class="right">{{ item.orgTestEnterNm }}</div>
            </div> -->
            <div class="row">
              <div class="left">下发日期:</div>
              <div class="right">{{ item.issueTm }}</div>
            </div>
            <div class="row">
              <div class="left">当前状态:</div>
              <!-- 待执行 -->
              <div class="right" v-if="item.state == 2" style="color: #ff3c00">
                待执行
              </div>
              <!-- 待结案 -->
              <div
                class="right"
                v-else-if="item.state == 3"
                style="color: #2778be"
              >
                待结案
              </div>
              <!-- 已完成 -->
              <div v-else-if="item.state == 4" class="right">已完成</div>
            </div>
          </van-cell>
        </van-list>
      </div>
    </div>
    <!-- </van-pull-refresh> -->
  </div>
</template>

<script>
import penHeader from "../../../components/personal/penHeader3";
import { Toast } from "vant";
import { mixins } from "../mixins/mixins";
import { mapState } from "vuex";
import moment from "moment";

export default {
  mixins: [mixins],
  data() {
    return {
      currentRole: "",
      state: 1,
      tab1Id: 1,
      tab1: [
        {
          id: 1,
          nm: "全部整改单",
        },
        {
          id: 2,
          nm: "待执行",
        },
        {
          id: 3,
          nm: "待结案",
        },
        {
          id: 4,
          nm: "已完成",
        },
      ],
      datepicker: new Date(),
      showPicker: false,
      searchInfo: {
        IssueDate: "",
        content: "",
      },
      isLoading: false,
      finished: false,
      loading: false,
      isfirstload: true,
      list: [],
      pageNo: 1,
      total: 0,
      pageSize: 10,
    };
  },
  components: {
    penHeader,
  },
  computed: {
    ...mapState(["serverAddr"]),
  },
  async created() {
    this.currentRole = JSON.parse(this.until.loGet("currentRole"));
  },

  filters: {},
  async mounted() {
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
        window.location.href =
          window.location.origin + this.serverAddr + "/personal/record";
      }
    },
    chooseTab1(id) {
      if (id != this.tab1Id) {
        this.tab1Id = id;
        this.pageNo = 1;
        this.list = [];
        this.state = id;

        if (this.tab1Id == 1) this.getList(true);
        else {
          this.getList(false);
        }
      }
    },
    handleIssue(e) {
      this.searchInfo.IssueDate = moment(e).format("YYYY-MM-DD");
      this.showPicker = false;
    },
    // 上拉加载
    handleLoad() {
      if (this.isfirstload) {
        this.list = [];
        this.getList(true);
        this.isfirstload = false;
        this.loading = false;
      } else {
        if (this.total > this.list.length) {
          this.info.pageNo += 1;
          if (this.tab1Id == 1) this.getList(true);
          else this.getList(false);
          this.loading = false;
        } else {
          this.loading = false;
          this.finished = true;
        }
      }
    },
    async getList(isall) {
      let qry = this.query.new();
      this.query.toP(qry, this.pageNo, this.pageSize);
      this.query.toW(qry, "status", "0", "EQ");
      if (this.state !== 1) {
        this.query.toW(qry, "state", this.state, "EQ");
      }
      if (this.currentRole.identityCd == "identity30") {
        this.query.toW(qry, "orgEnterId", this.currentRole.id.toString(), "EQ");
      } else if (this.currentRole.identityCd == "identity50") {
        this.query.toW(
          qry,
          "orgTestEnterId",
          this.currentRole.id.toString(),
          "EQ"
        );
      }
      let query = this.query.toEncode(qry);

      // // 根据登陆者的identityCd判断，30则是orgEnterId，50为orgTestEnterId
      // // 船厂
      // if (this.currentRole.identityCd == "identity30") {
      //   if (isall) {
      //     r.r[0].w.pop();
      //   }
      //   query = encodeURIComponent(JSON.stringify({ ...r, ...p }));
      // } else if (this.currentRole.identityCd == "identity50") {
      //   r.r[0].w[0].k = "orgTestEnterId";
      //   if (isall) {
      //     r.r[0].w.pop();
      //   }
      //   query = encodeURIComponent(JSON.stringify({ ...r, ...p }));
      // }
      let data = await this.api.getrectifyList(
        query,
        this.searchInfo.content,
        this.searchInfo.IssueDate
      );
      this.list = [...data.data.list, ...this.list];
      this.total = data.page.total;
    },
    toDetail(id) {
      this.until.href("./rectifyDetail.html?id=" + id);
    },
    Search() {
      this.pageNo = 1;
      this.list = [];
      if (this.tab1Id == 1) this.getList(true);
      else {
        this.getList(false);
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import url("../../../assets/css/mobile.less");
#container {
  .fixInfo {
    position: fixed;
    top: 1rem;
    z-index: 99;
    width: 100%;
    .body1 {
      font-size: 0.29rem;
      background: @backgroundColor;
      padding: 0.2rem 0.2rem 0 0.2rem;
      z-index: 10;
      .list-cont1 {
        border-top-left-radius: 0.1rem;
        border-top-right-radius: 0.1rem;
        background: white;
        position: relative;
        padding: 0.2rem 0 0 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        .line1 {
          width: 100%;
          display: flex;
          background: white;
          height: 0.8rem;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          /*标题*/
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
      }
    }
    .body2 {
      height: 1rem;
      padding: 0 0.2rem;
      background: @backgroundColor;
      display: flex;
      align-items: center;
      .list-cont2 {
        width: 100%;
        height: 100%;
        padding: 0 0.2rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: white;
        border-bottom-left-radius: 0.1rem;
        border-bottom-right-radius: 0.1rem;
        //   .van_field {
        //     padding: 0;
        //     height: 0.6rem;
        //     line-height: 0.6rem;
        //   }
        .btn_close {
          position: absolute;
          top: 50%;
          right: 0.1rem;
          transform: translateY(-50%);
          z-index: 10;
        }
        .datebox {
          width: 2.52rem;
          height: 0.6rem;
          line-height: 0.6rem;
          padding: 0;
          padding-left: 0.2rem;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 0.3rem;

        }
        .inputbox {
          width: 2.82rem;
          height: 0.6rem;
          line-height: 0.6rem;
          padding: 0;
          padding-left: 0.2rem;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 0.3rem;
        }
        .btn {
          width: 1.14rem;
          height: 0.6rem;
          background: #2778be;
          border-radius: 0.3rem;

          font-size: 0.3rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 0.6rem;
          text-align: center;
          display: inline-block;
        }
      }
    }
  }

  .body3 {
    padding: 0 0.2rem;
    background: @backgroundColor;
    display: flex;
    align-items: center;
    margin-top: 2.12rem;
    .list-cont3 {
      width: 100%;
      height: 100%;
      //   padding: 0 0.2rem;
      box-sizing: border-box;
      .list {
        .item {
          margin-top: 0.16rem;
          width: 100%;
          box-sizing: border-box;
          padding: 0.3rem;
          background: #fff;
          border-radius: 0.12rem;
          box-shadow: 0 0 0.04rem rgba(0, 0, 0, 0.3);
          .row {
            display: flex;
            .left {
              width: 2.1rem;
              margin-right: 0.4rem;
              font-size: 0.28rem;
              font-family: PingFang SC;
              font-weight: 500;
              color: #333333;
            }
            .right {
              width: calc(~"100vw - 3.1rem");
              font-size: 0.26rem;
              font-family: PingFang SC;
              font-weight: 500;
              color: #333333;
            }
          }
        }
      }
    }
  }
}
.active {
  color: #333333;
  border-bottom: 0.04rem solid #2778be !important;
  font-weight: bold;
}
</style>
