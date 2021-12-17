<template>
  <!--  变更记录-->
  <div>
    <div class="bianBox">
      <van-list
        class="list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getInfo"
      >
        <div v-for="(item, index) in list" :key="index">
          <div class="title" @click="item.show = !item.show">
            <span>时间：{{ item.chgTm }}</span>
            <p>
              <!-- <img :src="arrowDown" > -->
              <van-icon
                name="arrow-down"
                v-if="item.show"
                style="opacity: 0.5"
              />
              <van-icon name="arrow-up" v-else style="opacity: 0.5" />
            </p>
          </div>
          <div class="rich" v-if="item.show">
            <p class="desc">变更内容：{{ item.cont }}</p>
            <p style="margin-top: 20px" v-show="item.fileList">附件：</p>
            <div class="doc">
              <p v-for="j in item.fileList" @click="toLink(j.url)">
                <img :src="j.img" />
                <span>{{ j.fileNm }}</span>
              </p>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
// import arrowUp from '../../components/img/arrowUp.png'
// import arrowDown from '../../components/img/arrowDown.png'
export default {
  name: "fangansheji",
  data() {
    return {
      // arrowDown,
      // arrowUp,
      total: 0,
      pageSize: 7,
      pageNo: 1,
      currentRole: {},
      list: [],
      loading: false,
      finished: false,
    };
  },
  mounted() {
    this.id = this.until.getQueryString("id");
    // this.getInfo()
  },
  methods: {
    async getInfo() {
      this.currentRole = JSON.parse(this.until.loGet("currentRole"));
      let qry = this.query.new();
      this.query.toW(qry, "docsId", this.id, "EQ");
      this.query.toO(qry, "chgTm", "desc");
      this.query.toP(qry, this.pageNo, this.pageSize);
      let data = await this.api.bianRecords(this.query.toEncode(qry));

      data.data.list.forEach((item) => {
        item.show = false;
        item.chgTm = item.chgTm ? item.chgTm.split(" ")[0] : "";
        let fileList1 = item.attachment ? item.attachment.split(",") : [];
        let fileList2 = [];
        fileList1.forEach((v) => {
          let type = v.split(".")[v.split(".").length - 1];
          let nmList = v.split(".com/"); //分割出url后的内容
          let nm = "";
          nmList.forEach((j, z) => {
            //防止文件名中有 .com/ 所以循环加入
            if (z != 0) {
              nm += j;
            }
          });
          nmList = nm.split("_"); //分割随机字符后的内容
          nm = "";
          nmList.forEach((j, z) => {
            //防止文件名中有 _ 所以循环
            if (z != 0) {
              nm += j;
            }
          });
          nm = nm.split("." + type)[0];
          if (type == "pdf") {
            fileList2.push({ url: v, img: this.pdf, fileNm: nm });
          } else if (type == "doc" || type == "docx") {
            fileList2.push({ url: v, img: this.word, fileNm: nm });
          } else if (type == "ppt" || type == "pptx") {
            fileList2.push({ url: v, img: this.ppt, fileNm: nm });
          } else if (type == "xls" || type == "xlsx") {
            fileList2.push({ url: v, img: this.excel, fileNm: nm });
          } else {
            fileList2.push({ url: v, img: v, fileNm: nm });
          }
          item.fileList = fileList2;
        });
        this.list.push(item);
        // this.list = [...this.list, ...data.data.list]
      });
      this.total = data.page.total;
      this.finished = this.list.length >= data.page.total;
      console.log(this.finished);
      this.loading = false;
      this.pageNo++;
      console.log(this.list);
    },
    toLink(url) {
      console.log(url);
      window.open(url);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage3 = val;
      this.getInfo();
    },
  },
};
</script>

<style scoped lang="less">
.bianBox {
  .Footer {
    margin-top: 0.8rem;
    width: 100%;
    display: inline-flex;
    justify-content: center;
  }
}

.title {
  margin-bottom: 0.2rem;
  height: 0.8rem;
  background: #ffffff;
  color: #666666;
  padding: 0 0.56rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #cccccc;

  &:hover {
    cursor: pointer;
  }
  p:nth-of-type(1) {
    display: flex;
    align-items: center;
    img {
      width: 0.24rem;
      margin-left: 0.5rem;
    }
  }
}

.rich {
  padding: 0.48rem 0.56rem;
  .desc {
    color: #666666;
  }
  .report {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    p {
      width: 3.6rem;
      height: 2.4rem;
      margin: 0.2rem 0.2rem 0 0;
      img {
        display: block;
        width: 3.6rem;
        height: 2.4rem;
        object-fit: cover;
        margin: 0 auto;
      }
    }
  }
  .doc {
    display: flex;
    flex-direction: column;
    // flex-wrap: wrap;
    width: 100%;
    p {
      margin-top: 0.1rem;
      // width: 120px;
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 1rem;
        height: 1rem;
        margin-right: 3px;
        display: block;
        &:hover {
        }
      }
      span {
        display: block;
        width: 100%;
        // text-align: center;
        color: #0066cc;
        font-size: 0.28rem;
        // margin-top: 5px;
      }
    }
  }
}
</style>
