import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-emp/empemployee/list',
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
    url: '/api/blade-emp/empemployee/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-emp/empemployee/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const addToWhitelist = (ids) => {
  return request({
    url: '/api/blade-emp/empemployee/addToWhitelist',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const audit = (ids, optinos,auditType) => {
  return request({
    url: '/api/blade-emp/empemployee/auditAll',
    method: 'post',
    // ids, optinos,  validityTm,auditType
    params: {
      ids, optinos, auditType
    }
  })
}

export const state = (ids,stateType) => {
  return request({
    url: '/api/blade-emp/empemployee/stateAll',
    method: 'post',
    // ids, optinos,  validityTm,auditType
    params: {
      ids,  stateType
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-emp/empemployee/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-emp/empemployee/submit',
    method: 'post',
    data: row
  })
}

