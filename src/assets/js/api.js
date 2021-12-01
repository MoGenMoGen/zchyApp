import Vue from 'vue'
import axios from 'axios'
import qs from 'qs';
import query from "./query";
import { Toast } from 'vant';
Vue.prototype.axios = axios    //全局注册，使用方法为:this.$axios
import store from '../../store/store.js'
Vue.prototype.store = store
import { Dialog } from 'vant';
import Bridge from './jsBridge.js'

// 全局注册
Vue.use(Dialog);

axios.defaults.transformRequest.unshift((params) => {
	if (params) {
		Object.keys(params).forEach((key) => {
			if (params[key] instanceof Date) {
				let month = new Date(params[key]).getMonth() + 1
				params[key] = new Date(params[key]).getFullYear() + '-' + month + '-' + new Date(params[key]).getDate()
			}
		})
	}
	return params
})
const hostUrl = 'https://www.ship88.cn'
// const hostUrl = 'http://lwkacgr.nat.ipyingshe.com'
// const hostUrl = 'http://u2768442w0.qicp.vip'

//ajax请求
function get(url, data, header, cache = true) {
	let headers = null
	if (!header && window.localStorage.getItem("token")) {
		headers = { "sinovat-token": window.localStorage.getItem("token") }
	}
	if (header) {
		headers = header
	}

	if (url.indexOf("?") === -1) {
		url = url + "?_=" + new Date().getTime()
	} else {
		url = url + "&_=" + new Date().getTime()
	}

	let promise = new Promise((resolve, reject) => {
		axios.get(url, { params: data, headers }).then(res => {
			Toast.clear();
			if (res.data.code == 0) {
				resolve(res.data)
			} else if (res.data.code == 401) {
				Dialog.confirm({
					title: '提示',
					message: '您未登录，立即登录?',
				})
					.then(() => {
						window.location.href = '../home/login.html'
					})
					.catch(() => {

					});
				return
				setTimeout(() => {
					// window.location.href = '../home/login.html?login=true';
				}, 1500)
			} else {
				reject(res)
				if (res.data.code == 402 && res.data.msg.indexOf("请重新登陆") > -1 && window.location.href.indexOf('home/login') <= -1) {
					console.log('被强制退出')
					setTimeout(() => {
						window.location.href = '../home/login.html?login=true';
					}, 1500)
				}
			}
		}).catch(err => {
			Toast.clear();
			// Toast(JSON.stringify(err))
		})
	});
	return promise;
}

function post(url, data) {
	let header = {}
	if (window.localStorage.getItem('token')) {
		header = {
			"sinovat-token": window.localStorage.getItem("token")
		}
	}

	let promise = new Promise((resolve, reject) => {
		axios.post(url, data, { headers: header })
			.then(function (res) {
				Toast.clear();
				if (res.data.code === 0) {
					resolve(res.data)
				} else if (res.data.code === 401) {
					Dialog.confirm({
						title: '提示',
						message: '您未登录，立即登录?',
					})
						.then(() => {
							window.location.href = '../home/login.html'
						})
						.catch(() => {

						});
				} else {
					Toast(res.data.msg || res.data.message);
				}
			})
			.catch(function (error) {
				Toast.clear();
				// store.commit('changeLoading',false)
				// MessageBox({
				//     message: JSON.stringify(error),
				//     type: 'warning'
				// });
			});
	});
	return promise;
}

class api {
	//首页为你推荐
	forYouGoods() {
		return new Promise((resolve, reject) => {
			get("/ds/open/forYou").then(res => {
				resolve(res.data.list)
			});
		});
	}
	//获取省市区
	getAddr(data) {
		return new Promise((resolve, reject) => {
			get("/sys/region/api/list?query=" + data).then(res => {
				resolve(res.data.list)
			});
		});
	}
	//登录
	login(data) {
		return new Promise((resolve, reject) => {
			post("/general/access/memLogin", qs.stringify(data)).then(res => {
				window.localStorage.setItem("token", res.data.token)
				console.log('login')
				console.log(res.data.token)

				resolve(res.data)
				this.roleList()
				this.cartList()
			});
		});
	}
	//注册获取验证码
	getCode(data) {
		return new Promise((resolve, reject) => {
			get("/general/sms/sendVcodeRegister?mob=" + data).then(res => {
				resolve(res)
			});
		});
	}
	//修改密码获取验证码
	getCode2(data) {
		return new Promise((resolve, reject) => {
			get("/general/sms/sendVcodeLogin?mob=" + data).then(res => {
				resolve(res)
			});
		});
	}
	//注册
	register(data) {
		return new Promise((resolve, reject) => {
			post("/ship/member/api/regist", data).then(res => {
				resolve(res)
			});
		});
	}

