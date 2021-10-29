
//详情mixins
export const mixDtl={
    data(){
      return{
        info:'',//详情
          id:'',//详情id
          currentRole:'',//当前角色
      }
    },
    created(){
    },
    async mounted(){
        this.currentRole=JSON.parse(this.until.loGet('currentRole'))
        this.id=this.until.getQueryString("id")

    },


    computed:{

    },

    components:{

    },
    methods:{

    },

}
