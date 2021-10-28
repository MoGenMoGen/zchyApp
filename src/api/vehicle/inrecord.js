import request from '@/router/axios';

export const getPage = (current, size, params) => {
  return request({
    url: '/api/blade-vehicle/vehicleinoutrecord/recordsPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
