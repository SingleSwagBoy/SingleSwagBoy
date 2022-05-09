import request from 'utils/request.js'
import request2 from 'utils/request2.js'
import hookRequest from "utils/hookRequest";
let baseUrl = ""
console.log(window.location.host, "api")
if (window.location.host.includes("localhost") || window.location.host.includes("test")) {
    baseUrl = "http://test.cms.tvplus.club"
} else if (window.location.host.includes("cms.tvplus.club")) {
    baseUrl = "http://cms.tvplus.club"
}
export { baseUrl }

export const loginSystem = params => { //获取菜单
    return request.post(`${baseUrl}/mms/login`, params)
};
export const getMenu = params => { return request.post(`${baseUrl}/mms/sys/user/menu`, params) };                                                                                           //获取菜单
export const getPlace = params => { return request.post(`${baseUrl}/mms/region/areaInfo`, params) };                                                                                        //获取地域
export const getChannelGroupChannel = params => { return request.post(`${baseUrl}/mms/channel/channelGroupChannel/get`, params) };                                                          //获取频道组信息
export const getListChannelInfo = params => { return request.get(`${baseUrl}/mms/channel/programs/listChannelInfo`, { params: params }) };                                                  //获取指定频道和时间的节目单信息
export const updateListChannelInfo = params => { return request.get(`${baseUrl}/mms/channel/programs/updateChannelInfo`, { params: params }) };                                             //刷新指定频道和时间的节目单信息
export const updateChannelProgram = params => { return request.post(`${baseUrl}/mms/channel/programs/updateChannelProgram`, params) };                                                      //刷新指定频道和时间的节目单信息
export const deleteChannelProgram = params => { return request.post(`${baseUrl}/mms/channel/programs/deleteChannelProgram`, params) };                                                      //删除节目单某个节目
export const searchPrograms = params => { return request.get(`${baseUrl}/mms/channel/programGuides/search`, { params: params }) };                                                          //查询关联节目
export const addChannelProgram = params => { return request.post(`${baseUrl}/mms/channel/programs/addChannelProgram`, params) };                                                            //插入关联节目
export const getList = params => { return request.get(`${baseUrl}/mms/config/common/list`, { params: params }) };                                                                           //查询夺奖快讯
export const addList = (params, body) => { return request.post(`${baseUrl}/mms/config/common/add?key=${params.key}`, body) };                                                               //新增夺奖快讯
export const setConfig = (params, body) => { return request.post(`${baseUrl}/mms/config/common/set?key=${params.key}`, body) };                                                             //设置h5头图
export const getConfig = params => { return request.get(`${baseUrl}/mms/config/common/get`, { params: params }) };                                                                          //查询夺奖快讯
export const deleteConfig = params => { return request.post(`${baseUrl}/mms/config/common/delete?key=${params.key}&id=${params.id}`, {}) };                                                 //删除夺奖快讯
export const getProgramsList = params => { return request.get(`${baseUrl}/mms/channel/programs/list`, { params: params }) };                                                                //删除夺奖快讯
export const updateList = (params, body) => { return request.post(`${baseUrl}/mms/config/common/update?key=${params.key}&id=${params.id}`, body) };
export const getMedalList = params => { return request.get(`${baseUrl}/mms/olympic2021/getMedalList`, { params: params }) };                                                                //获取奖牌榜
export const setMedalList = params => { return request.post(`${baseUrl}/mms/olympic2021/setMedalList`, params) };                                                                           //设置夺奖快讯
export const getGameSchedule = params => { return request.get(`${baseUrl}/mms/olympic2021/getGameSchedule`, { params: params }) };                                                          //获取赛事列表  /mms/olympic2021/getGameSchedule [get]
export const searchVideo = params => { return request.get(`${baseUrl}/mms/shortVideo/search`, { params: params }) };                                                                        //短视频搜索
export const shortVideoSearch = params => { return request.post(`${baseUrl}/mms/shortVideo/column/list`, params) };                                                                         //合集管理的搜索
export const updateGameSchedule = (params, body) => { return request.post(`${baseUrl}/mms/olympic2021/updateGameSchedule?id=${params.id}`, body) };                                         //编辑赛事      /mms/olympic2021/updateGameSchedule?id=gameId  [post] body为修改过后的单个赛事
export const deleteGameSchedule = (params, body) => { return request.post(`${baseUrl}/mms/olympic2021/deleteGameSchedule?id=${params.id}`, body) };                                         //删除赛事      /mms/olympic2021/deleteGameSchedule?id=gameId     [post]
export const refreshSpider = (params) => { return request.get(`${baseUrl}/mms/olympic2021/refreshSpider?type=schedule`, { params: params }) };                                              //刷新爬虫赛事      /mms/olympic2021/deleteGameSchedule?id=gameId     [post]
export const addColumn = (params) => { return request.put(`${baseUrl}/mms/shortVideo/column`, params) };                                                                                    //新增
export const update_column = (params) => { return request.post(`${baseUrl}/mms/shortVideo/update_column`, params) };                                                                        //新增
export const cvideos = (params) => { return request.get(`${baseUrl}/mms/shortVideo/cvideos`, { params: params }) };                                                                         //查找合集短视频
export const getColumnInfo = (params) => { return request.get(`${baseUrl}/mms/shortVideo/column/detail`, { params: params }) };                                                             //查找合集短视频
export const syn_config = (params) => { return request.get(`${baseUrl}/mms/config/common/syn_config`, { params: params }) };                                                                //查找合集短视频
export const syn_slice = (params) => { return request.get(`${baseUrl}/mms/config/common/syn_slice`, { params: params }) };                                                                  //查找合集短视频
export const editColumn = (params) => { return request.post(`${baseUrl}/mms/shortVideo/column`, params) };                                                                                  //编辑专题
export const requestAddToLunbo = (params, vid) => { return request2.get(`${baseUrl}/mms/tv/channelRecommend/addToLunbo?vid=${vid}`, { params: params }) };                                  //添加视频到轮播

export const requestSvcResort = (params) => { return request2.get(`${baseUrl}/mms/shortVideo/svc/resort`, { params: params }) };                                                            //奥运会专题-专题下短视频重新排序
export const requestSvcChangeVideoSort = (params) => { return request2.post(`${baseUrl}/mms/shortVideo/svc/changeVideoSort`, params) };                                                     //奥运会专题-专题下短视频修改序号
export const requestSvcChangeVideoTitle = (params) => { return request2.post(`${baseUrl}/mms/shortVideo/svc/changeVideoTitle`, params) };                                                   //奥运会专题-专题下短视频修改标题

//同步秒杀数据
export const hotStock = (params) => { return request.get(`${baseUrl}/mms/activity/levelMs/hotStock`, { params: params }) };                                                                 //查找合集短视频
//等级权益
export const realStock = (params) => { return request.get(`${baseUrl}/mms/activity/levelMs/realStock`, { params: params }) };                                                               //查找合集短视频
export const getBonusList = (params) => { return request.get(`${baseUrl}/mms/cash/olympic/days/list`, { params: params }) };                                                                //奥运会返现列表拉取
export const updateGold = (params) => { return request.post(`${baseUrl}/mms/cash/olympic/days/update`, params) };                                                                           //奥运会返现奖牌更新
export const sendAward = (params) => { return request.post(`${baseUrl}/mms/cash/olympic/award`, params) };                                                                                  //奥运会发奖接口
export const getRecords = (params) => { return request.post(`${baseUrl}/mms/activity/levelMs/records`, params) };                                                                           //获取用户秒杀地址列表
export const importFile = (params) => { return request.post(`${baseUrl}/mms/activity/levelMs/import`, params) };                                                                            //到处用户地址file
export const getChinaTodayMedal = (params) => { return request.get(`${baseUrl}/mms/olympic2021/getChinaTodayMedal`, { params: params }) };                                                  //获取今日奖牌数
export const setChinaTodayMedal = (params) => { return request.post(`${baseUrl}/mms/olympic2021/setChinaTodayMedal`, params) };                                                             //设置今日奖牌数


//服务分类
export const getServiceList = (params) => { return request.post(`${baseUrl}/mms/tv/lifeService/category/list`, params) };                                                                   //获取分类列表
export const addService = (params) => { return request.post(`${baseUrl}/mms/tv/lifeService/category/add`, params) };                                                                        //新增分类
export const editService = (params) => { return request.post(`${baseUrl}/mms/tv/lifeService/category/edit`, params) };                                                                      //编辑分类
export const deleteItem = (params) => { return request.get(`${baseUrl}/mms/tv/lifeService/deleteItem`, { params: params }) };                                                               //删除分类
export const getSelector = (params) => { return request.get(`${baseUrl}/mms/tv/lifeService/selector`, { params: params }) };                                                                //下啦列表
export const getMiniInfo = (params) => { return request.get(`${baseUrl}/mms/tv/lifeService/miniProgram/info`, { params: params }) };                                                        //获取小程序信息
export const changeState = (params) => { return request.get(`${baseUrl}/mms/tv/lifeService/changeState`, { params: params }) };                                                             //获取小程序信息
//类别
export const getTagList = (params) => { return request.post(`${baseUrl}/mms/tv/lifeService/tag/list`, params) };                                                                            //类别列表
export const addTag = (params) => { return request.post(`${baseUrl}/mms/tv/lifeService/tag/add`, params) };                                                                                 //类别列表
export const editTag = (params) => { return request.post(`${baseUrl}/mms/tv/lifeService/tag/edit`, params) };                                                                               //类别列表
export const miniList = (params) => { return request.post(`${baseUrl}/mms/tv/lifeService/miniProgram/list`, params) };                                                                      //类别列表
export const editMini = (params) => { return request.post(`${baseUrl}/mms/tv/lifeService/miniProgram/edit`, params) };                                                                      //类别列表
export const addMini = (params) => { return request.post(`${baseUrl}/mms/tv/lifeService/miniProgram/add`, params) };                                                                        //类别列表
export const dataSyncCache = (params) => { return request.post(`${baseUrl}/mms/tv/lifeService/syncCache`, params) };                                                                        //数据同步
export const resetSort = (params) => { return request.post(`${baseUrl}/mms/tv/lifeService/resetSort`, params) };                                                                            //拖动排序

