import request from '@/router/axios';

export const getList = (pageNo, pageSize, params) => {
  return request({
    url: '/api/blade-resource/vod/endpoint/pageVideo',
    method: 'get',
    params: {
      ...params,
      pageNo,
      pageSize,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-resource/vod/endpoint/delVideo',
    method: 'get',
    params: {
      ids,
    }
  })
}


export const update = (row) => {
  return request({
    url: '/api/blade-resource/vod/endpoint/updateVideoInfo',
    method: 'post',
    data: row
  })
}

