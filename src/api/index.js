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
export const getMenu = params => { //获取菜单
    return request.post(`${baseUrl}/mms/sys/user/menu`, params)
};
export const getPlace = params => { //获取地域
    return request.post(`${baseUrl}/mms/region/areaInfo`, params)
};
export const getChannelGroupChannel = params => { //获取频道组信息
    return request.post(`${baseUrl}/mms/channel/channelGroupChannel/get`, params)
};
export const getListChannelInfo = params => { //获取指定频道和时间的节目单信息
    return request.get(`${baseUrl}/mms/channel/programs/listChannelInfo`, { params: params })
};
export const updateListChannelInfo = params => { //刷新指定频道和时间的节目单信息
    return request.get(`${baseUrl}/mms/channel/programs/updateChannelInfo`, { params: params })
};
export const updateChannelProgram = params => { //刷新指定频道和时间的节目单信息
    return request.post(`${baseUrl}/mms/channel/programs/updateChannelProgram`, params)
};
export const deleteChannelProgram = params => { //删除节目单某个节目
    return request.post(`${baseUrl}/mms/channel/programs/deleteChannelProgram`, params)
};
export const searchPrograms = params => { //查询关联节目
    return request.get(`${baseUrl}/mms/channel/programGuides/search`, { params: params })
};
export const addChannelProgram = params => { //插入关联节目
    return request.post(`${baseUrl}/mms/channel/programs/addChannelProgram`, params)
};
export const getList = params => { //查询夺奖快讯
    return request.get(`${baseUrl}/mms/config/common/list`, { params: params })
};
export const addList = (params, body) => { //新增夺奖快讯
    return request.post(`${baseUrl}/mms/config/common/add?key=${params.key}`, body)
};
export const setConfig = (params, body) => { //设置h5头图
    return request.post(`${baseUrl}/mms/config/common/set?key=${params.key}`, body)
};
export const getConfig = params => { //查询夺奖快讯
    return request.get(`${baseUrl}/mms/config/common/get`, { params: params })
};
export const deleteConfig = params => { //删除夺奖快讯
    return request.post(`${baseUrl}/mms/config/common/delete?key=${params.key}&id=${params.id}`, {})
};
export const getProgramsList = params => { //删除夺奖快讯
    return request.get(`${baseUrl}/mms/channel/programs/list`, { params: params })
};
export const updateList = (params, body) => { //
    return request.post(`${baseUrl}/mms/config/common/update?key=${params.key}&id=${params.id}`, body)
};
export const getMedalList = params => { //获取奖牌榜
    return request.get(`${baseUrl}/mms/olympic2021/getMedalList`, { params: params })
};
export const setMedalList = params => { //设置夺奖快讯
    return request.post(`${baseUrl}/mms/olympic2021/setMedalList`, params)
};
export const getGameSchedule = params => { //获取赛事列表  /mms/olympic2021/getGameSchedule [get]
    return request.get(`${baseUrl}/mms/olympic2021/getGameSchedule`, { params: params })
};
export const searchVideo = params => { //短视频搜索
    return request.get(`${baseUrl}/mms/shortVideo/search`, { params: params })
};
export const shortVideoSearch = params => { //合集管理的搜索
    return request.post(`${baseUrl}/mms/shortVideo/column/list`, params)
};
export const updateGameSchedule = (params, body) => { //编辑赛事      /mms/olympic2021/updateGameSchedule?id=gameId  [post] body为修改过后的单个赛事
    return request.post(`${baseUrl}/mms/olympic2021/updateGameSchedule?id=${params.id}`, body)
};
export const deleteGameSchedule = (params, body) => { //删除赛事      /mms/olympic2021/deleteGameSchedule?id=gameId     [post]
    return request.post(`${baseUrl}/mms/olympic2021/deleteGameSchedule?id=${params.id}`, body)
};
export const refreshSpider = (params) => { //刷新爬虫赛事      /mms/olympic2021/deleteGameSchedule?id=gameId     [post]
    return request.get(`${baseUrl}/mms/olympic2021/refreshSpider?type=schedule`, { params: params })
};
export const addColumn = (params) => { //新增
    return request.put(`${baseUrl}/mms/shortVideo/column`, params)
};
export const update_column = (params) => { //新增
    return request.post(`${baseUrl}/mms/shortVideo/update_column`, params)
};
export const cvideos = (params) => { //查找合集短视频
    return request.get(`${baseUrl}/mms/shortVideo/cvideos`, { params: params })
};
export const getColumnInfo = (params) => { //查找合集短视频
    return request.get(`${baseUrl}/mms/shortVideo/column/detail`, { params: params })
};
//数据同步 set/get /mms/config/common/syn_config?key=
export const syn_config = (params) => { //查找合集短视频
    return request.get(`${baseUrl}/mms/config/common/syn_config`, { params: params })
};
// add/list
export const syn_slice = (params) => { //查找合集短视频
    return request.get(`${baseUrl}/mms/config/common/syn_slice`, { params: params })
};
export const editColumn = (params) => { //编辑专题
    return request.post(`${baseUrl}/mms/shortVideo/column`, params)
};
//同步秒杀数据

