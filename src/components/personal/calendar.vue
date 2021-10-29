<template>
<!--

-->
    <div class="calendar-container">
        <div class="year">
            <div>
                <span  @click="lastYear">«</span>
                <span  @click="lastMonth">‹</span>
                <p>{{nowDate.year}}年{{nowDate.month+1}}月</p>

                <span  @click="nextMonth">›</span>
                <span  @click="nextYear">»</span>
            </div>
        </div>
        <ul class="week">
            <li v-for="(o,index) in 7" :key="o">{{formatWeek(index)}}</li>
        </ul>
        <ul class="date">
<!--            v-for循环数字，假设是星期三，则遍历范围为{0,1,2}，自身不被遍历-->
            <li class="none-week" v-for="o in lastMonthDays" :key="o+50" >
              <p>{{lastMonthStartDay+o-1}}</p>
            </li>


            <li class="has-week" @click="clickEvent(item.day)" v-for="item in dayList" :key="item.id">

              <p :class="[{current: item.day==currentDate.day
                            && nowDate.month==currentDate.month
                            && nowDate.year==currentDate.year,
                             selected:selectedDay==item.day
                             }]">
                  <span class="curDay">{{item.day}}</span>

                <span class="yiqian" v-if="item.sign"><img :src="hasSign"></span>
                <span class="weiqian" v-if=" !item.sign"><img :src="noSign"></span>

                </p>
            </li>
<!--            这部分可以不用显示，直接注释掉，然后lastMonthDays都是空也可以-->
            <li class="none-week" v-for="day in (42-lastMonthDays-nowMonthDays)" :key="day+100" >
              <p>{{day}}</p>
            </li>
        </ul>
        <p class="jiaobiao">
          <img :src="jiaobiao" >
        </p>

    </div>
</template>

