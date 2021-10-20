import request from 'utils/request.js'
import request2 from 'utils/request2.js'
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
export const getUserTag = (params) => { return request.post(`${baseUrl}/mms/ad/tag/get`, params) };                                                                                         //渠道
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
export const ChannelTopic = (params) => { return request.get(`${baseUrl}/mms/channel/topic`, { params }) };                                                                                 //获取专题列表
export const updateChannelTopic = params => { return request.put(`${baseUrl}/mms/channel/topic`, params) };                                                                                 //修改专题列表
export const addChannelTopic = params => { return request.post(`${baseUrl}/mms/channel/topic`, params) };                                                                                   //新增专题列表
export const deleteChannelTopic = params => { return request.delete(`${baseUrl}/mms/channel/topic`, { params: params }) };                                                                  //删除专题列表
export const listProgramByChannelId = params => { return request.get(`${baseUrl}/mms/channel/programs/listByChannelId`, { params: params }) };                                              //获取专题详情
export const syncChannel = params => { return request.get(`${baseUrl}/mms/channel/topic/sync`, { params: params }); };                                                                      //频道专题同步接口


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
export const syncSynSlice = (params) => { return request2.get(`${baseUrl}/mms/config/common/syn_slice`, { params: params }); };                                                          //查找合集短视频 /mms/config/common/syn_config?key=
export const syncWeChat = (params) => { return request2.get(`${baseUrl}/mms/sync/weChat`, { params: params }); };                                                                           //微信自动回复/wxcode/微信二维码
export const syncMenuImage = (params) => { return request2.get(`${baseUrl}/mms/config/menu/image/syncCache`, { params: params }); };                                                        //广告菜单栏目录配置
export const syncWxTemplateMsgConfig = (params) => { return request2.get(`${baseUrl}/mms/tmpl/message/config/sync`, { params: params }); };                                                 //微信模板消息 同步

//小程序配置
export const getMiniProList = (params) => { return request.post(`${baseUrl}/mms/wx/msg/getMpListV2`, params) };                                                                             //获取小程序配置列表
export const addMpConfig = (params) => { return request.post(`${baseUrl}/mms/wx/msg/addMpConfig`, params) };                                                                                //增加小程序配置列表
export const delMpConfig = (params) => { return request.post(`${baseUrl}/mms/wx/msg/delMpConfig?id=${params.id}`) };                                                                        //删除小程序配置列表

//广告光立---自定义规则便签
export const getAdTagList = (params) => { return request.post(`${baseUrl}/mms/ad/tag/get`, params) };                                                                                       //获取列表
export const getAdFieldList = (params) => { return request.post(`${baseUrl}/mms/dict/tagDic/get`, params) };                                                                                //获取Field列表
export const getDictionary = (params) => { return request.post(`${baseUrl}/mms/config/dictionary/get`, params) };                                                                           //获取数据源
export const addDIYTag = (params) => { return request.post(`${baseUrl}/mms/ad/tag/add`, params) };                                                                                          //增加自定义规则标签
export const updateDIYTag = (params) => { return request.post(`${baseUrl}/mms/ad/tag/update`, params) };                                                                                    //更新自定义规则标签
export const delDIYTag = (params) => { return request.post(`${baseUrl}/mms/ad/tag/del`, params) };                                                                                          //删除自定义规则标签
export const esQuery = (params) => { return request.post(`${baseUrl}/mms/ad/tag/esQuery`, params) };                                                                                        //esQuery

//  转转管理------赚赚激励气泡
export const getEarnTskList=(params)=>{ return request2.get(`${baseUrl}/mms/bubbletask/list`, { params: params }); };  // 获取转转激励任务列表
export const addEarnTskList = (params) => { return request2.post(`${baseUrl}/mms/bubbletask/add`, params) };            // 新增转转激励任务
export const updateEarnTskList = (params) => { return request2.post(`${baseUrl}/mms/bubbletask/update`, params) };      // 更新转转激励任务
export const deleteEarnTskList = (params) => { return request.get(`${baseUrl}/mms/bubbletask/del`, params) };         // 删除转转激励任务
export const syncEarnTskList = (params) => { return request2.post(`${baseUrl}/mms/bubbletask/sync`, params) };          // 同步缓存转转激励任务

//白名单配置
export const addWhite = (params) => { return request2.post(`${baseUrl}/mms/ad/whitelist/add`, params) };          // 新增白名单配置
export const listWhite = (params) => { return request2.get(`${baseUrl}/mms/ad/whitelist/list`, { params: params }) };          // 获取白名单配置
export const updateWhite = (params) => { return request2.post(`${baseUrl}/mms/ad/whitelist/update`, params) };          // 更新白名单配置
export const deleteWhite = (params) => { return request2.post(`${baseUrl}/mms/ad/whitelist/delete`, params) };          // 删除白名单配置
export const syncWhite = (params) => { return request2.post(`${baseUrl}/mms/ad/whitelist/sync`, params) };          // 同步


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
            { key: 4, value: '跳转到设置' },
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