export const hotStock = (params) => { //查找合集短视频
    return request.get(`${baseUrl}/mms/activity/levelMs/hotStock`, { params: params })
};
//等级权益
export const realStock = (params) => { //查找合集短视频
    return request.get(`${baseUrl}/mms/activity/levelMs/realStock`, { params: params })
};
export const getBonusList = (params) => { //奥运会返现列表拉取
    return request.get(`${baseUrl}/mms/cash/olympic/days/list`, { params: params })
};
export const updateGold = (params) => { //奥运会返现奖牌更新
    return request.post(`${baseUrl}/mms/cash/olympic/days/update`, params)
};
export const sendAward = (params) => { //奥运会发奖接口
    return request.post(`${baseUrl}/mms/cash/olympic/award`, params)
};
export const getRecords = (params) => { //获取用户秒杀地址列表
    return request.post(`${baseUrl}/mms/activity/levelMs/records`, params)
};
export const importFile = (params) => { //到处用户地址file
    return request.post(`${baseUrl}/mms/activity/levelMs/import`, params)
};
export const getChinaTodayMedal = (params) => { //获取今日奖牌数
    return request.get(`${baseUrl}/mms/olympic2021/getChinaTodayMedal`, { params: params })
};
export const setChinaTodayMedal = (params) => { //设置今日奖牌数
    return request.post(`${baseUrl}/mms/olympic2021/setChinaTodayMedal`, params)
};


//服务分类
export const getServiceList = (params) => { //获取分类列表
    return request.post(`${baseUrl}/mms/tv/lifeService/category/list`, params)
};
export const addService = (params) => { //新增分类
    return request.post(`${baseUrl}/mms/tv/lifeService/category/add`, params)
};
export const editService = (params) => { //编辑分类
    return request.post(`${baseUrl}/mms/tv/lifeService/category/edit`, params)
};
export const deleteItem = (params) => { //删除分类
    return request.get(`${baseUrl}/mms/tv/lifeService/deleteItem`, { params: params })
};
export const getSelector = (params) => { //下啦列表
    return request.get(`${baseUrl}/mms/tv/lifeService/selector`, { params: params })
};
export const getMiniInfo = (params) => { //获取小程序信息
    return request.get(`${baseUrl}/mms/tv/lifeService/miniProgram/info`, { params: params })
};
export const changeState = (params) => { //获取小程序信息
    return request.get(`${baseUrl}/mms/tv/lifeService/changeState`, { params: params })
};
//类别
export const getTagList = (params) => { //类别列表
    return request.post(`${baseUrl}/mms/tv/lifeService/tag/list`, params)
};
export const addTag = (params) => { //类别列表
    return request.post(`${baseUrl}/mms/tv/lifeService/tag/add`, params)
};
export const editTag = (params) => { //类别列表
    return request.post(`${baseUrl}/mms/tv/lifeService/tag/edit`, params)
};
export const miniList = (params) => { //类别列表
    return request.post(`${baseUrl}/mms/tv/lifeService/miniProgram/list`, params)
};
export const editMini = (params) => { //类别列表
    return request.post(`${baseUrl}/mms/tv/lifeService/miniProgram/edit`, params)
};
export const addMini = (params) => { //类别列表
    return request.post(`${baseUrl}/mms/tv/lifeService/miniProgram/add`, params)
};
export const dataSyncCache = (params) => { //数据同步
    return request.post(`${baseUrl}/mms/tv/lifeService/syncCache`, params)
};
export const resetSort = (params) => { //拖动排序
    return request.post(`${baseUrl}/mms/tv/lifeService/resetSort`, params)
};

