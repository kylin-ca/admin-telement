import axios from 'axios'
import router from '../router'
import store from '@/store'
import { succeed, failed, warning } from "@/utils"
import {
  getToken,
  setToken,
  removeToken
} from './auth'
import {
  MessageBox,
  Message
} from 'element-ui'
import {
  getRefreshToken,
} from '../api/token'
import {
  getTimestamp,
  randomString,
  getSignature
} from './index'
// const { pathToRegexp, match, parse, compile } = require("path-to-regexp");

// 是否正在刷新token的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []
function alertMessage(message) {
  Message({
    message: message,
    type: 'error',
    duration: 3 * 1000,
    showClose: true
  })
}
const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
  } = options
  // let { access_token } = getToken()
  let access_token = getToken() ? JSON.parse(getToken()).access_token : ""
  let rid = randomString(16)
  let time = getTimestamp()
  let sign = getSignature(rid, time, data, 'BEF06564C428CEE01EBC7E0934363F2F', method.toUpperCase())
  options.headers = {
    "mt-rid": rid, //随机字符串（16位字符数据混合）
    "mt-time": time, //当前时间戳毫秒 13位
    "mt-sign": sign, //签名 用于校验数据完整性
    "AccessToken": access_token //访问接口授权TOKEN (签名中不使用)
  }
  // const cloneData = lodash.cloneDeep(data)
  const cloneData = data
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        headers: options.headers,
        params: cloneData,
      }, {
        headers: options.headers
      })
    case 'delete':
      return axios.delete(url, {
        headers: options.headers,
        params: cloneData,
      })
    case 'post':
      return axios.post(url, cloneData, {
        headers: options.headers
      })
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

export default function request(options) {
  return fetch(options).then((response) => {
    const {
      statusText,
      status,
      config
    } = response
    let data = response.data
    let dataStatus = +data.status
    if (dataStatus === 4001) {
      if (!isRefreshing) {
        isRefreshing = true
        let { request_token } = JSON.parse(getToken())
        return getRefreshToken({
          // userid: 
          userid: store.getters.userid,
          request_token: request_token
        }).then(res => {
          if (res.status == 200) {
            const {
              access_token,
            } = res.data
            setToken(JSON.stringify({
              request_token,
              access_token
            }))
            config.headers['AccessToken'] = access_token
            // config.baseURL = ''
            // 已经刷新了token，将所有队列中的请求进行重试
            requests.forEach(cb => cb(access_token))
            requests = []
            return axios(config).then(res => {
              const {
                statusText,
                status,
                data
              } = res
              return {
                success: true,
                message: statusText,
                status,
                ...data,
              }
            })
          }
        }).catch(res => {
          console.error('request_token error =>', res)
        }).finally(() => {
          isRefreshing = false
        })
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push((access_token) => {
            // config.baseURL = ''
            config.headers['Authorization'] = `Bearer ${access_token}`
            resolve(axios(config).then(res => {
              const {
                statusText,
                status,
                data
              } = res
              return {
                success: true,
                message: statusText,
                status,
                ...data,
              }
            }))
          })
        })
      }
    }
    return {
      success: true,
      message: statusText,
      status,
      ...data,
    }
  }).catch((error) => {
    const {
      response
    } = error
    let msg
    let status
    let otherData = {}
    if (response) {
      const {
        data,
        statusText,
        config
      } = response
      otherData = data
      status = response.status
      msg = data.message || statusText
      failed('系统开小差');
    } else {
      status = 600
      msg = 'Network Error'
    }
    return {
      success: false,
      status,
      message: msg,
      ...otherData
    }
  })
}

