<template>
	<view class="template-product tn-safe-area-inset-bottom">
		<!-- 顶部自定义导航 -->
		<tn-nav-bar fixed alpha customBack>
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
				<text class='icon tn-icon-home-capsule-fill'></text>
			</view>
		</tn-nav-bar>

		<swiper class="card-swiper" :circular="true" :autoplay="true" duration="500" interval="5000"
			@change="cardSwiper">
			<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
				<view class="swiper-item image-banner">
					<image :src="item" mode="aspectFill"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="indication">
			<block v-for="(item,index) in swiperList" :key="index">
				<view class="spot" :class="cardCur==index?'active':''"></view>
			</block>
		</view>

		<view class="tn-margin" v-if="info.data">
			<view class="tn-flex tn-flex-row-between">
				<view class="justify-content-item tn-text-bold tn-margin-top-xs" style="font-size: 38rpx;">
					{{info.data.name}}
				</view>
				<view class="justify-content-item">
					<view
						class="icon15__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-shadow-blur button-1"
						@click="tn('/pageA/pano/pano')">
						<!-- <view class="tn-icon-share-circle tn-color-white"></view> -->
						<button class="tn-button--clear-style" open-type="share" style="border-radius: 0;">
							<view class="tn-icon-share-circle tn-color-white"></view>
						</button>
					</view>
				</view>
			</view>
			<view class="tn-flex tn-flex-row-between tn-margin-top">
				<view class="justify-content-item tn-text-bold tn-color-purplered">
					<text class="tn-padding-right-xs" style="font-size: 30rpx;">￥</text>
					<text class="" style="font-size: 50rpx;">{{info.data.price}}</text>
					
				</view>
				<view class="justify-content-item tn-color-gray tn-padding-top-xs">
					<view class="">已售 {{info.data.sales}}</view>
				</view>
			</view>
		</view>

		<!-- 边距间隔 -->
		<view class="tn-strip-bottom"></view>
		<view class="tn-margin-top-sm">
			<view class="nav_title--wrap">
				<view class="nav_title tn-cool-bg-color-6">
					<text class="tn-icon-star tn-padding-right-sm tn-text-xxl"></text>
					<text class="tn-text-xl">智途科技 · 产品详情</text>
					<text class="tn-icon-star tn-padding-left-sm tn-text-xxl"></text>
				</view>
			</view>
		</view>
		<view class="content-backgroup tn-margin">
			<rich-text :nodes="info.data.detail"></rich-text>

		</view>
	
		<view class='tn-tabbar-height'></view>

	</view>
</template>

<script>

	import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
	import {
		goodsDetail
	} from '@/api/home.js'
	export default {
	
		name: 'TemplateProduct',
		mixins: [template_page_mixin],
		data() {
			return {
				cardCur: 0,
				swiperList: [],
				topInfo: {
					height: 0,
				},
				topInfoTranslateY: 0,
				prevScrollTop: 0,
				id: '',
				info: {}
			}
		},
		onLoad(e) {
			this.id = e.id
			this.getData()
		},
		onReady() {
			this.getTopInfoRect()
		},
		onPageScroll(e) {
			this.handlePageScroll(e.scrollTop)
		},
		methods: {
			makePhoneCall(num) {
				uni.makePhoneCall({
					phoneNumber: num
				});
			},

		
			async getData() {
				let res = await goodsDetail({
					id: this.id
				})
				this.swiperList = res.data.data.images
				this.info = res.data
			},
			// 预览图片
			previewProductImage() {
				wx.previewImage({
					urls: []
				})
			},

		
			// cardSwiper
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			// 跳转
			tn(e) {
				uni.navigateTo({
					url: e,
				});
			},
			confirm(e) {
				
				let info = {
					name: this.info.name,
					...e.val,
					num: e.num,
					id: this.info.id
				}
				uni.navigateTo({
					url: '/commPages/order?info=' + JSON.stringify(info)
				})
			},
			// 获取顶部销售信息容器相关信息
			getTopInfoRect() {
				this._tGetRect('#top-info').then((res) => {
					if (!res) {
						setTimeout(() => {
							this.getTopInfoRect()
						}, 50)
						return
					}
					this.topInfo.height = res.height
				})
			},
			// 处理页面滚动事件
			handlePageScroll(scrollTop) {
				// console.log(scrollTop);
				if (this.prevScrollTop > scrollTop) {

					// 内容下滑，即手指从下往上滚
					this.topInfoTranslateY = 0
				} else {
					// 内容上滑，即手指从上往下滚
					if (scrollTop > this.topInfo.height) {
						this.topInfoTranslateY = this.topInfo.height
					}

				}

				this.prevScrollTop = scrollTop
			},
		}
	}
</script>