//投票
export const getVotingList = (params) => { //获取投票列表
    return request.post(`${baseUrl}/mms/activity/tvTrying/qhd/list`, params)
};
export const addVoting = (params) => { //新增投票列表
    return request.post(`${baseUrl}/mms/activity/tvTrying/qhd/create`, params)
};
export const editVoting = (params) => { //编辑投票列表
    return request.post(`${baseUrl}/mms/activity/tvTrying/qhd/edit`, params)
};
export const getMyProduct = (params) => { //产品线
    return request.post(`${baseUrl}/mms/product/get`, params)
};
export const getDict = (params) => { //字典集
    return request.post(`${baseUrl}/mms/dict/cp/get`, params)
};
export const getUserTag = (params) => { //渠道
    return request.post(`${baseUrl}/mms/ad/tag/get`, params)
};
export const getChannel = (params) => { //获取频道
    return request.post(`${baseUrl}/mms/channel/get`, params)
};
export const deleteVote = (params) => { //删除
    return request.get(`${baseUrl}/mms/activity/tvTrying/qhd/deleteItem`, { params: params })
};
export const changeStateVote = (params) => { //修改table里面的switch
    return request.get(`${baseUrl}/mms/activity/tvTrying/qhd/changeState`, { params: params })
};
export const voteSyncCache = (params) => { //同步数据
    return request.post(`${baseUrl}/mms/activity/tvTrying/qhd/syncCache`, params)
};
export const requestVoteDuplicate = (params) => {   //轻互动 拷贝一行
    return request.get(`${baseUrl}/mms/activity/tvTrying/qhd/duplicate`, { params: params })
}

// 频道组
export const getLockConfig = (params) => { //获取专项频道解锁配置
    return request.get(`${baseUrl}/mms/channel/group/exclusive/get`, { params: params })
};
export const getLockList = (params) => { //获取专项频道未设置的频道列表
    return request.post(`${baseUrl}/mms/channel/channelGroup/get`, params)
};
export const unlockChannel = (params) => { //专项频道解锁配置
    return request.post(`${baseUrl}/mms/channel/group/exclusive/unlock`, params)
};
//直播预告
export const getLivePreview = (params) => { //获取直播预告列表
    return request.post(`${baseUrl}/mms/channel/livePreview/get`, params)
};
export const updateLivePreview = (params) => { //更新直播预告列表
    return request.post(`${baseUrl}/mms/channel/livePreview/update`, params)
};
export const delLivePreview = (params) => { //删除直播预告列表
    return request.post(`${baseUrl}/mms/channel/livePreview/del`, params)
};
export const addLivePreview = (params) => { //新增直播预告列表
    return request.post(`${baseUrl}/mms/channel/livePreview/add`, params)
};
//推送节目单尝鲜版
export const getCheckboxTry = (params) => { //获取checkbox
    return request.get(`${baseUrl}/mms/channel/tvTrying/checkbox`, { params: params })
};
export const addTvTrying = (params) => { //添加推送尝鲜版
    return request.post(`${baseUrl}/mms/channel/tvTrying/add`, params)
};
export const deleteTvTrying = (params) => { //添加推送尝鲜版
    return request.post(`${baseUrl}/mms/channel/tvTrying/remove`, params)
};
export const syncCacheTvTry = (params) => { //数据同步推送尝鲜版
    return request.post(`${baseUrl}/mms/channel/tvTrying/syncCache`, params)
};

