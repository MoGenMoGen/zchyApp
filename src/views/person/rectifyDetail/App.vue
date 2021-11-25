<template>
  <!--	整改单详情-->
  <div id="container">
    <pen-header title="整改单"></pen-header>
    <!-- 二次下发 -->
    <div id="Issueshow" v-if="Issueshow" @click="Issueshow = false">
      <div class="addBox" @click.stop="">
        <div class="head">
          <p>再次下发说明</p>
        </div>
        <div class="addBody">
          <div class="inputbox">
            <van-field
              v-model="info.reissueReport"
              rows="1"
              autosize
              clearable
              required
              label="下发说明："
              type="textarea"
              placeholder="请输入二次下发说明"
            />
          </div>

          <div class="uploadBox">
            <div
              class="listLeft"
              style="padding-left: 6px; box-sizing: border-box"
            >
              <span style="color: red">*</span>下发图片:
            </div>
            <div class="listRightImg">
              <van-uploader
                multiple="true"
                preview-size="1.5rem"
                :after-read="afterRead"
                :before-delete="beforeDel"
                v-model="reissueAlbums"
              />
              <van-loading
                v-if="isvanloading2"
                type="spinner"
                class="van_loading"
              />
            </div>
          </div>
          <div class="Issuebtn">
            <div class="cancel" @click.stop="Issueshow = false">取消</div>
            <div class="confirm" @click="handleconfirmIssue">确认</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 整改单内容开始 -->
    <div class="containerBody">
      <div class="bodyTitle">
        <img :src="tradingL" />
        <p>整改单</p>
        <img :src="tradingR" />
      </div>
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">整改单号：</div>
          <div class="listRight">{{ info.cd }}</div>
        </div>
      </div>
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">整改名称：</div>
          <div class="listRight">{{ info.nm }}</div>
        </div>
      </div>
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">整改单位：</div>
          <div class="listRight">{{ info.orgEnterId }}</div>
        </div>
      </div>
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">整改责任人：</div>
          <div
            class="listRight"
            v-if="info.rectifyerSign && info.rectifyerSign.includes('http')"
          >
            <img
              :src="info.rectifyerSign"
              alt=""
              style="object-fit: fill; width: 3rem; height: 2rem"
            />
          </div>
          <div class="listRight" v-else>{{ info.rectifyerSign }}</div>
        </div>
      </div>
      <!-- <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">整改日期：</div>
          <div class="listRight">{{ info.rectifyTm }}</div>
        </div>
      </div> -->
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">下发日期：</div>
          <div class="listRight" v-if="info.issueTm">
            {{ info.issueTm.slice(0, 10) }}
          </div>
        </div>
      </div>
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">检查区域：</div>
          <div class="listRight">{{ info.inspArea }}</div>
        </div>
      </div>
      <!-- <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">隐患说明：</div>
          <div class="listRight">{{ info.explains }}</div>
        </div>
      </div> -->
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">整改要求：</div>
          <div
            class="listRight"
            style="white-space: pre-line; margin-top: -20px"
          >
            {{ info.rectifyDemand }}
          </div>
        </div>
      </div>

      <div class="bodyContent">
        <div
          class="contentList"
          style="display: flex; flex-direction: column; border-bottom: 0"
        >
          <div class="listLeft">隐患图片:</div>
          <div class="listRightImg">
            <img
              :src="item"
              v-for="(item, index) in hiddenPics"
              :key="index"
              @click="Preview(index, hiddenPics)"
            />
          </div>
        </div>
      </div>
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">复查人：</div>
          <div
            class="listRight"
            v-if="info.reviewerSign && info.reviewerSign.includes('http')"
          >
            <img
              :src="info.reviewerSign"
              alt=""
              style="object-fit: fill; width: 3rem; height: 2rem"
            />
          </div>
          <div class="listRight" v-else>{{ info.reviewerSign }}</div>
        </div>
      </div>
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">检验检测单位：</div>
          <div class="listRight">{{ info.orgTestEnterNm }}</div>
        </div>
      </div>
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">检查时间：</div>
          <div class="listRight" v-if="info.reviewerTm">
            {{ info.reviewerTm.slice(0, 10) }}
          </div>
        </div>
      </div>
    </div>
    <!-- 整改单内容结束 -->
    <!-- 整改执行情况开始 -->

    <!-- 检测：
    待执行：待执行状态
    结案、完成：展示内容
    船厂：
    待执行：输入执行内容
    待结案、完成：展示内容
    待结案多一个待结案状态 -->

    <div class="containerBody">
      <div class="bodyTitle">
        <img :src="tradingL" />
        <p>整改执行情况</p>
        <img :src="tradingR" />
      </div>
      <!-- 检验检测待执行开始 -->
      <div
        class="bodyContent"
        v-if="
          currentRole &&
          currentRole.identityCd == 'identity50' &&
          info.state == 2
        "
      >
        <div class="contentList">
          <div class="listLeft">整改状态：</div>
          <div class="listRight" style="color: #e4393c">待执行</div>
        </div>
      </div>
      <!-- 检验检测待执行结束 -->
      <!-- 船厂待执行开始 -->
      <div
        v-else-if="
          currentRole &&
          currentRole.identityCd == 'identity30' &&
          info.state == 2
        "
      >
        <div
          class="bodyContent"
          style="border-bottom: 1px solid #e5e5e5; padding: 0"
        >
          <van-field
            v-model="info.rectifyReport"
            rows="1"
            autosize
            clearable
            required
            label="整改上报："
            type="textarea"
            placeholder="请输入执行情况"
          />
        </div>
        <div class="bodyContent" style="border-bottom: 1px solid #e5e5e5">
          <div
            class="contentList"
            style="display: flex; flex-direction: column; border-bottom: 0"
          >
            <div
              class="listLeft"
              style="padding-left: 8px; box-sizing: border-box"
            >
              <span style="color: red">*</span>图片:
            </div>
            <div class="listRightImg">
              <van-uploader
                preview-size="1.5rem"
                :after-read="afterRead"
                :before-delete="beforeDel"
                v-model="albums"
                multiple="true"
              />
              <van-loading
                v-if="isvanloading"
                type="spinner"
                class="van_loading"
              />
            </div>
          </div>
        </div>
        <div
          class="bodyContent"
          style="border-bottom: 1px solid #e5e5e5; padding: 0"
        >
          <van-field
            v-model="info.rmks"
            rows="1"
            clearable
            autosize
            label="备注"
            type="textarea"
            placeholder="请输入备注"
          />
        </div>
      </div>

      <!-- 船厂待执行结束 -->
      <!-- 除检验检测待执行开始 -->
      <div
        v-if="
          !(
            currentRole &&
            currentRole.identityCd == 'identity50' &&
            info.state == 2
          )
        "
        style="background: #efefef"
        :style="{
          'padding-top':
            currentRole &&
            currentRole.identityCd == 'identity30' &&
            info.state == 2
              ? '.12rem'
              : '',
        }"
      >
        <div
          v-for="(item, index) in reissueList"
          :key="index"
          style="background: #fff; margin-bottom: 0.12rem"
        >
          <!-- 第一次下发 -->
          <div v-show="item.isshow && index == 0">
            <div style="font-size: 14px; font-weight: 700; text-align: center">
              下发内容
            </div>

            <div class="bodyContent">
              <div class="contentList">
                <div class="listLeft">整改要求:</div>
                <div
                  class="listRight"
                  style="white-space: pre-line; margin-top: -20px"
                >
                  {{ item.rectifyDemand }}
                </div>
              </div>
              <div
                class="contentList"
                style="display: flex; flex-direction: column"
              >
                <div class="listLeft">隐患图片:</div>
                <div class="listRightImg">
                  <img
                    :src="item1"
                    v-for="(item1, index1) in item.troubleImg
                      ? item.troubleImg.split(',')
                      : []"
                    :key="index1"
                    @click="
                      Preview(
                        index1,
                        item.troubleImg ? item.troubleImg.split(',') : []
                      )
                    "
                  />
                </div>
              </div>
            </div>
            <div class="bodyContent">
              <div class="contentList">
                <div class="listLeft">下发日期：</div>
                <div class="listRight" v-if="item.issueTm">
                  {{ item.issueTm.slice(0, 10) }}
                </div>
              </div>
            </div>
          </div>
          <!-- 二次下发 -->
          <div v-show="item.isshow && index > 0">
            <div style="font-size: 14px; font-weight: 700; text-align: center">
              再次下发内容
            </div>
            <div class="bodyContent">
              <div class="contentList">
                <div class="listLeft">下发说明:</div>
                <div
                  class="listRight"
                  style="white-space: pre-line; margin-top: -20px"
                >
                  {{ item.rectifyDemand }}
                </div>
              </div>
              <div
                class="contentList"
                style="display: flex; flex-direction: column"
              >
                <div class="listLeft">隐患图片:</div>
                <div class="listRightImg">
                  <img
                    :src="item1"
                    v-for="(item1, index1) in item.reissueImg
                      ? item.reissueImg.split(',')
                      : []"
                    :key="index1"
                    @click="
                      Preview(
                        index1,
                        item.reissueImg ? item.reissueImg.split(',') : []
                      )
                    "
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-show="item.isshow && item.rectifyReport">
            <div style="font-size: 14px; font-weight: 700; text-align: center">
              整改上报内容
            </div>

            <div class="bodyContent">
              <div class="contentList">
                <div class="listLeft">整改上报：</div>
                <div
                  class="listRight"
                  style="white-space: pre-line; margin-top: -20px"
                >
                  {{ item.rectifyReport }}
                </div>
              </div>
              <div
                class="contentList"
                style="display: flex; flex-direction: column"
              >
                <div class="listLeft">执行图片:</div>
                <div class="listRightImg">
                  <img
                    :src="item"
                    v-for="(item, index) in item.rectifyImg
                      ? item.rectifyImg.split(',')
                      : []"
                    :key="index"
                    @click="
                      Preview(
                        index,
                        item.rectifyImg ? item.rectifyImg.split(',') : []
                      )
                    "
                  />
                </div>
              </div>
            </div>
            <div class="bodyContent">
              <div class="contentList">
                <div class="listLeft">整改日期：</div>
                <div class="listRight" v-if="item.rectifyTm">
                  {{ item.rectifyTm.slice(0, 10) }}
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: center">
            <img
              :src="Dfolder"
              style="
                width: 0.46rem;
                height: 0.46rem;
                object-fit: fill;
                margin: 0.1rem 0;
              "
              v-show="!item.isshow"
              @click="item.isshow = !item.isshow"
            />
            <img
              :src="Ufolder"
              style="
                width: 0.46rem;
                height: 0.46rem;
                object-fit: fill;
                margin-bottom: 0.1rem;
              "
              v-show="item.isshow"
              @click="item.isshow = !item.isshow"
            />
          </div>
          <!-- <div class="bodyContent">
          <div class="contentList">
            <div class="listLeft">确认人：</div>
            <div
              class="listRight"
              v-if="info.reviewerSign && info.reviewerSign.includes('http')"
            >
              <img
                :src="info.reviewerSign"
                alt=""
                style="object-fit: fill; width: 3rem; height: 2rem"
              />
            </div>
          </div>
        </div> -->
          <!-- <div class="bodyContent">
          <div class="contentList">
            <div class="listLeft">确认日期：</div>
            <div class="listRight">{{ info.reviewerTm }}</div>
          </div>
        </div> -->
          <!-- <div
            class="bodyContent"
            v-if="
              currentRole &&
              currentRole.identityCd == 'identity30' &&
              info.state == 3
            "
          >
            <div class="contentList">
              <div class="listLeft">当前状态：</div>
              <div class="listRight" style="color: #2778be">待结案</div>
            </div>
          </div> -->
        </div>
      </div>
      <!--  除检验检测待执行结束  -->
    </div>
    <!-- 整改上报按钮开始 -->
    <div
      class="btn2"
      v-if="
        currentRole && currentRole.identityCd == 'identity30' && info.state == 2
      "
    >
      <div class="cancel" @click="back">取消</div>
      <div class="confirm" @click="handleReport">确定</div>
    </div>
    <!-- 整改上报按钮结束 -->
    <!-- 整改执行情况结束 -->
    <!-- 结案开始 -->
    <!-- 检测待结案 -->
    <div
      class="containerBody"
      v-if="
        info.state == 3 && currentRole && currentRole.identityCd == 'identity50'
      "
    >
      <div class="bodyTitle">
        <img :src="tradingL" />
        <p>结案</p>
        <img :src="tradingR" />
      </div>
      <div
        class="bodyContent"
        style="border-bottom: 1px solid #e5e5e5; padding: 0"
      >
        <van-field
          v-model="info.closeReport"
          rows="1"
          clearable
          autosize
          required
          label="结案内容："
          type="textarea"
          placeholder="请输入结案内容"
        />
      </div>
    </div>

    <!-- 已完成 -->
    <div class="containerBody" v-if="info.state == 4">
      <div class="bodyTitle">
        <img :src="tradingL" />
        <p>结案</p>
        <img :src="tradingR" />
      </div>
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">结案内容：</div>
          <div class="listRight">{{ info.closeReport }}</div>
        </div>
      </div>
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">签发人：</div>
          <div
            class="listRight"
            v-if="info.reviewerSign && info.reviewerSign.includes('http')"
          >
            <img
              :src="info.reviewerSign"
              alt=""
              style="object-fit: fill; width: 3rem; height: 2rem"
            />
          </div>
          <div class="listRight" v-else>
            {{ info.closeUserNm }}
          </div>
        </div>
      </div>
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">确认日期：</div>
          <div class="listRight">{{ info.closeDate }}</div>
        </div>
      </div>
      <div class="bodyContent">
        <div class="contentList">
          <div class="listLeft">检验检测单位：</div>
          <div class="listRight">{{ info.orgTestEnterNm }}</div>
        </div>
      </div>
    </div>
    <!-- 结案结束 -->
    <!-- 结案提交按钮开始 -->
    <div
      class="btn3"
      v-if="
        currentRole && currentRole.identityCd == 'identity50' && info.state == 3
      "
    >
      <div class="cancel" @click="back">取消</div>
      <div class="confirm" @click="handleRectifyclose">确认结案</div>
      <div class="issue" @click="Issueshow = true">再次下发</div>
    </div>
    <!-- 结案提交按钮结束 -->
  </div>
