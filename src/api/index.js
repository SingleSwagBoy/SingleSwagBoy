import request from 'utils/request.js'
let baseUrl = "http://test.cms.tvplus.club"
export {baseUrl} 
// 获取文章列表
// const fetchArtLists = ( params={} ) => request.get('/api/v1/artList', {params})


// // 增加文章
// const addArt = (params) => request.post('/api/v1/addArt', params)

// // 获取文章详情
// const getArtById = (id) =>request.get('/api/v1/getArt', {
//   params: {
//     id
//   }
// })

// // 更新文章
// const updateArt = (params) => request.post('/api/v1/updateArt', params)
// // 删除文章
// const delArtById = (id) =>request.get('/api/v1/delArt', {
//   params: {
//     id
//   }
// })

// // 登录接口
// const doLogin = (params) => request.post('/api/v1/login', params)



// // 登录接口
// const doLogin = (params) => request.post('/api/v1/login', params)


export const getPlace = params => { //获取地域
  return request.post(`${baseUrl}/mms/region/areaInfo`, params)
};
export const getChannelGroupChannel = params => { //获取频道组信息
  return request.post(`${baseUrl}/mms/channel/channelGroupChannel/get`,params)
};
export const getListChannelInfo = params => { //获取指定频道和时间的节目单信息
  return request.get(`${baseUrl}/mms/channel/programs/listChannelInfo`,{params:params})
};
export const updateListChannelInfo = params => { //刷新指定频道和时间的节目单信息
  return request.get(`${baseUrl}/mms/channel/programs/updateChannelInfo`,{params:params})
};
export const updateChannelProgram = params => { //刷新指定频道和时间的节目单信息
  return request.post(`${baseUrl}/mms/channel/programs/updateChannelProgram`,params)
};
export const searchPrograms = params => { //查询关联节目
  return request.get(`${baseUrl}/mms/channel/programGuides/search`,{params:params})
};
export const addChannelProgram = params => { //查询关联节目
  return request.post(`${baseUrl}/mms/channel/programs/addChannelProgram`,params)
};




// export {
//   fetchArtLists,
//   addArt,
//   getArtById,
//   updateArt,
//   delArtById,
//   doLogin
// }