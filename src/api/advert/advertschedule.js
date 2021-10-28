import request from '@/router/axios';

export const getList = (current, size, params, infoId) => {
  return request({
    url: '/api/blade-advert/advertschedule/listAInfo',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      infoId,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-advert/advertschedule/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-advert/advertschedule/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-advert/advertschedule/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-advert/advertschedule/submit',
    method: 'post',
    data: row
  })
}

export const getInfoList = (current, size, params) => {
  return request({
    url: '/api/blade-advert/advertinfo/listAPosition',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

