import request from '@/router/axios';

export const sync = () => {
  return request({
    url: '/api/blade-vehicle/vehicle/sync',
    method: 'get',
    params: {}
  })
}

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-vehicle/vehicle/list',
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
    url: '/api/blade-vehicle/vehicle/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-vehicle/vehicle/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const addToWhitelist = (ids) => {
  return request({
    url: '/api/blade-vehicle/vehicle/addToWhitelist',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-vehicle/vehicle/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-vehicle/vehicle/submit',
    method: 'post',
    data: row
  })
}

