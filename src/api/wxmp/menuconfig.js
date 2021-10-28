import request from '@/router/axios';

export const getMpList = () => {
  return request({
    url: '/api/blade-wxMp/wxmpmenuconfig/getMpList',
    method: 'get'
  })
}

export const getTreeMenuList = (appId) => {
  return request({
    url: '/api/blade-wxMp/wxmpmenuconfig/treeList',
    method: 'get',
    params: {
      appId
    }
  })
}
export const getDetail = (id) => {
  return request({
    url: '/api/blade-wxMp/wxmpmenuconfig/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-wxMp/wxmpmenuconfig/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-wxMp/wxmpmenuconfig/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-wxMp/wxmpmenuconfig/submit',
    method: 'post',
    data: row
  })
}
export const listByNullPid = (wxMpAppId) => {
  return request({
    url: '/api/blade-wxMp/wxmpmenuconfig/listByNullPid',
    method: 'get',
    params:{
      wxMpAppId
    }
  })
}
export const createMenu = (appid) => {
  return request({
    url: '/api/blade-wxMp/menu/'+appid+'/create',
    method: 'post'
  })
}
