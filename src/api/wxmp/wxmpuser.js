import request from '@/router/axios';


export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-wxMp/wxmpuser/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-wxMp/wxmpuser/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-wxMp/wxmpuser/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-wxMp/wxmpuser/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-wxMp/wxmpuser/submit',
    method: 'post',
    data: row
  })
}

