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


export const getMenu = params => { //获取菜单
  return request.post(`${baseUrl}/mms/sys/user/menu`, params)
};
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
export const addChannelProgram = params => { //插入关联节目
  return request.post(`${baseUrl}/mms/channel/programs/addChannelProgram`,params)
};
export const getList = params => { //查询夺奖快讯
  return request.get(`${baseUrl}/mms/config/common/list`,{params:params})
};
export const addList = (params,body) => { //新增夺奖快讯
  return request.post(`${baseUrl}/mms/config/common/add?key=${params.key}`,body)
};
export const setConfig = (params,body) => { //设置h5头图
  return request.post(`${baseUrl}/mms/config/common/set?key=${params.key}`,body)
};
export const getConfig = params => { //查询夺奖快讯
  return request.get(`${baseUrl}/mms/config/common/get`,{params:params})
};
export const deleteConfig = params => { //删除夺奖快讯
  return request.post(`${baseUrl}/mms/config/common/delete?key=${params.key}&id=${params.id}`,{})
};
export const getProgramsList = params => { //删除夺奖快讯
  return request.get(`${baseUrl}/mms/channel/programs/list`,{params:params})
};
export const updateList = (params,body) => { //删除夺奖快讯
  return request.post(`${baseUrl}/mms/config/common/update?key=${params.key}&id=${params.id}`,body)
};
export const getMedalList = params => { //获取奖牌榜
  return request.get(`${baseUrl}/mms/olympic2021/getMedalList`,{params:params})
};
export const setMedalList = params => { //设置夺奖快讯
  return request.post(`${baseUrl}/mms/olympic2021/setMedalList`,params)
};
export const getGameSchedule = params => { //获取赛事列表  /mms/olympic2021/getGameSchedule [get]
  return request.get(`${baseUrl}/mms/olympic2021/getGameSchedule`,{params:params})
};
export const searchVideo = params => { //短视频搜索
  return request.get(`${baseUrl}/mms/shortVideo/search`,{params:params})
};
export const shortVideoSearch = params => { //合集管理的搜索
  return request.post(`${baseUrl}/mms/shortVideo/column/list`,params)
};
export const updateGameSchedule = (params,body) => { //编辑赛事      /mms/olympic2021/updateGameSchedule?id=gameId  [post] body为修改过后的单个赛事
  return request.post(`${baseUrl}/mms/olympic2021/updateGameSchedule?id=${params.id}`,body)
};
export const deleteGameSchedule = (params,body) => { //删除赛事      /mms/olympic2021/deleteGameSchedule?id=gameId     [post]
  return request.post(`${baseUrl}/mms/olympic2021/deleteGameSchedule?id=${params.id}`,body)
};
export const refreshSpider = (params) => { //刷新爬虫赛事      /mms/olympic2021/deleteGameSchedule?id=gameId     [post]
  return request.get(`${baseUrl}/mms/olympic2021/refreshSpider?type=schedule`,{params:params})
};
export const addColumn = (params) => { //新增
  return request.put(`${baseUrl}/mms/shortVideo/column`,params)
};
export const update_column = (params) => { //新增
  return request.post(`${baseUrl}/mms/shortVideo/update_column`,params)
};
export const cvideos = (params) => { //查找合集短视频
  return request.get(`${baseUrl}/mms/shortVideo/cvideos`,{params:params})
};
export const getColumnInfo = (params) => { //查找合集短视频
  return request.get(`${baseUrl}/mms/shortVideo/column/list`,{params:params})
};




// export {
//   fetchArtLists,
//   addArt,
//   getArtById,
//   updateArt,
//   delArtById,
//   doLogin
// }