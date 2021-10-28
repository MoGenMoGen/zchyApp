import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-visitor/bkvisitoroprlog/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getVisitorList = (id) => {
  return request({
    url: '/api/blade-visitor/bkvisitoroprlog/oprlist',
    method: 'get',
    params: {
      visitorId: id,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-visitor/bkvisitoroprlog/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-visitor/bkvisitoroprlog/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-visitor/bkvisitoroprlog/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-visitor/bkvisitoroprlog/submit',
    method: 'post',
    data: row
  })
}

