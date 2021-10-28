<template>
  <basic-container>
    <el-form :inline="true" :model="vod" @keyup.enter.native="onLoad(page)" class="yui-search-form">
      <el-form-item>
        <el-input v-model="vod.title" placeholder="视频名称" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="vod.videoId" placeholder="视频ID" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="vod.status" clearable size="small" placeholder="状态" style="width: 100px">
          <el-option label="正常" value='Normal' />
          <el-option label="上传中" value='Uploading' />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker size="small" style="width: 230px"
          v-model="creationTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="onLoad(page)">查询</el-button>
        <el-button size="small" type="success" @click="configHandle()">配置</el-button>
        <el-button type="primary" size="small" @click="uploadHandle()">上传</el-button>
        <el-button type="danger" size="small" @click="delHandle()" :disabled="dataListSelections.length <= 0">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data" border stripe v-loading="loading" @selection-change="selectionChangeHandle" @sort-change="sortChangeHandle"
              height="650" class="yui-search-table" ref="table">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="video.title" label="视频" header-align="center" align="center">
        <template slot-scope="scope">
          <div class="vod-type">
            <div class="vod-img-type">
              <img :src="scope.row.video.coverURL" @click="playHandle(scope.row.mediaId, scope.row.video.status)"
                style="width: 120px; height: 68px"/>
            </div>
            <div class="vod-text-type">
              <div>{{ scope.row.video.title }}</div><br/>
              <div>ID：{{ scope.row.mediaId }}</div><br/>
              <div>时长：{{ scope.row.video.duration | durationFilter}}</div>
              <div class="vod-text-size">大小：{{ (scope.row.video.size / 1024 / 1024).toFixed(2) + 'M' }}</div>
              <div>存储地址：{{ scope.row.video.storageLocation }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="size" label="大小" header-align="center" align="center" width="60">
        <template slot-scope="scope">
          <label>{{ (scope.row.video.size / 1024 / 1024).toFixed(2) + 'M' }}</label>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="mediaType" label="类型" header-align="center" align="center" width="80px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.mediaType === 'video'" size="small">视频</el-tag>
          <el-tag v-else-if="scope.row.mediaType === 'audio'" size="small" type="danger">音频</el-tag>
          <el-tag v-else size="small">{{ scope.row.mediaType }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="video.catName" label="分类" header-align="center" align="center" width="100px">
        <template slot-scope="scope">
          <label v-if="scope.row.video.catName">{{ scope.row.video.catName }}1</label>
          <label v-else>未分类</label>
        </template>
      </el-table-column>
      <el-table-column prop="video.status" label="状态" header-align="center" align="center" width="70px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.video.status === 'Normal'" size="small">正常</el-tag>
          <el-tag v-else-if="scope.row.video.status === 'Uploading'" size="small" type="danger">上传中</el-tag>
          <el-tag v-else size="small">{{ scope.row.video.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="video.mediaSource" label="来源" header-align="center" align="center" width="90px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.video.mediaSource === 'general'" size="small">点播上传</el-tag>
          <el-tag v-else-if="scope.row.video.mediaSource === 'console'" size="small" type="danger">控制台</el-tag>
          <el-tag v-else size="small">{{ scope.row.video.mediaSource }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creationTime" label="创建时间" header-align="center" align="center" width="90">
        <template slot-scope="scope">
          {{ scope.row.video.creationTime | creationTimeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="infoHandle(scope.row.mediaId)" icon="el-icon-document" title="视频地址"></el-button>
          <el-button type="text" size="small" @click="editHandle(scope.row.mediaId)" icon="el-icon-edit" title="编辑"></el-button>
          <el-button type="text" size="small" @click="rowDel(scope.row)" icon="el-icon-delete" title="删除"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="page.pageNo"
      :page-sizes="page.pageSizes"
      :page-size="page.pageSize"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 配置 -->
    <config v-if="configVisible" ref="config"></config>
    <!-- 弹窗, 播放 -->
    <play v-if="playVisible" ref="play"></play>
    <!-- 弹窗, 编辑 -->
    <edit v-if="editVisible" ref="edit" @refreshDataList="onLoad(page)"></edit>
    <!-- 弹窗, 视频地址 -->
    <info v-if="infoVisible" ref="info"></info>
  </basic-container>
</template>

<script>
  import config from './vod-config'
  import play from './vod-play'
  import edit from './vod-edit'
  import info from './vod-info'
  import { timeToMinute } from '@/util/dateUtils'
  import {getList, remove} from "@/api/vod/vod";
  import {mapGetters} from "vuex";
  export default {
    data () {
      return {
        configVisible: false,
        playVisible: false,
        editVisible: false,
        infoVisible: false,
        dataListSelections: [],
        data: [],
        loading : true,
        creationTime: '',
        vod: {
          creationTime: '',
          creationTime1: '',
          title: '',
          videoId: '',
          status: ''
        },
        page: {
          pageSize: 5,
          pageNo: 1,
          total: 0,
          pageSizes: [5, 10, 20, 50, 100]
        }
      }
    },
    filters: {
      durationFilter (val) {
        if (val) {
          return timeToMinute(val)
        }
        return '00:00:00'
      },
      creationTimeFilter (val) {
        if (val) {
          val = val.replace('T', ' ').replace('Z', '');
          return val
        }
        return val
      }
    },
    components: {
      config, play, edit, info
    },
    computed: {
      ...mapGetters(["permission", "vodRoutes"]),
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.mediaId);
        });
        return ids.join(",");
      },
    },
    mounted() {
      this.onLoad(this.page)
    },
    methods: {
      uploadHandle () {
        this.$router.push({path: `/vod/vod-upload`});
      },
      configHandle () {
        this.configVisible = true;
        this.$nextTick(() => {
          this.$refs.config.init()
        })
      },
      playHandle (id, status) {
        if (status === 'Uploading') {
          this.$message.warning('视频上传中');
          return
        }
        this.playVisible = true;
        this.$nextTick(() => {
          this.$refs.play.init(id)
        })
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.mediaId);
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.onLoad(this.page);
          });
      },
      delHandle () {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.onLoad(this.page);
            this.$refs.crud.toggleSelection();
          });
      },
      // 详情
      infoHandle (id) {
        this.infoVisible = true;
        this.$nextTick(() => {
          this.$refs.info.init(id)
        })
      },
      // 新增 / 修改
      editHandle (id) {
        this.editVisible = true;
        this.$nextTick(() => {
          if (!id) {
            id = null
          }
          this.$refs.edit.init(id)
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 分页, 每页条数
      sizeChangeHandle (val) {
        this.page.pageNo = 1;
        this.page.pageSize = val;
        this.onLoad(this.page)
      },
      // 分页, 当前页
      currentChangeHandle (val) {
        this.page.pageNo = val;
        this.onLoad(this.page)
      },
      // 排序
      sortChangeHandle (data) {
        if (!data.order || !data.prop) {
          this.order = '';
          this.orderField = '';
          return false
        }
        this.page.pageNo = 1;
        // this.order = data.order.replace(/ending$/, '')
        // this.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
        this.order = data.order.replace(/ending$/, '');
        this.orderField = data.prop;
        this.onLoad(this.page)
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.table.clearSelection();
      },
      onLoad(page, params = {}) {
        this.loading = true;
        this.vod.creationTime = '';
        this.vod.creationTime1 = '';
        if(this.creationTime !== '' && this.creationTime !== null){
          console.log(this.creationTime);
          this.vod.creationTime = this.creationTime[0];
          this.vod.creationTime1 = this.creationTime[1]
        }
        getList(page.pageNo, page.pageSize, Object.assign(params, this.vod)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  }
</script>
<style>
  .vod-type .vod-img-type {
    float: left;
  }
  .vod-type .vod-text-type div {
    float: left;
    margin-left: 5px;
    font-size: 12px;
  }
  .vod-type .vod-text-type .vod-text-size {
    margin-left: 25px;
  }
</style>