<script>
    export default {
        data () {
            return {
                hasSign: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/d079e67942c441099d80d7db4f6fa498_已签到.png',
                noSign:'https://sinovat.oss-cn-shanghai.aliyuncs.com/ce3376286ced4e6d8b8293cb9b6a9bb8_未签到.png',
                jiaobiao:'https://sinovat.oss-cn-shanghai.aliyuncs.com/1ae748133ab84b9b812396d4b052a555_角标.png',
                nowDate: {}, //当前设置时间 默认为当前系统时间
                currentDate:{
                    day: 1,
                    month: 1,//当前月
                    year: 1970,//当前年
                },//当前时间
                selectedDay:1,//选中时间
                dayList:[],//存储nowDate的列表，
            //    ====================以下用于签到======================
                list:[],

            }
        },
        computed: {
            //表项中上个月天数
            lastMonthDays () {
                return this.startWeek()
            },
            //上个月天数
            lastMonthStartDay () {
                return this.calcLastMonthDays(this.nowDate.year,this.nowDate.month)-(this.startWeek()-1)
            },
            nowMonthDays () {
                return this.calcDays(this.nowDate.year,this.nowDate.month)
            }
        },
        created () {


            this.nowDate=this.getDate(new Date())
            //如果设置了值，则使用设置的值
            if(this.setDate) {
                this.nowDate = this.getDate(this.setDate)
            }

            this.getCurrentInfo()
            //  //获取一个月的天数
            let days=this.calcDays(this.nowDate.year,this.nowDate.month)
            this.setDayList(days)
            this.setSelectedDay()
        },
        watch:{
            nowDate:{
                handler(newVal,oldVal){

                    //获取一个月的天数
                    let days=this.calcDays(this.nowDate.year,this.nowDate.month)
                    this.setDayList(days)
                    this.setSelectedDay()
                },
                deep:true,//对象内部的属性监听，也叫深度监听

            }
        },
        methods: {
            updData(){
              this.nowDate=this.getDate(new Date())
              let days=this.calcDays(this.nowDate.year,this.nowDate.month)
              this.setDayList(days)
              this.setSelectedDay()
            },

            //获取今天 的年月日信息
            getCurrentInfo(){
                let tmp=new Date()
                this.currentDate.year=tmp.getFullYear()
                this.currentDate.month=tmp.getMonth()
                this.currentDate.day=tmp.getDate()


            },

            getDate (date) {
                // console.log("getDate的值："+date.getFullYear())
                return {
                    year: date.getFullYear(),//从 Date 对象以4位数字返回年份。
                    month: date.getMonth(),//从 Date 对象返回月份 (0 ~ 11)。
                    day: date.getDay(),//从 Date 对象返回一周中的某一天 (0 ~ 6)。
                    date: date.getDate()//从 Date 对象返回一个月中的某一天 (1 ~ 31)。
                }
            },
            formatWeek (day) {
                switch (day) {
                    case 0:
                        return '日';
                    case 1:
                        return '一'
                    case 2:
                        return '二';
                    case 3:
                        return '三'
                    case 4:
                        return '四'
                    case 5:
                        return '五'
                    case 6:
                        return '六'
                }
            },
            //判断闰年
            isLeapYear (year) {
                return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
            },
            //根据日子计算星期
            calcWeekend (year,month,day) {
                return new Date(year,month,day).getDay();
            },
            //计算某年某月的天数
            calcDays (year,month) {
                const monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                if(this.isLeapYear(year)&&month===1)
                    return 29
                else
                    return monthDay[month]
            },
            //设置当前页面显示的当前月份日期数列表(并非就是今天月份）
            async setDayList(days){

                //=================================获取列表(组件外)===================

                let qry=this.query.new();
                this.query.toP(qry,1,31)
                let m=this.nowDate.month+1
                //补0
                if(m<10){
                    m="0"+m;
                }
                let str=this.nowDate.year+"-"+m
                this.query.toW(qry,"crtTm",str,"LK")
                this.query.toO(qry,'crtTm',"asc")
                let res= await this.api.signList(this.query.toEncode(qry))
                let tmpList=res.list
                window.console.log("签到接口返回列表")
                window.console.log(tmpList)
                window.console.log("日历组件列表")
                window.console.log(this.dayList)
                //为tmpList赋值，如果到一个月的天数，补齐一个月的天数，首先计算该月天数
                let count=this.calcDays(this.nowDate.year,this.nowDate.month)
                window.console.log("当月天数。。"+count)




                //=================================获取列表(组件外)===================
                this.dayList=[]
                for(let i=1;i<=days;i++){
                    let siSign=false

                    for(let j=0;j<tmpList.length;j++){
                        let d=tmpList[j].crtTm.substring(8,10)
                        if(i==d){
                            siSign=true
                            break
                        }
                    }
                    this.dayList.push({
                        id:i,
                        day:i,
                        sign:siSign,

                        /*
                        在这里增加属性，
                         */
                    })
                }


            },

            //计算上个月天数
            calcLastMonthDays (year,month) {
                if(month===0) {
                    return this.calcDays(year-1,11)
                }else {
                    return this.calcDays(year,month-1)
                }
            },
            //上月
            lastMonth () {
                if(this.nowDate.month===0) {
                    this.nowDate.month = 11
                    this.nowDate.year --
                }else {
                    this.nowDate.month --
                }

            },
            //下月
            nextMonth () {
                if(this.nowDate.month===11) {
                    this.nowDate.month = 0
                    this.nowDate.year ++
                }else {
                    this.nowDate.month ++
                }

            },
            //去年
            lastYear () {
                this.nowDate.year --

            },
            //下一年
            nextYear () {
                this.nowDate.year ++

            },
            //计算当月开始星期
            startWeek () {
                return this.calcWeekend(this.nowDate.year,this.nowDate.month,1)
            },
            //
            clickEvent (day) {
                if(this.selectedDay!=day){
                    this.selectedDay=day
                }
                // window.console.log(day)
                let monthNo = this.nowDate.month;
                let month = monthNo<=11 ? (monthNo+1) : 0
                let date = {
                    year:this.nowDate.year,
                    month:month,
                    week: new Date(this.nowDate.year,this.nowDate.month,day).getDay(),
                    day:Number(day)
                }
                console.log(date)
                this.$emit('click-event',date);
            },
            //这个方法在这个组件中不用
            setSelectedDay(){
                console.log("...........................")
                console.log(this.nowDate)
                if(this.nowDate.year==this.currentDate.year
                    && this.nowDate.month==this.currentDate.month
                    && this.nowDate.date==this.currentDate.day){
                    this.selectedDay=this.currentDate.day
                }else{
                    this.selectedDay=1
                }
            },


        //    组件功能外


            //签到分页列表
            async getList(){

            },
        }
    }