//投票
export const getVotingList = (params) => { return request.post(`${baseUrl}/mms/activity/tvTrying/qhd/list`, params) };                                                                      //获取投票列表
export const addVoting = (params) => { return request.post(`${baseUrl}/mms/activity/tvTrying/qhd/create`, params) };                                                                        //新增投票列表
export const editVoting = (params) => { return request.post(`${baseUrl}/mms/activity/tvTrying/qhd/edit`, params) };                                                                         //编辑投票列表
export const getMyProduct = (params) => { return request.post(`${baseUrl}/mms/product/get`, params) };                                                                                      //产品线
export const getDict = (params) => { return request.post(`${baseUrl}/mms/dict/cp/get`, params) };                                                                                           //字典集
// export const getUserTag = (params) => { return request.post(`${baseUrl}/mms/ad/tag/get`, params) };                                                                                         //渠道
export const getChannel = (params) => { return request.post(`${baseUrl}/mms/channel/get`, params) };                                                                                        //获取频道
export const deleteVote = (params) => { return request.get(`${baseUrl}/mms/activity/tvTrying/qhd/deleteItem`, { params: params }) };                                                        //删除
export const changeStateVote = (params) => { return request.get(`${baseUrl}/mms/activity/tvTrying/qhd/changeState`, { params: params }) };                                                  //修改table里面的switch
export const voteSyncCache = (params) => { return request.post(`${baseUrl}/mms/activity/tvTrying/qhd/syncCache`, params) };//同步数据
export const requestVoteDuplicate = (params) => { return request.get(`${baseUrl}/mms/activity/tvTrying/qhd/duplicate`, { params: params }) };                                               //轻互动 拷贝一行

// 频道组
export const getLockConfig = (params) => { return request.get(`${baseUrl}/mms/channel/group/exclusive/get`, { params: params }) };                                                          //获取专项频道解锁配置
export const getLockList = (params) => { return request.post(`${baseUrl}/mms/channel/channelGroup/get`, params) };                                                                          //获取专项频道未设置的频道列表
export const unlockChannel = (params) => { return request.post(`${baseUrl}/mms/channel/group/exclusive/unlock`, params) };                                                                  //专项频道解锁配置
//直播预告
export const getLivePreview = (params) => { return request.post(`${baseUrl}/mms/channel/livePreview/get`, params) };                                                                        //获取直播预告列表
export const updateLivePreview = (params) => { return request.post(`${baseUrl}/mms/channel/livePreview/update`, params) };                                                                  //更新直播预告列表
export const delLivePreview = (params) => { return request.post(`${baseUrl}/mms/channel/livePreview/del`, params) };                                                                        //删除直播预告列表
export const addLivePreview = (params) => { return request.post(`${baseUrl}/mms/channel/livePreview/add`, params) };                                                                        //新增直播预告列表
//推送节目单尝鲜版
export const getCheckboxTry = (params) => { return request.get(`${baseUrl}/mms/channel/tvTrying/checkbox`, { params: params }) };                                                           //获取checkbox
export const addTvTrying = (params) => { return request.post(`${baseUrl}/mms/channel/tvTrying/add`, params) };                                                                              //添加推送尝鲜版
export const deleteTvTrying = (params) => { return request.post(`${baseUrl}/mms/channel/tvTrying/remove`, params) };                                                                        //添加推送尝鲜版
export const syncCacheTvTry = (params) => { return request.post(`${baseUrl}/mms/channel/tvTrying/syncCache`, params) };                                                                     //数据同步推送尝鲜版

// 频道专题
export const Getchannels = (params) => { return request.post(`${baseUrl}/mms/channel/programCover/channels`, params) };                                                                     //获取频道节目
export const ChannelTopic = (params) => { return request.post(`${baseUrl}/mms/channelTopicNew/list`, params) };                                                                                 //获取专题列表
export const updateChannelTopic = params => { return request.post(`${baseUrl}/mms/channelTopicNew/edit`, params) };                                                                                 //修改专题列表
export const addChannelTopic = params => { return request.post(`${baseUrl}/mms/channelTopicNew/create`, params) };                                                                                   //新增专题列表
export const deleteChannelTopic = params => { return request.get(`${baseUrl}/mms/channelTopicNew/deleteItem`, {params:params}) };                                                                  //删除专题列表
export const listProgramByChannelId = params => { return request.get(`${baseUrl}/mms/channel/programs/listByChannelId`, { params: params }) };                                              //获取专题详情
export const syncChannel = params => { return request.get(`${baseUrl}/mms/channel/topic/sync`, { params: params }); };                                                                      //频道专题同步接口
export const syncChannelNew = params => { return request.get(`${baseUrl}/mms/channelTopicNew/syncCache`, { params: params }); };                                                                      //频道专题同步接口
export const changeChannelTopic = params => { return request.get(`${baseUrl}/mms/channelTopicNew/changeState`, { params: params }); };                                                                      //频道专题同步接口
export const showConfChannel= params => { return request2.get(`${baseUrl}/mms/channelTopicNew/showConf`, { params: params }); };                                                                      //新频道专题-查看内容配置
export const saveConfChannel= params => { return request2.post(`${baseUrl}/mms/channelTopicNew/saveConf`,params); };   
export const ChannelTopicOld = (params) => { return request.get(`${baseUrl}/mms/channel/topic`, { params }) };                                                                                 //获取专题列表
export const updateChannelTopicOld = params => { return request.put(`${baseUrl}/mms/channel/topic`, params) };                                                                                 //修改专题列表
export const addChannelTopicOld = params => { return request.post(`${baseUrl}/mms/channel/topic`, params) };                                                                                   //新增专题列表
export const deleteChannelTopicOld = params => { return request.delete(`${baseUrl}/mms/channel/topic`, { params: params }) };                                                                   //新频道专题-查看内容配置


//微信公众号管理
export const getMsg = (params) => { return request.post(`${baseUrl}/mms/wx/msg/task/get`, params) };                                                                                        //客服消息
export const getMsgLog = (params) => { return request.post(`${baseUrl}/mms/wx/msg/log/get`, params) };                                                                                      //客服消息
export const getPublicList = (params) => { return request.post(`${baseUrl}/mms/wx/public/get`, params) };                                                                                   //获取公众号
export const getMsgTemplate = (params) => { return request.post(`${baseUrl}/mms/wx/msg/get`, params) };                                                                                     //获取模版 图文信息/文字信息
export const getTemplateImage = (params) => { return request.post(`${baseUrl}/mms/wx/msg/material`, params) };                                                                              //获取模版 图片
export const getTemplateUser = (params) => { return request.get(`${baseUrl}/mms/wx/msg/user/get`, { params: params }) };                                                                    //获取预览用户
export const deleteMsg = (params) => { return request.post(`${baseUrl}/mms/wx/msg/task/del`, params) };                                                                                     //删除客服消息
export const editMsg = (params) => { return request.post(`${baseUrl}/mms/wx/msg/task/update`, params) };                                                                                    //编辑客服消息
export const sendMsg = (params) => { return request.post(`${baseUrl}/mms/wx/msg/send`, params) };                                                                                           //发送客服消息
export const addMsg = (params) => { return request.post(`${baseUrl}/mms/wx/msg/task/add`, params) };                                                                                        //新增客服消息
export const addMaterial = (params) => { return request.post(`${baseUrl}/mms/wx/msg/addNews`, params) };                                                                                    //新增素材
export const addText = (params) => { return request.post(`${baseUrl}/mms/wx/msg/add`, params) };                                                                                            //新增文本
export const syncWxMaterial = (params) => { return request.post(`${baseUrl}/mms/wx/msg/syncWxMaterial`, params) };                                                                          //同步新增素材


//========== 尝鲜版 ==========
export const requestTvTringAdList = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/list`, params); };                                                                        //广告-列表
export const requestTvTringAdResetRatio = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/resetRatio`, params) };                                                             //广告-重设比例
export const requestTvTringAdChangeState = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/changeState`, { params: params }) };                                                //广告-修改状态
export const requestTvTringAdDuplicate = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/duplicate`, { params: params }) };                                                    //广告-拷贝一行
export const requestTvTringAdCreate = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/create`, params) };                                                                     //广告-新增
export const requestTvTringAdEdit = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/edit`, params) };                                                                         //广告-编辑
export const requestTvTringAdDeleteItem = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/deleteItem`, { params: params }) };                                                  //广告-删除
export const requestTvTringAdConfigRatio = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/config/ratio`, params) };                                                          //广告-配置节目单比例
export const requestTvTringAdConfigDuration = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/config/duration`, { params: params }); };                                        //广告-配置节目单持续时间
export const requestTvTringAdConfigDurationL = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/config/lDuration`, { params: params }); };                                      //广告-配置L型广告持续时间
export const requestTvTringAdSyncCache = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/syncCache`, params) };                                                               //广告-数据同步-生成前台缓存
export const requestTvTringShowConfig = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/showConfig`, { params: params }) };                                                    //广告-查看广告节目单配置
export const requestProductSkuList = (params) => { return request.post(`${baseUrl}/mms/p/product/sku`, params) }

// 广告管理-个人中心登录页                                
export const getHlcList = (params) => { return request.post(`${baseUrl}/mms/hlc/list`, params) };                                                                                           //广告管理-个人中心登录页-列表
export const addHlcList = (params) => { return request.post(`${baseUrl}/mms/hlc/create`, params) };                                                                                         //广告管理-个人中心登录页-新增
export const editHlcList = (params) => { return request.post(`${baseUrl}/mms/hlc/edit`, params) };                                                                                          //广告管理-个人中心登录页-修改
export const syncHlcList = (params, header) => { return request.get(`${baseUrl}/mms/hlc/syncCache`, { params: params, headers: header }) };                                                 //广告管理-个人中心登录页-数据同步
export const copyHlcList = (params) => { return request.get(`${baseUrl}/mms/hlc/duplicate`, { params: params }) };                                                                          //广告管理-个人中心登录页-复制
export const deleteHlcList = (params) => { return request.get(`${baseUrl}/mms/hlc/deleteItem`, { params: params }) };                                                                       //广告管理-个人中心登录页-删除
export const changeStateHlcList = (params) => { return request.get(`${baseUrl}/mms/hlc/changeState`, { params: params }) };                                                                 //广告管理-个人中心登录页-修改状态


export const requestWxProgramList = (params) => { return request2.post(`${baseUrl}/mms/wx/msg/getMpList`, params) };                                                                        //获取小程序列表

