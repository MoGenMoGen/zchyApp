import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-vehicle/vehicleinoutrecord/list',
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
    url: '/api/blade-vehicle/vehicleinoutrecord/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-vehicle/vehicleinoutrecord/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-vehicle/vehicleinoutrecord/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-vehicle/vehicleinoutrecord/submit',
    method: 'post',
    data: row
  })
}

