import request from '../utils/request'

//刷新token
export function getRefreshToken(param) {
    return request({
        url: 'api/manage/valid/token',
        method: 'post',
        data: param,
    })
}