//========== 配置管理 ==========
export const requestConfigAddDoc = (layer, params) => { return request2.post(`${baseUrl}/mms/doc/${layer === 0 ? '' : layer === 1 ? 'key/' : 'value/'}add`, params); };                     //配置列表-添加配置
export const requestConfigDocList = (layer, params) => { return request2.post(`${baseUrl}/mms/doc/${layer === 0 ? '' : layer === 1 ? 'key/' : 'value/'}get`, params); };                    //配置列表-配置列表
export const requestConfigDeleteDoc = (layer, params) => { return request2.post(`${baseUrl}/mms/doc/${layer === 0 ? '' : layer === 1 ? 'key/' : 'value/'}del`, params); };                  //配置列表-删除配置
export const requestConfigUpdateDoc = (layer, params) => { return request2.post(`${baseUrl}/mms/doc/${layer === 0 ? '' : layer === 1 ? 'key/' : 'value/'}update`, params); };               //配置列表-更新配置

export const requestOperateApk = (params) => { return request2.post(`${baseUrl}/mms/offline/apk/get`, params); };                                                                           //获取运营APK列表
// export const addOperateApk = params => { return axios.post(`${base}/mms/offline/apk/add`, params); };
// export const updateOperateApk = params => { return axios.post(`${base}/mms/offline/apk/update`, params); };
// export const removeOperateApk = params => { return axios.post(`${base}/mms/offline/apk/del`, params); };


//========== tv推荐配置 ==========
export const requestChannelRecommendList = (params) => { return request2.post(`${baseUrl}/mms/tv/channelRecommend/list`, params); };                                    //频道管理-列表
export const requestChannelRecommendSearchChannel = (params) => { return request2.get(`${baseUrl}/mms/tv/channelRecommend/searchChannel`, { params: params }); };       //频道管理-下拉搜索频道
export const requestChannelRecommendSearchProgram = (params) => { return request2.get(`${baseUrl}/mms/tv/channelRecommend/searchProgram`, { params: params }); };       //频道推荐-下拉搜索节目视频
export const selectSearch = (params) => { return request.get(`${baseUrl}/mms/tv/channelRecommend/searchProgram`, { params: params }); };       //频道推荐-下拉搜索节目视频
export const requestChannelRecommendCreate = (params) => { return request2.post(`${baseUrl}/mms/tv/channelRecommend/create`, params); };                                //频道推荐-新增
export const requestChannelRecommendEdit = (params) => { return request2.post(`${baseUrl}/mms/tv/channelRecommend/edit`, params); };                                    //频道推荐-编辑
export const requestChannelRecommendDelete = (params) => { return request2.get(`${baseUrl}/mms/tv/channelRecommend/deleteItem`, { params: params }); };                 //频道推荐-删除
export const requestChannelRecommendChangeState = (params) => { return request2.get(`${baseUrl}/mms/tv/channelRecommend/changeState`, { params: params }); };           //频道推荐-修改状态
export const requestChannelRecommendChannel = (params) => { return request2.post(`${baseUrl}/mms/channel/get`, params) };                                               //频道推荐-展示频道

//========== 微信管理 ==========
export const requestWxReply = (params) => { return request2.post(`${baseUrl}/mms/wxReply/get`, params); };                                                                                  //获取微信回复
export const requestWxReplyTypes = (params) => { return request2.post(`${baseUrl}/mms/wx/public/get`, params); };                                                                           //获取回复公众号的类型
export const requestWxReplyUpdate = (params) => { return request2.post(`${baseUrl}/mms/wxReply/update`, params); };                                                                         //编辑|更新
export const requestWxReplyDelete = (params) => { return request2.post(`${baseUrl}/mms/wxReply/del`, params); };                                                                            //删除
export const requestWxReplyCreate = (params) => { return request2.post(`${baseUrl}/mms/wxReply/add`, params); };                                                                            //添加

export const requestConfigMenuImageList = (params) => { return request2.post(`${baseUrl}/mms/config/menu/image/list`, params); };                                                           //菜单栏配置 列表
export const requestConfigMenuImageCreate = (params) => { return request2.post(`${baseUrl}/mms/config/menu/image/create`, params); };                                                       //菜单栏配置 新增
export const requestConfigMenuImageEidt = (params) => { return request2.post(`${baseUrl}/mms/config/menu/image/edit`, params); };                                                           //菜单栏配置 编辑
export const requestConfigMenuImageDelete = (params) => { return request2.get(`${baseUrl}/mms/config/menu/image/deleteItem`, { params: params }); };                                        //菜单栏配置 删除
export const requestConfigMenuImageChangeState = (params) => { return request2.get(`${baseUrl}/mms/config/menu/image/changeState`, { params: params }); };                                  //菜单栏配置 修改状态

export const requestWxTemplateMsgConfigList = (params) => { return request2.post(`${baseUrl}/mms/tmpl/message/config/list`, params); };                                                     //微信模板消息 列表
export const requestWxTemplateMsgConfigCreate = (params) => { return request2.post(`${baseUrl}/mms/tmpl/message/config/add`, params); };                                                    //微信模板消息 添加
export const requestWxTemplateMsgConfigUpload = (params) => { return request2.post(`${baseUrl}/mms/tmpl/message/config/update`, params); };                                                 //微信模板消息 修改
export const requestWxTemplateMsgConfigDelete = (params) => { return request2.post(`${baseUrl}/mms/tmpl/message/config/del`, params); };                                                    //微信模板消息 删除
export const requestWxTemplateMsgConfigSend = (params) => { return request2.post(`${baseUrl}/mms/tmpl/message/config/send`, params); };                                                     //微信模板消息 测试发送

//========== 权限管理 ==========
export const requestSysUser = params => { return request2.post(`${baseUrl}/mms/sys/user/get`, params); };                                                                                   //权限管理-用户列表
export const requestSysUserCreate = params => { return request2.post(`${baseUrl}/mms/sys/user/add`, params); };                                                                             //权限管理-创建用户
export const requestSysUserUpdate = params => { return request2.post(`${baseUrl}/mms/sys/user/update`, params); };                                                                          //权限管理-用户更新
export const requestSysUserDelete = params => { return request2.post(`${baseUrl}/mms/sys/user/del`, params); };                                                                             //权限管理-用户删除

export const requestSysRole = params => { return request2.post(`${baseUrl}/mms/sys/role/get`, params); };                                                                                   //角色列表
export const requestSysRoleCreate = params => { return request2.post(`${baseUrl}/mms/sys/role/add`, params); };
export const requestSysRoleUpdate = params => { return request2.post(`${baseUrl}/mms/sys/role/update`, params); };
export const requestSysRoleDelete = params => { return request2.post(`${baseUrl}/mms/sys/role/del`, params); };

export const requestSysMenu = params => { return request2.post(`${baseUrl}/mms/sys/menu/get`, params); };
export const requestSysMenuCreate = params => { return request2.post(`${baseUrl}/mms/sys/menu/add`, params); };
export const requestSysMenuUpdate = params => { return request2.post(`${baseUrl}/mms/sys/menu/update`, params); };
export const requestSysMenuDelete = params => { return request2.post(`${baseUrl}/mms/sys/menu/del`, params); };


export const requestSysUserRolePermissions = params => { return request2.post(`${baseUrl}/mms/sys/role/permission/get`, params); };                                                         //获取用户角色权限列表
export const requestSysUserRolePermissionCreate = params => { return request2.post(`${baseUrl}/mms/sys/role/permission/add`, params); };
export const requestSysUserRolePermissionUpdate = params => { return request2.post(`${baseUrl}/mms/sys/role/permission/update`, params); };
export const requestSysUserRolePermissionDelete = params => { return request2.post(`${baseUrl}/mms/sys/role/permission/del`, params); };




//========== 数据同步|数据缓存 ========== 
export const syncOther = (params) => { return request2.get(`${baseUrl}/mms/sync/other`, { params: params }); };                                                                             //其他缓存 其他缓存(热点频道/友盟上报/播放控制/分享码/产品线/文案/配置API/移动端banner/运营位/用户识别规则/热点节目/渠道/卡顿策略/设备权益/eslog/开机进入/定时任务/专享运营位/家庭账号配置)
export const syncLiveCarousel = (params) => { return request2.get(`${baseUrl}/mms/sync/liveCarousel`, { params: params }); };                                                               //直播轮播缓存(直播预告/轮播推荐/观影厅频道配置)
export const syncSyncConfig = (params) => { return request2.get(`${baseUrl}/mms/config/common/syn_config`, { params: params }); };                                                          //查找合集短视频 /mms/config/common/syn_config?key=
export const syncSynSlice = (params) => { return request2.get(`${baseUrl}/mms/config/common/syn_slice`, { params: params }); };                                                             //查找合集短视频 /mms/config/common/syn_config?key=
export const syncWeChat = (params) => { return request2.get(`${baseUrl}/mms/sync/weChat`, { params: params }); };                                                                           //微信自动回复/wxcode/微信二维码
export const syncMenuImage = (params) => { return request2.get(`${baseUrl}/mms/config/menu/image/syncCache`, { params: params }); };                                                        //广告菜单栏目录配置
export const syncWxTemplateMsgConfig = (params) => { return request2.get(`${baseUrl}/mms/tmpl/message/config/sync`, { params: params }); };                                                 //微信模板消息 同步
export const syncAdNewTagSync = (params) => { return request2.get(`${baseUrl}/mms/ad/new/tag/sync`, { params: params }); };                                                                 //广告新标签 数据同步
export const setMoney = (params) => { return request2.get(`${baseUrl}/mms/wxReply/setMoney`, { params: params }); };                                                                 //更新金额
export const getMoney = (params) => { return request2.get(`${baseUrl}/mms/wxReply/getMoney`, { params: params }); };                                                                 //更新金额
export const syncChannelRecommend = (params) => { return request2.get(`${baseUrl}/mms/tv/channelRecommend/syncCache`, { params: params }); };                                               //频道推荐-数据同步



//小程序配置
export const getMiniProList = (params) => { return request.post(`${baseUrl}/mms/wx/msg/getMpListV2`, params) };                                                                             //获取小程序配置列表
export const addMpConfig = (params) => { return request.post(`${baseUrl}/mms/wx/msg/addMpConfig`, params) };                                                                                //增加小程序配置列表
export const delMpConfig = (params) => { return request.post(`${baseUrl}/mms/wx/msg/delMpConfig?id=${params.id}`) };                                                                        //删除小程序配置列表

