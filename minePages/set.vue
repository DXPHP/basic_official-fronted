<template>
	<view class="tn-safe-area-inset-bottom">
		<!-- 顶部自定义导航 -->
		<tn-nav-bar fixed alpha customBack>
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
				<text class='icon tn-icon-home-capsule-fill'></text>
			</view>
		</tn-nav-bar>

		<view class="tn-margin-top" :style="{paddingTop: vuex_custom_bar_height + 'px'}">
			<!-- 这个是图鸟UI响应用户需求，推出的一个uni_modules组件，插件市场点击右上角，导入即可 https://ext.dcloud.net.cn/plugin?id=10172 -->
			<wx-user-info-modal v-model="showAuthorizationModal" @updated="updatedUserInfoEvent"></wx-user-info-modal>

			<view class="tn-flex tn-flex-row-between tn-strip-bottom tn-padding" @tap.stop="openAuthorizationModal">
				<view class="justify-content-item">
					<view class="tn-text-bold tn-text-lg">
						{{user.nickname || '暂无昵称'}}
					</view>

				</view>
				<view class="justify-content-item tn-text-lg tn-color-grey">
					<view class="logo-pic tn-shadow">
						<view class="logo-image">
							<view class="tn-shadow-blur"
								:style="'background-image:url('+user.avatar+');width: 80rpx;height: 80rpx;background-size: cover;'">
							</view>
						</view>
					</view>
				</view>
			</view>



			<view class="tn-flex tn-flex-row-between tn-strip-bottom-min tn-padding" @click="showModal2">
				<view class="justify-content-item">
					<view class="tn-text-bold tn-text-lg">
						绑定手机号
					</view>
					<view class="tn-color-gray tn-padding-top-xs">
						{{user.mobile || '未绑定'}}
					</view>
				</view>
				<view class="justify-content-item tn-text-lg tn-color-grey">
					<view class="tn-icon-right tn-padding-top"></view>
				</view>
			</view>



			<tn-modal v-model="show2" :custom="true" :showCloseBtn="true">
				<view class="custom-modal-content">
					<view class="">
						<view class="tn-text-lg tn-text-bold tn-color-purplered tn-text-center tn-padding">变更手机号码</view>
						<view class="tn-bg-gray--light tn-color-gray"
							style="border-radius: 10rpx;padding: 20rpx 30rpx;margin: 50rpx 0 60rpx 0;">
							{{user.mobile}}
						</view>
					</view>
					<view class="tn-flex-1 justify-content-item tn-margin-sm tn-text-center">

						<tn-button backgroundColor="#3668FC" padding="40rpx 0" width="60%" shadow fontBold
							open-type="getPhoneNumber" @getphonenumber="bindWechatPhone">
							<text class="tn-color-white">获取手机号</text>
						</tn-button>
					</view>
				</view>
			</tn-modal>



			<!-- 为app或者h5时修改用户昵称和头像使用到-->
			<tn-modal v-model="show4" :custom="true" :showCloseBtn="true">
				<view class="custom-modal-content">
					<view class="">
						<view class="tn-text-lg tn-text-bold  tn-text-center tn-padding">修改昵称和头像
						</view>
						<view class="tn-flex tn-flex-col-center tn-flex-row-center tn-text-lg tn-color-grey">
							<view class="logo-image1" @click="getImage">
								<view class="tn-shadow-blur"
									:style="'background-image:url('+info.avatar+');width: 100%;height: 100%;background-size: cover;border-radius: 50%;'">
								</view>
								<view class="logo-camera">
									<text class="tn-icon-camera" style="font-size: 50rpx;"></text>
								</view>
							</view>

						</view>

						<view class="tn-bg-gray--light"
							style="border-radius: 10rpx;padding: 20rpx 30rpx;margin: 50rpx 0 60rpx 0;">
							<input placeholder="请填写昵称" v-model="info.nickname" name="input"
								placeholder-style="color:#AAAAAA" maxlength="20"></input>
						</view>
					</view>
					<view class="tn-flex-1 justify-content-item tn-margin-sm tn-text-center"
						@click="updatedUserInfoEvent1">
						<tn-button backgroundColor="#3668FC" padding="40rpx 0" width="60%" fontBold>
							<text class="tn-color-white">保 存</text>
						</tn-button>
					</view>
				</view>
			</tn-modal>

		</view>


	</view>
</template>

