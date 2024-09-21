import {
	httpRequest
} from '../common/request'
// api/已经在请求封装中加入

// 获取用户信息
export const userinfo = (data) => httpRequest(`user/userinfo`, 'GET',
	data
)

// 账号登录
export const login = (data) => httpRequest(`user/login`, 'POST',
	data
)

// 绑定手机号
export const bindMobile = (data) => httpRequest(`user/bindMobile`, 'POST',
	data
)
//小程序授权登录
export const authLogin = (data) => httpRequest(`user/authLogin`, 'POST',
	data
)

// 修改用户信息
export const profile = (data) => httpRequest(`user/profile`, 'POST',
	data
)


// 发送短信验证码
export const send = (data) => httpRequest(`sms/send`, 'POST',
	data
)

// 注册
export const register = (data) => httpRequest(`user/register`, 'POST',
	data
)

// 政策协议
export const protocol = (data) => httpRequest(`support/protocol`, 'GET',
	data
)