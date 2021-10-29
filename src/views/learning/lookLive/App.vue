<template>
    <div class="p-padding">
        <div  class="prism-player" id="J_prismPlayer"></div>
    </div>
</template>

<script>
	import {mapState} from "vuex";
    export default {
        name: '',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App',
                filterText:'',
                treeKey:'',
                defaultProps: {// 可把label，children转换成自己想要的名称，如lable：name
                    children: 'children',
                    label: 'label'
                },
            }
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
		created(){
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
		},
        async mounted () {
            let id = this.until.getQueryString('id')
            let data = await this.api.livePlay(id)
            let info = data.data

            let url = ''
            if(info.liveStatus<3){
                url = info.flvUrl

            }else {
                url = info.storedUrl
            }
            let imgUrl = info.cover2Img

            // 初始化播放器
            var player = new Aliplayer({
                id: "J_prismPlayer", // 容器id
                // source:"http://cloud.video.taobao.com/play/u/2554695624/p/1/e/6/t/1/fv/102/28552077.mp4",
                // source:"http://kbs-dokdo.gscdn.com/dokdo_300/_definst_/dokdo_300.stream/playlist.m3u8",
                source: url,  //视频地址
                cover: imgUrl,  //播放器封面图
                autoplay: false,      // 是否自动播放
                width: "100%",       // 播放器宽度
                height: "100%",      // 播放器高度
                playsinline: true,
                seekable: true,
                skinLayout: [{
                    "name": "bigPlayButton",
                    "align": "cc"
                    //"x": 30,
                    //"y": 80
                }, {
                    "align": "blabs",
                    "x": 0,
                    "y": 0,
                    "name": "controlBar",
                    "children": [
                        {
                            "align": "tl",
                            "x": 15,
                            "y": 26,
                            "name": "playButton"
                        }, {
                            "align": "tl",
                            "x": 10,
                            "y": 24,
                            "name": "timeDisplay"
                        }, {
                            "align": "tr",
                            "x": 20,
                            "y": 25,
                            "name": "fullScreenButton"
                        }, {
                            "align": "tr",
                            "x": 20,
                            "y": 25,
                            "name": "volume"
                        },
                        {
                            "name": "progress",
                            "align": "tlabs",
                            "x": 0,
                            "y": 0
                        }
                    ]
                }]
            })
		},
		methods: {
			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					let id = this.until.getQueryString('id')
					window.location.href = window.location.origin+this.serverAddr+'/learning/video2?id='+id
				}
			},
            filterNode (value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            handleNodeClick (data, node, obj) {
                if (data.id) {
                    this.treeId = data.id;
                    this.treeDataObj = data;
                    this.nodeDataTree = node;
                    console.log(data);
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import url( 'https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css');
    .p-padding{
        height: 100%;
    }
</style>
