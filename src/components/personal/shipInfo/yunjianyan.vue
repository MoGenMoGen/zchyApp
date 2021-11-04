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
      <div class="item" v-for="(item, index) in List" :key="index">
        <div class="row">
          <div class="left">检查起止时间：</div>
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
          style="color: #2778be"
          @click="tofpxpert"
          v-if="currentRole && currentRole.identityCd == 'identity50'"
        >
          检验入口
        </div>
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
      let url = encodeURI(`esfp://login?server=${server}`);
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

