import request from '@/utils/request'

// 登录
export function login(param) {
  return request({
    url: 'api/manage/valid/login',
    method: 'post',
    data: param
  })
}
//登出
export function logout(param) {
  return request({
    url: 'api/manage/valid/logout',
    method: 'post',
    data: param
  })
}
//获取用户信息
export function getUserInfo(param) {
  return request({
    url: 'api/manage/user/get',
    method: 'get',
    data: param
  })
}
