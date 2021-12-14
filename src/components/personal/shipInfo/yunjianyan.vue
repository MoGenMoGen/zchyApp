<template>
  <!-- 云检验组件 -->

  <div class="container">
    <van-list
      class="list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getList"
    >
      <div
        class="item"
        v-for="(item, index) in List"
        :key="index"
        style="position: relative"
      >
        <div class="row">
          <div class="left">检查时间：</div>
          <div class="right">
            <div>{{ item.startTm }}</div>
            <div>{{ item.endTm }}</div>
          </div>
        </div>
        <div class="row">
          <div class="left">检查时长：</div>
          <div class="right">{{ item.runTime }}</div>
        </div>
        <div class="row">
          <div class="left">检查图片：</div>
          <div class="rightImg">
            <img
              :src="item1"
              v-for="(item1, index1) in picList(item.imgUrl)"
              :key="index1"
              @click="Preview(index1, picList(item.imgUrl))"
            />
          </div>
        </div>
        <div class="row">
          <div class="left">检查视频：</div>
          <div class="rightImg">
            <video
              v-for="(item2, index2) in videoList(item.vedioUrl)"
              :key="index2"
              controls
            >
              <source :src="item2" type="video/mp4" />
              您的浏览器不支持 HTML5 video 标签。
            </video>
          </div>
        </div>
        <div class="row">
          <div class="left">备注：</div>
          <div class="right">{{ item.rmks }}</div>
        </div>
        <div
          style="
            color: rgb(39, 120, 190);
            width: 1.6rem;
            margin-top: 0.12rem;
            border: 1px solid rgb(39, 120, 190);
            border-radius: 0.23rem;
            text-align: center;
            position: absolute;
            top: 1.2rem;
            right: 0.2rem;
          "
          @click="tofpxpert"
          v-if="currentRole && currentRole.identityCd == 'identity50'"
        >
          检验入口
        </div>
        <!-- state：0{
            船厂:空，
            检测：新增
          },
          state:1{
            查看
          }
           -->
        <div
          style="
            width: 1.69rem;
            height: 0.47rem;
            line-height: 0.47rem;
            background: rgba(39, 120, 190, 0);
            border: 1px solid #e74c3c;
            border-radius: 0.23rem;
            font-size: 0.24rem;
            text-align: center;
            font-family: PingFang SC;
            font-weight: 500;
            color: #e74c3c;
            position: absolute;
            top: 0.5rem;
            right: 0.2rem;
          "
          v-if="
            item.state == 0 &&
            currentRole &&
            currentRole.identityCd == 'identity50'
          "
          @click="newRectify(item.id)"
        >
          新增整改单
        </div>

        <div
          v-else-if="item.state == 1"
          style="
            width: 1.69rem;
            height: 0.47rem;
            line-height: 0.47rem;
            background: rgba(39, 120, 190, 0);
            border: 1px solid #f57313;
            border-radius: 0.23rem;
            font-size: 0.24rem;
            text-align: center;
            font-family: PingFang SC;
            font-weight: 500;
            color: #f57313;
            position: absolute;
            top: 0.5rem;
            right: 0.2rem;
          "
          @click="toDetail(item.recitfyId)"
        >
          查看整改单
        </div>
        <div v-else></div>
      </div>
    </van-list>
  </div>
</template>
<script>
import { ImagePreview } from "vant";

export default {
  name: "yunjianyan",
  props: {},
  data() {
    return {
      // 每页显示条数
      pageSize: 10,
      total: 0,
      // 当前页
      pageNo: 1,
      id: "",
      List: [],
      finished: false,
      loading: false,
      currentRole: "",
    };
  },
  computed: {
    picList() {
      return (img) => {
        if (img) return img.split(",");
        return [];
      };
    },
    videoList() {
      return (video) => {
        if (video) return video.split(",");
        return [];
      };
    },
  },
  methods: {
    Preview(index, list) {
      ImagePreview({
        images: list,
        startPosition: index,
      });
    },
    tofpxpert() {
      // let uid = "03939";
      // let ps = "zchy54321";
      // let uid = "";
      // let ps = "";
      let server = "www.fpxpert.cn";
      // let url = encodeURI(
      //   `esfp://login?uid=${uid}&password=${ps}&server=${server}`
      // );
      // let url = encodeURI(`esfp://login?server=${server}`);
      let url = encodeURI("esfp://");
      window.location.replace(url);
    },
    getList() {
      let qry = this.query.new();
      this.query.toP(qry, this.pageNo, this.pageSize);
      this.query.toO(qry, "crtTm", "desc");
      this.query.toW(qry, "docsId", this.id, "EQ");
      this.api.getCloudTestAdoptList(this.query.toEncode(qry)).then((res) => {
        this.total = res.page.total;
        this.List = [...this.List, ...res.data.list];
        this.finished = this.List.length >= res.page.total;
        this.loading = false;
        this.pageNo++;
      });
    },
    newRectify(id) {
      this.until.href(`./rectifyAdd.html?inspId=${id}`);
    },
    toDetail(id) {
      this.until.href(`./rectifyDetail.html?id=${id}`);
    },
  },
  created() {
    this.currentRole = JSON.parse(this.until.loGet("currentRole"));
  },
  mounted() {
    this.id = this.until.getQueryString("id");
    this.List = [];
  },

  watch: {},
};
</script>
<style lang="less" scoped>
.container {
  padding: 1rem 0.2rem;
  padding-top: 0;
  .list {
    .item {
      padding: 0.4rem 0.3rem;
      background: #fff;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      .row {
        display: flex;
        align-items: center;
        margin-bottom: 0.1rem;
        .left {
          font-size: 0.28rem;
          font-size: #333;
          font-weight: bold;
          margin-right: 0.1rem;
        }
        .right {
          font-size: 0.26rem;
          font-size: #333;
        }
        .rightImg {
          display: flex;
          flex-wrap: wrap;
          img {
            width: 1.5rem;
            height: 1.5rem;
            margin-right: 0.2rem;
            margin-bottom: 0.2rem;
          }
          video {
            width: 4rem;
            height: 2.5rem;
            margin-right: 0.2rem;
            margin-bottom: 0.2rem;
          }
        }
      }
    }
    .item:last-child {
      border: none;
    }
  }
}
</style>