<style lang="scss" scoped>
	.text-red {
		color: #E83A30;
	}

	.template-product {}

	.tn-tabbar-height {
		min-height: 20rpx;
		height: calc(40rpx + env(safe-area-inset-bottom) / 2);
	}

	/* 用户头像 start */
	.logo-image {
		width: 110rpx;
		height: 110rpx;
		position: relative;
	}

	.logo-pic {
		background-size: cover;
		background-repeat: no-repeat;
		// background-attachment:fixed;
		background-position: top;
		box-shadow: 0rpx 0rpx 80rpx 0rpx rgba(0, 0, 0, 0.15);
		border-radius: 10rpx;
		overflow: hidden;
		// background-color: #FFFFFF;
	}

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

	/* 轮播视觉差 start */
	.card-swiper {
		height: 750rpx !important;
	}

	.card-swiper swiper-item {
		width: 750rpx !important;
		left: 0rpx;
		box-sizing: border-box;
		// padding: 0rpx 30rpx 90rpx 30rpx;
		overflow: initial;
	}

	.card-swiper swiper-item .swiper-item {
		width: 100%;
		display: block;
		height: 100%;
		transform: scale(1);
		transition: all 0.2s ease-in 0s;
		overflow: hidden;
	}

	.card-swiper swiper-item.cur .swiper-item {
		transform: none;
		transition: all 0.2s ease-in 0s;
	}

	.image-banner {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-banner image {
		width: 100%;
		height: 100%;
	}

	/* 轮播指示点 start*/
	.indication {
		z-index: 9999;
		width: 100%;
		height: 36rpx;
		position: absolute;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.spot {
		background-color: #FFFFFF;
		opacity: 0.6;
		width: 10rpx;
		height: 10rpx;
		border-radius: 20rpx;
		top: -60rpx;
		margin: 0 8rpx !important;
		position: relative;
	}

	.spot.active {
		opacity: 1;
		width: 30rpx;
		background-color: #FFFFFF;
	}

	/* 间隔线 start*/
	.tn-strip-bottom-min {
		width: 100%;
		border-bottom: 1rpx solid #F8F9FB;
	}

	/* 间隔线 start*/
	.tn-strip-bottom {
		width: 100%;
		border-bottom: 20rpx solid rgba(241, 241, 241, 0.8);
	}

	/* 间隔线 end*/
	/* 标题 start */
	.nav_title {
		-webkit-background-clip: text;
		color: transparent;

		&--wrap {
			position: relative;
			display: flex;
			height: 120rpx;
			font-size: 46rpx;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			background-image: url(https://resource.tuniaokj.com/images/title_bg/title44.png);
			background-size: cover;
		}
	}

	/* 标题 end */

	/* 用户头像 start */
	.user-image {
		width: 90rpx;
		height: 90rpx;
		position: relative;
	}

	.user-pic {
		background-size: cover;
		background-repeat: no-repeat;
		// background-attachment:fixed;
		background-position: top;
		border-radius: 50%;
		overflow: hidden;
		background-color: #FFFFFF;
	}

	/* 底部*/
	.tn-footerfixed {
		position: fixed;
		background-color: rgba(255, 255, 255, 0.5);
		box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.07);
		bottom: 0;
		width: 100%;
		transition: all 0.25s ease-out;
		will-change: transform;
		z-index: 100;
	}

	/* 底部 start*/
	.footerfixed {
		position: fixed;
		width: 100%;
		bottom: 0;
		z-index: 999;
		box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.07);
	}

	/* 标签内容 start*/
	.tn-tag-content {
		&__item {
			display: inline-block;
			line-height: 45rpx;
			padding: 10rpx 30rpx;
			margin: 20rpx 20rpx 5rpx 0rpx;

			&--prefix {
				padding-right: 10rpx;
			}
		}
	}

	/* 标签内容 end*/

	/* 内容图 start */
	.content-backgroup {
		z-index: -1;

		.backgroud-image {
			width: 100%;
		}
	}

	/* 内容图 end */

	/* 商家商品 start*/
	.tn-blogger-content {
		&__wrap {
			box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
			border-radius: 20rpx;
			margin: 15rpx;
		}

		&__info {
			&__btn {
				margin-right: -12rpx;
				opacity: 0.5;
			}
		}

		&__label {
			&__item {
				line-height: 45rpx;
				padding: 0 10rpx;
				margin: 5rpx 18rpx 0 0;

				&--prefix {
					color: #E83A30;
					padding-right: 10rpx;
				}
			}

			&__desc {
				line-height: 35rpx;
			}
		}

		&__main-image {
			border-radius: 16rpx 16rpx 0 0;

			&--1 {
				max-width: 690rpx;
				min-width: 690rpx;
				max-height: 400rpx;
				min-height: 400rpx;
			}

			&--2 {
				max-width: 260rpx;
				max-height: 260rpx;
			}

			&--3 {
				height: 212rpx;
				width: 100%;
			}
		}

		&__count-icon {
			font-size: 24rpx;
			padding-right: 5rpx;
		}
	}

	.image-good {
		width: 180rpx;
		height: 300rpx;
		position: relative;
	}

	.image-pic {
		border: 1rpx solid #F8F7F8;
		background-size: cover;
		background-repeat: no-repeat;
		// background-attachment:fixed;
		background-position: center;
		border-radius: 20rpx;
	}

	.image-book {
		padding: 150rpx 0rpx;
		font-size: 16rpx;
		font-weight: 300;
		position: relative;
	}

	.image-picbook {
		background-size: cover;
		background-repeat: no-repeat;
		// background-attachment:fixed;
		background-position: top;
		border-radius: 15rpx 15rpx 0 0;
	}

	/* 按钮 */
	.button-1 {
		background-color: rgba(0, 0, 0, 0.15);
		position: absolute;
		/* bottom:200rpx;
      right: 20rpx; */
		top: 700rpx;
		right: 30rpx;
		z-index: 1001;
		border-radius: 100px;
	}

	/* 图标容器15 start */
	.icon15 {
		&__item {
			width: 30%;

			// border-radius: 10rpx;
			padding: 30rpx;
			margin: 20rpx 10rpx;
			transform: scale(1);
			transition: transform 0.3s linear;
			transform-origin: center center;

			&--icon {
				width: 100rpx;
				height: 100rpx;
				font-size: 60rpx;
				border-radius: 50%;
				margin-bottom: 18rpx;
				z-index: 1;

				&::after {
					content: " ";
					position: absolute;
					z-index: -1;
					width: 100%;
					height: 100%;
					left: 0;
					bottom: 0;
					border-radius: inherit;
					opacity: 1;
					transform: scale(1, 1);
					background-size: 100% 100%;


				}
			}
		}
	}
</style>