	//分期详情
	stageInfo(id) {
		return new Promise(resolve => {
			get("/ds/order/stageInfo?orderId=" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//分期付款确认
	stageConfirm(data) {
		return new Promise(resolve => {
			get("/ds/orderStage/updVoucher", data).then(res => {
				resolve(res)
			})
		})
	}
	//身份角色列表
	roleList() {
		return new Promise(resolve => {
			get("/ship/memberOrgEnterLink/apis/listIdentities", '', { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				console.log('diaoyong', window.localStorage.getItem('currentRole'))
				if (res.data.list.length > 0 && !window.localStorage.getItem('currentRole')) {
					// store.commit('currentRole',res.data.list[0])

					window.localStorage.setItem('currentRole', JSON.stringify(res.data.list[0]))
					Bridge.callHandler('h5_set_role', JSON.stringify(res.data.list[0]), res => {

					})

				}
				resolve(res.data.list)
			})
		})
	}
	//我要入驻身份列表
	getRoleList() {
		return new Promise((resolve, reject) => {
			get("/sys/cat/api/listItmTreeNode?cd=identity").then(res => {
				let list = res.data.list.filter(item => {
					return !item.arg5 || item.arg5 != 1
				})
				resolve(list)
			});
		});
	}
	//我要入驻新增
	settleInAdd(data) {
		return new Promise(resolve => {
			post('/ship/orgEnter/apis/add', data).then(res => {
				resolve(res)
			})
		})
	}
	//入驻身份更新
	settleInUpd(data) {
		return new Promise(resolve => {
			post('/ship/orgEnter/apis/upd', data).then(res => {
				resolve(res)
			})
		})
	}
	//广告
	getAdert(cd, num) {
		let param = {
			posCd: cd,
			adNums: num ? num : ''
		}
		return new Promise((resolve, reject) => {
			get("/sys/advertInfo/api/listAdsByPos2", param).then(res => {
				resolve(res.data.list)
			});
		});
	}
	//上传图片
	uploadImg(e) {
		let blob = e.target.files[0];
		console.log(blob)
		let maxSize = 1024 * 1024 * 1
		if (blob.size > maxSize) {
			Toast.fail('最大不能超过1M！');
			// store.commit('changeLoading',false)
			return
		}
		let param = new FormData();
		param.append('file', blob);
		return new Promise(resolve => {
			post('/general/oss/upload', param).then(res => {
				resolve(res.data)
			})
		})
	}

	//上传图片
	uploadImg2(e) {
		let param = new FormData();
		param.append('file', e);
		return new Promise(resolve => {
			post('/general/oss/upload', param).then(res => {
				resolve(res.data)
			})
		})
	}
	uploadImg3(e) {
		return new Promise(resolve => {
			post('/general/oss/encUpload', e).then(res => {

				resolve(res.data)
			})
		})
	}
	uploadImg4(e) {
		return new Promise(resolve => {
			post('/general/oss/upload', e).then(res => {
	
				resolve(res.data)
			})
		})
	}
	//选型记录复制
	xuanxingCopy(id) {
		return new Promise(resolve => {
			get('/ship/selectionBill/apis/copyNew?id=' + id).then(res => {
				resolve(res)
			})
		})
	}
	//选型记录详情
	xuanxingDetail(id) {
		return new Promise(resolve => {
			get("/ship/selectionBill/apis/info/" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//行业信息
	tradeInfo(data) {
		return new Promise(resolve => {
			get("/ship/indusInfo/api/page?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//行业信息详情
	detailInfo(id) {
		return new Promise(resolve => {
			get("/ship/indusInfo/api/info/" + id).then(res => {
				resolve(res)
			})
		})
	}
	//船舶/设备分类列表   船舶管理
	getClassify(data) {
		return new Promise((resolve, reject) => {
			get("/ds/cat/api/list?query=" + data).then(res => {
				resolve(res.data.list)
			});
		});
	}

	//船舶/设备分类列表 树形
	getClassify2() {
		return new Promise(resolve => {
			get('/ds/cat/listItemTreeNode?tid=4942035725390848').then(res => {
				resolve(res.data.list)
			})
		})
	}

	//船舶/设备分类列表 树形
	getShipClassify(pid) {
		let qry = query.new()
		query.toW(qry, 'pid', pid, 'EQ')
		return new Promise((resolve, reject) => {
			get("/ds/cat/api/list?query=" + query.toEncode(qry)).then(res => {
				resolve(res.data.list)
			});
		});
	}






	//重点推荐商品列表
	shopRecomdPro() {
		return new Promise((resolve, reject) => {
			get("/ds/open/recGoods").then(res => {
				resolve(res.data.list)
			});
		});
	}
	//加入购物车
	addCart(data) {
		return new Promise((resolve, reject) => {
			post("/ds/cart/addSelf", data, { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				resolve(res)
				this.cartList()
			});
		});
	}
	//购物车列表
	cartList() {
		return new Promise(resolve => {
			get("/ds/cart/myList", '', { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				resolve(res.data.list)
				let num = 0
				res.data.list.forEach(item => {
					item.items.forEach(v => {
						num += v.qty
					})
				})
				store.commit('cartNum', num)
			})
		})
	}
	//购物车查询运费
	cartFare(data) {
		return new Promise(resolve => {
			post("/ds/order/fareToCart", data, { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				resolve(res)
			})
		})
	}
	//立即下单计算运费
	byNewFare(data) {
		return new Promise(resolve => {
			post('/ds/order/buyNewFare', data, { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				resolve(res)
			})
		})
	}
	//购物车提交订单
	orderCrearCart(data) {
		return new Promise(resolve => {
			post("/ds/order/submitOrderToCart", data, { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				resolve(res.data.list)
			})
		})
	}
	//立即下单
	orderCreat(data) {
		return new Promise(resolve => {
			post('/ds/order/buyNew', data, { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				resolve(res.data)
			})
		})
	}
	//快速下单——立即下单
	quickOrderCreat(data) {
		return new Promise(resolve => {
			post('/ds/order/quickBuyNew', data, { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				resolve(res.data)
			})
		})
	}
	//个人信息查看
	personInfo() {
		return new Promise(resolve => {
			get("/ship/member/apis/detail", '', { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				// store.commit('userInfo',res.data)
				resolve(res.data)
			})
		})
	}
	//收藏总数
	favoriteTotal() {
		return new Promise(resolve => {
			get("/ship/favorite/apis/total").then(res => {
				resolve(res.data)
			})
		})
	}
	//在线交易——平台成交总量
	volume() {
		return new Promise((resolve, reject) => {
			get("/ds/open/getVolume").then(res => {
				resolve(res.data)
			});
		});
	}

	//船舶列表
	shipTradeList(data) {
		return new Promise(resolve => {
			get('/ds/open/shipGoodsPage?query=' + data).then(res => {
				resolve(res)
			})
		})
	}
	//商品分类（全部，包含船舶和产品）
	getAllClassify() {
		return new Promise(resolve => {
			get('/ds/open/catTree').then(res => {
				resolve(res.data.list)
			})
		})
	}
	//商品分类（排除船舶）
	goodClassify() {
		return new Promise(resolve => {
			get('/ds/open/goodsCatTree').then(res => {
				resolve(res.data.list)
			})
		})
	}
	//产品交易列表
	goodList(data) {
		return new Promise(resolve => {
			get('/ds/open/goodsPage?query=' + data).then(res => {
				resolve(res)
			})
		})
	}
	//我的船舶列表
	getMyShipList(data, param) {
		return new Promise(resolve => {
			get('/ship/docs/apis/page?query=' + data, param).then(res => {
				resolve(res)
			})
		})
	}
	//  我的预约列表
	subscribeList(data) {
		return new Promise(resolve => {
			get('/ship/designAppointment/apis/page?query=' + data).then(res => {
				resolve(res)
			})
		})
	}
	//系统消息列表
	msgList(data) {
		return new Promise(resolve => {
			get("/ship/msgSend/apis/page?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//个人中心——收付款记录分页列表   非商场
	paymentList(query, data) {
		return new Promise((resolve, reject) => {
			get("/ds/moneyPlan/apis/page?query=" + query, data).then(res => {
				resolve(res)
			});
		});
	}

	//个人中心-提交确认/确认收款
	confirmRev(data) {
		return new Promise(resolve => {
			post("/ship/payment/apis/audit", data).then(res => {
				resolve(res)
			})
		})
	}

	//收货地址列表
	addrList(data) {
		return new Promise(resolve => {
			get("/sys/addr/pageSelf?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//签到接口
	signIn() {
		return new Promise(resolve => {
			post("/ship/signIn/apis/add").then(res => {
				resolve(res.data)
			})
		})
	}
	//签到分页列表
	signList(data) {
		return new Promise(resolve => {
			get("/ship/signIn/apis/page?query=" + data).then(res => {
				resolve(res.data)
			})
		})
	}
	//系统消息详情
	msgDetail(id) {
		return new Promise(resolve => {
			get("/ship/msgSend/apis/info/" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//删除地址
	delAddr(data) {
		return new Promise(resolve => {
			get("/sys/addr/delSelf", data).then(res => {
				resolve(res)
			})
		})
	}

	/*
  获取省级数据sys/region/apis/listRegion
	*/
	getAddrP() {
		let qry = query.new()
		query.toW(qry, 'pid', 100000, 'EQ')
		query.toW(qry, 'status', 0, 'EQ')
		return new Promise((resolve) => {
			get('/sys/region/api/list?query=' + query.toEncode(qry)).then(res => {
				resolve(res);
			});
		});

	}
	/*
获得市和县级数据，传入省级id或者市级id
	 */
	getAddr2(provinceId) {
		//pid是上级id
		let qry = query.new()
		query.toW(qry, 'pid', provinceId, 'EQ')
		query.toW(qry, 'status', 0, 'EQ')
		return new Promise((resolve) => {
			get('/sys/region/api/list?query=' + query.toEncode(qry)).then(res => {
				resolve(res);
			});
		});
	}
	//新增收货地址
	addrAdd(data) {
		return new Promise(resolve => {
			post("/sys/addr/addSelf", data).then(res => {
				resolve(res)
			})
		})
	}
	//修改收货地址
	addrUpd(data) {
		return new Promise(resolve => {
			post("/sys/addr/updSelf", data).then(res => {
				resolve(res)
			})
		})
	}
	//入驻详情（需要登录）
	getRoleDetail(id) {
		return new Promise((resolve, reject) => {
			get("/ship/orgEnter/apis/detail/" + id).then(res => {
				resolve(res.data)
			});
		});
	}
	//修改密码
	changePWD(data) {
		return new Promise((resolve, reject) => {
			post("/sys/user/api/repassword", data).then(res => {
				resolve(res.data)
			});
		});
	}
	//登录后修改密码
	changePWD2(data) {
		return new Promise(resolve => {
			post('/sys/user/apis/repassword', data).then(res => {
				resolve(res)
			})
		})
	}
	//船舶资料——船舶基本资料
	shipInfoBasic(id) {
		return new Promise((resolve, reject) => {
			get("/ship/docs/apis/info/" + id).then(res => {
				resolve(res.data)
			});
		});
	}
	//船舶资料——机构详情
	orgInfoBasic(data) {
		return new Promise((resolve, reject) => {
			get("/ship/orgEnter/apis/basicInfo", data).then(res => {
				resolve(res.data)
			});
		});
	}
	//证书通用接口(无需登录)
	certNotLoginList(data) {
		return new Promise(resolve => {
			get("/ship/docsCertificate/api/page?query=" + data).then(res => {
				resolve(res.data.list)
			})
		})
	}

	//品质保障 不分页列表
	qualityList(query) {
		return new Promise((resolve, reject) => {
			get("/ship/docsSurvey/apis/list?query=" + query).then(res => {
				resolve(res.data.list)
			});
		});
	}

	//个人中心-检验检测列表
	jianyanList(data) {
		return new Promise(resolve => {
			get("/ship/docsCertificate/apis/page?query=" + data).then(res => {
				resolve(res.data.list)
			})
		})
	}

	//船舶资料——检测证书
	certificate(query) {
		return new Promise((resolve, reject) => {
			get("/ship/docsCertificate/apis/page?query=" + query).then(res => {
				resolve(res)
			});
		});
	}
	//建造过程 不分页列表
	buildStep(query) {
		return new Promise((resolve, reject) => {
			get("/ship/docsBuild/apis/list?query=" + query).then(res => {
				resolve(res.data.list)
			});
		});
	}

	//个人信息修改
	personInfoChange(data) {
		return new Promise(resolve => {
			post("/ship/member/apis/upd", data).then(res => {
				resolve(res)
			})
		})
	}
	//留言提交
	msgAdd(data) {
		return new Promise(resolve => {
			post("/ship/msgBoard/apis/add", data).then(res => {
				resolve(res)
			})
		})
	}
	//选型记录列表
	xuanxingList(data) {
		return new Promise(resolve => {
			get("/ship/selectionBill/apis/page?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//DIY报价记录列表
	diyList(data) {
		return new Promise(resolve => {
			get("/ship/diyQuoteRecords/apis/page?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//行业信息栏目列表
	infoList(data) {
		return new Promise(resolve => {
			get("/ship/indusInfoCat/api/list?query=" + data).then(res => {
				resolve(res.data.list)
			})
		})
	}


	//入驻机构分页（所有的）
	getRoleAll(data) {
		return new Promise((resolve, reject) => {
			get("/ship/orgEnter/api/page?query=" + data).then(res => {
				resolve(res.data.list)
			});
		});
	}
	//平台规则 分类
	ruleCatList() {
		return new Promise(resolve => {
			get('/ship/ruleCat/api/list').then(res => {
				resolve(res)
			})
		})
	}
	//平台规则 列表
	ruleList(data) {
		return new Promise(resolve => {
			get('/ship/ruleCont/api/list?query=' + data).then(res => {
				resolve(res)
			})
		})
	}
	//平台规则 详情
	ruleDetail(id) {
		return new Promise(resolve => {
			get('/ship/ruleCont/api/info/' + id).then(res => {
				resolve(res)
			})
		})
	}
	logout() {
		return new Promise((resolve, reject) => {
			get("/general/access/logout").then(res => {
				resolve(res)
			});
		});
	}
	//我的合同列表
	contractList(query, data) {
		return new Promise(resolve => {
			get("/ship/contract/apis/page?query=" + query, data).then(res => {
				resolve(res)
			})
		})
	}
	//我的合同详情
	contractDetail(id) {
		return new Promise(resolve => {
			get("/ship/contract/apis/info/" + id,).then(res => {
				resolve(res)
			})
		})
	}
	//数据字典-查询下一级列表
	dataDictionary(cd) {
		return new Promise(resolve => {
			get("/sys/cat/api/listByPcd?cd=" + cd).then(res => {
				resolve(res.data.list)
			})
		})
	}
	//diy报价
	diyOffer(data) {
		return new Promise(resolve => {
			post('/ship/diyQuoteRecords/apis/quote', data).then(res => {
				resolve(res.data)
			})
		})
	}
	//预约设计提交
	designAdd(data) {
		return new Promise(resolve => {
			post("/ship/designAppointment/apis/add", data).then(res => {
				resolve(res)
				Toast.success('预约成功');
				setTimeout(() => {
					window.history.go(-1);
				}, 1500)
			})
		})
	}
	//维保记录 分页列表
	maintenR(query, data) {
		return new Promise((resolve, reject) => {
			get("/ship/taskNote/api/page?query=" + query, data).then(res => {
				resolve(res)
			});
		});
	}
	//对维保记录进行评价
	toRepair(data) {
		return new Promise((resolve, reject) => {
			post("/ship/taskQues/apis/add", data).then(res => {
				resolve(res)
			});
		});
	}
	//在线直播分页列表
	studyLive(data) {
		return new Promise(resolve => {
			get("/ship/studyLive/api/page?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//讲师库-分页列表
	getTeacherPage(data) {
		return new Promise(resolve => {
			get("/ship/studyTeacher/api/page?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//船舶管理 船舶列表不分页
	shipList2(data) {
		return new Promise(resolve => {
			get("/ship/solutions/api/list?query=" + data).then(res => {
				resolve(res.data.list)
			})
		})
	}

	//船舶管理 船舶列表分页
	shipList(data) {
		return new Promise(resolve => {
			get("/ship/solutions/api/page?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//删除船舶设计方案
	delDesignFile(id) {
		return new Promise(resolve => {
			get("/ship/solutions/apis/del?ids=" + id).then(res => {
				resolve(res)
			})
		})
	}
	//船舶管理 船舶详情
	shipDetail(id) {
		return new Promise(resolve => {
			get("/ship/solutions/api/info/" + id, '', { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				resolve(res.data)
			})
		})
	}
	//船舶详细描述
	shipInfo(id) {
		return new Promise(resolve => {
			get("/ds/open/shipInfo?id=" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//船舶检测证书
	shipDetailCeList(id) {
		return new Promise((resolve, reject) => {
			get("/ds/open/shipCert?id=" + id).then(res => {
				resolve(res.data.list)
			});
		});
	}
	//船舶品质保障
	shipDetailSurvey(id) {
		return new Promise((resolve, reject) => {
			get("/ds/open/shipSurvey?id=" + id).then(res => {
				resolve(res.data.list)
			});
		});
	}
	//本店精选
	proDetailChoice(id) {
		return new Promise((resolve, reject) => {
			get("/ds/open/shopTopGoods?id=" + id).then(res => {
				resolve(res.data.list)
			});
		});
	}
	//检测证书
	proDetailCeList(id) {
		return new Promise((resolve, reject) => {
			get("/ds/open/goodsCert?id=" + id).then(res => {
				resolve(res.data.list)
			});
		});
	}
	//船舶详情的设备分类列表
	shipDetailEqupClassify(id) {
		return new Promise((resolve, reject) => {
			get("/ds/open/shipDeviceCat?id=" + id).then(res => {
				resolve(res.data)
			});
		});
	}
	//船舶详情的设备列表
	shipDetailEqupList(param) {
		return new Promise((resolve, reject) => {
			get("/ds/open/shipDevice", param).then(res => {
				resolve(res.data.list)
			});
		});
	}
	//船舶设计方案详情
	designFileDetail(id) {
		return new Promise(resolve => {
			get("/ship/solutions/api/info/" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//船舶设计方案  设备列表
	designGoodsList(query) {
		return new Promise(resolve => {
			get("/ship/soluDevice/api/list?query=" + query).then(res => {
				resolve(res.data.list)
			})
		})
	}
	//入驻详情（不登录）
	getRoleDetail2(id) {
		return new Promise((resolve, reject) => {
			get("/ship/orgEnter/api/info/" + id).then(res => {
				resolve(res.data)
			});
		});
	}
	// 我的预约详情
	subscribeDetail(id) {
		return new Promise(resolve => {
			get('/ship/designAppointment/apis/info/' + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//个人中心——全部船舶
	allShip(query, data) {
		return new Promise((resolve, reject) => {
			get("/ship/docs/apis/page?query=" + query, data).then(res => {
				resolve(res)
			});
		});
	}
	//船舶档案  设备列表
	fileDeviceList(query, data) {
		return new Promise(resolve => {
			get("/ship/docsDevice/apis/pageShopDeviceNew?query=" + query, data).then(res => {
				resolve(res.data.list)
			})
		})
	}
	//新增维保服务
	taskNoteAdd(data) {
		return new Promise(resolve => {
			post('/ship/taskNote/api/add', data).then(res => {
				resolve(res)
			})
		})
	}

	//子账户信息-分页列表
	getAccountList(data) {
		return new Promise(resolve => {
			get("/ship/member/apis/findSubAccount?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//新增子账户
	addSubAccount(data) {
		return new Promise(resolve => {
			post('/ship/member/apis/addSubAccount', data).then(res => {
				resolve(res.data)
			})
		})
	}
	//修改子账户
	updSubAccount(data) {
		return new Promise(resolve => {
			post('/ship/member/apis/updSubAccount', data).then(res => {
				resolve(res.data)
			})
		})
	}
	//退货
	orderReturn(data) {
		return new Promise(resolve => {
			post("/ds/orderRtn/rtn", data).then(res => {
				resolve(res)
			})
		})
	}

	//删除子账户
	delSubAccount(ids) {
		return new Promise(resolve => {
			get('/ship/member/apis/delSubAccount?ids=' + ids).then(res => {
				resolve(res.data)
			})
		})
	}
	//获取权限列表和修改时权限回显
	getRsco(data) {
		return new Promise(resolve => {
			get("/sys/rsco/apis/getRsco", data).then(res => {
				resolve(res.data.list)
			})
		})
	}
	//获取客服电话
	getKefuPhone() {
		return new Promise(resolve => {
			get("/ship/serviceTel/api/list").then(res => {
				resolve(res.data.list)
			})
		})
	}

	//船舶建设订单详情
	shipOrderDetail(id) {
		return new Promise(resolve => {
			get('/ship/order/apis/info/' + id).then(res => {
				resolve(res.data)
			})
		})
	}


	//子账户 身份回显
	getListIdentities(data) {
		return new Promise(resolve => {
			get("/ship/memberOrgEnterLink/apis/subAccount/listIdentities", data).then(res => {
				resolve(res.data.list)
			})
		})
	}
	//DIY报价记录详情
	diyDetail(id) {
		return new Promise(resolve => {
			get("/ship/diyQuoteRecords/apis/info/" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//派单负责人列表
	toRepairMan(id) {
		return new Promise((resolve, reject) => {
			get("/ship/taskNote/api/list/findMemAccount/infos?handleOrgId=" + id).then(res => {
				resolve(res.data.list)
			});
		});
	}
	//维保派单
	toDispatch(data) {
		return new Promise(resolve => {
			get('/ship/taskNote/api/distribute', data).then(res => {
				resolve(res)
			})
		})
	}
	//维保工单详情
	taskNoteDetail(id) {
		return new Promise(resolve => {
			get('/ship/taskNote/api/infoAll/' + id).then(res => {
				resolve(res.data)
			})
		})
	}

	//客户档案详情
	custInfoDetail(id) {
		return new Promise(resolve => {
			get('/ship/custInfo/apis/info/' + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//维保工单完成
	taskNoteFinish(data) {
		return new Promise(resolve => {
			post('/ship/taskNote/api/finishMaintain', data).then(res => {
				resolve(res)
			})
		})
	}
	//我的跟进记录
	myCustFollow(data) {
		return new Promise(resolve => {
			get('/ship/custFollow/apis/page?query=' + data).then(res => {
				resolve(res)
			})
		})
	}

	//客户档案列表不分页
	custInfoList2(data) {
		return new Promise(resolve => {
			get('/ship/custInfo/apis/list?query=' + data).then(res => {
				resolve(res.data.list)
			})
		})
	}
	//商机列表不分页
	custProjectList(data) {
		return new Promise(resolve => {
			get('/ship/custProject/apis/list?query=' + data).then(res => {
				resolve(res.data.list)
			})
		})
	}
	//新增跟进记录
	custFollwAdd(data) {
		return new Promise(resolve => {
			post('/ship/custFollow/apis/add', data).then(res => {
				resolve(res)
			})
		})
	}

	//客户档案列表分页
	custInfoList(data) {
		return new Promise(resolve => {
			get('/ship/custInfo/apis/page?query=' + data).then(res => {
				resolve(res)
			})
		})
	}

	//  新增客户
	addCustomer(data) {
		return new Promise(resolve => {
			post('/ship/custInfo/apis/add', data).then(res => {
				resolve(res.data)
			})
		})
	}
	//商机列表 分页
	custProjectPage(data) {
		return new Promise(resolve => {
			get('/ship/custProject/apis/page?query=' + data).then(res => {
				resolve(res)
			})
		})
	}
	//商机修改
	custProjectUpd(data) {
		return new Promise(resolve => {
			post('/ship/custProject/apis/upd', data).then(res => {
				resolve(res)
			})
		})
	}
	//新增商机
	custProjectAdd(data) {
		return new Promise(resolve => {
			post('/ship/custProject/apis/add', data).then(res => {
				resolve(res)
			})
		})
	}
	//规范/设计列表分页
	standardList(data) {
		return new Promise(resolve => {
			get('/ship/norm/api/page?query=' + data).then(res => {
				resolve(res)
			})
		})
	}
	//规范/设计详情
	standardDetail(id) {
		return new Promise(resolve => {
			get('/ship/norm/api/info/' + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//投标管理分页列表
	bidManage(query, data) {
		return new Promise(resolve => {
			get("/ship/bid/apis/page?query=" + query, data).then(res => {
				resolve(res)
			})
		})
	}
	//个人中心查看中标详情
	bidOfferDetail(data) {
		return new Promise(resolve => {
			get("/ship/bidOffer/apis/detail", data).then(res => {
				resolve(res)
			})
		})
	}
	//投标报名
	bidApply(data) {
		return new Promise(resolve => {
			post("/ship/bidApply/apis/apply", data).then(res => {
				resolve(res)
			})
		})
	}
	//个人中心-品质保障新增
	quaGuarAdd(data) {
		return new Promise(resolve => {
			post("/ship/docsSurvey/apis/add", data).then(res => {
				resolve(res)
			})
		})
	}
	//在线交易-船舶详情
	tradeShipDetail(id) {
		return new Promise(resolve => {
			get("/ds/open/goodsInfo?id=" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//关注店铺
	followShop(data) {
		return new Promise(resolve => {
			post('/ship/favorite/apis/add', data).then(res => {
				resolve(res)
			})
		})
	}
	//取消关注店铺
	delFollow(id) {
		return new Promise(resolve => {
			get("/ship/favorite/apis/delByTargetId?id=" + id).then(res => {
				resolve(res)
			})
		})
	}
	//看了又看
	proDetailLook(id) {
		return new Promise((resolve, reject) => {
			get("/ds/open/lookAndSee?id=" + id).then(res => {
				resolve(res.data.list)
			});
		});
	}
	//店铺简介
	shopIntro(id) {
		return new Promise(resolve => {
			get("/ds/open/shopInfo?id=" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//店铺商品分类列表
	shopCatList(id) {
		return new Promise(resolve => {
			get("/ds/open/catInShop?id=" + id).then(res => {
				resolve(res.data.list)
			})
		})
	}
	//店铺商品分页列表
	shopGoodList(data) {
		return new Promise(resolve => {
			get("/ds/open/shopGoodsPage?query=" + data).then(res => {
				resolve(res)
			})
		})
	}

	//个人中心-检验检测新增
	inspectAdd(data) {
		return new Promise(resolve => {
			post("/ship/docsCertificate/apis/add", data).then(res => {
				resolve(res)
			})
		})
	}


	//个人中心-我的订单
	myOrderP(query) {
		return new Promise((resolve, reject) => {
			get("/ds/order/myPage?query=" + query).then(res => {
				resolve(res)
			});
		});
	}
	//订单分页列表(设计订单,建造订单等)
	shipOderPage(query, data) {
		return new Promise(resolve => {
			get("/ship/order/apis/page?query=" + query, data).then(res => {
				resolve(res)
			})
		})
	}
	//销售订单(供应商)
	shopOrder(data) {
		return new Promise(resolve => {
			get("/ds/purchase/pageBySupplier?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//订单详情
	orderDetail(id) {
		return new Promise((resolve, reject) => {
			get("/ds/order/orderInfo?id=" + id, '', { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				resolve(res.data)
			});
		});
	}

	//销售订单详情(基本信息)
	shopBasicDetail(id) {
		return new Promise(resolve => {
			get("/ds/purchase/info/" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//销售订单详情(产品信息)
	shopProductDetail(data) {
		return new Promise(resolve => {
			get("/ds/purchaseItm/list?query=" + data).then(res => {
				resolve(res.data.list)
			})
		})
	}
	//申请分期
	applyStaging(id) {
		return new Promise(resolve => {
			get("/ds/order/applyStaging?orderId=" + id).then(res => {
				resolve(res)
			})
		})
	}
	//线下支付
	payXX(data) {
		return new Promise(resolve => {
			get("/ds/order/offline", data).then(res => {
				resolve(res)
			})
		})
	}
	//金融保险提交
	financeApplic(data) {
		return new Promise(resolve => {
			post("/ship/financeApplic/apis/add", data).then(res => {
				resolve(res)
			})
		})
	}
	//同个分类下随机产品
	catRand(data, num) {
		return new Promise(resolve => {
			get("/ds/open/randGoods?query=" + data + '&num=' + num).then(res => {
				resolve(res.data.list)
			})
		})
	}
	//查看物流信息
	trace(data) {
		return new Promise((resolve, reject) => {
			get('/ds/logi/query', data).then(res => {
				resolve(res)
			});
		});
	}
	//商品/船舶搜索
	goodsSearch(data) {
		return new Promise((resolve, reject) => {
			get("/search/goods/api/page", data).then(res => {
				resolve(res)
			});
		});
	}
	//船舶设计方案分页列表
	programSearch(data) {
		return new Promise((resolve, reject) => {
			get("/search/solutions/api/page", data).then(res => {
				resolve(res)
			});
		});
	}
	//行业资讯-分页
	infoSearch(data) {
		return new Promise((resolve, reject) => {
			get("/search/indusInfo/api/page", data).then(res => {
				resolve(res)
			});
		});
	}
	//店铺搜索分页列表
	storeSearch(data) {
		return new Promise((resolve, reject) => {
			get("/search/shops/api/page", data).then(res => {
				resolve(res)
			});
		});
	}
	//查看物流信息
	trace(com, num) {
		return new Promise((resolve, reject) => {
			get('/ds/logi/query?com=' + com + '&num=' + num).then(res => {
				resolve(res)
			});
		});
	}
	//删除订单
	delOrder(id) {
		return new Promise((resolve, reject) => {
			get("/ds/order/delOrder?id=" + id).then(res => {
				resolve(res)
			});
		});
	}
	//申请开票时的单位列表
	invoiceCompany(data) {
		return new Promise(resolve => {
			get('/ds/invoiceInfo/apis/list?query=' + data).then(res => {
				resolve(res.data.list)
			})
		})
	}

	//申请开票
	invoiceApply(data) {
		return new Promise(resolve => {
			post('/ds/invoiceApplication/apis/add', data).then(res => {
				resolve(res)
			})
		})
	}
	//取消待支付订单
	cancelPay(id) {
		return new Promise((resolve, reject) => {
			get("/ds/order/cancelOrder?orderId=" + id).then(res => {
				resolve(res)
			});
		});
	}
	//确认收货
	confirmGoods(id) {
		return new Promise(resolve => {
			get("/ds/order/buyerReceipt?orderId=" + id).then(res => {
				resolve(res)
			})
		})
	}
	//订单确认完成
	confirmFinishOrder(id) {
		return new Promise(resolve => {
			get("/ship/order/apis/chageOrder?id=" + id).then(res => {
				resolve(res)
			})
		})
	}
	//我的收藏-船舶设计方案
	collect1(data) {
		return new Promise(resolve => {
			get('/ship/favorite/apis/page?query=' + data).then(res => {
				resolve(res)
			})
		})
	}
	//我的收藏-船舶/设备
	collect2(data, nm) {
		return new Promise(resolve => {
			get('/ship/favorite/apis/page2?query=' + data + '&nm=' + nm).then(res => {
				resolve(res)
			})
		})
	}
	//我的收藏-店铺
	collect3(data, nm) {
		return new Promise(resolve => {
			get('/ship/favorite/apis/page3?query=' + data + '&nm=' + nm).then(res => {
				resolve(res)
			})
		})
	}
	//我的收藏-学习-课件分页查询
	collect4(data, nm) {
		return new Promise(resolve => {
			get('/ship/favorite/apis/page4?query=' + data + '&nm=' + nm).then(res => {
				resolve(res)
			})
		})
	}
	//我的收藏-学习-直播分页查询
	collect5(data, nm) {
		return new Promise(resolve => {
			get('/ship/favorite/apis/page5?query=' + data + '&nm=' + nm).then(res => {
				resolve(res)
			})
		})
	}

	//我的推荐
	myRecommend(data) {
		return new Promise(resolve => {
			get('/ds/view/Commission/apis/page?query=' + data).then(res => {
				resolve(res)
			})
		})
	}

	//云监造摄像头分页列表
	myVideoList(data) {
		return new Promise(resolve => {
			get('/visual/camera/api/page?query=' + data).then(res => {
				resolve(res)
			})
		})
	}
	//试点服务栏目
	servicePage(query) {
		return new Promise((resolve, reject) => {
			get("/ship/serviceInfoCat/api/page?query=" + query).then(res => {
				resolve(res)
			});
		});
	}
	//试点服务栏目
	serviceTree(query) {
		return new Promise((resolve, reject) => {
			get("/ship/serviceInfoCat/api/listTreeNode?query=" + query).then(res => {
				resolve(res)
			});
		});
	}
	//试点栏目内容
	serviceInfo(query) {
		return new Promise((resolve, reject) => {
			get("/ship/serviceInfo/api/page?query=" + query).then(res => {
				resolve(res)
			});
		});
	}
	//补贴申请-分页列表
	subsidiesList(query) {
		return new Promise(resolve => {
			get("/ship/pilotApplication/apis/page?query=" + query).then(res => {
				resolve(res)
			})
		})
	}
	//补贴申请-详情
	subsidiesDetail(id) {
		return new Promise(resolve => {
			get("/ship/pilotApplication/apis/info/" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//试点服务内容
	serviceContent(query) {
		return new Promise(resolve => {
			get("/ship/serviceInfo/api/page?query=" + query).then(res => {
				resolve(res)
			})
		})
	}

	//试点服务内容详情
	serviceDetail(id) {
		return new Promise(resolve => {
			get("/ship/serviceInfo/api/info/" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//在线学习学习资源-课件上传
	learningUpload(data) {
		return new Promise(resolve => {
			post("/ship/studyCont/apis/add", data).then(res => {
				resolve(res)
			})
		})
	}
	//购物车修改数量
	cartChangeNum(data) {
		return new Promise(resolve => {
			get("/ds/cart/changeQty", data, { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				resolve(res)
				this.cartList()
			})
		})
	}
	//个人中心-设计流程列表
	designDeptList(data) {
		return new Promise(resolve => {
			get("/ship/docsDesign/apis/list?query=" + data).then(res => {
				resolve(res.data.list)
			})
		})
	}

	//个人中心-设计流程修改
	designDeptUpd(data) {
		return new Promise(resolve => {
			post("/ship/docsDesign/apis/upd", data).then(res => {
				resolve(res)
			})
		})
	}
	//个人中心-设计流程新增
	designDeptAdd(data) {
		return new Promise(resolve => {
			post("/ship/docsDesign/apis/add", data).then(res => {
				resolve(res)
			})
		})
	}
	//个人中心-建造流程新增
	buildDeptAdd(data) {
		return new Promise(resolve => {
			post("/ship/docsBuild/apis/add", data).then(res => {
				resolve(res)
			})
		})
	}
	//发现好货商品列表
	shopGoodPro() {
		return new Promise((resolve, reject) => {
			get("/ds/open/niceGoods").then(res => {
				resolve(res.data.list)
			});
		});
	}
	//新品首发商品列表
	shopNewPro() {
		return new Promise((resolve, reject) => {
			get("/ds/open/newsGoods").then(res => {
				resolve(res.data.list)
			});
		});
	}

	//优质店铺
	shopGoodStore() {
		return new Promise((resolve, reject) => {
			get("/ds/open/niceShops").then(res => {
				resolve(res.data.list)
			});
		});
	}
	//购物车删除
	cartDelet(data) {
		return new Promise(resolve => {
			get("/ds/cart/del", data, { "sinovat-token": window.localStorage.getItem("token") }).then(res => {
				resolve(res)
			})
		})
	}

	//排行榜单专题
	goodsRank30() {
		return new Promise((resolve, reject) => {
			get("/ds/open/goodsTop30").then(res => {
				resolve(res.data.list)
			});
		});
	}
	//学习资源分类列表
	getStudyCont(data) {
		return new Promise(resolve => {
			get("/ship/studyCont/api/page?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//讲师库-列表
	getTeacher(data) {
		return new Promise(resolve => {
			get("/ship/studyTeacher/api/list?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//学习资源浏览访问
	studyCont(id) {
		return new Promise((resolve, reject) => {
			get("/ship/studyCont/apis/visit/" + id).then(res => {
				resolve(res)
			});
		});
	}
	//学习资源-播放/下载计数
	studyContPlay(id) {
		return new Promise((resolve, reject) => {
			get("/ship/studyCont/apis/play/" + id).then(res => {
				resolve(res)
			});
		});
	}
	//在线直播分类
	studyCat() {
		return new Promise(resolve => {
			get("/ship/studyLiveCat/api/list").then(res => {
				resolve(res.data.list)
			})
		})
	}
	//在线直播-详情查询
	livePlay(id) {
		return new Promise((resolve, reject) => {
			get("/ship/studyLive/apis/info/" + id).then(res => {
				resolve(res)
			});
		});
	}

	//在线学习栏目列表
	studyContCat(data) {
		return new Promise(resolve => {
			get("/ship/studyContCat/api/list?query=" + data).then(res => {
				resolve(res)
			})
		})
	}

	//选型报价项目工程列表
	xuanxingProjectList() {
		return new Promise(resolve => {
			get('/ship/selectionProjCat/apis/list').then(res => {
				resolve(res.data.list)
			})
		})
	}
	//商城全部设备（含规格）
	xuanxingProductList() {
		return new Promise(resolve => {
			get('/ship/soluDevice/apis/goodSkuAll').then(res => {
				resolve(res.data.list)
			})
		})
	}

	//选型报价新增
	xuanxingAdd(data) {
		return new Promise(resolve => {
			post("/ship/selectionBill/apis/add", data).then(res => {
				resolve(res)
			})
		})
	}
	//选型报价新增
	xuanxingUpd(data) {
		return new Promise(resolve => {
			post("/ship/selectionBill/apis/upd", data).then(res => {
				resolve(res)
			})
		})
	}
	//船舶设备 分页
	shipCatList(data) {
		return new Promise(resolve => {
			get('/ds/cat/api/listDeviceCat?query=' + data).then(res => {
				resolve(res)
			})
		})
	}
	//船舶设计方案 新增设备时的列表
	designCatList(query, data) {
		return new Promise(resolve => {
			get("/ship/soluDevice/apis/goodSku?query=" + query, data).then(res => {
				resolve(res.data.list)
			})
		})
	}
	//我要出售
	toSale(data) {
		return new Promise(resolve => {
			post('/ship/saleApplication/apis/add', data).then(res => {
				resolve(res)
			})
		})
	}
	//每日特价列表
	shopDailySpecials() {
		return new Promise((resolve, reject) => {
			get("/ds/open/speGoods").then(res => {
				resolve(res.data.list)
			});
		});
	}
	//折扣产品列表
	shopDiscountPro() {
		return new Promise((resolve, reject) => {
			get("/ds/open/saleGoods").then(res => {
				resolve(res.data.list)
			});
		});
	}

	//新增船舶设计方案
	addDesignFile(data) {
		return new Promise(resolve => {
			post('/ship/solutions/apis/addSolutionAndDevice', data).then(res => {
				resolve(res)
			})
		})
	}

	//更新船舶设计方案
	updDesignFile(data) {
		return new Promise(resolve => {
			post('/ship/solutions/apis/updSolutionAndDevice', data).then(res => {
				resolve(res)
			})
		})
	}

	//	支付宝支付

	alipay(data) {
		return new Promise(resolve => {
			get("/pay/aliPay/appPay", data).then(res => {
				resolve(res)
			})
		})
	}
	//	微信支付

	wxpay(data) {
		return new Promise(resolve => {
			get("/pay/wxPay/appPay", data).then(res => {
				resolve(res)
			})
		})
	}

	//视频hls
	getVideoUrl(data) {
		return new Promise(resolve => {
			get('/sys/hik/previewURLs?code=' + data).then(res => {
				resolve(res.data.data.url)
			})
		})
	}
	//补贴申请-新增
	subsidiesAdd(data) {
		return new Promise(resolve => {
			post("/ship/pilotApplication/apis/add", data).then(res => {
				resolve(res)
			})
		})
	}
	//查看物流信息
	trace2(com, num) {
		return new Promise((resolve, reject) => {
			get('/ds/logi/query?com=' + com + '&num=' + num).then(res => {
				resolve(res)
			});
		});
	}
	//投标报价
	bidOffer(data) {
		return new Promise(resolve => {
			post("/ship/bidOffer/apis/offer", data).then(res => {
				resolve(res)
			})
		})
	}
	//投标报价更新
	bidOfferUpd(data) {
	  return new Promise(resolve => {
	    post("/ship/bidOffer/apis/upd", data).then(res => {
	      resolve(res)
	    })
	  })
	}
	//验证用户名是否重复
	checkUsername(data) {
		return new Promise((resolve, reject) => {
			get('/ship/member/api/checkUsername?username=' + data).then(res => {
				resolve(res)
			}).catch(err => {
				reject(err)
			})
		})
	}
	//验证手机号是否重复
	checkMob(data) {
		return new Promise((resolve, reject) => {
			get('/ship/member/api/checkMob?mob=' + data).then(res => {
				resolve(res)
			}).catch(err => {
				reject(err)
			})
		})
	}
	//在线交易——平台成交总量--船舶
	volumeShip() {
		return new Promise((resolve, reject) => {
			axios.get("/visual/sales/api/ships").then(res => {
				console.log(res)
				resolve(res.data.value)
			});
		});
	}
	//在线交易——平台成交总量--产品
	volumePro() {
		return new Promise((resolve, reject) => {
			axios.get("/visual/sales/api/prods").then(res => {
				resolve(res.data.value)
			});
		});
	}
	//缓存保存 对象
	toSave(key, data) {
		return new Promise(resolve => {
			post('/general/cache/objSave?key=' + key, data).then(res => {
				resolve(res)
			})
		})
	}
	//缓存读取
	toGet(data) {
		return new Promise(resolve => {
			get('/general/cache/get?key=' + data).then(res => {
				resolve(res.data)
			})
		})
	}
	//船舶节点通知
	shipNotice(data) {
		return new Promise(resolve => {
			post('/ship/docsNotice/apis/add', data).then(res => {
				resolve(res)
			})
		})
	}
	//证书通用接口(无需登录)
	certNotLoginList(data) {
		return new Promise(resolve => {
			get("/ship/docsCertificate/api/page?query=" + data).then(res => {
				resolve(res.data.list)
			})
		})
	}

	//快速下单——列表
	getQuickOrder(data) {
		return new Promise(resolve => {
			get("/ds/quickbuyStore/apis/page?query=" + data).then(res => {
				resolve(res)
			})
		})
	}

	//快速下单——列表
	getQuickOrder2() {
		return new Promise(resolve => {
			get("/ds/quickbuyStore/apis/list").then(res => {
				resolve(res)
			})
		})
	}
	//快速下单——添加
	addQuickOrder(data) {
		return new Promise(resolve => {
			post("/ds/quickbuyStore/apis/add", data).then(res => {
				resolve(res.data)
			})
		})
	}
	//快速下单通过商品id获得规格
	getSkuList(id) {
		return new Promise(resolve => {
			get("/ds/goodsSku/listByGoodsId?id=" + id).then(res => {
				resolve(res.data.list)
			})
		})
	}

	//快速下单的产品列表
	getQuickGoods() {
		return new Promise(resolve => {
			get("/ds/goods/list").then(res => {
				resolve(res.data.list)
			})
		})
	}
	//快速下单——修改数量
	updQuickOrder(data) {
		return new Promise(resolve => {
			post("/ds/quickbuyStore/apis/upd", data).then(res => {
				resolve(res.data)
			})
		})
	}
	//快速下单——删除
	delQuickOrder(id) {
		return new Promise(resolve => {
			get("/ds/quickbuyStore/apis/del?ids=" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//未读消息
	getMsgNum(id) {
		return new Promise(resolve => {
			get("/ship/msgSend/apis/unread").then(res => {
				resolve(res.data)
			})
		})
	}
	//发票帮助中心列表
	getBillHelpList(query) {
		return new Promise(resolve => {
			get('/ds/invoiceSupport/apis/page?query=' + query).then(res => {
				resolve(res)
			})
		})
	}
	//发票帮助中心详情
	getBillHelpDetail(query) {
		return new Promise(resolve => {
			get('/ds/invoiceSupport/apis/info/' + query).then(res => {
				resolve(res)
			})
		})
	}
	// 整改单列表
	getrectifyList(condition, msg, issueTm) {
		return new Promise(resolve => {
			get("/ship/docsRectify/apis/page?query=" + condition + "&msg=" + msg + "&issueTm=" + issueTm).then(res => {
				resolve(res)
			})
		})
	}
	// 整改详情
	getRectifyDetail(id) {
		return new Promise(resolve => {
			get("/ship/docsRectify/apis/info/" + id).then(res => {
				resolve(res.data)
			})
		})
	}
	//开票资料详情
	getQualiInfo(data) {
		return new Promise(resolve => {
			get("/ds/invoiceInfo/apis/infoByOrgEnterId", data).then(res => {
				resolve(res)
			})
		})
	}
	//开票资料新增
	qualiAdd(data) {
		return new Promise(resolve => {
			post("/ds/invoiceInfo/apis/add", data).then(res => {
				resolve(res)
			})
		})
	}
	//开票资料更新
	qualiUpd(data) {
		return new Promise(resolve => {
			post("/ds/invoiceInfo/apis/upd", data).then(res => {
				resolve(res)
			})
		})
	}
	//开票资料删除
	qualiDel(data) {
		return new Promise(resolve => {
			get("/ds/invoiceInfo/apis/del", data).then(res => {
				resolve(res)
			})
		})
	}
	//开票资料新增
	qualiAddrAdd(data) {
		return new Promise(resolve => {
			post("/ds/invoiceAddr/apis/add", data).then(res => {
				resolve(res)
			})
		})
	}
	//开票资料更新
	qualiAddrUpd(data) {
		return new Promise(resolve => {
			post("/ds/invoiceAddr/apis/upd", data).then(res => {
				resolve(res)
			})
		})
	}
	//开票资料详情
	getQualiAddrInfo(data) {
		return new Promise(resolve => {
			get("/ds/invoiceAddr/apis/listByOrderId", data).then(res => {
				resolve(res)
			})
		})
	}

	// 开票结果
	getInvoiceResult(data) {
		return new Promise(resolve => {
			get("/ds/invoiceResult/apis/listByOrderId", data).then(res => {
				resolve(res.data)
			})
		})
	}
	// 整改上报
	handleRectifyReport(body) {
		41
		return new Promise(resolve => {
			post("/ship/docsRectify/apis/rectifyReport", body).then(res => {
				resolve(res)
			})
		})
	}
	// 整改确认结案
	handlerectifyClose(body) {
		return new Promise(resolve => {
			post("/ship/docsRectify/apis/rectifyClose", body).then(res => {
				resolve(res)
			})
		})
	}
	// 整改再次下发
	handleRectifyReturn(body) {
		return new Promise(resolve => {
			post("/ship/docsRectify/apis/rectifyReturn", body).then(res => {
				resolve(res)
			})
		})
	}
	// 历史资料审核通过分页列表
	getHisPicAdoptList(data) {
		return new Promise(resolve => {
			get("/ship/docsImgs/apis/page?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	// 运行记录审核通过分页列表
	getRunAdoptList(data) {
		return new Promise(resolve => {
			get("/ship/docsOprRecord/apis/page?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	// 云检验审核通过分页列表
	getCloudTestAdoptList(data) {
		return new Promise(resolve => {
			get("/ship/docsInsp/apis/page?query=" + data).then(res => {
				resolve(res)
			})
		})
	}
	//云检验详情
	getDocsInspDetail(data){
	  return new Promise(resolve => {
	    get("/ship/docsInsp/apis/info/"+data).then(res=>{
	      resolve(res)
	    })
	  })
	}
	//船舶的合同列表
	shipContractList(query, data) {
		return new Promise(resolve => {
			get("/ship/contract/apis/docsPage?query=" + query, data).then(res => {
				resolve(res)
			})
		})
	}

	//获取整改单单号
	getDocsRectifyCd() {
		return new Promise(resolve => {
			get('/ship/docsRectify/apis/getCd').then(res => {
				resolve(res)
			})
		})
	}
	//整改单新增
	postDocsRectifyAdd(data) {
		return new Promise(resolve => {
			post("/ship/docsRectify/apis/add", data).then(res => {
				resolve(res.data)
			})
		})
	}
	//获取整改单位
	getRecitifyList(data) {
	  return new Promise(resolve => {
	    get('/ship/orgEnter/getOrg?docsId=' + data).then(res => {
	      resolve(res)
	    })
	  })
	}
	//获取检验检测机构
	getRecitifyListTest(data) {
	  return new Promise(resolve => {
	    get('/ship/orgEnter/getOrgTest?docsId=' + data).then(res => {
	      resolve(res)
	    })
	  })
	}
	//获取整改单位人员列表
	getMemberOrgEnterLink(query) {
		return new Promise(resolve => {
			get('/ship/memberOrgEnterLink/api/listA?query=' + query).then(res => {
				resolve(res)
			})
		})
	}
	// 我的投标报名列表
	getMyBidApplyList(data) {
	  return new Promise(resolve => {
	    get("/ship/bidApply/page?query="+data).then(res=>{
	      resolve(res)
	    })
	  })
	}
	// 招标公告分页列表
	getBidAfficheList2(data){
	  return new Promise(resolve => {
	    get("/ship/bidAffiche/list?query="+data).then(res=>{
	      resolve(res)
	    })
	  })
	}
	// 全部投标，投标结果列表
	getMyBidList(data,id) {
	  return new Promise(resolve => {
	    get("/ship/bid/pageOfMy?query="+data+'&id='+id).then(res=>{
	      resolve(res)
	    })
	  })
	}
	//保证金提交
	bidBail(data) {
	  return new Promise(resolve => {
	    post("/ship/bidDeposit/add", data).then(res => {
	      resolve(res)
	    })
	  })
	}
	//保证金修改
	bidBailUpd(data) {
	  return new Promise(resolve => {
	    post("/ship/bidDeposit/upd", data).then(res => {
	      resolve(res)
	    })
	  })
	}
	//投标报价
	bidOffer(data) {
	  return new Promise(resolve => {
	    post("/ship/bidOffer/apis/offer", data).then(res => {
	      resolve(res)
	    })
	  })
	}
	//签到
	bidSign(data) {
	  return new Promise(resolve => {
	    post("/ship/bidSignin/bidSignin/"+data).then(res => {
	      resolve(res)
	    })
	  })
	}
	// 新闻咨询招标分页列表
	getBidList(data){
	  return new Promise(resolve => {
	    get("/ship/bid/apis/api/page?query="+data).then(res=>{
	      resolve(res)
	    })
	  })
	}
	// 招投标详情
	getBidInfo(data,orgId) {
	  return new Promise(resolve => {
	    get("/ship/bid/apis/api/info/"+data+'?orgId='+orgId).then(res=>{
	      resolve(res)
	    })
	  })
	}
	// 购买须知
	getShopInfo() {
	  return new Promise(resolve => {
	    get("/sys/advertInfo/info/178").then(res=>{
	      resolve(res)
	    })
	  })
	}
}


export { api };