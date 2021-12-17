<template>
	<div class="shipEquip">
		<div class="tab">
			<p @click="index=j" :class="{active:index==j}" v-for="(item,j) in nmList" :key="j">
				<span>{{item.nm}}</span>
			</p>
		</div>
		<div class="equipBox" v-if="list[index]">
			<div v-for="(i,k) in list[index].equipList" :class="{open:i.check}" @click="toCheck(k)">
				<p><span>{{i.nm}}</span><i class="iconfont iconarrdown"></i></p>
				<div v-if="i.check" class="box">
					<p><span style="flex: 1.5;">序号</span><span>图片</span><span style="flex: 5;">名称</span>
						<span>型号</span><span>数量</span><span>单位</span><span>价格</span><span>金额</span>
						<span>供应商</span>
					</p>
					<p v-for="(z,y) in i.tabList" :key="y">
						<span style="flex: 1.5;">{{y+1}}</span><span><img :src="z.imgUrl"></span>
						<span style="flex: 5;">{{z.nm}}</span><span>{{z.model}}</span>
						<span>{{z.num}}</span><span>{{z.unit}}</span><span>{{fmoney(z.price)}}</span>
						<span>{{z.price?fmoney(z.price*z.num):''}}</span><span>{{z.supplierNm}}</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['id','types'],
		data() {
			return {
				index: 0,
				nmList: [],
				list: [],
			}
		},
		watch: {
			index() {
				console.log('点击 :' + this.index)
			}
		},
		mounted() {
			this.getClassify()
		},
		methods: {
			fmoney(s, n) {
			    n = n > 0 && n <= 20 ? n : 2;
			    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
			    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
			    var t = "";
			    for (let i = 0; i < l.length; i++) {
			        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
			    }
			    return t.split("").reverse().join("") + "." + r;
			},
			async toCheck(k) {
				if (this.list[this.index].equipList[k].check) {
					this.list[this.index].equipList[k].check = false
				} else {
					this.list[this.index].equipList.forEach((i, j) => {
						if (j == k) {
							this.list[this.index].equipList[j].check = true
						} else {
							this.list[this.index].equipList[j].check = false
						}
					})

					let qry = this.query.new()
					if(this.types==1) {
						// 船舶设计详情进入
						// this.query.toW(qry, 'solutionId', this.id, 'EQ')
						this.query.toW(qry, 'cids', this.list[this.index].equipList[k].id, 'LK')
						this.list[this.index].equipList[k].tabList = await this.api.designGoodsList(this.query.toEncode(
							qry))
					} else if(this.types==2) {
						// 装备在线船舶详情进入
						let data = {
							id:this.id,
							cid:this.list[this.index].equipList[k].id+''
						}
						this.list[this.index].equipList[k].tabList = await this.api.shipDetailEqupList(this.query.toEncode(
							qry),data)
					} else {
						// 个人中心船舶档案进入
						this.query.toW(qry, 'cids', this.list[this.index].equipList[k].id+'', 'LK')
						let data = {
							docsId:this.id
						}
						this.list[this.index].equipList[k].tabList = await this.api.fileDeviceList2(this.query.toEncode(
							qry),data)
					}
					this.list[this.index].equipList[k].tabList.forEach(item => {
						item.nm = item.nm.split('[')[0]
					})
					console.log(this.list[this.index].equipList[k].tabList)
				}
				this.$set(this.list, this.index, this.list[this.index])

			},
			async getClassify() {
				let data = await this.api.shipDetailEqupClassify(this.id)
				console.log('分类列表')
				console.log(data)
				this.list = []
				for (let [k, v] of Object.entries(data)) {
					if (v.length > 0) {
						this.list.push({
							nm: k,
							equipList: v
						})
					}
				}
				this.list.forEach((item, index) => {
					this.nmList.push({
						nm: item.nm,
						index: index
					})
				})
				console.log('左侧列表')
				console.log(this.list)
				console.log(this.id)
				for (let i = 0; i < this.list.length; i++) {
					if (this.list[i].equipList.length > 0) {
						this.list[i].equipList.forEach(item => {
							item.check = false
						})
						this.$set(this.list, i, this.list[i])
					}
				}
				console.log(this.list)
			},
		}
	}
</script>

<style lang="less" scoped>
	@import url("../assets/css/mobile.less");

	.shipEquip {
		.tab {
			display: flex;
			height: 1rem;

			>p {
				box-sizing: border-box;
				flex: 1;
				height: 1rem;
				padding: 0.3rem 0.5rem;
				font-size: 0.24rem;
				color: #9A9A9A;

				>span {
					padding: 0.08rem 0.2rem;
					border-radius: 0.3rem;
					white-space: nowrap;
				}
			}

			.active {
				color: #ffffff;

				>span {
					background-color: @themeColor;
				}
			}
		}

		.equipBox {
			>div {
				// display: flex;
				// flex-direction: column;

				border-bottom: 1px solid rgba(0, 0, 0, 0.1);

				&:last-of-type {
					border-bottom: 0;
				}

				p {
					display: flex;
					align-items: center;
					padding: 0.2rem 0.39rem 0.2rem 0.46rem;

					span {
						flex: 3;
						font-size: 0.24rem;
						color: #343434;
					}

					>i {
						font-size: 0.3rem;
						color: #999999;

					}
				}

				>div {
					/*padding: 0 0.39rem 0 0.46rem;*/

					>p {
						&:last-of-type {
							border-bottom: 0;
						}

						>span {
							text-align: center;

						}
					}
				}
			}

			.open {
				background-color: #F1F3F2;

				p {
					border-bottom: 1px solid rgba(0, 0, 0, 0.1);

					>i {
						transform: rotate(180deg);
					}
				}

				.box {
					width: auto;
					overflow-y: auto;
					p {
						width: 900px;
						display: flex;
						align-items: center;
					}
				}
			}
		}
	}
</style>