// 频道专题
export const Getchannels = (params) => { // 获取频道节目
    return request.post(`${baseUrl}/mms/channel/programCover/channels`, params)
};
export const ChannelTopic = (params) => { // 获取专题列表
    return request.get(`${baseUrl}/mms/channel/topic`, { params })
};
export const updateChannelTopic = params => {  // 修改专题列表
    return request.put(`${baseUrl}/mms/channel/topic`, params)
}
export const addChannelTopic = params => { // 新增专题列表
    return request.post(`${baseUrl}/mms/channel/topic`, params)
}
export const deleteChannelTopic = params => {   // 删除专题列表
    return request.delete(`${baseUrl}/mms/channel/topic`, { params: params })
}
export const listProgramByChannelId = params => {   // 获取专题详情
    return request.get(`${baseUrl}/mms/channel/programs/listByChannelId`, { params: params })
}
export const syncChannel = params => {
    return request.get(`${baseUrl}/mms/sync/channel`, { params: params });
};


//微信公众号管理
export const getMsg = (params) => { //客服消息
    return request.post(`${baseUrl}/mms/wx/msg/task/get`, params)
};
export const getMsgLog = (params) => { //客服消息
    return request.post(`${baseUrl}/mms/wx/msg/log/get`, params)
};
export const getPublicList = (params) => { //获取公众号
    return request.post(`${baseUrl}/mms/wx/public/get`, params)
};
export const getMsgTemplate = (params) => { //获取模版 图文信息/文字信息
    return request.post(`${baseUrl}/mms/wx/msg/get`, params)
};
export const getTemplateImage = (params) => { //获取模版 图片
    return request.post(`${baseUrl}/mms/wx/msg/material`, params)
};
export const getTemplateUser = (params) => { //获取预览用户
    return request.get(`${baseUrl}/mms/wx/msg/user/get`, { params: params })
};
export const deleteMsg = (params) => { //删除客服消息
    return request.post(`${baseUrl}/mms/wx/msg/task/del`, params)
};
export const editMsg = (params) => { //编辑客服消息
    return request.post(`${baseUrl}/mms/wx/msg/task/update`, params)
};
export const sendMsg = (params) => { //发送客服消息
    return request.post(`${baseUrl}/mms/wx/msg/send`, params)
};
export const addMsg = (params) => { //新增客服消息
    return request.post(`${baseUrl}/mms/wx/msg/task/add`, params)
};
export const getMpList = (params) => { //获取小程序列表
    return request.post(`${baseUrl}/mms/wx/msg/getMpList`, params)
};
export const addMaterial = (params) => { //新增素材
    return request.post(`${baseUrl}/mms/wx/msg/addNews`, params)
};
export const addText = (params) => { //新增文本
    return request.post(`${baseUrl}/mms/wx/msg/add`, params)
};
export const syncWxMaterial = (params) => { //同步新增素材
    return request.post(`${baseUrl}/mms/wx/msg/syncWxMaterial`, params)
};