</template>

<script>
import { compressImg, readImg } from "@/assets/js/imageUtil";
import { ImagePreview } from "vant";
import penHeader from "../../../components/personal/penHeader";
import { Toast } from "vant";
import { mixins } from "../mixins/mixins";
import { mapState } from "vuex";
import moment from "moment";
import tradingL from "@/assets/img/tradingL.png";
import tradingR from "@/assets/img/tradingR.png";
import Dfolder from "@/assets/img/person/down_folder.png";
import Ufolder from "@/assets/img/person/up_folder.png";

export default {
  mixins: [mixins],
  data() {
    return {
      tradingL,
      tradingR,
      Dfolder,
      Ufolder,
      currentRole: "",
      // 再次下发列表
      reissueList: [],
      info: {},
      // 上报图片列表
      albums: [],
      // 加载图片
      isvanloading: false,
      // 再次下发图片列表
      reissueAlbums: [],
      isvanloading2: false,
      // 二次下发弹窗
      Issueshow: false,
    };
  },
  components: {
    penHeader,
  },
  computed: {
    ...mapState(["serverAddr"]),
    hiddenPics() {
      if (this.info.troubleImg) return this.info.troubleImg.split(",");
      return [];
    },
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
    this.id = this.until.getQueryString("id");
    let data = await this.api.getRectifyDetail(this.id);
    this.info = data.shipDocsRectifyVo;
    // if (this.info.rectifyImg) this.albums = this.info.rectifyImg.split(",");
    this.reissueList = data.reissueList;
    this.reissueList.forEach((item) => {
      this.$set(item, "isshow", true);
    });
    console.log(111, this.albums);
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
    Preview(index, list) {
      ImagePreview({
        images: list,
        startPosition: index,
      });
    },
    // 文件删除前的回调
    beforeDel(file, detail) {
      // detail.index为图片下标
      // let fileList = this.commitInfo.pic.split(",");
      // fileList.splice(detail.index, 1);
      // this.commitInfo.pic = fileList.join(",");
      // albums里面内容为文件格式，不能直接传给后台
      if (this.currentRole && this.currentRole.identityCd == "identity30") {
        this.albums.splice(detail.index, 1);
        this.info.rectifyImg = this.albums.join(",");
      } else if (
        this.currentRole &&
        this.currentRole.identityCd == "identity50"
      ) {
        this.reissueAlbums.splice(detail.index, 1);
        this.info.reissueImg = this.reissueAlbums.join(",");
      }
    },
    // 文件读取完成后的回调
    async afterRead(e) {
      // 船厂identityCd == 'identity30'整改上报图片上传
      // 检测identityCd == 'identity50'二次下发图片上传
      console.log(1111, e);
      // this.$loading.show("正在上传");
      if (this.currentRole && this.currentRole.identityCd == "identity30")
        this.isvanloading = true;
      else if (this.currentRole && this.currentRole.identityCd == "identity50")
        this.isvanloading2 = true;

      //多图上传
      if (Array.isArray(e)) {
        e.forEach(async (item) => {
          const formData = new FormData();
          if (item.file.size > 1048576) {
            // console.log("压缩图片");
            const img = await readImg(item.file);
            let blob = await compressImg(img);
            formData.append("file", blob, "file.jpg");
          } else {
            formData.append("file", item.file, "file.jpg");
          }
          this.uploadPic(formData);
        });
      }
      //单图上传
      else {
        const formData = new FormData();

        if (e.file.size > 1048576) {
          // console.log("压缩图片");
          const img = await readImg(e.file);
          let blob = await compressImg(img);
          formData.append("file", blob, "file.jpg");
        } else {
          formData.append("file", e.file, "file.jpg");
        }
        this.uploadPic(formData);
      }
    },
    //调取图片上传接口
    uploadPic(formData) {
      this.api.uploadImg3(formData).then((imgurl) => {
        this.isvanloading = false;
        this.isvanloading2 = false;
        console.log("上传后地址", imgurl);
        if (this.currentRole && this.currentRole.identityCd == "identity30") {
          if (!this.info.rectifyImg) {
            this.info.rectifyImg = imgurl;
          } else {
            this.info.rectifyImg += `,${imgurl}`;
          }
          // this.albums.push(imgurl);
        } else if (
          this.currentRole &&
          this.currentRole.identityCd == "identity50"
        ) {
          if (!this.info.reissueImg) {
            this.info.reissueImg = imgurl;
          } else {
            this.info.reissueImg += `,${imgurl}`;
          }
          // this.reissueAlbums.push(imgurl);
          console.log(1111111, this.reissueAlbums);
        }
      });
    },
    back() {
      this.until.back();
    },
    // 整改上报
    async handleReport() {
      if (!this.info.rectifyReport) {
        Toast("上报内容不能为空");
      } else if (!this.info.rectifyImg) {
        Toast("执行图片不能为空");
      } else {
        let obj = {};
        //再下发说明列表
        if (this.reissueList.length > 1) {
          obj = {
            inspId: this.reissueList[this.reissueList.length - 1].id,
          };
        }
        let res = await this.api.handleRectifyReport({
          ...{
            id: this.id,
            cd: this.info.cd,
            rectifyReport: this.info.rectifyReport,
            rectifyImg: this.info.rectifyImg,
            rmks: this.info.rmks,
          },
          ...obj,
        });
        console.log(12222, res);
        if (res.code == 0) {
          Toast.success("上报成功");
          let data = await this.api.getRectifyDetail(this.id);
          this.info = data.shipDocsRectifyVo;
          // if (this.info.rectifyImg)
          //   this.albums = this.info.rectifyImg.split(",");

          this.reissueList = data.reissueList;
          this.reissueList.forEach((item) => {
            this.$set(item, "isshow", true);
          });
        } else {
          Toast.fail("上报失败");
        }
      }
    },
    // 确认结案
    async handleRectifyclose() {
      if (this.info.closeReport == "") {
        Toast("结案内容不能为空");
      } else {
        let res = await this.api.handlerectifyClose({
          id: this.id,
          closeReport: this.info.closeReport,
        });

        if (res.code == 0) {
          Toast.success("结案成功");
          let data = await this.api.getRectifyDetail(this.id);
          this.info = data.shipDocsRectifyVo;
          // if (this.info.rectifyImg)
          //   this.albums = this.info.rectifyImg.split(",");

          this.reissueList = data.reissueList;
          this.reissueList.forEach((item) => {
            this.$set(item, "isshow", true);
          });
        } else {
          Toast.fail("结案失败");
        }
      }
    },
    // 二次下发
    async handleconfirmIssue() {
      if (!this.info.reissueReport || !this.info.reissueImg) {
        Toast("请将信息填写完整");
      } else {
        let data = await this.api.handleRectifyReturn({
          inspId: this.reissueList[this.reissueList.length - 1].id,
          id: this.id,
          cd: this.info.cd,
          reissueImg: this.info.reissueImg,
          reissueReport: this.info.reissueReport,
        });
        if (data.code == 0) {
          Toast.success("再次下发成功");
          let data1 = await this.api.getRectifyDetail(this.id);
          this.info = data1.shipDocsRectifyVo;
          // if (this.info.rectifyImg) {
          //   this.albums = this.info.rectifyImg.split(",");
          // }
          this.reissueList = data1.reissueList;
          this.reissueList.forEach((item) => {
            this.$set(item, "isshow", true);
          });
          this.Issueshow = false;
        } else {
          Toast.fail("再次下发失败");
        }
      }
    },
    //传入图片路径，返回base64
    getBase64(url, callback) {
      var Img = new Image(),
        dataURL = "";
      Img.src = url + "?v=" + Math.random();
      Img.setAttribute("crossOrigin", "Anonymous");
      Img.onload = function () {
        var canvas = document.createElement("canvas"),
          width = Img.width,
          height = Img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(Img, 0, 0, width, height);
        dataURL = canvas.toDataURL("image/jpeg");
        return callback ? callback(dataURL) : null;
      };
    },
  },
};
</script>
<style lang="less" scoped>
@import url("../../../assets/css/mobile.less");
#container {
  padding-bottom: 2rem;
  #Issueshow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    .addBox {
      width: 6.49rem;
      height: 6.59rem;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      border-radius: 0.08rem;
      position: relative;

      .head {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1rem;
        width: 100%;
        padding: 0 0.3rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.3);
        > p {
          margin: 0 auto;
          font-size: 0.28rem;
          padding-left: 0.16rem;
          color: #333;
          // width: 37.4%;
        }
        > img {
          width: 0.16rem;
          height: 0.16rem;
          cursor: pointer;
        }
      }
      .addBody {
        width: 100%;
        flex: 1;
        overflow: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        .inputbox {
          width: 80%;
          margin-top: 0.5rem;
        }
        .uploadBox {
          width: 80%;
          margin-top: 0.5rem;
          padding-bottom: 0.78rem;
        }
        .Issuebtn {
          width: 100%;
          position: absolute;
          z-index: 199;
          bottom: 0;
          left: 0;
          display: flex;
          .cancel {
            width: 50%;
            height: 0.78rem;
            background: #fff;
            border-top: 1px solid #dddddd;
            border-radius: 0.05rem;
            font-size: 0.16rem;
            font-weight: 400;
            color: #666666;
            line-height: 0.78rem;
            text-align: center;
          }
          .confirm {
            width: 50%;
            border-top: 1px solid #dddddd;

            height: 0.78rem;
            background: #2778be;
            border-radius: 0.05rem;
            font-size: 0.16rem;
            font-weight: 400;
            color: #ffffff;
            line-height: 0.78rem;
            text-align: center;
          }
        }
      }
    }
  }
  .containerBody {
    background-color: #ffffff;
    width: 7.09rem;
    padding: 0.4rem 0.2rem;
    padding-bottom: 0;
    box-sizing: border-box;
    margin: 0.2rem auto;
    border-radius: 0.12rem;
    .bodyTitle {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.3rem;
      color: #303030;
      font-weight: bold;
      img {
        width: 1.2rem;
      }
      p {
        margin: 0 0.3rem;
      }
    }
    .bodyContent {
      padding: 0.3rem 0 0.3rem 0;
      box-sizing: border-box;
      .contentList {
        display: flex;
        padding-bottom: 0.2rem;
        box-sizing: border-box;
        border-bottom: 0.01rem solid #e5e5e5;
        .listLeft {
          font-size: 0.28rem;
          font-weight: 500;
          color: #333333;
          width: 2rem;
        }
        .listRight {
          font-size: 0.26rem;
          font-weight: 500;
          color: #333333;
          // margin-left: 0.8rem;
          .van-cell {
            height: 0.2rem;
            display: flex;
            align-items: center;
            padding-left: 0;
            font-size: 0.26rem;
            width: 4rem;
          }
          .van-cell::after {
            border-bottom: 0;
          }
          .van-cell::placeholder {
            color: #999999;
          }
          textarea {
            width: 4rem;
            height: 2.12rem;
            box-sizing: border-box;
            font-size: 0.24rem;
          }
          textarea::placeholder {
            color: #999999;
          }
        }
        .listRightImg {
          display: flex;
          flex-wrap: wrap;
          position: relative;
          padding: 0.1rem 0.6rem;
          img {
            width: 1.5rem;
            height: 1.5rem;
            margin-right: 0.2rem;
            margin-bottom: 0.2rem;
          }
          .van_loading {
            position: absolute;
            top: 50%;
            right: 30%;
            transform: translateX(-50%) translateY(-50%);
            color: #09c076;
          }
        }
      }
    }

    .bodyList {
      display: flex;
      align-items: center;
      margin-bottom: 0.3rem;
      .left {
        display: flex;
        align-items: center;
        width: 1.8rem;
        .name {
          font-size: 0.24rem;
          font-weight: 500;
          color: #333333;
          margin-left: 0.1rem;
          width: 1.5rem;
        }
      }
      .right {
        margin-left: 0.1rem;
        font-weight: 500;
        color: #303030;
        .van-cell {
          width: 4.57rem;
          border: 0.01rem solid #dddddd;
          height: 0.6rem;
          display: flex;
          align-items: center;
        }
        .van-cell::after {
          border-bottom: 0;
        }
        .van-cell::placeholder {
          color: #999999;
        }
        textarea {
          width: 4.57rem;
          height: 2.12rem;
          border: 0.01rem solid #dddddd;
          padding: 0.2rem 0.32rem;
          box-sizing: border-box;
          font-size: 0.22rem;
        }
        textarea::placeholder {
          color: #999999;
        }
      }
    }
    .imgUpload {
      margin-left: 0.5rem;
      .top {
        font-size: 0.24rem;
        font-weight: 500;
        color: #333333;
        margin-bottom: 0.3rem;
        span {
          font-size: 0.24rem;
          font-weight: 500;
          color: #909090;
        }
      }
      .imgBox {
      }
    }
  }
  .btn2 {
    z-index: 99;
    position: fixed;
    bottom: 0;
    width: 100vw;
    display: flex;
    .cancel {
      width: 50%;
      height: 0.98rem;
      background: #fff;
      font-size: 0.28rem;
      font-weight: bold;
      color: #999999;
      line-height: 0.98rem;
      text-align: center;
    }
    .confirm {
      width: 50%;
      height: 0.98rem;
      background: #2778be;
      color: #fff;
      font-size: 0.28rem;
      font-weight: bold;
      line-height: 0.98rem;
      text-align: center;
    }
  }
  .btn3 {
    z-index: 99;
    position: fixed;
    bottom: 0;
    width: 100vw;
    display: flex;
    .cancel {
      width: 33.3%;
      height: 0.98rem;
      background: #fff;
      font-size: 0.28rem;
      font-weight: bold;
      color: #999999;
      line-height: 0.98rem;
      text-align: center;
    }
    .confirm {
      width: 33.3%;
      height: 0.98rem;
      background: #e4393c;
      color: #fff;
      font-size: 0.28rem;
      font-weight: bold;
      line-height: 0.98rem;
      text-align: center;
    }
    .issue {
      width: 33.3%;
      height: 0.98rem;
      background: #2778be;
      color: #fff;
      font-size: 0.28rem;
      font-weight: bold;
      line-height: 0.98rem;
      text-align: center;
    }
  }
}
</style>
