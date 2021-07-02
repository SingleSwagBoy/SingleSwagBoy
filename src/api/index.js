import request from 'utils/request.js'

// 获取文章列表
const fetchArtLists = ( params={} ) => request.get('/api/v1/artList', {params})


// 增加文章
const addArt = (params) => request.post('/api/v1/addArt', params)

// 获取文章详情
const getArtById = (id) =>request.get('/api/v1/getArt', {
  params: {
    id
  }
})

// 更新文章
const updateArt = (params) => request.post('/api/v1/updateArt', params)
// 删除文章
const delArtById = (id) =>request.get('/api/v1/delArt', {
  params: {
    id
  }
})

// 登录接口
const doLogin = (params) => request.post('/api/v1/login', params)

export {
  fetchArtLists,
  addArt,
  getArtById,
  updateArt,
  delArtById,
  doLogin
}