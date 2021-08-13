import request from 'utils/request.js'
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



//========== 尝鲜版 ==========
export const requestTvTringAdList = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/list`, params); }                                 //广告-列表
export const requestTvTringAdResetRatio = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/resetRatio`, params) }                      //广告-重设比例
export const requestTvTringAdChangeState = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/changeState`, { params: params }) }         //广告-修改状态
export const requestTvTringAdDuplicate = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/duplicate`, { params: params }) }             //广告-拷贝一行
export const requestTvTringAdCreate = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/create`, params) }                              //广告-新增
export const requestTvTringAdEdit = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/edit`, params) }                                  //广告-编辑
export const requestTvTringAdDeleteItem = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/deleteItem`, { params: params }) }           //广告-删除
export const requestTvTringAdConfigRatio = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/config/ratio`, { params: params }) }        //广告-配置节目单比例
export const requestTvTringAdConfigDuration = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/config/duration`, params); }            //广告-配置节目单持续时间
export const requestTvTringAdSyncCache = (params) => { return request.post(`${baseUrl}/mms/ad/tvTrying/syncCache`, params) }                        //广告-数据同步-生成前台缓存
export const requestTvTringShowConfig = (params) => { return request.get(`${baseUrl}/mms/ad/tvTrying/showConfig`, params) }                         //广告-查看广告节目单配置

//========== 基础数据 老CMS平台中数据整理 ==========
//二维码类型
export const requestQrcodeTypes = () => {
    return new Promise((resolve, reject) => {
        let params = [
            { key: 1, value: '静态广告', },
            { key: 2, value: 'gif广告', },
            { key: 3, value: '支付广告', },
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
            { key: 8, value: '跳转到小剧场列表页' },
            { key: 100, value: '跳转到小剧场播放页' },
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
            { key: 1, value: '定向' },
            { key: 2, value: '非定向' },
        ];
        resolve(params);
    });
}
