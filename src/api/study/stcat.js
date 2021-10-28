import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-study/stcat/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getTreeList = (current,  params) => {
  return request({
    url: '/api/blade-study/stcat/treelist',
    method: 'get',
    params: {
      ...params,
      current
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-study/stcat/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-study/stcat/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-study/stcat/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-study/stcat/submit',
    method: 'post',
    data: row
  })
}

