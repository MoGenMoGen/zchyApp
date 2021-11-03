<template>
  <!-- 运行记录 组件 -->
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
          <div class="left">开始时间：</div>
          <div class="right">{{ item.startTm }}</div>
        </div>
        <div class="row">
          <div class="left">结束时间：</div>
          <div class="right">{{ item.endTm }}</div>
        </div>
        <div class="row">
          <div class="left">运行时长：</div>
          <div class="right">{{ item.runTime }}</div>
        </div>
        <div class="row">
          <div class="left">运行状态：</div>
          <div class="right">{{ item.runningStatusNm }}</div>
        </div>
        <div class="row">
          <div class="left">运行图片：</div>
          <div class="rightImg">
            <img
              :src="item1"
              v-for="(item1, index1) in runPics(item.imgUrl)"
              :key="index1"
              @click="Preview(index1,runPics(item.imgUrl))"
            />
          </div>
        </div>
        <div class="row">
          <div class="left">备注信息：</div>
          <div class="right">{{ item.rmks }}</div>
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
    };
  },
  computed: {
    runPics() {
      return (img) => {
        if (img) return img.split(",");
        return [];
      };
    },
  },
  created() {
    this.id = this.until.getQueryString("id");
    this.List = [];
  },
  mounted() {},

  methods: {
    Preview(index,list) {
      ImagePreview({
        images: list,
        startPosition: index,
      });
    },
    getList() {
      let qry = this.query.new();
      this.query.toP(qry, this.pageNo, this.pageSize);
      this.query.toO(qry, "crtTm", "desc");
      this.query.toW(qry, "docsId", this.id, "EQ");
      this.api.getRunAdoptList(this.query.toEncode(qry)).then((res) => {
        this.total = res.page.total;
        this.List = [...this.List, ...res.data.list];
        this.finished = this.List.length >= res.page.total;
        this.loading = false;
        this.pageNo++;
      });
    },
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
        }
      }
    }
    .item:last-child {
      border: none;
    }
  }
}
</style>