//广告管理---自定义规则便签
export const requestAdRightKey = params => { return request2.post(`${baseUrl}/mms/ad/adRightKey/get`, params); };                                                                //获取广告素材 获取右下角广告
export const addAdRightKey = params => { return request2.post(`${baseUrl}/mms/ad/adRightKey/add`, params); };                                                                //获取广告素材 获取右下角广告
export const addScreen = params => { return request2.post(`${baseUrl}/mms/ad/screen/add`, params); };                                                                //获取广告素材 获取右下角广告
export const getScreen = params => { return request2.post(`${baseUrl}/mms/ad/screen/get`, params); };                                                                //获取广告素材 获取右下角广告
export const requestAdTagList = (params) => { return request2.post(`${baseUrl}/mms/ad/tag/get`, params) };                                                                                       //获取列表
export const addDIYTag = (params) => { return request.post(`${baseUrl}/mms/ad/tag/add`, params) };                                                                                          //增加自定义规则标签
export const updateDIYTag = (params) => { return request.post(`${baseUrl}/mms/ad/tag/update`, params) };                                                                                    //更新自定义规则标签
export const delDIYTag = (params) => { return request.post(`${baseUrl}/mms/ad/tag/del`, params) };                                                                                          //删除自定义规则标签
export const esQuery = (params) => { return request.post(`${baseUrl}/mms/ad/tag/esQuery`, params) };                                                                                        //esQuery

//广告组
export const requestNewGroupCreate = (params) => { return request2.post(`${baseUrl}/mms/ad/newGroup/add`, params) };                                                                         //新建广告组
export const requestNewGroupUpdate = (params) => { return request2.post(`${baseUrl}/mms/ad/newGroup/update`, params) };                                                                      //更新广告组
export const requestNewGroupList = (params) => { return request2.post(`${baseUrl}/mms/ad/newGroup/get`, params) };                                                                           //获取广告组
export const requestNewGroupDelete = (params) => { return request2.post(`${baseUrl}/mms/ad/newGroup/del`, params) };                                                                         //删除广告组
export const requestNewGroupCopy = (params) => { return request2.post(`${baseUrl}/mms/ad/newGroup/copy`, params) };                                                                          //复制广告组

//素材库
export const getInfoGroup = (params) => { return request2.post(`${baseUrl}/mms/ad/info/group/get`, params) };                                                                          //信息流广告组
export const addInfoGroup = (params) => { return request2.post(`${baseUrl}/mms/ad/info/group/add`, params) };                                                                          //信息流广告组
export const updateInfoGroup = (params) => { return request2.post(`${baseUrl}/mms/ad/info/group/update`, params) };                                                                          //信息流广告组
export const delInfoGroup = (params) => { return request2.post(`${baseUrl}/mms/ad/info/group/del`, params) };                                                                          //信息流广告组
export const getSdkList = (params) => { return request2.post(`${baseUrl}/mms/ad/sdk/get`, params) };                                                                          //信息流广告组
export const getPosition = (params) => { return request2.post(`${baseUrl}/mms/ad/space/get`, params) };                                                                          //信息流广告组

//右下角广告
export const getCorner = (params) => { return request2.post(`${baseUrl}/mms/ad/corner/get`, params) };                                                                          //信息流广告组
export const getChannelTag = (params) => { return request2.post(`${baseUrl}/mms/channel/tag/get`, params) };                                                                          //信息流广告组
export const updateCorner = (params) => { return request2.post(`${baseUrl}/mms/ad/corner/update`, params) };                                                                          //信息流广告组
export const addCorner = (params) => { return request2.post(`${baseUrl}/mms/ad/corner/add`, params) };                                                                          //信息流广告组
export const delCorner = (params) => { return request2.post(`${baseUrl}/mms/ad/corner/del`, params) };                                                                          //信息流广告组



//标签配置
export const requestNewAdTagList = (params) => { return request2.get(`${baseUrl}/mms/ad/new/tag/get`, { params: params }) };                                                                //新版 获取用户标签列表
export const getGroup = (params) => { return request2.post(`${baseUrl}/mms/dict/cp/group/getInfo`, params) };                                                                //新版 获取用户标签列表
export const requestNewAdTagCreate = (params) => { return request2.post(`${baseUrl}/mms/ad/new/tag/add`, params) };                                                                         //新版 创建用户标签数据
export const requestNewAdTagUpdate = (params) => { return request2.post(`${baseUrl}/mms/ad/new/tag/update`, params) };                                                                      //新版 更新用户标签规则
export const requestNewAdTagRecord = (params) => { return request2.post(`${baseUrl}/mms/ad/new/tag/record`, params) };                                                                      //新版 更新用户标签规则
export const requestNewAdTagDelete = (params) => { return request2.post(`${baseUrl}/mms/ad/new/tag/del`, params) };                                                                         //新版 删除用户标签规则
export const requestDictionary = (params) => { return request2.post(`${baseUrl}/mms/config/dictionary/get`, params) };                                                                      //获取 字典数据源
export const requestAdFieldList = (params) => { return request2.post(`${baseUrl}/mms/dict/tagDic/get`, params) };                                                                           //获取Field列表
export const adListSync = (params) => { return request2.post(`${baseUrl}/mms/ad/newGroup/sync`, params) };                                                                                  //获取Field列表
export const adRightKeyUpdate = (params) => { return request2.post(`${baseUrl}/mms/ad/adRightKey/update`, params) };                                                                        //更新右键运营为
export const screenUpdate = (params) => { return request2.post(`${baseUrl}/mms/ad/screen/update`, params) };                                                                                //更新屏显素材
export const screenDel = (params) => { return request2.post(`${baseUrl}/mms/ad/screen/del`, params) };                                                                                      //删除屏显素材
export const adRightKeyDel = (params) => { return request2.delete(`${baseUrl}/mms/ad/adRightKey/del`, { params: params }) };                                                               //删除屏显素材
export const adRightKeySync = (params) => { return request2.post(`${baseUrl}/mms/ad/adRightKey/sync`, params) };                                                             //素材混村
export const screenCopy = (params) => { return request2.post(`${baseUrl}/mms/ad/screen/copy`, params) };                                                             //素材混村
export const adRightKeyCopy = (params) => { return request2.post(`${baseUrl}/mms/ad/adRightKey/copy`, params) };                                                             //素材混村

//  转转管理------赚赚激励气泡
export const getEarnTskList = (params) => { return request2.get(`${baseUrl}/mms/bubbletask/list`, { params: params }); };  // 获取转转激励任务列表
export const addEarnTskList = (params) => { return request.post(`${baseUrl}/mms/bubbletask/add`, params) };            // 新增转转激励任务
export const updateEarnTskList = (params) => { return request.post(`${baseUrl}/mms/bubbletask/update`, params) };      // 更新转转激励任务
export const deleteEarnTskList = (params) => { return request.get(`${baseUrl}/mms/bubbletask/del`, { params: params }) };         // 删除转转激励任务
export const syncEarnTskList = (params) => { return request2.post(`${baseUrl}/mms/bubbletask/sync`, params) };          // 同步缓存转转激励任务

//赚赚管理---体现商品列表 
export const getZzItemList = (params) => { return request2.post(`${baseUrl}/mms/zzItem/list`, params) };          // 获取体现商品列表
export const editZzItemList = (params) => { return request2.post(`${baseUrl}/mms/zzItem/edit`, params) };          // 编辑体现商品列表
export const addZzItemList = (params) => { return request2.post(`${baseUrl}/mms/zzItem/create`, params) };          // 编辑体现商品列表
export const deleteZzItemList = (params) => { return request2.get(`${baseUrl}/mms/zzItem/deleteItem`, { params: params }) };          // 编辑体现商品列表
export const changeZzItemList = (params) => { return request2.get(`${baseUrl}/mms/zzItem/changeState`, { params: params }) };          // 编辑体现商品列表
export const syncZzItemList = (params) => { return request2.get(`${baseUrl}/mms/zzItem/syncCache`, { params: params }) };          // 编辑体现商品列表
export const rsZzItemList = (params) => { return request2.get(`${baseUrl}/mms/zzItem/rs`, { params: params }) };          // 刷新库存
//赚赚管理---刷新库存
export const getRefresh = (params) => { return request2.post(`${baseUrl}/mms/zzItemTicker/list`, params) };          // 获取库存列表
export const addRefresh = (params) => { return request2.post(`${baseUrl}/mms/zzItemTicker/store`, params) };          // 编辑和新增库存列表
export const changeRefresh = (params) => { return request2.get(`${baseUrl}/mms/zzItemTicker/changeState`, { params: params }) };          // 编辑和新增库存列表
export const delRefresh = (params) => { return request2.get(`${baseUrl}/mms/zzItemTicker/deleteItem`, { params: params }) };          // 编辑和新增库存列表
//赚赚管理 ---随机提现配置 
export const getZZShow = (params) => { return request2.get(`${baseUrl}/mms/zz/show`, { params: params }) };
export const saveZZShow = (params, header) => { return request2.post(`${baseUrl}/mms/zz/store?key=${header.key}`, params) };
export const syncZZShow = (params) => { return request2.get(`${baseUrl}/mms/zz/syncCache`, { params: params }) };


//白名单配置
export const addWhite = (params) => { return request2.post(`${baseUrl}/mms/ad/whitelist/add`, params) };          // 新增白名单配置
export const listWhite = (params) => { return request2.get(`${baseUrl}/mms/ad/whitelist/list`, { params: params }) };          // 获取白名单配置
export const updateWhite = (params) => { return request2.post(`${baseUrl}/mms/ad/whitelist/update`, params) };          // 更新白名单配置
export const deleteWhite = (params) => { return request2.post(`${baseUrl}/mms/ad/whitelist/delete`, params) };          // 删除白名单配置
export const syncWhite = (params) => { return request2.post(`${baseUrl}/mms/ad/whitelist/sync`, params) };          // 同步
//电视节目单配置
export const getProgramAppConfig = (params) => { return request2.get(`${baseUrl}/mms/programApp/programAppConfig/get`, { params: params }) };          // 获取电视节目单配置列表
export const updateProgramAppConfig = (params) => { return request2.post(`${baseUrl}/mms/programApp/programAppConfig/update`, params) };          // 更新电视节目单列表
export const syncProgramAppConfig = (params) => { return request2.get(`${baseUrl}/mms/sync/programAppConfig`, { params: params }) };          // 更新电视节目单列表

