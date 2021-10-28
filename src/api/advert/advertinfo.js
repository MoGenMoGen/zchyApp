import request from '@/router/axios';

export const getList = (current, size, params, posId) => {
  return request({
    url: '/api/blade-advert/advertinfo/listAPosition',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      posId
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-advert/advertinfo/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const getPosDetail = (id) => {
  return request({
    url: '/api/blade-advert/advertposition/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-advert/advertinfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-advert/advertinfo/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-advert/advertinfo/submit',
    method: 'post',
    data: row
  })
}

export const getPositionList = (current, size, params) => {
  return request({
    url: '/api/blade-advert/advertposition/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

