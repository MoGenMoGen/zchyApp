<template>
  <div class="container">
    <van-list
      class="list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getList"
    >
      <div class="item" v-for="(item1, index1) in imglist" :key="index1">
        <div class="title">
          {{ item1.title }}
          <div class="down" @click="hanglefold(item1)">
            <img
              :class="{
                arrowTransform: !item1.isshow,
                arrowTransformReturn: item1.isshow,
              }"
              :src="arrowdown"
              alt=""
            />
          </div>
        </div>
        <div class="picbox" v-if="item1.isshow">
          <div
            class="picitem"
            v-for="(item2, index2) in item1.piclist"
            :key="index2"
            @click="Preview(index2, item1.piclist)"
          >
            <img
              :src="item2.previewUrl"
              alt=""
              style="cursor: pointer"
              v-if="item2.previewUrl"
              @click.stop="toOpen(item2.imgUrl)"
            />
            <img :src="item2.imgUrl" alt="" style="cursor: pointer" v-else />
            <p class="desc">{{ item2.name }}</p>
            <p class="date">{{ item2.imgDate }}</p>
          </div>
        </div>
      </div>
    </van-list>

    <!-- 分页 -->
    <!-- <div class="Footer">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div> -->
  </div>
</template>

<script>
import arrowdown from "@/assets/img/person/down_arrow.png";
import { ImagePreview } from "vant";
import excel from "@/assets/img/person/excel.png";
import ppt from "@/assets/img/person/ppt.png";
import word from "@/assets/img/person/word.png";
import pdf from "@/assets/img/person/pdf.jpg";
export default {
  name: "historyPic",
  data() {
    return {
      //   // 每页显示条数
      //   pageSize: 20,
      //   total: 0,
      //   // 当前页
      //   currentPage: 1,
      arrowdown,
      pageNo: 1,
      total: 0,
      pageSize: 10,
      finished: false,
      loading: false,
      // 船舶id
      id: "",
      // 存所有数据放一维数组，用于过渡
      List: [],
      imglist: [],
      excel,
      ppt,
      word,
      pdf,
    };
  },
  created() {
    this.id = this.until.getQueryString("id");
    this.List = [];
    this.imglist = [];
    // 获取历史图片审核通过列表
    // this.getList();
  },
  methods: {
    hanglefold(item) {
      item.isshow = !item.isshow;
      this.imglist.push();
    },
    Preview(index, list) {
      list = list.map((item) => item.imgUrl);
      ImagePreview({
        images: list,
        startPosition: index,
      });
    },
    // handleCurrentChange() {
    //   // console.log(`当前页: ${val}`);
    //   this.currentPage = val;
    //   this.getList();
    // },
    getList() {
      let qry = this.query.new();
      this.query.toO(qry, "crtTm", "desc");
      this.query.toP(qry, this.pageNo, this.pageSize);
      this.query.toW(qry, "docsId", this.id, "EQ");
      let query = this.query.toEncode(qry);

      this.api.getHisPicAdoptList(query).then((res) => {
        this.total = res.page.total;
        this.List = [...this.List, ...res.data.list];
        this.finished = this.List.length >= res.page.total;
        this.loading = false;
        this.pageNo++;
      //处理有文件的情况
          this.List.forEach((item) => {
            let type =
              item.imgUrl.split(".")[item.imgUrl.split(".").length - 1];
            if (type == "pdf") {
              this.$set(item, "previewUrl", this.pdf);
            } else if (type == "doc" || type == "docx") {
              this.$set(item, "previewUrl", this.word);
            } else if (type == "ppt" || type == "pptx") {
              this.$set(item, "previewUrl", this.ppt);
            } else if (type == "xls" || type == "xlsx") {
              this.$set(item, "previewUrl", this.excel);
            } else {
              //图片不做处理
            }
          });
        console.log("一维全部展示数组", this.List);
        // 先去重再合并
        // 去重相同年月后的数组
        let uniquList = JSON.parse(JSON.stringify(this.List));
        for (let i = 0; i < uniquList.length; i++) {
          for (let j = i + 1; j < uniquList.length; j++) {
            if (
              uniquList[i].years == uniquList[j].years &&
              uniquList[i].months == uniquList[j].months
            ) {
              //第一个等同于第二个，splice方法删除第二个
              uniquList.splice(j, 1);
              j--;
            }
          }
        }
        console.log("去重后的数组", uniquList);
        uniquList.forEach((item1) => {
          //  相同年月的数组
          let likeList = this.List.filter((item2) => {
            return item1.years == item2.years && item1.months == item2.months;
          });
          console.log("相同年月数组", likeList);
          let obj = {};
          obj.title = `${likeList[0].years}年${likeList[0].months}月`;
          obj.isshow = true;
          obj.piclist = likeList;
          this.imglist.push(obj);
        });
        //为相同年月的一组数据添加一个date属性,值为相同的年月
        this.imglist.forEach((item1) => {
          if (item1.piclist.length > 0) {
            this.$set(item1, "date", item1.piclist[0].imgDate.slice(0, 7));
          }
        });
        //排序
        this.imglist = this.imglist.sort(function (a, b) {
          let x = a.date;
          let y = b.date;
          return y < x ? -1 : x > y ? 1 : 0; //从小到大排序
        });

        console.log("二维目标数组", this.imglist);
      });
    },
    toOpen(url) {
      window.open(url);
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  .item {
    .title {
      height: 0.6rem;
      background: #f7f7f7;
      border: 1px solid #eeeeee;
      line-height: 0.6rem;
      font-size: 0.28rem;
      font-weight: bold;
      color: #666666;
      padding-left: 0.28rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // padding-right: .22rem;
      .down {
        box-sizing: content-box;
        width: 0.24rem;
        height: 0.4rem;
        line-height: 0.4rem;
        padding-right: 0.22rem;
        // float: right;
        img {
          width: 0.24rem;
          height: 0.14rem;
        }
        .arrowTransform {
          transition: 0.2s;
          transform-origin: center;
          transform: rotateZ(180deg);
        }
        .arrowTransformReturn {
          transition: 0.2s;
          transform-origin: center;
          transform: rotateZ(0deg);
        }
      }
    }

    .picbox {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      //   justify-content: space-between;
      padding: 0.2rem 0 0.4rem;
      .picitem {
        margin-right: 0.22rem;
        img {
          width: 1.5rem;
          height: 1.5rem;
        }
        .desc {
          height: 0.32rem;
          font-size: 0.32rem;
          font-weight: 400;
          color: #303030;
          line-height: 0.32rem;
          margin: 0.2rem;
        }
        .date {
          height: 0.22rem;
          font-size: 0.28rem;
          font-weight: 400;
          color: #909090;
          line-height: 0.22rem;
          margin: 0.2rem;
        }
      }
      .picitem:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
  .Footer {
    margin-top: 0.4rem;
    width: 100%;
    display: inline-flex;
    justify-content: center;
  }
}
</style>>