// 抽奖活动 
export const getPActivityList = (params) => { return request.get(`${baseUrl}/mms/activity/truntable/list`, { params: params }); };        // 获取列表
export const updatePActivity = (params) => { return request.post(`${baseUrl}/mms/activity/truntable/update`, params); };                  // 修改活动
export const updatePActivityStatus = (params) => { return request.get(`${baseUrl}/mms/activity/truntable/status`, { params: params }); }; // 上下线活动
export const addPActivity = (params) => { return request.post(`${baseUrl}/mms/activity/truntable/add`, params); };                        // 新增
export const removePActivity = (params) => { return request.get(`${baseUrl}/mms/activity/truntable/del`, { params: params }); };         // 删除
export const goodsRealStock = (params) => { return request.get(`${baseUrl}/mms/activity/truntable/realStock`, { params: params }); };    // 对应的商品实时库存
export const syncPActivity = (params) => { return request.get(`${baseUrl}/mms/activity/truntable/sync`, { params: params }); };          // 同步缓存

// 商品配置
export const getPProductList = (params) => { return request.get(`${baseUrl}/mms/activity/truntable/goods`, { params: params }); };       // 商品列表
export const delgoodsList = (params) => { return request.get(`${baseUrl}/mms/activity/truntable/delgoods`, { params: params }); };       // 删除商品
export const addPActivityGoods = (params) => { return request.post(`${baseUrl}/mms/activity/truntable/addgoods`, params); };              // 新增商品
export const updateGoods = (params) => { return request.post(`${baseUrl}/mms/activity/truntable/updategoods`, params); };                 // 编辑商品



//源失效推推荐
export const getSource = (params) => { return request.post(`${baseUrl}/mms/channel/sourceInvalidRecommend/get`, params); };                 // 获取源失效推荐
export const addSource = (params) => { return request.post(`${baseUrl}/mms/channel/sourceInvalidRecommend/add`, params); };                 // 新增源失效推荐
export const updateSource = (params) => { return request.post(`${baseUrl}/mms/channel/sourceInvalidRecommend/update`, params); };                 // 更新源失效推荐
export const delSource = (params) => { return request.post(`${baseUrl}/mms/channel/sourceInvalidRecommend/del`, params); };                 // 删除源失效推荐
export const syncSource = (params) => { return request.get(`${baseUrl}/mms/channel/sourceInvalidRecommend/sync`, { params: params }); };                 // 同步缓存-源失效推荐
export const copySource = (params) => { return request.post(`${baseUrl}/mms/channel/sourceInvalidRecommend/copy`, params); };                 // 复制源失效推荐




//节目单视频集配置
export const getProgramlist = (params) => { return request.get(`${baseUrl}/mms/channel/svcollection/programlist`, { params: params }); };                 // 节目单视频集列表
export const getShortList = (params) => { return request.get(`${baseUrl}/mms/channel/svcollection/list`, { params: params }); };                 // 短视频视频集列表
export const addProgramList = (params) => { return request.post(`${baseUrl}/mms/channel/svcollection/programadd`, params); };                 // 短视频视频集列表
export const uploadProgramList = (params) => { return request.post(`${baseUrl}/mms/channel/svcollection/programupdate`, params); };                 // 短视频视频集列表
export const getDetailProgram = (params) => { return request.get(`${baseUrl}/mms/channel/home/text/program`, { params: params }); };                 // 获取节目单信息
export const getProgramInfo = (params) => { return request.get(`${baseUrl}/mms/channel/svcollection/programinfo`, { params: params }); };                 // 节目单视频集详情
export const delProgramList = (params) => { return request.get(`${baseUrl}/mms/channel/svcollection/programdel`, { params: params }); };                 // 删除节目单
export const syncProgramList = (params) => { return request.get(`${baseUrl}/mms/channel/svcollection/programsync`, { params: params }); };                 // 同步
export const addShortList = (params) => { return request.post(`${baseUrl}/mms/channel/svcollection/add`, params); };                 // 同步
export const searchShortList = (params) => { return request.get(`${baseUrl}/mms/shortVideo/searchbyid`, { params: params }); };                 // 同步
export const updateShortList = (params) => { return request.post(`${baseUrl}/mms/channel/svcollection/update`,params); };                 // 同步
export const delShortList = (params) => { return request.get(`${baseUrl}/mms/channel/svcollection/del`,{ params: params }); };                 // 同步
export const getSuggest = (params) => { return request.get(`${baseUrl}/mms/channel/home/suggest/list`,{ params: params }); };                 // 首页为你推荐列表
export const addSuggest = (params) => { return request2.post(`${baseUrl}/mms/channel/home/suggest/add`,params); };                 // 首页为你推荐列表
export const updateSuggest = (params) => { return request2.post(`${baseUrl}/mms/channel/home/suggest/update`,params); };                 // 首页为你推荐列表
export const syncSuggest = (params) => { return request.get(`${baseUrl}/mms/channel/home/suggest/sync`,{ params: params }); };                 // 首页为你推荐列表同步
export const getSuggestInfo = (params) => { return request2.get(`${baseUrl}/mms/channel/home/suggest/getBaseInfo`,{ params: params }); };                 // 首页为你推荐基本信息获取
export const setSuggestInfo = (params) => { return request2.post(`${baseUrl}/mms/channel/home/suggest/setBaseInfo`,params); };                 // 首页为你推荐基本信息获取
//首页文字轮播配置
export const getWordsConfig = (params) => { return request.get(`${baseUrl}/mms/channel/home/text/list`, { params: params }); };                 // 首页文字轮播配置列表
export const uploadWordsConfig = (params) => { return request.post(`${baseUrl}/mms/channel/home/text/update`, params); };                 // 首页文字轮播配置列表
export const addWordsConfig = (params) => { return request.post(`${baseUrl}/mms/channel/home/text/add`, params); };                 // 首页文字轮播配置列表
export const delWordsConfig = (params) => { return request.get(`${baseUrl}/mms/channel/home/text/del`, { params: params }); };                 // 首页文字轮播配置列表
export const getImageWordsConfig = (params) => { return request.get(`${baseUrl}/mms/channel/home/text/image`, { params: params }); };                 // 首页文字轮播配置列表
export const setImageWordsConfig = (params) => { return request.get(`${baseUrl}/mms/channel/home/text/uploadimage`, { params: params }); };                 // 首页文字轮播配置列表
export const syncWordsConfig = (params) => { return request.get(`${baseUrl}/mms/channel/home/text/sync`, { params: params }); };                 // 首页文字轮播配置列表



//首页直播配置
export const getHomeList = (params) => { return request.get(`${baseUrl}/mms/channel/home/channel/list`,{ params: params }); };                 // 首页直播配置列表
export const uploadHomeList = (params) => { return request2.post(`${baseUrl}/mms/channel/home/channel/update`,params); };                 // 首页直播配置列表
export const addHomeList = (params) => { return request2.post(`${baseUrl}/mms/channel/home/channel/add`,params); };                 // 首页直播配置列表新增
export const delHomeList = (params) => { return request2.get(`${baseUrl}/mms/channel/home/channel/del`,{params:params}); };                 // 首页直播配置列表新增
export const getStateHomeList = (params) => { return request.get(`${baseUrl}/mms/channel/home/channel/status`,{ params: params }); };                 // 首页直播配置列表
export const setStateHomeList = (params) => { return request.get(`${baseUrl}/mms/channel/home/channel/setstatus`,{ params: params }); };                 // 首页直播配置列表
export const syncHomeList = (params) => { return request.get(`${baseUrl}/mms/channel/home/channel/sync`,{ params: params }); };                 // 首页直播配置列表
export const getHomeBaseInfo = (params) => { return request2.get(`${baseUrl}/mms/channel/home/channel/getBaseInfo`,{ params: params }); };                 // 首页为你推荐基本信息获取
export const getAllBaseInfo = (params) => { return request2.get(`${baseUrl}/mms/channel/home/channel/getAllBaseInfo`,{ params: params }); };                 // 首页全部直播基本信息获取
export const addTab = (params) => { return request2.post(`${baseUrl}/mms/channel/home/channel/newBaseInfo`,params); };                 // 首页直播新增加tab
export const setHomeBaseInfo = (params) => { return request2.post(`${baseUrl}/mms/channel/home/channel/setBaseInfo`,params); };                 // 首页直播基本信息配置(原只状态设置）


//微信菜单
export const addWechatMenu = (params) => { return request.post(`${baseUrl}/mms/wx/menu/new/add`, params); };                 // 创建菜单
export const getWechatMenu = (params) => { return request2.get(`${baseUrl}/mms/wx/menu/new/get`, { params: params }); };                 // 获取菜单
export const delWechatMenu = (params) => { return request2.get(`${baseUrl}/mms/wx/menu/new/delete`, { params: params }); };                 // 删除菜单
export const getWxlist = (params) => { return request2.get(`${baseUrl}/mms/wx/menu/new/wxlist`, { params: params }); };                 // 获取菜单
export const setMenuState = (params) => { return request2.get(`${baseUrl}/mms/wx/menu/new/status`, { params: params }); };                 // 设置菜单状态
export const uploadWechatMenu = (params) => { return request.post(`${baseUrl}/mms/wx/menu/new/update`, params); };           // 编辑菜单

//微信个性化群发
export const preSend = (params) => { return request2.post(`${baseUrl}/mms/wx/push/preview`,params); };           // 微信群发预览
export const addSend = (params) => { return request2.post(`${baseUrl}/mms/wx/push/add`,params); };           // 新建微信群发
export const materialSend = (params) => { return request2.post(`${baseUrl}/mms/wx/push/material`,params); };           // 获取微信图文素材
export const wechatMaterialSend = (params) => { return request2.post(`${baseUrl}/mms/wx/push/drafts`,params); };           // 获取微信草稿箱
export const getSend = (params) => { return request2.get(`${baseUrl}/mms/wx/push/list`,{ params: params }); };           // 群发列表
export const everySend = (params) => { return request2.get(`${baseUrl}/mms/wx/push/data`,{ params: params }); };           // 微信群发结束后的统计结果
export const cancelSend = (params) => { return request2.get(`${baseUrl}/mms/wx/push/cancel`,{ params: params }); };           // 取消预约推送
export const reSend = (params) => { return request2.get(`${baseUrl}/mms/wx/push/resend`,{ params: params }); };           // 取消推送重发
export const delSend = (params) => { return request2.get(`${baseUrl}/mms/wx/push/delete`,{ params: params }); };           // 撤销发送