//========== 尝鲜版 ==========
export const requestTvTringAdList = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/list`, params); }                                         //广告-列表
export const requestTvTringAdResetRatio = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/resetRatio`, params) }                              //广告-重设比例
export const requestTvTringAdChangeState = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/changeState`, { params: params }) }                 //广告-修改状态
export const requestTvTringAdDuplicate = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/duplicate`, { params: params }) }                     //广告-拷贝一行
export const requestTvTringAdCreate = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/create`, params) }                                      //广告-新增
export const requestTvTringAdEdit = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/edit`, params) }                                          //广告-编辑
export const requestTvTringAdDeleteItem = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/deleteItem`, { params: params }) }                   //广告-删除
export const requestTvTringAdConfigRatio = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/config/ratio`, params) }                           //广告-配置节目单比例
export const requestTvTringAdConfigDuration = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/config/duration`, { params: params }); }         //广告-配置节目单持续时间
export const requestTvTringAdConfigDurationL = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/config/lDuration`, { params: params }); }       //广告-配置L型广告持续时间
export const requestTvTringAdSyncCache = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/syncCache`, params) }                                //广告-数据同步-生成前台缓存
export const requestTvTringShowConfig = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/showConfig`, { params: params }) }                     //广告-查看广告节目单配置
export const requestProductSkuList = (params) => { return request.post(`${baseUrl}/mms/p/product/sku`, params) }                                            //广告-二维码套餐类型
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



//========== 配置管理 ==========
export const requestConfigAddDoc = (layer, params) => { return request2.post(`${baseUrl}/mms/doc/${layer === 0 ? '' : layer === 1 ? 'key/' : 'value/'}add`, params); }                       //配置列表-添加配置
export const requestConfigDocList = (layer, params) => { return request2.post(`${baseUrl}/mms/doc/${layer === 0 ? '' : layer === 1 ? 'key/' : 'value/'}get`, params); }                      //配置列表-配置列表
export const requestConfigDeleteDoc = (layer, params) => { return request2.post(`${baseUrl}/mms/doc/${layer === 0 ? '' : layer === 1 ? 'key/' : 'value/'}del`, params); }                    //配置列表-删除配置
export const requestConfigUpdateDoc = (layer, params) => { return request2.post(`${baseUrl}/mms/doc/${layer === 0 ? '' : layer === 1 ? 'key/' : 'value/'}update`, params); }                 //配置列表-更新配置


//微信管理
export const requestWxReply = (params) => { return request2.post(`${baseUrl}/mms/wxReply/get`, params); }                           //获取微信回复
export const requestWxReplyTypes = (params) => { return request2.post(`${baseUrl}/mms/wx/public/get`, params); }                    //获取回复公众号的类型
export const requestWxReplyUpdate = params => { return request2.post(`${baseUrl}/mms/wxReply/update`, params); };                   //编辑|更新
export const requestWxReplyDelete = params => { return request2.post(`${baseUrl}/mms/wxReply/del`, params); };                      //删除
export const requestWxReplyCreate = params => { return request2.post(`${baseUrl}/mms/wxReply/add`, params); };                      //添加


//========== 数据同步|数据缓存 ========== 
export const syncOther = (params) => { return request2.get(`${baseUrl}/mms/sync/other`, { params: params }); };                                                             //其他缓存 其他缓存(热点频道/友盟上报/播放控制/分享码/产品线/文案/配置API/移动端banner/运营位/用户识别规则/热点节目/渠道/卡顿策略/设备权益/eslog/开机进入/定时任务/专享运营位/家庭账号配置)
export const syncLiveCarousel = (params) => { return request2.get(`${baseUrl}/mms/sync/liveCarousel`, { params: params }); };                                               //直播轮播缓存(直播预告/轮播推荐/观影厅频道配置)
export const syncSyncConfig = (params) => { return request2.get(`${baseUrl}/mms/config/common/syn_config`, { params: params }); };                                          //查找合集短视频 /mms/config/common/syn_config?key=

//小程序配置
export const getMiniProList = (params) => { //获取小程序配置列表
    return request.post(`${baseUrl}/mms/wx/msg/getMpListV2`, params)
};
export const addMpConfig = (params) => { //增加小程序配置列表
    return request.post(`${baseUrl}/mms/wx/msg/addMpConfig`, params)
};
export const delMpConfig = (params) => { //删除小程序配置列表
    return request.post(`${baseUrl}/mms/wx/msg/delMpConfig?id=${params.id}`)
};