
//列表mixins
export const mixins={
    data(){
      return{
        pageNo:1,
        pageSize:15,
        finished:false,//标记是否已经加载完
          currentRole:'',//当前角色
          searchText:'',
          loading:false,
          immediate:false,//
        list:[]
      }
    },
    created(){
    },
    async mounted(){
        this.currentRole=JSON.parse(this.until.loGet('currentRole'))


    },


    computed:{

    },
    watch:{
        searchText(){
            this.pageNo=1
            this.list=[]
            this.getList()

        }
    },
    components:{

    },
    filters:{
        //时间过滤器，去掉时分秒
        dateFilter(val){
            if(val){
                return val.split(' ')[0]
            }else{
                return val
            }

        }
    },
    methods:{
        onLoad(){
            this.getList()

        },
    },

}