//微信粉丝
export const getFansTagList = (params) => { return request2.post(`${baseUrl}/mms/wx/fansTag/list`, params); };           // 获取微信标签详情列表
export const addFansTag = (params) => { return request2.post(`${baseUrl}/mms/wx/fansTag/add`, params); };           // 新增粉丝标签
export const updateFansTag = (params) => { return request2.post(`${baseUrl}/mms/wx/fansTag/update`, params); };           // 更新粉丝标签
export const delFansTag = (params) => { return request2.post(`${baseUrl}/mms/wx/fansTag/del`, params); };           // 删除粉丝标签
export const getFansTag = (params) => { return request2.post(`${baseUrl}/mms/wx/fansTag/get`, params); };           // 粉丝标签列表


//火星开机进入 
export const getMarsList = (params) => { return request.get(`${baseUrl}/mms/ad/marsStartup/get`, { params: params }); };                 // 获取
export const addMarsList = (params) => { return request2.post(`${baseUrl}/mms/ad/marsStartup/add`, params); };                 // 获取
export const uploadMarsList = (params) => { return request2.post(`${baseUrl}/mms/ad/marsStartup/update`, params); };                 // 获取
export const delMarsList = (params) => { return request.get(`${baseUrl}/mms/ad/marsStartup/del`, { params: params }); };                 // 获取



//赚赚限时任务
export const addEnterChannel = (params) => { return request2.post(`${baseUrl}/mms/config/vipBootChannelConfig/add`, params); };                 // 添加会员开机进入频道配置
export const getEnterChannel = (params) => { return request2.post(`${baseUrl}/mms/config/vipBootChannelConfig/get`, params); };                 // 查询会员开机进入频道配置
export const delEnterChannel = (params) => { return request2.delete(`${baseUrl}/mms/config/vipBootChannelConfig/del`, { params: params }); };                 // 会员开机进入频道配置 - 删除
export const uploadEnterChannel = (params) => { return request2.put(`${baseUrl}/mms/config/vipBootChannelConfig/update`, params); };                 // 更新会员开机进入频道配置
export const syncEnterChannel = (params) => { return request2.get(`${baseUrl}/mms/config/vipBootChannelConfig/sync`, { params: params }); };                 // 同步会员开机进入频道配置

//开机启动图配置
export const getPowerBoot = (params) => { return request2.post(`${baseUrl}/mms/tv/powerBoot/list`,params); };                 // 开机启动-列表
export const addPowerBoot = (params) => { return request2.post(`${baseUrl}/mms/tv/powerBoot/create`,params); };                 // 开机启动-列表
export const editPowerBoot = (params) => { return request2.post(`${baseUrl}/mms/tv/powerBoot/edit`,params); };                 // 开机启动-列表
export const delPowerBoot = (params) => { return request2.get(`${baseUrl}/mms/tv/powerBoot/deleteItem`,{params:params}); };                 // 开机启动-列表
export const changePowerBoot = (params) => { return request2.get(`${baseUrl}/mms/tv/powerBoot/changeState`,{params:params}); };                 // 开机启动-列表
export const syncPowerBoot = (params) => { return request2.get(`${baseUrl}/mms/tv/powerBoot/syncCache`,{params:params}); };                 // 开机启动-列表


//好看分类
export const getHkCategory = (params) => { return request2.post(`${baseUrl}/mms/tv/hkCategory/list`,params); };                 // 开机启动-列表
export const addHkCategory = (params) => { return request2.post(`${baseUrl}/mms/tv/hkCategory/create`,params); };                 // 开机启动-列表
export const editHkCategory = (params) => { return request2.post(`${baseUrl}/mms/tv/hkCategory/edit`,params); };                 // 开机启动-列表
export const delHkCategory = (params) => { return request2.get(`${baseUrl}/mms/tv/hkCategory/deleteItem`,{params:params}); };                 // 开机启动-列表
export const changeHkCategory = (params) => { return request2.get(`${baseUrl}/mms/tv/hkCategory/changeState`,{params:params}); };                 // 开机启动-列表
export const switchHkCategory = (params) => { return request2.get(`${baseUrl}/mms/tv/hkCategory/switch`,{params:params}); };                 // 开机启动-列表
export const syncHkCategory = (params) => { return request2.get(`${baseUrl}/mms/tv/hkCategory/syncCache`,{params:params}); };                 // 开机启动-列表



//体育频道视频集配置
export const getChannelSport = (params) => { return request2.post(`${baseUrl}/mms/channel/channelSport/svcList`, params); };                 // 配置管理-体育频道视频集配置-列表
export const addChannelSport = (params) => { return request2.post(`${baseUrl}/mms/channel/channelSport/svcAdd`, params); };                 // 配置管理-体育频道视频集配置-添加
export const delChannelSport = (params) => { return request2.get(`${baseUrl}/mms/channel/channelSport/svcRemove`, { params: params }); };                 // 配置管理-体育频道视频集配置-移除
export const resetChannelSport = (params) => { return request2.get(`${baseUrl}/mms/channel/channelSport/svcResort`, { params: params }); };                 // 配置管理-体育频道视频集配置-重新生成排序序号
export const syncChannelSport = (params) => { return request2.get(`${baseUrl}/mms/channel/channelSport/svcSyncCache`, { params: params }); };                 // 配置管理-体育频道视频集配置-数据同步
export const sortChannelSport = (params) => { return request2.post(`${baseUrl}/mms/channel/channelSport/svcChangeSort`, params); };                 // 配置管理-体育频道视频集配置-排序



//企业微信
export const getQrcodeConfig = (params) => { return request2.get(`${baseUrl}/mms/wx/qrcode/configs`,{params:params}); };                 // 获取登录、解锁二维码配置
export const saveQrcodeConfig = (params) => { return request2.post(`${baseUrl}/mms/wx/qrcode/saveconfig`,params); };                 // 保存登录、解锁二维码配置
export const getWechatUser = (params) => { return request2.get(`${baseUrl}/mms/wx/qrcode/qywechatuser`,{params:params}); };                 // 企业微信客服列表
export const getMyWechatUser = (params) => { return request2.get(`${baseUrl}/mms/wx/qrcode/listreluser`,{params:params}); };                 // 易添加企业微信客服列表
export const syncMyWechatUser = (params) => { return request2.get(`${baseUrl}/mms/wx/qrcode/syncconfig`,{params:params}); };                 // 易添加企业微信客服列表sync
export const syncQrcodeConfig = (params) => { return request2.get(`${baseUrl}/mms/wx/qrcode/syncusers`,{params:params}); };                 // 同步企业微信数据到我们的库中
export const saveMyWechatUser = (params) => { return request2.post(`${baseUrl}/mms/wx/qrcode/savereluser`,params); }; 
export const getWechatList = (params) => { return request2.get(`${baseUrl}/mms/wx/qywechat/codes`,{params:params}); };  //获取企业微信列表
export const getCount = (params) => { return request2.get(`${baseUrl}/mms/wx/qrcode/listrelcount`,{params:params}); };  //企业微信客服解锁使用次数
export const getexcluswitch = (params) => { return request2.get(`${baseUrl}/mms/wx/qrcode/getexcluswitch`,{params:params}); };  //企业微信客服解锁
export const setexcluswitch = (params) => { return request2.get(`${baseUrl}/mms/wx/qrcode/setexcluswitch`,{params:params}); };  //企业微信客服解锁使用次数


// 易添加企业微信客服列表更新
export const getWelcome = (params) => { return request2.get(`${baseUrl}/mms/wx/qywechat/listwelcome`,{params:params}); };                 // 易添加企业微信客服列表更新
export const addWelcome = (params) => { return request2.post(`${baseUrl}/mms/wx/qywechat/addwelcome`,params); };                 // 易添加企业微信客服列表新增
export const saveWelcome = (params) => { return request2.post(`${baseUrl}/mms/wx/qywechat/savewelcome`,params); };                 // 易添加企业微信客服列表更新
export const delWelcome = (params) => { return request2.get(`${baseUrl}/mms/wx/qywechat/delwelcome`,{params:params}); };                 // 易添加企业微信客服列表更新
export const changeWelcome = (params) => { return request2.get(`${baseUrl}/mms/wx/qywechat/welcomestatus`,{params:params}); };                 // 易添加企业微信客服列表状态改变
export const uploadImage = (params,form,header) => { return request2.post(`${baseUrl}/mms/wx/qywechat/uploadimg?qywechatCode=${params.qywechatCode}`,form,{headers: header}); };                 // 上传图片

//企微标签
export const synctags = (params) => { return request2.get(`${baseUrl}/mms/wx/qywechat/synctags`,{params:params}); };          //同步企业微信企业标签
export const corptags = (params) => { return request2.get(`${baseUrl}/mms/wx/qywechat/corptags`,{params:params}); };          //获取企业微信标签
export const addcorptagtask = (params) => { return request2.post(`${baseUrl}/mms/wx/qywechat/addcorptagtask`,params); };          //同步企业微信企业标签
export const corptagtasks = (params) => { return request2.get(`${baseUrl}/mms/wx/qywechat/corptagtasks`,{params:params}); };          //企业微信标签任务列表
export const corptagtaskstatus = (params) => { return request2.get(`${baseUrl}/mms/wx/qywechat/corptagtaskstatus`,{params:params}); };          //企业微信标签任务上下线
export const delcorptagtask = (params) => { return request2.get(`${baseUrl}/mms/wx/qywechat/delcorptagtask`,{params:params}); };          //企业微信标签删除



//移动端节目单屏蔽
export const getShieldList = (params) => { return request2.get(`${baseUrl}/mms/channel/programs/listAllPrograms`,{params:params}); };          //查询节目单
export const delShieldList = (params) => { return request2.post(`${baseUrl}/mms/channel/programs/delBlackProgram`,params); };                  //删除黑名单节目
export const addShieldList = (params) => { return request2.post(`${baseUrl}/mms/channel/programs/addBlackProgram`,params); };          //添加节目到黑名单


//家庭相册传照片配置
export const getActivityConfig = (params) => { return request2.post(`${baseUrl}/mms/album/config/upload/guideActivity/list`,params); };          //引导上传照片活动配置 - 查
export const addActivityConfig = (params) => { return request2.post(`${baseUrl}/mms/album/config/upload/guideActivity/add`,params); };          //引导上传照片活动配置 - 增加
export const updateActivityConfig = (params) => { return request2.post(`${baseUrl}/mms/album/config/upload/guideActivity/update`,params); };          //引导上传照片活动配置 - 更新
export const delActivityConfig = (params) => { return request2.get(`${baseUrl}/mms/album/config/upload/guideActivity/del`,{params:params}); };          //引导上传照片活动配置 - 删
export const syncActivityConfig = (params) => { return request2.get(`${baseUrl}/mms/album/config/upload/guideActivity/sync`,{params:params}); };          //引导上传照片活动配置 - 缓存同步

