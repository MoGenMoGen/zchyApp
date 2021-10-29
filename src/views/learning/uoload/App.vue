<template>
    <div class="app" >
        <van-popup v-model="show" position="bottom">
            <van-picker
                    title="选择类别"
                    show-toolbar
                    :columns="list"
                    value-key="nm"
                    @confirm="onConfirm"
                    @cancel="onCancel"
                    @change="onChange"
            />
        </van-popup>
        <van-nav-bar style="background-color: #2878BE;" fixed title="上传（课件或知识包）" :border="false" fixed class="fixTop">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="whiteBox">
                <ul>
                    <li>
                        <span>课程名称：</span>
                        <input placeholder="请输入课程名称" v-model="info.nm"/>
                    </li>
                    <li style="align-items: normal;">
                        <span style="padding-top: 0.2rem">课程简介：</span>
                        <textarea placeholder="请输入课程简介" v-model="info.cont"></textarea>
                    </li>
                    <li>
                        <span>选择类别：</span>
                        <p @click="show = true" style="height: 0.6rem;border: 0.01rem solid #DDDDDD;color: #9A9A9A;display: flex;align-items: center;padding-left: 0.24rem;">{{info.cid == ''? '点击此处选择类别': choose}}</p>
                    </li>
                    <li>
                        <span>课程封面：</span>
                        <van-uploader v-model="imgList"  :after-read="afterRead"  :max-count="1">
                            <div class="upBox" >
                                <input type="file"/>
                                <span style="font-size: 0.5rem; margin: 0.54rem;color: #9A9A9A;">+</span>
                            </div>
                        </van-uploader>

                    </li>
                    <li>
                        <span>附件上传：</span>
                        <van-uploader v-model="imgList2"  :after-read="afterRead2"  >
                            <div class="upBox" >
                                <input type="file"/>
                                <span style="font-size: 0.5rem; margin: 0.54rem;color: #9A9A9A;">+</span>
                            </div>
                        </van-uploader>
                    </li>
                    <li style="margin-top: 0.2rem;">
                        <span style="color: #FFFFFF;opacity: 0;">规则说明：</span>
                        <p class="rmk">* 上传格式： 限制文档、PPT、图片</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="foot">
            <p @click="back">取消</p>
            <p @click="submit">确认</p>
        </div>
    </div>

</template>

<script>
    import  { Toast } from 'vant';
    import bg from '@/assets/img/bg.png'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                bg,
                currentPage:1,
                pageSize: 4,
                show:false,
                choose:'',
                imgList:[],
                imgList2:[],
                info: {
                    cid: '',
                    cids: "",
                    nm: "",
                    summary: "",
                    teacherId: "",
                    teacher: "",
                    icon: "",
                    coverUrl: "",
                    origNm: "",
                    size: "",
                    type: "1",
                    url: "",
                    cont: "",
                    rmks: "备注"
                },
                list:[],
            };
        },
        watch:{
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        created(){
        },
        mounted() {
            this.getList();
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
		},
		methods: {
			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					window.location.href = window.location.origin+this.serverAddr+'/learning/learning'
				}
			},
            back(){
                window.history.go(-1);
            },
            toPage(url){
                this.until.href(url)
            },
            submit(){

                if(!this.info.nm){
                    Toast.fail('请输入课程名称！');
                }else if(!this.info.cont){
                    Toast.fail('请输入课程简介！');
                }else if(!this.info.cid){
                    Toast.fail('请选择课程所属分类！');
                }else if(this.imgList.length == 0){
                    Toast.fail('请上传课程封面！');
                }else if(this.imgList2.length == 0){
                    Toast.fail('请上传附件！');
                }else{
                    this.info.coverUrl = this.imgList[0].url;
                    this.info.cids = this.info.cid;
                    let imgList=[]
                    this.imgList2.forEach(item=>{
                        imgList.push(item.url)
                    })
                    this.info.url=imgList.join(",")
                    this.api.learningUpload(this.info).then(res =>{
                        if(res.code == 0){
                            Toast.success('上传成功！');
                            this.toPage('./index.html')
                        }
                    })
                }
            },

             afterRead(file) {
                // 此时可以自行将文件上传至服务器
                 this.imgList.forEach(item=>{
                     item.status="uploading"
                     this.api.uploadImg2(item.file).then(res=>{
                         item.status="done"
                         item.url=res
                     })
                     console.log(this.imgList)
                 })
            },
            afterRead2(file) {
                // 此时可以自行将文件上传至服务器
                this.imgList2.forEach(item=>{
                    item.status="uploading"
                    this.api.uploadImg2(item.file).then(res=>{
                        item.status="done"
                        item.url=res
                    })
                    console.log(this.imgList2)
                })
            },
            async getList(){
                let qry = this.query.new()
                let data = await this.api.studyContCat(this.query.toEncode(qry))
                this.list = data.data.list
                console.log('this.list',this.list)
            },
            onConfirm(value, index) {
                // Toast(`当前值：${value.id}, 当前索引：${index}`);
                this.choose = this.list[index].nm
                this.info.cid = value.id
                this.info.cids = value.id
                this.show = false
            },
            onChange(picker, value, index) {
                // Toast(`当前值：${value.id}, 当前索引：${index}`);
            },
            onCancel() {
                Toast('取消');
                this.show = false

            },
        },

    };
</script>
<style lang="less">
    .fixTop{
        background: none;
        .van-nav-bar__title{
            font-size: 0.36rem;
            color: #ffffff;
        }
        .van-nav-bar__right{
            font-size: 0.28rem;
            color: #ffffff;
        }
    }
</style>
<style lang="less" scoped>
    .app{
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center top;
        background-color: #F1F3F2;
        .main{
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            flex: 1;
            flex-direction:column;
            padding: 0 0.2rem;
            margin-top: 1.2rem;
            .whiteBox{
                margin-bottom: 0.2rem;
                border-radius: 0.1rem;
                background-color: #ffffff;
                box-sizing: border-box;
                padding: 0.1rem 0.3rem;
                ul li{
                    display: flex;
                    align-items: center;
                    margin-top: 0.3rem;
                    span{
                        margin-right: 0.45rem;
                        color: #343434;
                        font-size: 0.24rem;
                    }
                    p{
                        flex: 1;
                        color: #343434;
                        font-size: 0.24rem;
                    }
                    input{
                        flex: 1;
                        border: 0.01rem solid #DDDDDD;
                        height: 0.6rem;
                        padding-left: 0.24rem;
                    }
                    textarea{
                        flex: 1;
                        border: 0.01rem solid #DDDDDD;
                        padding-left: 0.24rem;
                        height: 1.8rem;
                        padding-top: 0.2rem;
                    }
                    .upBox{
                        border: 0.01rem dashed #d3d3d3;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        >input{
                            position: absolute;
                            top: 0;
                            left: 0;
                            opacity: 0;
                            height: 100%;
                            width: 100%;
                            padding-left: 0;
                        }
                    }
                    .rmk{
                        flex: 1;
                        color: #FF3C3C;
                        font-size: 0.22rem;
                    }
                }

            }
        }
        .foot{
            position: fixed;
            bottom: 0;
            flex: 1;
            display: flex;
            height: 0.98rem;
            width: 100%;
            >p:first-child{
                width: 50%;
                font-weight: bold;
                font-size: 0.28rem;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #9A9A9A;
                background-color: #FFFFFF;
                border: none;
            }
            >p:last-child{
                width: 50%;
                font-weight: bold;
                font-size: 0.28rem;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #FFFFFF;
                background-color: #2878BE;
                border: none;

            }
        }
    }

</style>
