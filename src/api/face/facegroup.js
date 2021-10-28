import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-baidu/face/faceGroup/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
};

export const getDetail = (id) => {
  return request({
    url: '/api/blade-baidu/face/faceGroup/detail',
    method: 'get',
    params: {
      id
    }
  })
};

export const remove = (ids) => {
  return request({
    url: '/api/blade-baidu/face/faceGroup/remove',
    method: 'post',
    params: {
      ids,
    }
  })
};

export const add = (row) => {
  return request({
    url: '/api/blade-baidu/face/faceGroup/save',
    method: 'post',
    data: row
  })
};