//  好剧专题
export const specialList = (params) => { return request.get(`${baseUrl}/mms/channel/home/special/list`,{params:params}); };       // 专题列表
export const specialAdd = (params) => { return request.post(`${baseUrl}/mms/channel/home/special/add`,params); };       // 新增专题
export const specialGetBaseInfo = (params) => { return request.get(`${baseUrl}/mms/channel/home/special/getBaseInfo`,{params:params}); };       // 获取专题标题
export const specialSetBaseInfo = (params) => { return request.post(`${baseUrl}/mms/channel/home/special/setBaseInfo`,params); };       // 设置专题标题
export const specialStatus = (params) => { return request.get(`${baseUrl}/mms/channel/home/special/status`,{params:params}); };       // 获取专题标题
export const specialSync = (params) => { return request.get(`${baseUrl}/mms/channel/home/special/sync`,{params:params}); };       // 专题同步
export const specialUpdate = (params) => { return request.post(`${baseUrl}/mms/channel/home/special/update`,params); };       // 修改专题
export const specialDelete = (params) => { return request.get(`${baseUrl}/mms/channel/home/special/del`,{params:params}); };       // 专题删除
export const specialChangepos = (params) => { return request.get(`${baseUrl}/mms/channel/home/special/changepos`,{params:params}); };       // 设置专题排序
export const specialResort = (params) => { return request.get(`${baseUrl}/mms/channel/home/special/resort`,{params:params}); };       // 专题重排序


//移动端节目单屏蔽
export const getCategories = (params) => { return request.get(`${baseUrl}/mms/channel/programs/getCategories`,{params:params}); };       // 节目类型 
export const getlistAllPrograms = (params) => { return request.get(`${baseUrl}/mms/channel/programs/listAllPrograms`,{params:params}); };       // 列表-节目单
export const getCategoriesDetail = (params) => { return request.get(`${baseUrl}/mms/channel/programs/${params.id}`,{params:params}); };       // 详情-节目单
export const categoriesUpdate = (programeId,params) => { return request.put(`${baseUrl}/mms/channel/programs/${programeId}`, params) }; 


// 马甲包
export const getArmourPackage = (params) => { return request2.post(`${baseUrl}/mms/armourPackage/list`,params); };          //引导上传照片活动配置 - 缓存同步
export const addArmourPackage = (params) => { return request2.post(`${baseUrl}/mms/armourPackage/create`,params); };          //引导上传照片活动配置 - 缓存同步
export const delArmourPackage = (params) => { return request2.get(`${baseUrl}/mms/armourPackage/delete`,{params:params}); };          //引导上传照片活动配置 - 缓存同步
export const editArmourPackage = (params) => { return request2.post(`${baseUrl}/mms/armourPackage/edit`,params); };          //引导上传照片活动配置 - 缓存同步
export const copyArmourPackage = (params) => { return request2.get(`${baseUrl}/mms/armourPackage/copy`,{params:params}); };          //引导上传照片活动配置 - 缓存同步
export const syncArmourPackage = (params) => { return request2.get(`${baseUrl}/mms/armourPackage/sync`,{params:params}); };          //引导上传照片活动配置 - 缓存同步


//  微信登陆-专享配置
export const getconfigsLogin = (params) => { return request.get(`${baseUrl}/mms/wx/exclusive/list`, { params: params }); };     // 解锁配置列表
export const getconfigsstatus = (params) => { return request.get(`${baseUrl}/mms/wx/exclusive/status`, { params: params }); };     // 解锁配置上下线
export const getconfigsAdd = (params) => { return request.post(`${baseUrl}/mms/wx/exclusive/add`, params); };                 // 解锁配置添加
export const getconfigsUpdate = (params) => { return request.post(`${baseUrl}/mms/wx/exclusive/update`, params); };                 // 解锁配置更新
export const getconfigsDelete = (params) => { return request.get(`${baseUrl}/mms/wx/exclusive/delete`, { params: params }); };     // 解锁配置删除
export const getconfigsSync = (params) => { return request.get(`${baseUrl}/mms/wx/exclusive/sync`, { params: params }); };     // 解锁配置同步

// 登录(专享)配置
export const listextraGet = (params) => { return request.get(`${baseUrl}/mms/wx/qrcode/listextra`, { params: params }); };     // 解锁二维码文案描述
export const setextra = (params) => { return request.post(`${baseUrl}/mms/wx/qrcode/setextra`, params); };                 // 设置解锁二维码文案描述
export const bigwechatsPublic = (params) => { return request.get(`${baseUrl}/mms/wx/qrcode/bigwechats`, { params: params }); };     // 公众号大号的列表
//下线节目
export const getOfflineProgram = (params) => { return request2.post(`${baseUrl}/mms/offline/program/get`,params); };          //下线节目列表
export const getApkList = (params) => { return request2.post(`${baseUrl}/mms/offline/apk/get`,params); };          //下线节目列表
export const getOfflineChannel = (params) => { return request2.post(`${baseUrl}/mms/offline/channel/get`,params); };          //下线节目列表
export const updateOfflineTime = (params) => { return request2.post(`${baseUrl}/mms/offline/schedule/update`,params); };          //下线节目列表
export const delOfflineChannel = (params) => { return request2.post(`${baseUrl}/mms/offline/channel/del`,params); };          //删除频道
export const addOfflineChannel = (params) => { return request2.post(`${baseUrl}/mms/offline/channel/add`,params); };          //删除频道
export const updateOfflineChannel = (params) => { return request2.post(`${baseUrl}/mms/offline/channel/update`,params); };          //删除频道
export const updateOfflineProgram = (params) => { return request2.post(`${baseUrl}/mms/offline/program/update`,params); };          //删除频道
export const copyOfflineProgram = (params) => { return request2.post(`${baseUrl}/mms/offline/program/copy`,params); };          //删除频道
export const addOfflineProgram = (params) => { return request2.post(`${baseUrl}/mms/offline/program/add`,params); };          //删除频道
export const delOfflineProgram = (params) => { return request2.post(`${baseUrl}/mms/offline/program/del`,params); };          //删除频道
export const syncOfflineProgram = (params) => { return request2.get(`${baseUrl}/mms/sync/offline`,{params:params}); };          //删除频道


//风险设备
export const getRiskConfig = (params) => { return request2.get(`${baseUrl}/mms/offline/program/risk/config`,{params:params}); };          //删除频道
export const editRiskConfig = (params) => { return request2.post(`${baseUrl}/mms/offline/program/risk/config`,params); };          //删除频道

//支付成功页面
export const getAdSPList = (params) => { return request2.post(`${baseUrl}/mms/ad/adSP/list`,params); };          //查看支付成功列表
export const addAdSPList = (params) => { return request2.post(`${baseUrl}/mms/ad/adSP/create`,params); };          //查看支付成功列表
export const updateAdSPList = (params) => { return request2.post(`${baseUrl}/mms/ad/adSP/update`,params); };          //查看支付成功列表
export const delAdSPList = (params) => { return request2.get(`${baseUrl}/mms/ad/adSP/del`,{params:params}); };          //查看支付成功列表
export const syncAdSPList = (params) => { return request2.get(`${baseUrl}/mms/sync/ad`,{params:params}); };          //查看支付成功列表


//tv菜单配置
export const getMenuList = (params) => { return request2.post(`${baseUrl}/mms/tv/menu/list`,params); };          //菜单配置列表
export const addMenuList = (params) => { return request2.post(`${baseUrl}/mms/tv/menu/create`,params); };          //菜单配置列表
export const updateMenuList = (params) => { return request2.put(`${baseUrl}/mms/tv/menu/${params.id}`,params); };          //菜单配置列表
export const delMenuList = (params) => { return request2.delete(`${baseUrl}/mms/tv/menu/${params.id}`,params); };          //菜单配置列表
export const syncMenuList = (params) => { return request2.get(`${baseUrl}/mms/tv/menu/syncCache`,{params:params}); };          //菜单配置列表


//apk配置
export const requestApkConfigAdd = (params) => { return request2.post(`${baseUrl}/mms/apk/add`, params); };               //新增apk
export const requestApkConfigSync = (params) => { return request2.post(`${baseUrl}/mms/apk/sync`, params); };             //同步apk配置
export const requestApkConfigDelete = (params) => { return request2.get(`${baseUrl}/mms/apk/delete`, { params: params }); };          //删除apk配置
export const requestApkConfigList = (params) => { return request2.get(`${baseUrl}/mms/apk/list`, { params: params }); };              //apk配置列表


//芒果专区
export const getMangoList = (params) => { return request2.get(`${baseUrl}/mms/config/common/list`,{params:params}); };                //芒果专区-相关模块数据-获取
export const addMangoList = (params) => { return request2.post(`${baseUrl}/mms/config/common/add?key=${params.key}`,params); };       //芒果专区-相关模块数据-新建
export const addMangoUpdate = (params) => { return request2.post(`${baseUrl}/mms/config/common/update?key=${params.key}&id=${params.indexId}`,params); };          //芒果专区-相关模块数据-更新
export const delMango = (params) => { return request2.post(`${baseUrl}/mms/config/common/delete?key=${params.key}&id=${params.id}`,params); };          //芒果专区-相关模块数据-删除
export const getMangoSync = (params) => { return request2.get(`${baseUrl}/mms/config/common/syn_slice?key=${params.key}`); };          //芒果专区-相关模块数据-缓存同步 ,{params:params}
export const addMangosearch = (params) => { return request.post(`${baseUrl}/mms/mgtv/video/searchAll`,params); };       //媒资库视频模糊搜索
export const updateMangoSort = (type,params) => { return request2.post(`${baseUrl}/mms/config/common/set?key=${type}`,params); };       //芒果专区-相关模块数据-新建
export const getSortList = (params) => { return request2.get(`${baseUrl}/mms/config/common/get`,{params:params}); };                //芒果专区-相关模块数据-获取
export const getMangoSyncTab = (params) => { return request2.get(`${baseUrl}/mms/config/common/syn_config?key=${params.key}`); };          //芒果专区-相关模块数据-tab排序缓存同步 ,{params:params}

// 获取用户相册照片
export const getlistPhoto = (params) => { return request.post(`${baseUrl}/mms/album/listPhoto`, params); };                 // 解锁配置更新