</script>


<style scoped lang="less">
    .calendar-container {

      -moz-user-select: none; /*火狐*/
      -webkit-user-select: none; /*webkit浏览器*/
      -ms-user-select: none; /*IE10*/
      -khtml-user-select: none; /*早期浏览器*/
        user-select: none;
        width: 100%;
        height: 540px;

        background: white;
        border-radius: 20px;
        position: relative;
        box-shadow:0px 4px 13px 0px rgba(13,4,8,0.13);
    }
    .year {
        text-align: center;
        margin-bottom: 10px;
        background: #2778BE;
        color: white;
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
        display: flex;
        align-items: center;
        div{
            margin: 0 auto;
            width: 100%;
            height: 100%;
            overflow: hidden;

            span {
                font-size:25px;
                display:  inline-block;
                width: 10%;
                background: #2778BE;
                &:hover{
                  cursor: pointer;
                }
            }
            /*2020年7月*/
            p {
                background: #2778BE;
                font-size: 20px;
                line-height: 2;
                width: 50%;
                display: inline-block;
            }


        }
    }
    .date{
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;
        li {
          font-size: 18px;
          width: 14%;
          height: 40px;
          text-align: center;
          line-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          p{
            display: flex;
            width: 40px;
            height: 40px;
            align-items: center;
            justify-content: center;
            position: relative;
            &:hover{
              cursor: pointer;
            }
            /*未签文字*/
            .weiqian{
              position: absolute;
              width: 100%;
              height: 100%;
              img{
                position: absolute;
                bottom: 0;
                width: 20px;
                left: 50%;
                transform: translateX(-50%);
              }

            }
          /*  已经签到*/
            .yiqian{
              position: absolute;
              width: 100%;
              height: 100%;
              img{
                position: absolute;
                bottom: 0;
                width: 20px;
                left: 50%;
                transform: translateX(-50%);
              }
            }
          }
        }
    }
    .week {
        height: 65px;
        border-bottom: .5px solid #ddd;
        margin-bottom: 5px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: nowrap;
         align-items: center;
        list-style: none;
        color: #666666;
      li {
        font-size: 18px;
        width: 14%;
        height: 40px;
        text-align: center;
        line-height: 50px;
      }
    }

    /*上个月或者下个月的日期*/
    .none-week {
        color: #C7C7C7;
    }
    .has-week{
        color: #666666;
        /*font-weight: bold;*/
    }
    /*当前日期*/
    .current{
        /*background: #2778BE !important;*/
        /*color: white;*/

    }
    /*没选中，但是在包含今天的月份的页面中，则字体变蓝*/
    .current2{
        color:  #2778BE !important;
    }
    /*选中日期*/
    .selected{
        /*background: #2778BE;*/
        /*color: white;*/
    }


/*  右下角飘起角标*/
  .jiaobiao{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 69px;
    height: 91px;
    background: #F4F4F4;
    border-bottom-right-radius: 20px;
    img{
      width: 69px;
      height: 91px;
      border-bottom-right-radius: 20px;
    }
  }

</style>
