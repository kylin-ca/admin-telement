import { login, logout, getUserInfo } from '@/api/user'
import { getRefreshToken } from '@/api/token'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    username: '',
    avatar: '',
    request_token: '',
    userid: '',
    userInfo: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.request_token = token
  },
  SET_NAME: (state, name) => {
    state.username = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  },
  SET_ACCESS_TOKEN: (state, access_token) => {
    state.access_token = access_token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit, state }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (response.status === 200) {
          let { request_token, userid } = response.data
          // console.log(request_token)
          // const { data } = response
          // console.log(request_token)
          // console.log(commit)
          commit('SET_TOKEN', request_token)
          commit('SET_USERID', userid)
          return getRefreshToken({
            userid,
            request_token,
          })
        } else {
          return Promise.reject("error")
        }
      }).then(res => {
        let token = JSON.stringify({
          request_token: state.request_token,
          access_token: res.data.access_token
        })
        setToken(token)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({
        userid: state.userid,
      }).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo({
        id: state.userid,
      }).then((res) => {
        commit('SET_USER_INFO', res.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
  // // remove token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     removeToken() // must remove  token  first
  //     commit('RESET_STATE')
  //     resolve()
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