//tv专题页配置
export const getTopic = (params) => { return request2.get(`${baseUrl}/mms/channel/tvspecial/list`, {params:params}); };                 // 解锁配置更新
export const addTopic = (params) => { return request2.post(`${baseUrl}/mms/channel/tvspecial/add`, params); };                 // 解锁配置更新
export const updateTopic = (params) => { return request2.post(`${baseUrl}/mms/channel/tvspecial/update`, params); };                 // 解锁配置更新
export const delTopic = (params) => { return request2.get(`${baseUrl}/mms/channel/tvspecial/del`, {params:params}); };                 // 解锁配置更新
export const syncTopic = (params) => { return request2.get(`${baseUrl}/mms/channel/tvspecial/sync`, {params:params}); };                 // 解锁配置更新

//我的配置
export const getMine = (params) => { return request2.post(`${baseUrl}/mms/tv/myCenter/grid/list`, params); };                 // 我的配置列表
export const addMine = (params) => { return request2.post(`${baseUrl}/mms/tv/myCenter/grid/add`, params); };                 // 我的配置增加
export const editMine = (params) => { return request2.post(`${baseUrl}/mms/tv/myCenter/grid/edit`, params); };                 // 我的配置编辑
export const delMine = (params) => { return request2.post(`${baseUrl}/mms/tv/myCenter/grid/del`, params); };                 // 我的配置删除
export const getMineGrid = (params,query) => { return request2.post(`${baseUrl}/mms/tv/myCenter/grid/second/${query.id}/list`, params); };                 // 我的配置删除
export const addMineGrid = (params,query) => { return request2.post(`${baseUrl}/mms/tv/myCenter/grid/second/${query.id}/add`, params); };                 // 我的配置删除
export const editMineGrid = (params,query) => { return request2.post(`${baseUrl}/mms/tv/myCenter/grid/second/${query.id}/edit`, params); };                 // 我的配置删除
export const copyMineGrid = (params,query) => { return request2.post(`${baseUrl}/mms/tv/myCenter/grid/second/${query.id}/copy`, params); };                 // 我的配置删除
export const delMineGrid = (params) => { return request2.post(`${baseUrl}/mms/tv/myCenter/grid/second/del`, params); };                 // 我的配置删除
export const syncMineGrid = (params) => { return request2.get(`${baseUrl}/mms/tv/myCenter/grid/second/sync`, {params:params}); };                 // 我的配置删除


//退出登录
export const getLogout = (params) => { return request2.get(`${baseUrl}/mms/channel/logout/list`, {params:params}); };                 // 我的配置删除
export const addLogout = (params) => { return request2.post(`${baseUrl}/mms/channel/logout/add`, params); };                 // 我的配置删除
export const updateLogout = (params) => { return request2.post(`${baseUrl}/mms/channel/logout/update`, params); };                 // 我的配置删除
export const delLogout = (params) => { return request2.get(`${baseUrl}/mms/channel/logout/del`, {params:params}); };                 // 我的配置删除
export const syncLogout = (params) => { return request2.get(`${baseUrl}/mms/channel/logout/sync`, {params:params}); };                 // 我的配置删除
export const changeLogoutState = (params) => { return request2.get(`${baseUrl}/mms/channel/logout/status`, {params:params}); };                 // 我的配置删除

//频道搜索-->热门搜索
export const getHotChannel = (params) => { return request2.post(`${baseUrl}/mms/tv/hotRecommend/list`, params); };                 // 频道搜索列表
export const addHotChannel = (params) => { return request2.post(`${baseUrl}/mms/tv/hotRecommend/add`, params); };                 // 频道搜索增加
export const editHotChannel = (params) => { return request2.post(`${baseUrl}/mms/tv/hotRecommend/edit`, params); };                 // 频道搜索编辑
export const delHotChannel = (params) => { return request2.post(`${baseUrl}/mms/tv/hotRecommend/del`, params); };                 // 频道搜索删除
export const syncHotChannel = (params) => { return request2.get(`${baseUrl}/mms/tv/hotRecommend/sync`, {params:params}); };                 // 频道搜索列表

// 私域小程序配置
export const signGoodsList = (params) => { return request2.get(`${baseUrl}/mms/pd/integral/goods`, {params:params}); };                 // 商品列表
export const signGoodsDelete = (params) => { return request2.get(`${baseUrl}/mms/pd/integral/goodsDel`, {params:params}); };            // 删除商
export const signGoodsAdd = (params) => { return request2.post(`${baseUrl}/mms/pd/integral/goodsAdd`, params); };                 // 新增商品
export const signGoodsEdit = (params) => { return request2.post(`${baseUrl}/mms/pd/integral/goodsEdit`, params); };                 // 编辑商品
export const signCategory = (params) => { return request2.get(`${baseUrl}/mms/pd/integral/category`, {params:params}); };            // 获取商品分类
export const signCategoryAdd = (params) => { return request2.post(`${baseUrl}/mms/pd/integral/categoryAdd`, params); };                 // 添加商品分类
export const signCategoryEdit = (params) => { return request2.post(`${baseUrl}/mms/pd/integral/categoryEdit`, params); };                 // 编辑商品分类
export const signCategoryDel = (params) => { return request2.get(`${baseUrl}/mms/pd/integral/categoryDel`, {params:params}); };            // 删除商品分类(检测下分类下是否有商品
export const signRuleInfo = (params) => { return request2.get(`${baseUrl}/mms/pd/integral/ruleInfo`, {params:params}); };                 // 规则配置
export const signRuleEdit = (params) => { return request2.post(`${baseUrl}/mms/pd/integral/rule`, params); };                 // 修改规则配置
export const signExtra = (params) => { return request2.get(`${baseUrl}/mms/pd/integral/extra`, {params:params}); };                 // 获取额外配置
export const signExtraEdit = (params) => { return request2.post(`${baseUrl}/mms/pd/integral/extraEdit`, params); };                 // 编辑额外配置
export const signSync = (params) => { return request2.post(`${baseUrl}/mms/pd/integral/sync`, params); };                 // 同步缓存

export const signCalendarList = (params) => { return request.get(`${baseUrl}/mms/pd/calendar/list`, {params:params}); };                 // 指定月份的热点事件
export const signCalendarSave = (params) => { return request2.post(`${baseUrl}/mms/pd/calendar/save`, params); };                 // 增加/更新指定日期的热点事件配置
export const signCalendarClear = (params) => { return request2.post(`${baseUrl}/mms/pd/calendar/clear?day=${params.day}`, params); };                 // 清空指定日期的热点数据
export const signCalendarSync = (params) => { return request2.post(`${baseUrl}/mms/pd/calendar/sync?month=${params.month}`, params); };                 // 同步缓存

export const scoreExrecords = (params) => { return request.post(`${baseUrl}/mms/pd/integral/exrecords`, params) };   // 兑换记录
export const scoreRecordEdit = (params) => { return request.post(`${baseUrl}/mms/pd/integral/recordEdit`, params) };   // 更新兑换记录

//家庭相册活动管理
export const getAblum = (params) => { return request2.post(`${baseUrl}/mms/album/activity/billboard/list`,params); };                 // 我的配置删除
export const addAblum = (params) => { return request2.post(`${baseUrl}/mms/album/activity/billboard/add`, params); };                 // 我的配置删除
export const updateAblum = (params) => { return request2.post(`${baseUrl}/mms/album/activity/billboard/update`, params); };                 // 我的配置删除
export const delAblum = (params) => { return request2.get(`${baseUrl}/mms/album/activity/billboard/del`, {params:params}); };                 // 我的配置删除
export const syncAblum = (params) => { return request2.get(`${baseUrl}/mms/album/activity/billboard/sync`, {params:params}); };                 // 我的配置删除




//广告-二维码套餐类型
//========== 基础数据 老CMS平台中数据整理 ==========
//二维码类型
export const requestQrcodeTypes = () => {
    return new Promise((resolve, reject) => {
        let params = [
            { key: 1, value: '静态广告', },
            { key: 2, value: 'gif广告', },
            { key: 3, value: '支付', },
            { key: 4, value: '到期不支付', },
            { key: 5, value: '到期支付', },
            { key: 6, value: '红包', },
            { key: 7, value: '优惠券', },
            { key: 8, value: '宣传内容', },
            { key: 9, value: '家庭号' },
            { key: 10, value: '登录', },
            { key: 11, value: '小程序登录' },
            { key: 12, value: 'TV端尝鲜版专属' }
        ];
        resolve(params);
    });
}

//跳转类型
export const requestJumpTypes = () => {
    return new Promise((resolve, reject) => {
        let params = [
            { key: 1, value: '跳转到频道' },
            { key: 2, value: '跳转到下载' },
            { key: 3, value: '跳转到商品' },
            { key: 4, value: '跳转到活动' },
            { key: 5, value: '跳转到任务' },
            { key: 6, value: '跳转到菜单' },          //对应接口 requestJumpMenuTypes
            { key: 7, value: '跳转到二维码' },
            { key: 8, value: '跳转到好看分类' },      //对应接口 requestGoodLookTypes
        ];
        resolve(params);
    });
}

//跳转目录类型 跳转菜单类型 对应接口requestJumpTypes:6
export const requestJumpMenuTypes = () => {
    return new Promise((resolve, reject) => {
        let params = [
            { key: 1, value: '跳转到金币' },
            { key: 2, value: '跳转到手机' },
            { key: 3, value: '跳转到自建' },
            // { key: 4, value: '跳转到设置' },
            { key: 5, value: '跳转到联系' },
            { key: 6, value: '跳转到语音' },
            { key: 7, value: '跳转到套餐' },
            // { key: 8, value: '跳转到小剧场列表页' },
            // { key: 100, value: '跳转到小剧场播放页' },
        ];
        resolve(params);
    });
}

//好看类型 关联接口requestJumpTypes:8
export const requestGoodLookTypes = () => {
    return new Promise((resolve, reject) => {
        let params = [
            { key: 1, value: '点歌台' },
            { key: 2, value: '电视相册' },
            { key: 3, value: '公共相册' },
        ];
        resolve(params);
    });
}
//投放类型
export const requestDeliveryTypes = () => {
    return new Promise((resolve, reject) => {
        let params = [
            // { key: 0, value: '不选择' },
            { key: 1, value: '定向' },
            { key: 2, value: '非定向' },
        ];
        resolve(params);
    });
}

//字典 状态
export const requestDictStatus = () => {
    return new Promise((resolve, reject) => {
        let params = [
            { key: 1, value: '有效' },
            { key: 2, value: '无效' },
        ];
        resolve(params);
    });
}