<script>
	import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
	import WxUserInfoModal from '@/uni_modules/tuniaoui-wx-user-info/components/tuniaoui-wx-user-info/tuniaoui-wx-user-info.vue'
	import {
		bindMobile,
		profile
	} from '@/api/user.js'
	import {
		updateUserInfo
	} from '@/utils/updateUtils.js'
	import {
		isLogin
	} from '@/utils/commonUtils.js'
	import {
		uploadFilePromise
	} from '@/utils/uploadFileUtils.js'

	import {
		getStorage,
	} from '@/common/db.js';
	import {
		storageKey,
	} from '@/common/config.js';
	const {
		storage_userInfo
	} = storageKey

	export default {
		components: {
			WxUserInfoModal
		},
		name: 'TemplateSet',
		mixins: [template_page_mixin],
		data() {
			return {
				showAuthorizationModal: false,
				show2: false,
				show4: false,
				user: {
					mobile: '',
					nickname: '',
					realName: '',
					avatar: ''
				},
				info: {
					nickname: '',
					avatar: ''
				}

			}
		},
		computed: {

		},
		onLoad() {
			isLogin()
			let userInfo = getStorage(storage_userInfo)
			if (userInfo) {
				this.user = JSON.parse(userInfo).userinfo
			}

		},
		methods: {
			getImage() {
				uni.chooseImage({
					success: async (chooseImageRes) => {
						// this.is_upload = true
						uni.showLoading({
							title: '加载中~'
						})
						const tempFilePaths = chooseImageRes.tempFilePaths;
						const result = await uploadFilePromise(tempFilePaths[0])
						this.info.avatar = result.fullurl
						// this.is_upload = false
						uni.hideLoading()

					}
				});
			},
			async bindWechatPhone(e) {
				let that = this
				if (e.errMsg != 'getPhoneNumber:ok') return 1
				let res = await bindMobile({
					code: e.code
				})
				let data = await updateUserInfo()
				this.user.mobile = data.userinfo.mobile
				this.show2 = false

			},
			// 跳转
			tn(e) {
				uni.navigateTo({
					url: e,
				});
			},



			// 弹出模态框
			showModal2(event) {
				this.openModal2()
			},
			// 打开模态框
			openModal2() {
				this.show2 = true
			},

			// 打开获取用户信息弹框
			openAuthorizationModal() {
				// #ifdef MP-WEIXIN 
				this.showAuthorizationModal = true
				// #endif
				// #ifndef MP-WEIXIN

				this.info = {
					nickname: this.user.nickname,
					avatar: this.user.avatar
				}
				this.show4 = true
				// #endif

			},
			// 修改用户信息
			updatedUserInfo() {
				profile({
					nickname: this.user.nickname,
					avatar: this.user.avatar
				}).then(res => {
					this.$tn.message.toast('修改成功')
					let data = updateUserInfo()
				})
			},

			// 获取到的用户信息
			async updatedUserInfoEvent(info) {
				const result = await uploadFilePromise(info.avatar)
				this.user.avatar = result.fullurl
				this.user.nickname = info.nickname
				this.showAuthorizationModal = false
				this.updatedUserInfo()
				// console.log('获取到的用户信息', info)
			},
			// 获取到的用户信息
			updatedUserInfoEvent1() {
				if (!this.info.avatar) return this.$tn.message.toast('请先上传头像')
				if (!this.info.nickname) return this.$tn.message.toast('请先输入昵称')
				this.user.nickname = this.info.nickname
				this.user.avatar = this.info.avatar
				this.show4 = false
				this.updatedUserInfo()

			},



		}
	}
</script>

<style lang="scss" scoped>
	/* 胶囊*/
	.tn-custom-nav-bar__back {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		box-sizing: border-box;
		background-color: rgba(0, 0, 0, 0.15);
		border-radius: 1000rpx;
		border: 1rpx solid rgba(255, 255, 255, 0.5);
		color: #FFFFFF;
		font-size: 18px;

		.icon {
			display: block;
			flex: 1;
			margin: auto;
			text-align: center;
		}

		&:before {
			content: " ";
			width: 1rpx;
			height: 110%;
			position: absolute;
			top: 22.5%;
			left: 0;
			right: 0;
			margin: auto;
			transform: scale(0.5);
			transform-origin: 0 0;
			pointer-events: none;
			box-sizing: border-box;
			opacity: 0.7;
			background-color: #FFFFFF;
		}
	}

	/* 授权 */
	.login-page {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 授权按钮 */
	.submit-btn {
		width: 100%;
		background-color: #05C160;
		color: #FFFFFF;
		margin-top: 60rpx;
		border-radius: 10rpx;
		padding: 25rpx;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 30rpx;
	}

	/* 间隔线 start*/
	.tn-strip-bottom-min {
		width: 100%;
		border-bottom: 1rpx solid #F8F9FB;
	}

	.tn-strip-bottom {
		width: 100%;
		border-bottom: 20rpx solid rgba(241, 241, 241, 0.8);
	}

	/* 间隔线 end*/
	.logo-image1 {
		width: 150rpx;
		height: 150rpx;
		background-size: cover;
		background-repeat: no-repeat;
		// background-attachment:fixed;
		background-position: top;
		border: 2rpx solid rgba(255, 255, 255, 0.05);
		box-shadow: 0rpx 0rpx 80rpx 0rpx rgba(0, 0, 0, 0.15);
		border-radius: 50%;
		position: relative;

		.logo-camera {
			position: absolute;
			right: 0;
			bottom: 0;
		}
	}

	/* 用户头像 start */
	.logo-image {
		width: 80rpx;
		height: 80rpx;
		position: relative;
	}

	.logo-pic {
		background-size: cover;
		background-repeat: no-repeat;
		// background-attachment:fixed;
		background-position: top;
		border: 2rpx solid rgba(255, 255, 255, 0.05);
		box-shadow: 0rpx 0rpx 80rpx 0rpx rgba(0, 0, 0, 0.15);
		border-radius: 50%;
		overflow: hidden;
		// background-color: #FFFFFF;
	}


	/* 底部悬浮按钮 start*/
	.tn-tabbar-height {
		min-height: 100rpx;
		height: calc(120rpx + env(safe-area-inset-bottom) / 2);
	}

	.tn-footerfixed {
		position: fixed;
		width: 100%;
		bottom: calc(30rpx + env(safe-area-inset-bottom));
		z-index: 1024;
		box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0);

	}

	/* 底部悬浮按钮 end*/
</style>