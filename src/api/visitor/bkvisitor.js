import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-visitor/bkvisitor/list',
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
    url: '/api/blade-visitor/bkvisitor/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-visitor/bkvisitor/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const addToWhitelist = (ids) => {
  return request({
    url: '/api/blade-visitor/bkvisitor/addToWhitelist',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-visitor/bkvisitor/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-visitor/bkvisitor/submit',
    method: 'post',
    data: row
  })
}

export const sendAudit = (row) => {
  return request({
    url: '/api/blade-visitor/bkvisitor/audit',
    method: 'post',
    data: row
  })
}

