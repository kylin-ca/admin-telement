const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  size: state => state.app.size,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.avatar,
  name: state => state.user.userInfo.username,
  userid: state => state.user.userid,
}
export default getters
