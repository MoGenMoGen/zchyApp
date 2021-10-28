import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-ques/quescat/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getTreeList = (params) => {
  return request({
    url: '/api/blade-ques/quescat/treeList',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-ques/quescat/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-ques/quescat/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-ques/quescat/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-ques/quescat/submit',
    method: 'post',
    data: row
  })
}

