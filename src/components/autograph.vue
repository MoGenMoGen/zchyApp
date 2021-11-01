<style lang="less">
	body {
		background-color: #f5f5f5;
	}

	#app {
		width: 100%;
		margin: 0 auto;
	}

	.row {
		width: 100%;

		.signMain {
			position: relative;
			height: 240px;

			>p {
				text-align: center;
				position: absolute;
				top: 0;
				z-index: 2;
				display: block;
				width: 100%;
				font-size: .2rem;
				line-height: .6rem;
			}

			#signature {
				top: 0;
				left: 0;
				position: absolute;
				background: #ffffff;
				/*border: double 3px transparent;*/
				/*border-radius: 5px;*/
				/*border-radius: 15px 15px 0 0;*/
				/*background-image: linear-gradient(white, white),*/
				/*radial-gradient(circle at top left, #4bc5e8, #9f6274);*/
				/*background-origin: border-box;*/
				/*background-clip: content-box, border-box;*/

			}
		}

		.btn-box {
			width: 100%;
			display: flex;
			align-items: center;
			border-radius: 0 0 15px 15px;
			border-top: 1px solid #dddddd;
			color: #659ddd;
			text-align: center;
			background-color: #ffffff;

			.left-btn {
				padding: 15px 0;
				box-sizing: border-box;
				width: 50%;
				border-right: 1px solid #dddddd;
			}

			.right-btn {
				padding: 15px 0;
				width: 50%;
				box-sizing: border-box;
			}
		}
	}
</style>

<template>
	<div id="app">
		<div class="row">
			<div class="signMain">
				<VueSignaturePad id="signature" ref="signaturePad" :options="{backgroundColor}"/>
			</div>
			<div class="btn-box">
				<div class="left-btn" @click="clear">消除</div>
				<div class="right-btn" @click="save">确定</div>
			</div>
		</div>
	</div>

</template>

<script>
	import Vue from 'vue';
	import VueSignature from 'vue-signature-pad';
	import {
		Toast
	} from 'mint-ui';
	Vue.use(VueSignature);
	Vue.config.productionTip = false;
	export default {
		name: 'App',
		data() {
			return {
				backgroundColor:'#fff'
			}
		},
		mounted() {
			// this.abc();

			// this.setCanvas()
		},
		methods: {
			//重置画布，以清除上次的书写
			setCanvas() {
				let canvas = document.getElementsByTagName('canvas')[0]
				canvas.setAttribute('width', 0);
				canvas.setAttribute('height', 0);
				canvas.setAttribute('width', 375);
				canvas.setAttribute('height', 240);
				// canvas.clearRect(0,0,375,240)
				console.log('#######')
				console.log(canvas.width)
				console.log(canvas.height)
				this.$emit('closeSign')
			},
			// base64转file
			dataURLtoFile(dataurl,filename) {
				let arr = dataurl.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new File([u8arr], filename, {
					type: mime
				});
			},
			undo() {
				this.$refs.signaturePad.undoSignature();
				this.$emit('closeSign')
			},
			clear() {
				this.$refs.signaturePad.clearSignature();
				this.$emit('closeSign')
			},
			save() {
				const {
					isEmpty,
					data
				} = this.$refs.signaturePad.saveSignature('image/jpeg');
				console.log(isEmpty,data)
				if (data) {
					Toast('签名成功！');
					//将base64转成
					const file = this.dataURLtoFile(data,'file.jpg');
					this.api.upLoadBase(file).then(res => {
						this.$emit('closeSign',res.data.link)
					})
				} else {
					Toast('您还没有签名！');
				}

			}
		}
	}
</script>
