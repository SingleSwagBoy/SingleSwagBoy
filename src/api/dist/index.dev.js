"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPublicList = exports.getMsgLog = exports.getMsg = exports.deleteChannelTopicOld = exports.addChannelTopicOld = exports.updateChannelTopicOld = exports.ChannelTopicOld = exports.saveConfChannel = exports.showConfChannel = exports.changeChannelTopic = exports.syncChannelNew = exports.syncChannel = exports.listProgramByChannelId = exports.deleteChannelTopic = exports.addChannelTopic = exports.updateChannelTopic = exports.ChannelTopic = exports.Getchannels = exports.syncCacheTvTry = exports.deleteTvTrying = exports.addTvTrying = exports.getCheckboxTry = exports.addLivePreview = exports.delLivePreview = exports.updateLivePreview = exports.getLivePreview = exports.unlockChannel = exports.getLockList = exports.getLockConfig = exports.requestVoteDuplicate = exports.voteSyncCache = exports.changeStateVote = exports.deleteVote = exports.getChannel = exports.getDict = exports.getMyProduct = exports.editVoting = exports.addVoting = exports.getVotingList = exports.resetSort = exports.dataSyncCache = exports.addMini = exports.editMini = exports.miniList = exports.editTag = exports.addTag = exports.getTagList = exports.changeState = exports.getMiniInfo = exports.getSelector = exports.deleteItem = exports.editService = exports.addService = exports.getServiceList = exports.setChinaTodayMedal = exports.getChinaTodayMedal = exports.importFile = exports.getRecords = exports.sendAward = exports.updateGold = exports.getBonusList = exports.realStock = exports.hotStock = exports.requestSvcChangeVideoTitle = exports.requestSvcChangeVideoSort = exports.requestSvcResort = exports.requestAddToLunbo = exports.editColumn = exports.syn_slice = exports.syn_config = exports.getColumnInfo = exports.cvideos = exports.update_column = exports.addColumn = exports.refreshSpider = exports.deleteGameSchedule = exports.updateGameSchedule = exports.shortVideoSearch = exports.searchVideo = exports.getGameSchedule = exports.setMedalList = exports.getMedalList = exports.updateList = exports.getProgramsList = exports.deleteConfig = exports.getConfig = exports.setConfig = exports.addList = exports.getList = exports.addChannelProgram = exports.searchPrograms = exports.deleteChannelProgram = exports.updateChannelProgram = exports.updateListChannelInfo = exports.getListChannelInfo = exports.getChannelGroupChannel = exports.getPlace = exports.getMenu = exports.loginSystem = exports.baseUrl = void 0;
exports.requestNewGroupCreate = exports.esQuery = exports.delDIYTag = exports.updateDIYTag = exports.addDIYTag = exports.requestAdTagList = exports.getScreen = exports.addScreen = exports.addAdRightKey = exports.requestAdRightKey = exports.delMpConfig = exports.addMpConfig = exports.getMiniProList = exports.syncChannelRecommend = exports.getMoney = exports.setMoney = exports.syncAdNewTagSync = exports.syncWxTemplateMsgConfig = exports.syncMenuImage = exports.syncWeChat = exports.syncSynSlice = exports.syncSyncConfig = exports.syncLiveCarousel = exports.syncOther = exports.requestSysUserRolePermissionDelete = exports.requestSysUserRolePermissionUpdate = exports.requestSysUserRolePermissionCreate = exports.requestSysUserRolePermissions = exports.requestSysMenuDelete = exports.requestSysMenuUpdate = exports.requestSysMenuCreate = exports.requestSysMenu = exports.requestSysRoleDelete = exports.requestSysRoleUpdate = exports.requestSysRoleCreate = exports.requestSysRole = exports.requestSysUserDelete = exports.requestSysUserUpdate = exports.requestSysUserCreate = exports.requestSysUser = exports.requestWxTemplateMsgConfigSend = exports.requestWxTemplateMsgConfigDelete = exports.requestWxTemplateMsgConfigUpload = exports.requestWxTemplateMsgConfigCreate = exports.requestWxTemplateMsgConfigList = exports.requestConfigMenuImageChangeState = exports.requestConfigMenuImageDelete = exports.requestConfigMenuImageEidt = exports.requestConfigMenuImageCreate = exports.requestConfigMenuImageList = exports.requestWxReplyCreate = exports.requestWxReplyDelete = exports.requestWxReplyUpdate = exports.requestWxReplyTypes = exports.requestWxReply = exports.requestChannelRecommendChannel = exports.requestChannelRecommendChangeState = exports.requestChannelRecommendDelete = exports.requestChannelRecommendEdit = exports.requestChannelRecommendCreate = exports.selectSearch = exports.requestChannelRecommendSearchProgram = exports.requestChannelRecommendSearchChannel = exports.requestChannelRecommendList = exports.requestOperateApk = exports.requestConfigUpdateDoc = exports.requestConfigDeleteDoc = exports.requestConfigDocList = exports.requestConfigAddDoc = exports.requestWxProgramList = exports.changeStateHlcList = exports.deleteHlcList = exports.copyHlcList = exports.syncHlcList = exports.editHlcList = exports.addHlcList = exports.getHlcList = exports.requestProductSkuList = exports.requestTvTringShowConfig = exports.requestTvTringAdSyncCache = exports.requestTvTringAdConfigDurationL = exports.requestTvTringAdConfigDuration = exports.requestTvTringAdConfigRatio = exports.requestTvTringAdDeleteItem = exports.requestTvTringAdEdit = exports.requestTvTringAdCreate = exports.requestTvTringAdDuplicate = exports.requestTvTringAdChangeState = exports.requestTvTringAdResetRatio = exports.requestTvTringAdList = exports.syncWxMaterial = exports.addText = exports.addMaterial = exports.addMsg = exports.sendMsg = exports.editMsg = exports.deleteMsg = exports.getTemplateUser = exports.getTemplateImage = exports.getMsgTemplate = void 0;
exports.syncWordsConfig = exports.setImageWordsConfig = exports.getImageWordsConfig = exports.delWordsConfig = exports.addWordsConfig = exports.uploadWordsConfig = exports.getWordsConfig = exports.setSuggestInfo = exports.getSuggestInfo = exports.syncSuggest = exports.updateSuggest = exports.addSuggest = exports.getSuggest = exports.delShortList = exports.updateShortList = exports.searchShortList = exports.addShortList = exports.syncProgramList = exports.delProgramList = exports.getProgramInfo = exports.getDetailProgram = exports.uploadProgramList = exports.addProgramList = exports.getShortList = exports.getProgramlist = exports.copySource = exports.syncSource = exports.delSource = exports.updateSource = exports.addSource = exports.getSource = exports.updateGoods = exports.addPActivityGoods = exports.delgoodsList = exports.getPProductList = exports.syncPActivity = exports.goodsRealStock = exports.removePActivity = exports.addPActivity = exports.updatePActivityStatus = exports.updatePActivity = exports.getPActivityList = exports.syncProgramAppConfig = exports.updateProgramAppConfig = exports.getProgramAppConfig = exports.syncWhite = exports.deleteWhite = exports.updateWhite = exports.listWhite = exports.addWhite = exports.syncZZShow = exports.saveZZShow = exports.getZZShow = exports.delRefresh = exports.changeRefresh = exports.addRefresh = exports.getRefresh = exports.rsZzItemList = exports.syncZzItemList = exports.changeZzItemList = exports.deleteZzItemList = exports.addZzItemList = exports.editZzItemList = exports.getZzItemList = exports.syncEarnTskList = exports.deleteEarnTskList = exports.updateEarnTskList = exports.addEarnTskList = exports.getEarnTskList = exports.adRightKeyCopy = exports.screenCopy = exports.adRightKeySync = exports.adRightKeyDel = exports.screenDel = exports.screenUpdate = exports.adRightKeyUpdate = exports.adListSync = exports.requestAdFieldList = exports.requestDictionary = exports.requestNewAdTagDelete = exports.requestNewAdTagRecord = exports.requestNewAdTagUpdate = exports.requestNewAdTagCreate = exports.getGroup = exports.requestNewAdTagList = exports.delCorner = exports.addCorner = exports.updateCorner = exports.getChannelTag = exports.getCorner = exports.getPosition = exports.getSdkList = exports.delInfoGroup = exports.updateInfoGroup = exports.addInfoGroup = exports.getInfoGroup = exports.requestNewGroupCopy = exports.requestNewGroupDelete = exports.requestNewGroupList = exports.requestNewGroupUpdate = void 0;
exports.specialResort = exports.specialChangepos = exports.specialDelete = exports.specialUpdate = exports.specialSync = exports.specialStatus = exports.specialSetBaseInfo = exports.specialGetBaseInfo = exports.specialAdd = exports.specialList = exports.syncActivityConfig = exports.delActivityConfig = exports.updateActivityConfig = exports.addActivityConfig = exports.getActivityConfig = exports.addShieldList = exports.delShieldList = exports.getShieldList = exports.delcorptagtask = exports.corptagtaskstatus = exports.corptagtasks = exports.addcorptagtask = exports.corptags = exports.synctags = exports.uploadImage = exports.changeWelcome = exports.delWelcome = exports.saveWelcome = exports.addWelcome = exports.getWelcome = exports.setexcluswitch = exports.getexcluswitch = exports.getCount = exports.getWechatList = exports.saveMyWechatUser = exports.syncQrcodeConfig = exports.syncMyWechatUser = exports.getMyWechatUser = exports.getWechatUser = exports.saveQrcodeConfig = exports.getQrcodeConfig = exports.sortChannelSport = exports.syncChannelSport = exports.resetChannelSport = exports.delChannelSport = exports.addChannelSport = exports.getChannelSport = exports.syncHkCategory = exports.switchHkCategory = exports.changeHkCategory = exports.delHkCategory = exports.editHkCategory = exports.addHkCategory = exports.getHkCategory = exports.syncPowerBoot = exports.changePowerBoot = exports.delPowerBoot = exports.editPowerBoot = exports.addPowerBoot = exports.getPowerBoot = exports.syncEnterChannel = exports.uploadEnterChannel = exports.delEnterChannel = exports.getEnterChannel = exports.addEnterChannel = exports.delMarsList = exports.uploadMarsList = exports.addMarsList = exports.getMarsList = exports.getFansTag = exports.delFansTag = exports.updateFansTag = exports.addFansTag = exports.getFansTagList = exports.delSend = exports.reSend = exports.cancelSend = exports.everySend = exports.getSend = exports.wechatMaterialSend = exports.materialSend = exports.addSend = exports.preSend = exports.uploadWechatMenu = exports.setMenuState = exports.getWxlist = exports.delWechatMenu = exports.getWechatMenu = exports.addWechatMenu = exports.setHomeBaseInfo = exports.addTab = exports.getAllBaseInfo = exports.getHomeBaseInfo = exports.syncHomeList = exports.setStateHomeList = exports.getStateHomeList = exports.delHomeList = exports.addHomeList = exports.uploadHomeList = exports.getHomeList = void 0;
exports.signCalendarSync = exports.signCalendarClear = exports.signCalendarSave = exports.signCalendarList = exports.signSync = exports.signExtraEdit = exports.signExtra = exports.signRuleEdit = exports.signRuleInfo = exports.signCategoryDel = exports.signCategoryEdit = exports.signCategoryAdd = exports.signCategory = exports.signGoodsEdit = exports.signGoodsAdd = exports.signGoodsDelete = exports.signGoodsList = exports.syncHotChannel = exports.delHotChannel = exports.editHotChannel = exports.addHotChannel = exports.getHotChannel = exports.changeLogoutState = exports.syncLogout = exports.delLogout = exports.updateLogout = exports.addLogout = exports.getLogout = exports.syncMineGrid = exports.delMineGrid = exports.copyMineGrid = exports.editMineGrid = exports.addMineGrid = exports.getMineGrid = exports.delMine = exports.editMine = exports.addMine = exports.getMine = exports.syncTopic = exports.delTopic = exports.updateTopic = exports.addTopic = exports.getTopic = exports.getlistPhoto = exports.getMangoSyncTab = exports.getSortList = exports.updateMangoSort = exports.addMangosearch = exports.getMangoSync = exports.delMango = exports.addMangoUpdate = exports.addMangoList = exports.getMangoList = exports.requestApkConfigList = exports.requestApkConfigDelete = exports.requestApkConfigSync = exports.requestApkConfigAdd = exports.syncMenuList = exports.delMenuList = exports.updateMenuList = exports.addMenuList = exports.getMenuList = exports.syncAdSPList = exports.delAdSPList = exports.updateAdSPList = exports.addAdSPList = exports.getAdSPList = exports.editRiskConfig = exports.getRiskConfig = exports.syncOfflineProgram = exports.delOfflineProgram = exports.addOfflineProgram = exports.copyOfflineProgram = exports.updateOfflineProgram = exports.updateOfflineChannel = exports.addOfflineChannel = exports.delOfflineChannel = exports.updateOfflineTime = exports.getOfflineChannel = exports.getApkList = exports.getOfflineProgram = exports.bigwechatsPublic = exports.setextra = exports.listextraGet = exports.getconfigsSync = exports.getconfigsDelete = exports.getconfigsUpdate = exports.getconfigsAdd = exports.getconfigsstatus = exports.getconfigsLogin = exports.syncArmourPackage = exports.copyArmourPackage = exports.editArmourPackage = exports.delArmourPackage = exports.addArmourPackage = exports.getArmourPackage = exports.categoriesUpdate = exports.getCategoriesDetail = exports.getlistAllPrograms = exports.getCategories = void 0;
exports.requestDictStatus = exports.requestDeliveryTypes = exports.requestGoodLookTypes = exports.requestJumpMenuTypes = exports.requestJumpTypes = exports.requestQrcodeTypes = void 0;

var _request = _interopRequireDefault(require("utils/request.js"));

var _request2 = _interopRequireDefault(require("utils/request2.js"));

var _hookRequest = _interopRequireDefault(require("utils/hookRequest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var baseUrl = "";
exports.baseUrl = baseUrl;
console.log(window.location.host, "api");

if (window.location.host.includes("localhost") || window.location.host.includes("test")) {
  exports.baseUrl = baseUrl = "http://test.cms.tvplus.club";
} else if (window.location.host.includes("cms.tvplus.club")) {
  exports.baseUrl = baseUrl = "http://cms.tvplus.club";
}

var loginSystem = function loginSystem(params) {
  //获取菜单
  return _request["default"].post("".concat(baseUrl, "/mms/login"), params);
};

exports.loginSystem = loginSystem;

var getMenu = function getMenu(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/sys/user/menu"), params);
}; //获取菜单


exports.getMenu = getMenu;

var getPlace = function getPlace(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/region/areaInfo"), params);
}; //获取地域


exports.getPlace = getPlace;

var getChannelGroupChannel = function getChannelGroupChannel(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/channelGroupChannel/get"), params);
}; //获取频道组信息


exports.getChannelGroupChannel = getChannelGroupChannel;

var getListChannelInfo = function getListChannelInfo(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/programs/listChannelInfo"), {
    params: params
  });
}; //获取指定频道和时间的节目单信息


exports.getListChannelInfo = getListChannelInfo;

var updateListChannelInfo = function updateListChannelInfo(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/programs/updateChannelInfo"), {
    params: params
  });
}; //刷新指定频道和时间的节目单信息


exports.updateListChannelInfo = updateListChannelInfo;

var updateChannelProgram = function updateChannelProgram(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/programs/updateChannelProgram"), params);
}; //刷新指定频道和时间的节目单信息


exports.updateChannelProgram = updateChannelProgram;

var deleteChannelProgram = function deleteChannelProgram(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/programs/deleteChannelProgram"), params);
}; //删除节目单某个节目


exports.deleteChannelProgram = deleteChannelProgram;

var searchPrograms = function searchPrograms(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/programGuides/search"), {
    params: params
  });
}; //查询关联节目


exports.searchPrograms = searchPrograms;

var addChannelProgram = function addChannelProgram(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/programs/addChannelProgram"), params);
}; //插入关联节目


exports.addChannelProgram = addChannelProgram;

var getList = function getList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/config/common/list"), {
    params: params
  });
}; //查询夺奖快讯


exports.getList = getList;

var addList = function addList(params, body) {
  return _request["default"].post("".concat(baseUrl, "/mms/config/common/add?key=").concat(params.key), body);
}; //新增夺奖快讯


exports.addList = addList;

var setConfig = function setConfig(params, body) {
  return _request["default"].post("".concat(baseUrl, "/mms/config/common/set?key=").concat(params.key), body);
}; //设置h5头图


exports.setConfig = setConfig;

var getConfig = function getConfig(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/config/common/get"), {
    params: params
  });
}; //查询夺奖快讯


exports.getConfig = getConfig;

var deleteConfig = function deleteConfig(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/config/common/delete?key=").concat(params.key, "&id=").concat(params.id), {});
}; //删除夺奖快讯


exports.deleteConfig = deleteConfig;

var getProgramsList = function getProgramsList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/programs/list"), {
    params: params
  });
}; //删除夺奖快讯


exports.getProgramsList = getProgramsList;

var updateList = function updateList(params, body) {
  return _request["default"].post("".concat(baseUrl, "/mms/config/common/update?key=").concat(params.key, "&id=").concat(params.id), body);
};

exports.updateList = updateList;

var getMedalList = function getMedalList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/olympic2021/getMedalList"), {
    params: params
  });
}; //获取奖牌榜


exports.getMedalList = getMedalList;

var setMedalList = function setMedalList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/olympic2021/setMedalList"), params);
}; //设置夺奖快讯


exports.setMedalList = setMedalList;

var getGameSchedule = function getGameSchedule(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/olympic2021/getGameSchedule"), {
    params: params
  });
}; //获取赛事列表  /mms/olympic2021/getGameSchedule [get]


exports.getGameSchedule = getGameSchedule;

var searchVideo = function searchVideo(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/shortVideo/search"), {
    params: params
  });
}; //短视频搜索


exports.searchVideo = searchVideo;

var shortVideoSearch = function shortVideoSearch(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/shortVideo/column/list"), params);
}; //合集管理的搜索


exports.shortVideoSearch = shortVideoSearch;

var updateGameSchedule = function updateGameSchedule(params, body) {
  return _request["default"].post("".concat(baseUrl, "/mms/olympic2021/updateGameSchedule?id=").concat(params.id), body);
}; //编辑赛事      /mms/olympic2021/updateGameSchedule?id=gameId  [post] body为修改过后的单个赛事


exports.updateGameSchedule = updateGameSchedule;

var deleteGameSchedule = function deleteGameSchedule(params, body) {
  return _request["default"].post("".concat(baseUrl, "/mms/olympic2021/deleteGameSchedule?id=").concat(params.id), body);
}; //删除赛事      /mms/olympic2021/deleteGameSchedule?id=gameId     [post]


exports.deleteGameSchedule = deleteGameSchedule;

var refreshSpider = function refreshSpider(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/olympic2021/refreshSpider?type=schedule"), {
    params: params
  });
}; //刷新爬虫赛事      /mms/olympic2021/deleteGameSchedule?id=gameId     [post]


exports.refreshSpider = refreshSpider;

var addColumn = function addColumn(params) {
  return _request["default"].put("".concat(baseUrl, "/mms/shortVideo/column"), params);
}; //新增


exports.addColumn = addColumn;

var update_column = function update_column(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/shortVideo/update_column"), params);
}; //新增


exports.update_column = update_column;

var cvideos = function cvideos(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/shortVideo/cvideos"), {
    params: params
  });
}; //查找合集短视频


exports.cvideos = cvideos;

var getColumnInfo = function getColumnInfo(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/shortVideo/column/detail"), {
    params: params
  });
}; //查找合集短视频


exports.getColumnInfo = getColumnInfo;

var syn_config = function syn_config(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/config/common/syn_config"), {
    params: params
  });
}; //查找合集短视频


exports.syn_config = syn_config;

var syn_slice = function syn_slice(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/config/common/syn_slice"), {
    params: params
  });
}; //查找合集短视频


exports.syn_slice = syn_slice;

var editColumn = function editColumn(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/shortVideo/column"), params);
}; //编辑专题


exports.editColumn = editColumn;

var requestAddToLunbo = function requestAddToLunbo(params, vid) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/channelRecommend/addToLunbo?vid=").concat(vid), {
    params: params
  });
}; //添加视频到轮播


exports.requestAddToLunbo = requestAddToLunbo;

var requestSvcResort = function requestSvcResort(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/shortVideo/svc/resort"), {
    params: params
  });
}; //奥运会专题-专题下短视频重新排序


exports.requestSvcResort = requestSvcResort;

var requestSvcChangeVideoSort = function requestSvcChangeVideoSort(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/shortVideo/svc/changeVideoSort"), params);
}; //奥运会专题-专题下短视频修改序号


exports.requestSvcChangeVideoSort = requestSvcChangeVideoSort;

var requestSvcChangeVideoTitle = function requestSvcChangeVideoTitle(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/shortVideo/svc/changeVideoTitle"), params);
}; //奥运会专题-专题下短视频修改标题
//同步秒杀数据


exports.requestSvcChangeVideoTitle = requestSvcChangeVideoTitle;

var hotStock = function hotStock(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/activity/levelMs/hotStock"), {
    params: params
  });
}; //查找合集短视频
//等级权益


exports.hotStock = hotStock;

var realStock = function realStock(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/activity/levelMs/realStock"), {
    params: params
  });
}; //查找合集短视频


exports.realStock = realStock;

var getBonusList = function getBonusList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/cash/olympic/days/list"), {
    params: params
  });
}; //奥运会返现列表拉取


exports.getBonusList = getBonusList;

var updateGold = function updateGold(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/cash/olympic/days/update"), params);
}; //奥运会返现奖牌更新


exports.updateGold = updateGold;

var sendAward = function sendAward(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/cash/olympic/award"), params);
}; //奥运会发奖接口


exports.sendAward = sendAward;

var getRecords = function getRecords(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/activity/levelMs/records"), params);
}; //获取用户秒杀地址列表


exports.getRecords = getRecords;

var importFile = function importFile(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/activity/levelMs/import"), params);
}; //到处用户地址file


exports.importFile = importFile;

var getChinaTodayMedal = function getChinaTodayMedal(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/olympic2021/getChinaTodayMedal"), {
    params: params
  });
}; //获取今日奖牌数


exports.getChinaTodayMedal = getChinaTodayMedal;

var setChinaTodayMedal = function setChinaTodayMedal(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/olympic2021/setChinaTodayMedal"), params);
}; //设置今日奖牌数
//服务分类


exports.setChinaTodayMedal = setChinaTodayMedal;

var getServiceList = function getServiceList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/tv/lifeService/category/list"), params);
}; //获取分类列表


exports.getServiceList = getServiceList;

var addService = function addService(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/tv/lifeService/category/add"), params);
}; //新增分类


exports.addService = addService;

var editService = function editService(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/tv/lifeService/category/edit"), params);
}; //编辑分类


exports.editService = editService;

var deleteItem = function deleteItem(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/tv/lifeService/deleteItem"), {
    params: params
  });
}; //删除分类


exports.deleteItem = deleteItem;

var getSelector = function getSelector(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/tv/lifeService/selector"), {
    params: params
  });
}; //下啦列表


exports.getSelector = getSelector;

var getMiniInfo = function getMiniInfo(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/tv/lifeService/miniProgram/info"), {
    params: params
  });
}; //获取小程序信息


exports.getMiniInfo = getMiniInfo;

var changeState = function changeState(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/tv/lifeService/changeState"), {
    params: params
  });
}; //获取小程序信息
//类别


exports.changeState = changeState;

var getTagList = function getTagList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/tv/lifeService/tag/list"), params);
}; //类别列表


exports.getTagList = getTagList;

var addTag = function addTag(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/tv/lifeService/tag/add"), params);
}; //类别列表


exports.addTag = addTag;

var editTag = function editTag(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/tv/lifeService/tag/edit"), params);
}; //类别列表


exports.editTag = editTag;

var miniList = function miniList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/tv/lifeService/miniProgram/list"), params);
}; //类别列表


exports.miniList = miniList;

var editMini = function editMini(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/tv/lifeService/miniProgram/edit"), params);
}; //类别列表


exports.editMini = editMini;

var addMini = function addMini(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/tv/lifeService/miniProgram/add"), params);
}; //类别列表


exports.addMini = addMini;

var dataSyncCache = function dataSyncCache(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/tv/lifeService/syncCache"), params);
}; //数据同步


exports.dataSyncCache = dataSyncCache;

var resetSort = function resetSort(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/tv/lifeService/resetSort"), params);
}; //拖动排序
//投票


exports.resetSort = resetSort;

var getVotingList = function getVotingList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/activity/tvTrying/qhd/list"), params);
}; //获取投票列表


exports.getVotingList = getVotingList;

var addVoting = function addVoting(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/activity/tvTrying/qhd/create"), params);
}; //新增投票列表


exports.addVoting = addVoting;

var editVoting = function editVoting(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/activity/tvTrying/qhd/edit"), params);
}; //编辑投票列表


exports.editVoting = editVoting;

var getMyProduct = function getMyProduct(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/product/get"), params);
}; //产品线


exports.getMyProduct = getMyProduct;

var getDict = function getDict(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/dict/cp/get"), params);
}; //字典集
// export const getUserTag = (params) => { return request.post(`${baseUrl}/mms/ad/tag/get`, params) };                                                                                         //渠道


exports.getDict = getDict;

var getChannel = function getChannel(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/get"), params);
}; //获取频道


exports.getChannel = getChannel;

var deleteVote = function deleteVote(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/activity/tvTrying/qhd/deleteItem"), {
    params: params
  });
}; //删除


exports.deleteVote = deleteVote;

var changeStateVote = function changeStateVote(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/activity/tvTrying/qhd/changeState"), {
    params: params
  });
}; //修改table里面的switch


exports.changeStateVote = changeStateVote;

var voteSyncCache = function voteSyncCache(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/activity/tvTrying/qhd/syncCache"), params);
}; //同步数据


exports.voteSyncCache = voteSyncCache;

var requestVoteDuplicate = function requestVoteDuplicate(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/activity/tvTrying/qhd/duplicate"), {
    params: params
  });
}; //轻互动 拷贝一行
// 频道组


exports.requestVoteDuplicate = requestVoteDuplicate;

var getLockConfig = function getLockConfig(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/group/exclusive/get"), {
    params: params
  });
}; //获取专项频道解锁配置


exports.getLockConfig = getLockConfig;

var getLockList = function getLockList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/channelGroup/get"), params);
}; //获取专项频道未设置的频道列表


exports.getLockList = getLockList;

var unlockChannel = function unlockChannel(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/group/exclusive/unlock"), params);
}; //专项频道解锁配置
//直播预告


exports.unlockChannel = unlockChannel;

var getLivePreview = function getLivePreview(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/livePreview/get"), params);
}; //获取直播预告列表


exports.getLivePreview = getLivePreview;

var updateLivePreview = function updateLivePreview(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/livePreview/update"), params);
}; //更新直播预告列表


exports.updateLivePreview = updateLivePreview;

var delLivePreview = function delLivePreview(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/livePreview/del"), params);
}; //删除直播预告列表


exports.delLivePreview = delLivePreview;

var addLivePreview = function addLivePreview(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/livePreview/add"), params);
}; //新增直播预告列表
//推送节目单尝鲜版


exports.addLivePreview = addLivePreview;

var getCheckboxTry = function getCheckboxTry(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/tvTrying/checkbox"), {
    params: params
  });
}; //获取checkbox


exports.getCheckboxTry = getCheckboxTry;

var addTvTrying = function addTvTrying(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/tvTrying/add"), params);
}; //添加推送尝鲜版


exports.addTvTrying = addTvTrying;

var deleteTvTrying = function deleteTvTrying(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/tvTrying/remove"), params);
}; //添加推送尝鲜版


exports.deleteTvTrying = deleteTvTrying;

var syncCacheTvTry = function syncCacheTvTry(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/tvTrying/syncCache"), params);
}; //数据同步推送尝鲜版
// 频道专题


exports.syncCacheTvTry = syncCacheTvTry;

var Getchannels = function Getchannels(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/programCover/channels"), params);
}; //获取频道节目


exports.Getchannels = Getchannels;

var ChannelTopic = function ChannelTopic(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channelTopicNew/list"), params);
}; //获取专题列表


exports.ChannelTopic = ChannelTopic;

var updateChannelTopic = function updateChannelTopic(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channelTopicNew/edit"), params);
}; //修改专题列表


exports.updateChannelTopic = updateChannelTopic;

var addChannelTopic = function addChannelTopic(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channelTopicNew/create"), params);
}; //新增专题列表


exports.addChannelTopic = addChannelTopic;

var deleteChannelTopic = function deleteChannelTopic(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channelTopicNew/deleteItem"), {
    params: params
  });
}; //删除专题列表


exports.deleteChannelTopic = deleteChannelTopic;

var listProgramByChannelId = function listProgramByChannelId(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/programs/listByChannelId"), {
    params: params
  });
}; //获取专题详情


exports.listProgramByChannelId = listProgramByChannelId;

var syncChannel = function syncChannel(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/topic/sync"), {
    params: params
  });
}; //频道专题同步接口


exports.syncChannel = syncChannel;

var syncChannelNew = function syncChannelNew(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channelTopicNew/syncCache"), {
    params: params
  });
}; //频道专题同步接口


exports.syncChannelNew = syncChannelNew;

var changeChannelTopic = function changeChannelTopic(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channelTopicNew/changeState"), {
    params: params
  });
}; //频道专题同步接口


exports.changeChannelTopic = changeChannelTopic;

var showConfChannel = function showConfChannel(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channelTopicNew/showConf"), {
    params: params
  });
}; //新频道专题-查看内容配置


exports.showConfChannel = showConfChannel;

var saveConfChannel = function saveConfChannel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channelTopicNew/saveConf"), params);
};

exports.saveConfChannel = saveConfChannel;

var ChannelTopicOld = function ChannelTopicOld(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/topic"), {
    params: params
  });
}; //获取专题列表


exports.ChannelTopicOld = ChannelTopicOld;

var updateChannelTopicOld = function updateChannelTopicOld(params) {
  return _request["default"].put("".concat(baseUrl, "/mms/channel/topic"), params);
}; //修改专题列表


exports.updateChannelTopicOld = updateChannelTopicOld;

var addChannelTopicOld = function addChannelTopicOld(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/topic"), params);
}; //新增专题列表


exports.addChannelTopicOld = addChannelTopicOld;

var deleteChannelTopicOld = function deleteChannelTopicOld(params) {
  return _request["default"]["delete"]("".concat(baseUrl, "/mms/channel/topic"), {
    params: params
  });
}; //新频道专题-查看内容配置
//微信公众号管理


exports.deleteChannelTopicOld = deleteChannelTopicOld;

var getMsg = function getMsg(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/task/get"), params);
}; //客服消息


exports.getMsg = getMsg;

var getMsgLog = function getMsgLog(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/log/get"), params);
}; //客服消息


exports.getMsgLog = getMsgLog;

var getPublicList = function getPublicList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/public/get"), params);
}; //获取公众号


exports.getPublicList = getPublicList;

var getMsgTemplate = function getMsgTemplate(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/get"), params);
}; //获取模版 图文信息/文字信息


exports.getMsgTemplate = getMsgTemplate;

var getTemplateImage = function getTemplateImage(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/material"), params);
}; //获取模版 图片


exports.getTemplateImage = getTemplateImage;

var getTemplateUser = function getTemplateUser(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/wx/msg/user/get"), {
    params: params
  });
}; //获取预览用户


exports.getTemplateUser = getTemplateUser;

var deleteMsg = function deleteMsg(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/task/del"), params);
}; //删除客服消息


exports.deleteMsg = deleteMsg;

var editMsg = function editMsg(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/task/update"), params);
}; //编辑客服消息


exports.editMsg = editMsg;

var sendMsg = function sendMsg(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/send"), params);
}; //发送客服消息


exports.sendMsg = sendMsg;

var addMsg = function addMsg(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/task/add"), params);
}; //新增客服消息


exports.addMsg = addMsg;

var addMaterial = function addMaterial(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/addNews"), params);
}; //新增素材


exports.addMaterial = addMaterial;

var addText = function addText(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/add"), params);
}; //新增文本


exports.addText = addText;

var syncWxMaterial = function syncWxMaterial(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/syncWxMaterial"), params);
}; //同步新增素材
//========== 尝鲜版 ==========


exports.syncWxMaterial = syncWxMaterial;

var requestTvTringAdList = function requestTvTringAdList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/ad/tvTrying/list"), params);
}; //广告-列表


exports.requestTvTringAdList = requestTvTringAdList;

var requestTvTringAdResetRatio = function requestTvTringAdResetRatio(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/ad/tvTrying/resetRatio"), params);
}; //广告-重设比例


exports.requestTvTringAdResetRatio = requestTvTringAdResetRatio;

var requestTvTringAdChangeState = function requestTvTringAdChangeState(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/ad/tvTrying/changeState"), {
    params: params
  });
}; //广告-修改状态


exports.requestTvTringAdChangeState = requestTvTringAdChangeState;

var requestTvTringAdDuplicate = function requestTvTringAdDuplicate(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/ad/tvTrying/duplicate"), {
    params: params
  });
}; //广告-拷贝一行


exports.requestTvTringAdDuplicate = requestTvTringAdDuplicate;

var requestTvTringAdCreate = function requestTvTringAdCreate(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/ad/tvTrying/create"), params);
}; //广告-新增


exports.requestTvTringAdCreate = requestTvTringAdCreate;

var requestTvTringAdEdit = function requestTvTringAdEdit(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/ad/tvTrying/edit"), params);
}; //广告-编辑


exports.requestTvTringAdEdit = requestTvTringAdEdit;

var requestTvTringAdDeleteItem = function requestTvTringAdDeleteItem(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/ad/tvTrying/deleteItem"), {
    params: params
  });
}; //广告-删除


exports.requestTvTringAdDeleteItem = requestTvTringAdDeleteItem;

var requestTvTringAdConfigRatio = function requestTvTringAdConfigRatio(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/ad/tvTrying/config/ratio"), params);
}; //广告-配置节目单比例


exports.requestTvTringAdConfigRatio = requestTvTringAdConfigRatio;

var requestTvTringAdConfigDuration = function requestTvTringAdConfigDuration(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/ad/tvTrying/config/duration"), {
    params: params
  });
}; //广告-配置节目单持续时间


exports.requestTvTringAdConfigDuration = requestTvTringAdConfigDuration;

var requestTvTringAdConfigDurationL = function requestTvTringAdConfigDurationL(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/ad/tvTrying/config/lDuration"), {
    params: params
  });
}; //广告-配置L型广告持续时间


exports.requestTvTringAdConfigDurationL = requestTvTringAdConfigDurationL;

var requestTvTringAdSyncCache = function requestTvTringAdSyncCache(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/ad/tvTrying/syncCache"), params);
}; //广告-数据同步-生成前台缓存


exports.requestTvTringAdSyncCache = requestTvTringAdSyncCache;

var requestTvTringShowConfig = function requestTvTringShowConfig(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/ad/tvTrying/showConfig"), {
    params: params
  });
}; //广告-查看广告节目单配置


exports.requestTvTringShowConfig = requestTvTringShowConfig;

var requestProductSkuList = function requestProductSkuList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/p/product/sku"), params);
}; // 广告管理-个人中心登录页                                


exports.requestProductSkuList = requestProductSkuList;

var getHlcList = function getHlcList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/hlc/list"), params);
}; //广告管理-个人中心登录页-列表


exports.getHlcList = getHlcList;

var addHlcList = function addHlcList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/hlc/create"), params);
}; //广告管理-个人中心登录页-新增


exports.addHlcList = addHlcList;

var editHlcList = function editHlcList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/hlc/edit"), params);
}; //广告管理-个人中心登录页-修改


exports.editHlcList = editHlcList;

var syncHlcList = function syncHlcList(params, header) {
  return _request["default"].get("".concat(baseUrl, "/mms/hlc/syncCache"), {
    params: params,
    headers: header
  });
}; //广告管理-个人中心登录页-数据同步


exports.syncHlcList = syncHlcList;

var copyHlcList = function copyHlcList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/hlc/duplicate"), {
    params: params
  });
}; //广告管理-个人中心登录页-复制


exports.copyHlcList = copyHlcList;

var deleteHlcList = function deleteHlcList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/hlc/deleteItem"), {
    params: params
  });
}; //广告管理-个人中心登录页-删除


exports.deleteHlcList = deleteHlcList;

var changeStateHlcList = function changeStateHlcList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/hlc/changeState"), {
    params: params
  });
}; //广告管理-个人中心登录页-修改状态


exports.changeStateHlcList = changeStateHlcList;

var requestWxProgramList = function requestWxProgramList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/msg/getMpList"), params);
}; //获取小程序列表
//========== 配置管理 ==========


exports.requestWxProgramList = requestWxProgramList;

var requestConfigAddDoc = function requestConfigAddDoc(layer, params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/doc/").concat(layer === 0 ? '' : layer === 1 ? 'key/' : 'value/', "add"), params);
}; //配置列表-添加配置


exports.requestConfigAddDoc = requestConfigAddDoc;

var requestConfigDocList = function requestConfigDocList(layer, params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/doc/").concat(layer === 0 ? '' : layer === 1 ? 'key/' : 'value/', "get"), params);
}; //配置列表-配置列表


exports.requestConfigDocList = requestConfigDocList;

var requestConfigDeleteDoc = function requestConfigDeleteDoc(layer, params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/doc/").concat(layer === 0 ? '' : layer === 1 ? 'key/' : 'value/', "del"), params);
}; //配置列表-删除配置


exports.requestConfigDeleteDoc = requestConfigDeleteDoc;

var requestConfigUpdateDoc = function requestConfigUpdateDoc(layer, params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/doc/").concat(layer === 0 ? '' : layer === 1 ? 'key/' : 'value/', "update"), params);
}; //配置列表-更新配置


exports.requestConfigUpdateDoc = requestConfigUpdateDoc;

var requestOperateApk = function requestOperateApk(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/apk/get"), params);
}; //获取运营APK列表
// export const addOperateApk = params => { return axios.post(`${base}/mms/offline/apk/add`, params); };
// export const updateOperateApk = params => { return axios.post(`${base}/mms/offline/apk/update`, params); };
// export const removeOperateApk = params => { return axios.post(`${base}/mms/offline/apk/del`, params); };
//========== tv推荐配置 ==========


exports.requestOperateApk = requestOperateApk;

var requestChannelRecommendList = function requestChannelRecommendList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/channelRecommend/list"), params);
}; //频道管理-列表


exports.requestChannelRecommendList = requestChannelRecommendList;

var requestChannelRecommendSearchChannel = function requestChannelRecommendSearchChannel(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/channelRecommend/searchChannel"), {
    params: params
  });
}; //频道管理-下拉搜索频道


exports.requestChannelRecommendSearchChannel = requestChannelRecommendSearchChannel;

var requestChannelRecommendSearchProgram = function requestChannelRecommendSearchProgram(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/channelRecommend/searchProgram"), {
    params: params
  });
}; //频道推荐-下拉搜索节目视频


exports.requestChannelRecommendSearchProgram = requestChannelRecommendSearchProgram;

var selectSearch = function selectSearch(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/tv/channelRecommend/searchProgram"), {
    params: params
  });
}; //频道推荐-下拉搜索节目视频


exports.selectSearch = selectSearch;

var requestChannelRecommendCreate = function requestChannelRecommendCreate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/channelRecommend/create"), params);
}; //频道推荐-新增


exports.requestChannelRecommendCreate = requestChannelRecommendCreate;

var requestChannelRecommendEdit = function requestChannelRecommendEdit(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/channelRecommend/edit"), params);
}; //频道推荐-编辑


exports.requestChannelRecommendEdit = requestChannelRecommendEdit;

var requestChannelRecommendDelete = function requestChannelRecommendDelete(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/channelRecommend/deleteItem"), {
    params: params
  });
}; //频道推荐-删除


exports.requestChannelRecommendDelete = requestChannelRecommendDelete;

var requestChannelRecommendChangeState = function requestChannelRecommendChangeState(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/channelRecommend/changeState"), {
    params: params
  });
}; //频道推荐-修改状态


exports.requestChannelRecommendChangeState = requestChannelRecommendChangeState;

var requestChannelRecommendChannel = function requestChannelRecommendChannel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/get"), params);
}; //频道推荐-展示频道
//========== 微信管理 ==========


exports.requestChannelRecommendChannel = requestChannelRecommendChannel;

var requestWxReply = function requestWxReply(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wxReply/get"), params);
}; //获取微信回复


exports.requestWxReply = requestWxReply;

var requestWxReplyTypes = function requestWxReplyTypes(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/public/get"), params);
}; //获取回复公众号的类型


exports.requestWxReplyTypes = requestWxReplyTypes;

var requestWxReplyUpdate = function requestWxReplyUpdate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wxReply/update"), params);
}; //编辑|更新


exports.requestWxReplyUpdate = requestWxReplyUpdate;

var requestWxReplyDelete = function requestWxReplyDelete(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wxReply/del"), params);
}; //删除


exports.requestWxReplyDelete = requestWxReplyDelete;

var requestWxReplyCreate = function requestWxReplyCreate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wxReply/add"), params);
}; //添加


exports.requestWxReplyCreate = requestWxReplyCreate;

var requestConfigMenuImageList = function requestConfigMenuImageList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/config/menu/image/list"), params);
}; //菜单栏配置 列表


exports.requestConfigMenuImageList = requestConfigMenuImageList;

var requestConfigMenuImageCreate = function requestConfigMenuImageCreate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/config/menu/image/create"), params);
}; //菜单栏配置 新增


exports.requestConfigMenuImageCreate = requestConfigMenuImageCreate;

var requestConfigMenuImageEidt = function requestConfigMenuImageEidt(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/config/menu/image/edit"), params);
}; //菜单栏配置 编辑


exports.requestConfigMenuImageEidt = requestConfigMenuImageEidt;

var requestConfigMenuImageDelete = function requestConfigMenuImageDelete(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/config/menu/image/deleteItem"), {
    params: params
  });
}; //菜单栏配置 删除


exports.requestConfigMenuImageDelete = requestConfigMenuImageDelete;

var requestConfigMenuImageChangeState = function requestConfigMenuImageChangeState(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/config/menu/image/changeState"), {
    params: params
  });
}; //菜单栏配置 修改状态


exports.requestConfigMenuImageChangeState = requestConfigMenuImageChangeState;

var requestWxTemplateMsgConfigList = function requestWxTemplateMsgConfigList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tmpl/message/config/list"), params);
}; //微信模板消息 列表


exports.requestWxTemplateMsgConfigList = requestWxTemplateMsgConfigList;

var requestWxTemplateMsgConfigCreate = function requestWxTemplateMsgConfigCreate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tmpl/message/config/add"), params);
}; //微信模板消息 添加


exports.requestWxTemplateMsgConfigCreate = requestWxTemplateMsgConfigCreate;

var requestWxTemplateMsgConfigUpload = function requestWxTemplateMsgConfigUpload(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tmpl/message/config/update"), params);
}; //微信模板消息 修改


exports.requestWxTemplateMsgConfigUpload = requestWxTemplateMsgConfigUpload;

var requestWxTemplateMsgConfigDelete = function requestWxTemplateMsgConfigDelete(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tmpl/message/config/del"), params);
}; //微信模板消息 删除


exports.requestWxTemplateMsgConfigDelete = requestWxTemplateMsgConfigDelete;

var requestWxTemplateMsgConfigSend = function requestWxTemplateMsgConfigSend(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tmpl/message/config/send"), params);
}; //微信模板消息 测试发送
//========== 权限管理 ==========


exports.requestWxTemplateMsgConfigSend = requestWxTemplateMsgConfigSend;

var requestSysUser = function requestSysUser(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/user/get"), params);
}; //权限管理-用户列表


exports.requestSysUser = requestSysUser;

var requestSysUserCreate = function requestSysUserCreate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/user/add"), params);
}; //权限管理-创建用户


exports.requestSysUserCreate = requestSysUserCreate;

var requestSysUserUpdate = function requestSysUserUpdate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/user/update"), params);
}; //权限管理-用户更新


exports.requestSysUserUpdate = requestSysUserUpdate;

var requestSysUserDelete = function requestSysUserDelete(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/user/del"), params);
}; //权限管理-用户删除


exports.requestSysUserDelete = requestSysUserDelete;

var requestSysRole = function requestSysRole(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/role/get"), params);
}; //角色列表


exports.requestSysRole = requestSysRole;

var requestSysRoleCreate = function requestSysRoleCreate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/role/add"), params);
};

exports.requestSysRoleCreate = requestSysRoleCreate;

var requestSysRoleUpdate = function requestSysRoleUpdate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/role/update"), params);
};

exports.requestSysRoleUpdate = requestSysRoleUpdate;

var requestSysRoleDelete = function requestSysRoleDelete(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/role/del"), params);
};

exports.requestSysRoleDelete = requestSysRoleDelete;

var requestSysMenu = function requestSysMenu(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/menu/get"), params);
};

exports.requestSysMenu = requestSysMenu;

var requestSysMenuCreate = function requestSysMenuCreate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/menu/add"), params);
};

exports.requestSysMenuCreate = requestSysMenuCreate;

var requestSysMenuUpdate = function requestSysMenuUpdate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/menu/update"), params);
};

exports.requestSysMenuUpdate = requestSysMenuUpdate;

var requestSysMenuDelete = function requestSysMenuDelete(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/menu/del"), params);
};

exports.requestSysMenuDelete = requestSysMenuDelete;

var requestSysUserRolePermissions = function requestSysUserRolePermissions(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/role/permission/get"), params);
}; //获取用户角色权限列表


exports.requestSysUserRolePermissions = requestSysUserRolePermissions;

var requestSysUserRolePermissionCreate = function requestSysUserRolePermissionCreate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/role/permission/add"), params);
};

exports.requestSysUserRolePermissionCreate = requestSysUserRolePermissionCreate;

var requestSysUserRolePermissionUpdate = function requestSysUserRolePermissionUpdate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/role/permission/update"), params);
};

exports.requestSysUserRolePermissionUpdate = requestSysUserRolePermissionUpdate;

var requestSysUserRolePermissionDelete = function requestSysUserRolePermissionDelete(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/sys/role/permission/del"), params);
}; //========== 数据同步|数据缓存 ========== 


exports.requestSysUserRolePermissionDelete = requestSysUserRolePermissionDelete;

var syncOther = function syncOther(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/sync/other"), {
    params: params
  });
}; //其他缓存 其他缓存(热点频道/友盟上报/播放控制/分享码/产品线/文案/配置API/移动端banner/运营位/用户识别规则/热点节目/渠道/卡顿策略/设备权益/eslog/开机进入/定时任务/专享运营位/家庭账号配置)


exports.syncOther = syncOther;

var syncLiveCarousel = function syncLiveCarousel(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/sync/liveCarousel"), {
    params: params
  });
}; //直播轮播缓存(直播预告/轮播推荐/观影厅频道配置)


exports.syncLiveCarousel = syncLiveCarousel;

var syncSyncConfig = function syncSyncConfig(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/config/common/syn_config"), {
    params: params
  });
}; //查找合集短视频 /mms/config/common/syn_config?key=


exports.syncSyncConfig = syncSyncConfig;

var syncSynSlice = function syncSynSlice(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/config/common/syn_slice"), {
    params: params
  });
}; //查找合集短视频 /mms/config/common/syn_config?key=


exports.syncSynSlice = syncSynSlice;

var syncWeChat = function syncWeChat(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/sync/weChat"), {
    params: params
  });
}; //微信自动回复/wxcode/微信二维码


exports.syncWeChat = syncWeChat;

var syncMenuImage = function syncMenuImage(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/config/menu/image/syncCache"), {
    params: params
  });
}; //广告菜单栏目录配置


exports.syncMenuImage = syncMenuImage;

var syncWxTemplateMsgConfig = function syncWxTemplateMsgConfig(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tmpl/message/config/sync"), {
    params: params
  });
}; //微信模板消息 同步


exports.syncWxTemplateMsgConfig = syncWxTemplateMsgConfig;

var syncAdNewTagSync = function syncAdNewTagSync(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/ad/new/tag/sync"), {
    params: params
  });
}; //广告新标签 数据同步


exports.syncAdNewTagSync = syncAdNewTagSync;

var setMoney = function setMoney(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wxReply/setMoney"), {
    params: params
  });
}; //更新金额


exports.setMoney = setMoney;

var getMoney = function getMoney(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wxReply/getMoney"), {
    params: params
  });
}; //更新金额


exports.getMoney = getMoney;

var syncChannelRecommend = function syncChannelRecommend(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/channelRecommend/syncCache"), {
    params: params
  });
}; //频道推荐-数据同步
//小程序配置


exports.syncChannelRecommend = syncChannelRecommend;

var getMiniProList = function getMiniProList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/getMpListV2"), params);
}; //获取小程序配置列表


exports.getMiniProList = getMiniProList;

var addMpConfig = function addMpConfig(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/addMpConfig"), params);
}; //增加小程序配置列表


exports.addMpConfig = addMpConfig;

var delMpConfig = function delMpConfig(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/msg/delMpConfig?id=").concat(params.id));
}; //删除小程序配置列表
//广告管理---自定义规则便签


exports.delMpConfig = delMpConfig;

var requestAdRightKey = function requestAdRightKey(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/adRightKey/get"), params);
}; //获取广告素材 获取右下角广告


exports.requestAdRightKey = requestAdRightKey;

var addAdRightKey = function addAdRightKey(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/adRightKey/add"), params);
}; //获取广告素材 获取右下角广告


exports.addAdRightKey = addAdRightKey;

var addScreen = function addScreen(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/screen/add"), params);
}; //获取广告素材 获取右下角广告


exports.addScreen = addScreen;

var getScreen = function getScreen(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/screen/get"), params);
}; //获取广告素材 获取右下角广告


exports.getScreen = getScreen;

var requestAdTagList = function requestAdTagList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/tag/get"), params);
}; //获取列表


exports.requestAdTagList = requestAdTagList;

var addDIYTag = function addDIYTag(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/ad/tag/add"), params);
}; //增加自定义规则标签


exports.addDIYTag = addDIYTag;

var updateDIYTag = function updateDIYTag(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/ad/tag/update"), params);
}; //更新自定义规则标签


exports.updateDIYTag = updateDIYTag;

var delDIYTag = function delDIYTag(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/ad/tag/del"), params);
}; //删除自定义规则标签


exports.delDIYTag = delDIYTag;

var esQuery = function esQuery(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/ad/tag/esQuery"), params);
}; //esQuery
//广告组


exports.esQuery = esQuery;

var requestNewGroupCreate = function requestNewGroupCreate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/newGroup/add"), params);
}; //新建广告组


exports.requestNewGroupCreate = requestNewGroupCreate;

var requestNewGroupUpdate = function requestNewGroupUpdate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/newGroup/update"), params);
}; //更新广告组


exports.requestNewGroupUpdate = requestNewGroupUpdate;

var requestNewGroupList = function requestNewGroupList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/newGroup/get"), params);
}; //获取广告组


exports.requestNewGroupList = requestNewGroupList;

var requestNewGroupDelete = function requestNewGroupDelete(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/newGroup/del"), params);
}; //删除广告组


exports.requestNewGroupDelete = requestNewGroupDelete;

var requestNewGroupCopy = function requestNewGroupCopy(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/newGroup/copy"), params);
}; //复制广告组
//素材库


exports.requestNewGroupCopy = requestNewGroupCopy;

var getInfoGroup = function getInfoGroup(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/info/group/get"), params);
}; //信息流广告组


exports.getInfoGroup = getInfoGroup;

var addInfoGroup = function addInfoGroup(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/info/group/add"), params);
}; //信息流广告组


exports.addInfoGroup = addInfoGroup;

var updateInfoGroup = function updateInfoGroup(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/info/group/update"), params);
}; //信息流广告组


exports.updateInfoGroup = updateInfoGroup;

var delInfoGroup = function delInfoGroup(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/info/group/del"), params);
}; //信息流广告组


exports.delInfoGroup = delInfoGroup;

var getSdkList = function getSdkList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/sdk/get"), params);
}; //信息流广告组


exports.getSdkList = getSdkList;

var getPosition = function getPosition(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/space/get"), params);
}; //信息流广告组
//右下角广告


exports.getPosition = getPosition;

var getCorner = function getCorner(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/corner/get"), params);
}; //信息流广告组


exports.getCorner = getCorner;

var getChannelTag = function getChannelTag(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/tag/get"), params);
}; //信息流广告组


exports.getChannelTag = getChannelTag;

var updateCorner = function updateCorner(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/corner/update"), params);
}; //信息流广告组


exports.updateCorner = updateCorner;

var addCorner = function addCorner(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/corner/add"), params);
}; //信息流广告组


exports.addCorner = addCorner;

var delCorner = function delCorner(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/corner/del"), params);
}; //信息流广告组
//标签配置


exports.delCorner = delCorner;

var requestNewAdTagList = function requestNewAdTagList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/ad/new/tag/get"), {
    params: params
  });
}; //新版 获取用户标签列表


exports.requestNewAdTagList = requestNewAdTagList;

var getGroup = function getGroup(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/dict/cp/group/getInfo"), params);
}; //新版 获取用户标签列表


exports.getGroup = getGroup;

var requestNewAdTagCreate = function requestNewAdTagCreate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/new/tag/add"), params);
}; //新版 创建用户标签数据


exports.requestNewAdTagCreate = requestNewAdTagCreate;

var requestNewAdTagUpdate = function requestNewAdTagUpdate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/new/tag/update"), params);
}; //新版 更新用户标签规则


exports.requestNewAdTagUpdate = requestNewAdTagUpdate;

var requestNewAdTagRecord = function requestNewAdTagRecord(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/new/tag/record"), params);
}; //新版 更新用户标签规则


exports.requestNewAdTagRecord = requestNewAdTagRecord;

var requestNewAdTagDelete = function requestNewAdTagDelete(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/new/tag/del"), params);
}; //新版 删除用户标签规则


exports.requestNewAdTagDelete = requestNewAdTagDelete;

var requestDictionary = function requestDictionary(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/config/dictionary/get"), params);
}; //获取 字典数据源


exports.requestDictionary = requestDictionary;

var requestAdFieldList = function requestAdFieldList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/dict/tagDic/get"), params);
}; //获取Field列表


exports.requestAdFieldList = requestAdFieldList;

var adListSync = function adListSync(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/newGroup/sync"), params);
}; //获取Field列表


exports.adListSync = adListSync;

var adRightKeyUpdate = function adRightKeyUpdate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/adRightKey/update"), params);
}; //更新右键运营为


exports.adRightKeyUpdate = adRightKeyUpdate;

var screenUpdate = function screenUpdate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/screen/update"), params);
}; //更新屏显素材


exports.screenUpdate = screenUpdate;

var screenDel = function screenDel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/screen/del"), params);
}; //删除屏显素材


exports.screenDel = screenDel;

var adRightKeyDel = function adRightKeyDel(params) {
  return _request2["default"]["delete"]("".concat(baseUrl, "/mms/ad/adRightKey/del"), {
    params: params
  });
}; //删除屏显素材


exports.adRightKeyDel = adRightKeyDel;

var adRightKeySync = function adRightKeySync(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/adRightKey/sync"), params);
}; //素材混村


exports.adRightKeySync = adRightKeySync;

var screenCopy = function screenCopy(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/screen/copy"), params);
}; //素材混村


exports.screenCopy = screenCopy;

var adRightKeyCopy = function adRightKeyCopy(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/adRightKey/copy"), params);
}; //素材混村
//  转转管理------赚赚激励气泡


exports.adRightKeyCopy = adRightKeyCopy;

var getEarnTskList = function getEarnTskList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/bubbletask/list"), {
    params: params
  });
}; // 获取转转激励任务列表


exports.getEarnTskList = getEarnTskList;

var addEarnTskList = function addEarnTskList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/bubbletask/add"), params);
}; // 新增转转激励任务


exports.addEarnTskList = addEarnTskList;

var updateEarnTskList = function updateEarnTskList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/bubbletask/update"), params);
}; // 更新转转激励任务


exports.updateEarnTskList = updateEarnTskList;

var deleteEarnTskList = function deleteEarnTskList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/bubbletask/del"), {
    params: params
  });
}; // 删除转转激励任务


exports.deleteEarnTskList = deleteEarnTskList;

var syncEarnTskList = function syncEarnTskList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/bubbletask/sync"), params);
}; // 同步缓存转转激励任务
//赚赚管理---体现商品列表 


exports.syncEarnTskList = syncEarnTskList;

var getZzItemList = function getZzItemList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/zzItem/list"), params);
}; // 获取体现商品列表


exports.getZzItemList = getZzItemList;

var editZzItemList = function editZzItemList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/zzItem/edit"), params);
}; // 编辑体现商品列表


exports.editZzItemList = editZzItemList;

var addZzItemList = function addZzItemList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/zzItem/create"), params);
}; // 编辑体现商品列表


exports.addZzItemList = addZzItemList;

var deleteZzItemList = function deleteZzItemList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/zzItem/deleteItem"), {
    params: params
  });
}; // 编辑体现商品列表


exports.deleteZzItemList = deleteZzItemList;

var changeZzItemList = function changeZzItemList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/zzItem/changeState"), {
    params: params
  });
}; // 编辑体现商品列表


exports.changeZzItemList = changeZzItemList;

var syncZzItemList = function syncZzItemList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/zzItem/syncCache"), {
    params: params
  });
}; // 编辑体现商品列表


exports.syncZzItemList = syncZzItemList;

var rsZzItemList = function rsZzItemList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/zzItem/rs"), {
    params: params
  });
}; // 刷新库存
//赚赚管理---刷新库存


exports.rsZzItemList = rsZzItemList;

var getRefresh = function getRefresh(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/zzItemTicker/list"), params);
}; // 获取库存列表


exports.getRefresh = getRefresh;

var addRefresh = function addRefresh(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/zzItemTicker/store"), params);
}; // 编辑和新增库存列表


exports.addRefresh = addRefresh;

var changeRefresh = function changeRefresh(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/zzItemTicker/changeState"), {
    params: params
  });
}; // 编辑和新增库存列表


exports.changeRefresh = changeRefresh;

var delRefresh = function delRefresh(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/zzItemTicker/deleteItem"), {
    params: params
  });
}; // 编辑和新增库存列表
//赚赚管理 ---随机提现配置 


exports.delRefresh = delRefresh;

var getZZShow = function getZZShow(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/zz/show"), {
    params: params
  });
};

exports.getZZShow = getZZShow;

var saveZZShow = function saveZZShow(params, header) {
  return _request2["default"].post("".concat(baseUrl, "/mms/zz/store?key=").concat(header.key), params);
};

exports.saveZZShow = saveZZShow;

var syncZZShow = function syncZZShow(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/zz/syncCache"), {
    params: params
  });
}; //白名单配置


exports.syncZZShow = syncZZShow;

var addWhite = function addWhite(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/whitelist/add"), params);
}; // 新增白名单配置


exports.addWhite = addWhite;

var listWhite = function listWhite(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/ad/whitelist/list"), {
    params: params
  });
}; // 获取白名单配置


exports.listWhite = listWhite;

var updateWhite = function updateWhite(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/whitelist/update"), params);
}; // 更新白名单配置


exports.updateWhite = updateWhite;

var deleteWhite = function deleteWhite(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/whitelist/delete"), params);
}; // 删除白名单配置


exports.deleteWhite = deleteWhite;

var syncWhite = function syncWhite(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/whitelist/sync"), params);
}; // 同步
//电视节目单配置


exports.syncWhite = syncWhite;

var getProgramAppConfig = function getProgramAppConfig(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/programApp/programAppConfig/get"), {
    params: params
  });
}; // 获取电视节目单配置列表


exports.getProgramAppConfig = getProgramAppConfig;

var updateProgramAppConfig = function updateProgramAppConfig(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/programApp/programAppConfig/update"), params);
}; // 更新电视节目单列表


exports.updateProgramAppConfig = updateProgramAppConfig;

var syncProgramAppConfig = function syncProgramAppConfig(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/sync/programAppConfig"), {
    params: params
  });
}; // 更新电视节目单列表
// 抽奖活动 


exports.syncProgramAppConfig = syncProgramAppConfig;

var getPActivityList = function getPActivityList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/activity/truntable/list"), {
    params: params
  });
}; // 获取列表


exports.getPActivityList = getPActivityList;

var updatePActivity = function updatePActivity(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/activity/truntable/update"), params);
}; // 修改活动


exports.updatePActivity = updatePActivity;

var updatePActivityStatus = function updatePActivityStatus(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/activity/truntable/status"), {
    params: params
  });
}; // 上下线活动


exports.updatePActivityStatus = updatePActivityStatus;

var addPActivity = function addPActivity(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/activity/truntable/add"), params);
}; // 新增


exports.addPActivity = addPActivity;

var removePActivity = function removePActivity(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/activity/truntable/del"), {
    params: params
  });
}; // 删除


exports.removePActivity = removePActivity;

var goodsRealStock = function goodsRealStock(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/activity/truntable/realStock"), {
    params: params
  });
}; // 对应的商品实时库存


exports.goodsRealStock = goodsRealStock;

var syncPActivity = function syncPActivity(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/activity/truntable/sync"), {
    params: params
  });
}; // 同步缓存
// 商品配置


exports.syncPActivity = syncPActivity;

var getPProductList = function getPProductList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/activity/truntable/goods"), {
    params: params
  });
}; // 商品列表


exports.getPProductList = getPProductList;

var delgoodsList = function delgoodsList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/activity/truntable/delgoods"), {
    params: params
  });
}; // 删除商品


exports.delgoodsList = delgoodsList;

var addPActivityGoods = function addPActivityGoods(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/activity/truntable/addgoods"), params);
}; // 新增商品


exports.addPActivityGoods = addPActivityGoods;

var updateGoods = function updateGoods(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/activity/truntable/updategoods"), params);
}; // 编辑商品
//源失效推推荐


exports.updateGoods = updateGoods;

var getSource = function getSource(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/sourceInvalidRecommend/get"), params);
}; // 获取源失效推荐


exports.getSource = getSource;

var addSource = function addSource(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/sourceInvalidRecommend/add"), params);
}; // 新增源失效推荐


exports.addSource = addSource;

var updateSource = function updateSource(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/sourceInvalidRecommend/update"), params);
}; // 更新源失效推荐


exports.updateSource = updateSource;

var delSource = function delSource(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/sourceInvalidRecommend/del"), params);
}; // 删除源失效推荐


exports.delSource = delSource;

var syncSource = function syncSource(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/sourceInvalidRecommend/sync"), {
    params: params
  });
}; // 同步缓存-源失效推荐


exports.syncSource = syncSource;

var copySource = function copySource(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/sourceInvalidRecommend/copy"), params);
}; // 复制源失效推荐
//节目单视频集配置


exports.copySource = copySource;

var getProgramlist = function getProgramlist(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/svcollection/programlist"), {
    params: params
  });
}; // 节目单视频集列表


exports.getProgramlist = getProgramlist;

var getShortList = function getShortList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/svcollection/list"), {
    params: params
  });
}; // 短视频视频集列表


exports.getShortList = getShortList;

var addProgramList = function addProgramList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/svcollection/programadd"), params);
}; // 短视频视频集列表


exports.addProgramList = addProgramList;

var uploadProgramList = function uploadProgramList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/svcollection/programupdate"), params);
}; // 短视频视频集列表


exports.uploadProgramList = uploadProgramList;

var getDetailProgram = function getDetailProgram(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/text/program"), {
    params: params
  });
}; // 获取节目单信息


exports.getDetailProgram = getDetailProgram;

var getProgramInfo = function getProgramInfo(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/svcollection/programinfo"), {
    params: params
  });
}; // 节目单视频集详情


exports.getProgramInfo = getProgramInfo;

var delProgramList = function delProgramList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/svcollection/programdel"), {
    params: params
  });
}; // 删除节目单


exports.delProgramList = delProgramList;

var syncProgramList = function syncProgramList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/svcollection/programsync"), {
    params: params
  });
}; // 同步


exports.syncProgramList = syncProgramList;

var addShortList = function addShortList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/svcollection/add"), params);
}; // 同步


exports.addShortList = addShortList;

var searchShortList = function searchShortList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/shortVideo/searchbyid"), {
    params: params
  });
}; // 同步


exports.searchShortList = searchShortList;

var updateShortList = function updateShortList(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/svcollection/update"), params);
}; // 同步


exports.updateShortList = updateShortList;

var delShortList = function delShortList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/svcollection/del"), {
    params: params
  });
}; // 同步


exports.delShortList = delShortList;

var getSuggest = function getSuggest(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/suggest/list"), {
    params: params
  });
}; // 首页为你推荐列表


exports.getSuggest = getSuggest;

var addSuggest = function addSuggest(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/home/suggest/add"), params);
}; // 首页为你推荐列表


exports.addSuggest = addSuggest;

var updateSuggest = function updateSuggest(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/home/suggest/update"), params);
}; // 首页为你推荐列表


exports.updateSuggest = updateSuggest;

var syncSuggest = function syncSuggest(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/suggest/sync"), {
    params: params
  });
}; // 首页为你推荐列表同步


exports.syncSuggest = syncSuggest;

var getSuggestInfo = function getSuggestInfo(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/home/suggest/getBaseInfo"), {
    params: params
  });
}; // 首页为你推荐基本信息获取


exports.getSuggestInfo = getSuggestInfo;

var setSuggestInfo = function setSuggestInfo(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/home/suggest/setBaseInfo"), params);
}; // 首页为你推荐基本信息获取
//首页文字轮播配置


exports.setSuggestInfo = setSuggestInfo;

var getWordsConfig = function getWordsConfig(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/text/list"), {
    params: params
  });
}; // 首页文字轮播配置列表


exports.getWordsConfig = getWordsConfig;

var uploadWordsConfig = function uploadWordsConfig(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/home/text/update"), params);
}; // 首页文字轮播配置列表


exports.uploadWordsConfig = uploadWordsConfig;

var addWordsConfig = function addWordsConfig(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/home/text/add"), params);
}; // 首页文字轮播配置列表


exports.addWordsConfig = addWordsConfig;

var delWordsConfig = function delWordsConfig(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/text/del"), {
    params: params
  });
}; // 首页文字轮播配置列表


exports.delWordsConfig = delWordsConfig;

var getImageWordsConfig = function getImageWordsConfig(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/text/image"), {
    params: params
  });
}; // 首页文字轮播配置列表


exports.getImageWordsConfig = getImageWordsConfig;

var setImageWordsConfig = function setImageWordsConfig(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/text/uploadimage"), {
    params: params
  });
}; // 首页文字轮播配置列表


exports.setImageWordsConfig = setImageWordsConfig;

var syncWordsConfig = function syncWordsConfig(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/text/sync"), {
    params: params
  });
}; // 首页文字轮播配置列表
//首页直播配置


exports.syncWordsConfig = syncWordsConfig;

var getHomeList = function getHomeList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/channel/list"), {
    params: params
  });
}; // 首页直播配置列表


exports.getHomeList = getHomeList;

var uploadHomeList = function uploadHomeList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/home/channel/update"), params);
}; // 首页直播配置列表


exports.uploadHomeList = uploadHomeList;

var addHomeList = function addHomeList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/home/channel/add"), params);
}; // 首页直播配置列表新增


exports.addHomeList = addHomeList;

var delHomeList = function delHomeList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/home/channel/del"), {
    params: params
  });
}; // 首页直播配置列表新增


exports.delHomeList = delHomeList;

var getStateHomeList = function getStateHomeList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/channel/status"), {
    params: params
  });
}; // 首页直播配置列表


exports.getStateHomeList = getStateHomeList;

var setStateHomeList = function setStateHomeList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/channel/setstatus"), {
    params: params
  });
}; // 首页直播配置列表


exports.setStateHomeList = setStateHomeList;

var syncHomeList = function syncHomeList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/channel/sync"), {
    params: params
  });
}; // 首页直播配置列表


exports.syncHomeList = syncHomeList;

var getHomeBaseInfo = function getHomeBaseInfo(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/home/channel/getBaseInfo"), {
    params: params
  });
}; // 首页为你推荐基本信息获取


exports.getHomeBaseInfo = getHomeBaseInfo;

var getAllBaseInfo = function getAllBaseInfo(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/home/channel/getAllBaseInfo"), {
    params: params
  });
}; // 首页全部直播基本信息获取


exports.getAllBaseInfo = getAllBaseInfo;

var addTab = function addTab(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/home/channel/newBaseInfo"), params);
}; // 首页直播新增加tab


exports.addTab = addTab;

var setHomeBaseInfo = function setHomeBaseInfo(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/home/channel/setBaseInfo"), params);
}; // 首页直播基本信息配置(原只状态设置）
//微信菜单


exports.setHomeBaseInfo = setHomeBaseInfo;

var addWechatMenu = function addWechatMenu(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/menu/new/add"), params);
}; // 创建菜单


exports.addWechatMenu = addWechatMenu;

var getWechatMenu = function getWechatMenu(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/menu/new/get"), {
    params: params
  });
}; // 获取菜单


exports.getWechatMenu = getWechatMenu;

var delWechatMenu = function delWechatMenu(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/menu/new/delete"), {
    params: params
  });
}; // 删除菜单


exports.delWechatMenu = delWechatMenu;

var getWxlist = function getWxlist(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/menu/new/wxlist"), {
    params: params
  });
}; // 获取菜单


exports.getWxlist = getWxlist;

var setMenuState = function setMenuState(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/menu/new/status"), {
    params: params
  });
}; // 设置菜单状态


exports.setMenuState = setMenuState;

var uploadWechatMenu = function uploadWechatMenu(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/menu/new/update"), params);
}; // 编辑菜单
//微信个性化群发


exports.uploadWechatMenu = uploadWechatMenu;

var preSend = function preSend(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/push/preview"), params);
}; // 微信群发预览


exports.preSend = preSend;

var addSend = function addSend(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/push/add"), params);
}; // 新建微信群发


exports.addSend = addSend;

var materialSend = function materialSend(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/push/material"), params);
}; // 获取微信图文素材


exports.materialSend = materialSend;

var wechatMaterialSend = function wechatMaterialSend(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/push/drafts"), params);
}; // 获取微信草稿箱


exports.wechatMaterialSend = wechatMaterialSend;

var getSend = function getSend(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/push/list"), {
    params: params
  });
}; // 群发列表


exports.getSend = getSend;

var everySend = function everySend(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/push/data"), {
    params: params
  });
}; // 微信群发结束后的统计结果


exports.everySend = everySend;

var cancelSend = function cancelSend(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/push/cancel"), {
    params: params
  });
}; // 取消预约推送


exports.cancelSend = cancelSend;

var reSend = function reSend(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/push/resend"), {
    params: params
  });
}; // 取消推送重发


exports.reSend = reSend;

var delSend = function delSend(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/push/delete"), {
    params: params
  });
}; // 撤销发送
//微信粉丝


exports.delSend = delSend;

var getFansTagList = function getFansTagList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/fansTag/list"), params);
}; // 获取微信标签详情列表


exports.getFansTagList = getFansTagList;

var addFansTag = function addFansTag(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/fansTag/add"), params);
}; // 新增粉丝标签


exports.addFansTag = addFansTag;

var updateFansTag = function updateFansTag(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/fansTag/update"), params);
}; // 更新粉丝标签


exports.updateFansTag = updateFansTag;

var delFansTag = function delFansTag(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/fansTag/del"), params);
}; // 删除粉丝标签


exports.delFansTag = delFansTag;

var getFansTag = function getFansTag(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/fansTag/get"), params);
}; // 粉丝标签列表
//火星开机进入 


exports.getFansTag = getFansTag;

var getMarsList = function getMarsList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/ad/marsStartup/get"), {
    params: params
  });
}; // 获取


exports.getMarsList = getMarsList;

var addMarsList = function addMarsList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/marsStartup/add"), params);
}; // 获取


exports.addMarsList = addMarsList;

var uploadMarsList = function uploadMarsList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/marsStartup/update"), params);
}; // 获取


exports.uploadMarsList = uploadMarsList;

var delMarsList = function delMarsList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/ad/marsStartup/del"), {
    params: params
  });
}; // 获取
//赚赚限时任务


exports.delMarsList = delMarsList;

var addEnterChannel = function addEnterChannel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/config/vipBootChannelConfig/add"), params);
}; // 添加会员开机进入频道配置


exports.addEnterChannel = addEnterChannel;

var getEnterChannel = function getEnterChannel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/config/vipBootChannelConfig/get"), params);
}; // 查询会员开机进入频道配置


exports.getEnterChannel = getEnterChannel;

var delEnterChannel = function delEnterChannel(params) {
  return _request2["default"]["delete"]("".concat(baseUrl, "/mms/config/vipBootChannelConfig/del"), {
    params: params
  });
}; // 会员开机进入频道配置 - 删除


exports.delEnterChannel = delEnterChannel;

var uploadEnterChannel = function uploadEnterChannel(params) {
  return _request2["default"].put("".concat(baseUrl, "/mms/config/vipBootChannelConfig/update"), params);
}; // 更新会员开机进入频道配置


exports.uploadEnterChannel = uploadEnterChannel;

var syncEnterChannel = function syncEnterChannel(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/config/vipBootChannelConfig/sync"), {
    params: params
  });
}; // 同步会员开机进入频道配置
//开机启动图配置


exports.syncEnterChannel = syncEnterChannel;

var getPowerBoot = function getPowerBoot(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/powerBoot/list"), params);
}; // 开机启动-列表


exports.getPowerBoot = getPowerBoot;

var addPowerBoot = function addPowerBoot(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/powerBoot/create"), params);
}; // 开机启动-列表


exports.addPowerBoot = addPowerBoot;

var editPowerBoot = function editPowerBoot(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/powerBoot/edit"), params);
}; // 开机启动-列表


exports.editPowerBoot = editPowerBoot;

var delPowerBoot = function delPowerBoot(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/powerBoot/deleteItem"), {
    params: params
  });
}; // 开机启动-列表


exports.delPowerBoot = delPowerBoot;

var changePowerBoot = function changePowerBoot(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/powerBoot/changeState"), {
    params: params
  });
}; // 开机启动-列表


exports.changePowerBoot = changePowerBoot;

var syncPowerBoot = function syncPowerBoot(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/powerBoot/syncCache"), {
    params: params
  });
}; // 开机启动-列表
//好看分类


exports.syncPowerBoot = syncPowerBoot;

var getHkCategory = function getHkCategory(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/hkCategory/list"), params);
}; // 开机启动-列表


exports.getHkCategory = getHkCategory;

var addHkCategory = function addHkCategory(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/hkCategory/create"), params);
}; // 开机启动-列表


exports.addHkCategory = addHkCategory;

var editHkCategory = function editHkCategory(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/hkCategory/edit"), params);
}; // 开机启动-列表


exports.editHkCategory = editHkCategory;

var delHkCategory = function delHkCategory(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/hkCategory/deleteItem"), {
    params: params
  });
}; // 开机启动-列表


exports.delHkCategory = delHkCategory;

var changeHkCategory = function changeHkCategory(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/hkCategory/changeState"), {
    params: params
  });
}; // 开机启动-列表


exports.changeHkCategory = changeHkCategory;

var switchHkCategory = function switchHkCategory(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/hkCategory/switch"), {
    params: params
  });
}; // 开机启动-列表


exports.switchHkCategory = switchHkCategory;

var syncHkCategory = function syncHkCategory(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/hkCategory/syncCache"), {
    params: params
  });
}; // 开机启动-列表
//体育频道视频集配置


exports.syncHkCategory = syncHkCategory;

var getChannelSport = function getChannelSport(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/channelSport/svcList"), params);
}; // 配置管理-体育频道视频集配置-列表


exports.getChannelSport = getChannelSport;

var addChannelSport = function addChannelSport(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/channelSport/svcAdd"), params);
}; // 配置管理-体育频道视频集配置-添加


exports.addChannelSport = addChannelSport;

var delChannelSport = function delChannelSport(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/channelSport/svcRemove"), {
    params: params
  });
}; // 配置管理-体育频道视频集配置-移除


exports.delChannelSport = delChannelSport;

var resetChannelSport = function resetChannelSport(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/channelSport/svcResort"), {
    params: params
  });
}; // 配置管理-体育频道视频集配置-重新生成排序序号


exports.resetChannelSport = resetChannelSport;

var syncChannelSport = function syncChannelSport(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/channelSport/svcSyncCache"), {
    params: params
  });
}; // 配置管理-体育频道视频集配置-数据同步


exports.syncChannelSport = syncChannelSport;

var sortChannelSport = function sortChannelSport(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/channelSport/svcChangeSort"), params);
}; // 配置管理-体育频道视频集配置-排序
//企业微信


exports.sortChannelSport = sortChannelSport;

var getQrcodeConfig = function getQrcodeConfig(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qrcode/configs"), {
    params: params
  });
}; // 获取登录、解锁二维码配置


exports.getQrcodeConfig = getQrcodeConfig;

var saveQrcodeConfig = function saveQrcodeConfig(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/qrcode/saveconfig"), params);
}; // 保存登录、解锁二维码配置


exports.saveQrcodeConfig = saveQrcodeConfig;

var getWechatUser = function getWechatUser(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qrcode/qywechatuser"), {
    params: params
  });
}; // 企业微信客服列表


exports.getWechatUser = getWechatUser;

var getMyWechatUser = function getMyWechatUser(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qrcode/listreluser"), {
    params: params
  });
}; // 易添加企业微信客服列表


exports.getMyWechatUser = getMyWechatUser;

var syncMyWechatUser = function syncMyWechatUser(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qrcode/syncconfig"), {
    params: params
  });
}; // 易添加企业微信客服列表sync


exports.syncMyWechatUser = syncMyWechatUser;

var syncQrcodeConfig = function syncQrcodeConfig(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qrcode/syncusers"), {
    params: params
  });
}; // 同步企业微信数据到我们的库中


exports.syncQrcodeConfig = syncQrcodeConfig;

var saveMyWechatUser = function saveMyWechatUser(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/qrcode/savereluser"), params);
};

exports.saveMyWechatUser = saveMyWechatUser;

var getWechatList = function getWechatList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qywechat/codes"), {
    params: params
  });
}; //获取企业微信列表


exports.getWechatList = getWechatList;

var getCount = function getCount(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qrcode/listrelcount"), {
    params: params
  });
}; //企业微信客服解锁使用次数


exports.getCount = getCount;

var getexcluswitch = function getexcluswitch(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qrcode/getexcluswitch"), {
    params: params
  });
}; //企业微信客服解锁


exports.getexcluswitch = getexcluswitch;

var setexcluswitch = function setexcluswitch(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qrcode/setexcluswitch"), {
    params: params
  });
}; //企业微信客服解锁使用次数
// 易添加企业微信客服列表更新


exports.setexcluswitch = setexcluswitch;

var getWelcome = function getWelcome(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qywechat/listwelcome"), {
    params: params
  });
}; // 易添加企业微信客服列表更新


exports.getWelcome = getWelcome;

var addWelcome = function addWelcome(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/qywechat/addwelcome"), params);
}; // 易添加企业微信客服列表新增


exports.addWelcome = addWelcome;

var saveWelcome = function saveWelcome(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/qywechat/savewelcome"), params);
}; // 易添加企业微信客服列表更新


exports.saveWelcome = saveWelcome;

var delWelcome = function delWelcome(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qywechat/delwelcome"), {
    params: params
  });
}; // 易添加企业微信客服列表更新


exports.delWelcome = delWelcome;

var changeWelcome = function changeWelcome(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qywechat/welcomestatus"), {
    params: params
  });
}; // 易添加企业微信客服列表状态改变


exports.changeWelcome = changeWelcome;

var uploadImage = function uploadImage(params, form, header) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/qywechat/uploadimg?qywechatCode=").concat(params.qywechatCode), form, {
    headers: header
  });
}; // 上传图片
//企微标签


exports.uploadImage = uploadImage;

var synctags = function synctags(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qywechat/synctags"), {
    params: params
  });
}; //同步企业微信企业标签


exports.synctags = synctags;

var corptags = function corptags(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qywechat/corptags"), {
    params: params
  });
}; //获取企业微信标签


exports.corptags = corptags;

var addcorptagtask = function addcorptagtask(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/wx/qywechat/addcorptagtask"), params);
}; //同步企业微信企业标签


exports.addcorptagtask = addcorptagtask;

var corptagtasks = function corptagtasks(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qywechat/corptagtasks"), {
    params: params
  });
}; //企业微信标签任务列表


exports.corptagtasks = corptagtasks;

var corptagtaskstatus = function corptagtaskstatus(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qywechat/corptagtaskstatus"), {
    params: params
  });
}; //企业微信标签任务上下线


exports.corptagtaskstatus = corptagtaskstatus;

var delcorptagtask = function delcorptagtask(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/wx/qywechat/delcorptagtask"), {
    params: params
  });
}; //企业微信标签删除
//移动端节目单屏蔽


exports.delcorptagtask = delcorptagtask;

var getShieldList = function getShieldList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/programs/listAllPrograms"), {
    params: params
  });
}; //查询节目单


exports.getShieldList = getShieldList;

var delShieldList = function delShieldList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/programs/delBlackProgram"), params);
}; //删除黑名单节目


exports.delShieldList = delShieldList;

var addShieldList = function addShieldList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/programs/addBlackProgram"), params);
}; //添加节目到黑名单
//家庭相册传照片配置


exports.addShieldList = addShieldList;

var getActivityConfig = function getActivityConfig(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/album/config/upload/guideActivity/list"), params);
}; //引导上传照片活动配置 - 查


exports.getActivityConfig = getActivityConfig;

var addActivityConfig = function addActivityConfig(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/album/config/upload/guideActivity/add"), params);
}; //引导上传照片活动配置 - 增加


exports.addActivityConfig = addActivityConfig;

var updateActivityConfig = function updateActivityConfig(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/album/config/upload/guideActivity/update"), params);
}; //引导上传照片活动配置 - 更新


exports.updateActivityConfig = updateActivityConfig;

var delActivityConfig = function delActivityConfig(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/album/config/upload/guideActivity/del"), {
    params: params
  });
}; //引导上传照片活动配置 - 删


exports.delActivityConfig = delActivityConfig;

var syncActivityConfig = function syncActivityConfig(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/album/config/upload/guideActivity/sync"), {
    params: params
  });
}; //引导上传照片活动配置 - 缓存同步
//  好剧专题


exports.syncActivityConfig = syncActivityConfig;

var specialList = function specialList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/special/list"), {
    params: params
  });
}; // 专题列表


exports.specialList = specialList;

var specialAdd = function specialAdd(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/home/special/add"), params);
}; // 新增专题


exports.specialAdd = specialAdd;

var specialGetBaseInfo = function specialGetBaseInfo(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/special/getBaseInfo"), {
    params: params
  });
}; // 获取专题标题


exports.specialGetBaseInfo = specialGetBaseInfo;

var specialSetBaseInfo = function specialSetBaseInfo(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/home/special/setBaseInfo"), params);
}; // 设置专题标题


exports.specialSetBaseInfo = specialSetBaseInfo;

var specialStatus = function specialStatus(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/special/status"), {
    params: params
  });
}; // 获取专题标题


exports.specialStatus = specialStatus;

var specialSync = function specialSync(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/special/sync"), {
    params: params
  });
}; // 专题同步


exports.specialSync = specialSync;

var specialUpdate = function specialUpdate(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/channel/home/special/update"), params);
}; // 修改专题


exports.specialUpdate = specialUpdate;

var specialDelete = function specialDelete(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/special/del"), {
    params: params
  });
}; // 专题删除


exports.specialDelete = specialDelete;

var specialChangepos = function specialChangepos(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/special/changepos"), {
    params: params
  });
}; // 设置专题排序


exports.specialChangepos = specialChangepos;

var specialResort = function specialResort(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/home/special/resort"), {
    params: params
  });
}; // 专题重排序
//移动端节目单屏蔽


exports.specialResort = specialResort;

var getCategories = function getCategories(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/programs/getCategories"), {
    params: params
  });
}; // 节目类型 


exports.getCategories = getCategories;

var getlistAllPrograms = function getlistAllPrograms(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/programs/listAllPrograms"), {
    params: params
  });
}; // 列表-节目单


exports.getlistAllPrograms = getlistAllPrograms;

var getCategoriesDetail = function getCategoriesDetail(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/channel/programs/").concat(params.id), {
    params: params
  });
}; // 详情-节目单


exports.getCategoriesDetail = getCategoriesDetail;

var categoriesUpdate = function categoriesUpdate(programeId, params) {
  return _request["default"].put("".concat(baseUrl, "/mms/channel/programs/").concat(programeId), params);
}; // 马甲包


exports.categoriesUpdate = categoriesUpdate;

var getArmourPackage = function getArmourPackage(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/armourPackage/list"), params);
}; //引导上传照片活动配置 - 缓存同步


exports.getArmourPackage = getArmourPackage;

var addArmourPackage = function addArmourPackage(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/armourPackage/create"), params);
}; //引导上传照片活动配置 - 缓存同步


exports.addArmourPackage = addArmourPackage;

var delArmourPackage = function delArmourPackage(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/armourPackage/delete"), {
    params: params
  });
}; //引导上传照片活动配置 - 缓存同步


exports.delArmourPackage = delArmourPackage;

var editArmourPackage = function editArmourPackage(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/armourPackage/edit"), params);
}; //引导上传照片活动配置 - 缓存同步


exports.editArmourPackage = editArmourPackage;

var copyArmourPackage = function copyArmourPackage(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/armourPackage/copy"), {
    params: params
  });
}; //引导上传照片活动配置 - 缓存同步


exports.copyArmourPackage = copyArmourPackage;

var syncArmourPackage = function syncArmourPackage(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/armourPackage/sync"), {
    params: params
  });
}; //引导上传照片活动配置 - 缓存同步
//  微信登陆-专享配置


exports.syncArmourPackage = syncArmourPackage;

var getconfigsLogin = function getconfigsLogin(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/wx/exclusive/list"), {
    params: params
  });
}; // 解锁配置列表


exports.getconfigsLogin = getconfigsLogin;

var getconfigsstatus = function getconfigsstatus(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/wx/exclusive/status"), {
    params: params
  });
}; // 解锁配置上下线


exports.getconfigsstatus = getconfigsstatus;

var getconfigsAdd = function getconfigsAdd(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/exclusive/add"), params);
}; // 解锁配置添加


exports.getconfigsAdd = getconfigsAdd;

var getconfigsUpdate = function getconfigsUpdate(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/exclusive/update"), params);
}; // 解锁配置更新


exports.getconfigsUpdate = getconfigsUpdate;

var getconfigsDelete = function getconfigsDelete(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/wx/exclusive/delete"), {
    params: params
  });
}; // 解锁配置删除


exports.getconfigsDelete = getconfigsDelete;

var getconfigsSync = function getconfigsSync(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/wx/exclusive/sync"), {
    params: params
  });
}; // 解锁配置同步
// 登录(专享)配置


exports.getconfigsSync = getconfigsSync;

var listextraGet = function listextraGet(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/wx/qrcode/listextra"), {
    params: params
  });
}; // 解锁二维码文案描述


exports.listextraGet = listextraGet;

var setextra = function setextra(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/wx/qrcode/setextra"), params);
}; // 设置解锁二维码文案描述


exports.setextra = setextra;

var bigwechatsPublic = function bigwechatsPublic(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/wx/qrcode/bigwechats"), {
    params: params
  });
}; // 公众号大号的列表
//下线节目


exports.bigwechatsPublic = bigwechatsPublic;

var getOfflineProgram = function getOfflineProgram(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/program/get"), params);
}; //下线节目列表


exports.getOfflineProgram = getOfflineProgram;

var getApkList = function getApkList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/apk/get"), params);
}; //下线节目列表


exports.getApkList = getApkList;

var getOfflineChannel = function getOfflineChannel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/channel/get"), params);
}; //下线节目列表


exports.getOfflineChannel = getOfflineChannel;

var updateOfflineTime = function updateOfflineTime(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/schedule/update"), params);
}; //下线节目列表


exports.updateOfflineTime = updateOfflineTime;

var delOfflineChannel = function delOfflineChannel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/channel/del"), params);
}; //删除频道


exports.delOfflineChannel = delOfflineChannel;

var addOfflineChannel = function addOfflineChannel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/channel/add"), params);
}; //删除频道


exports.addOfflineChannel = addOfflineChannel;

var updateOfflineChannel = function updateOfflineChannel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/channel/update"), params);
}; //删除频道


exports.updateOfflineChannel = updateOfflineChannel;

var updateOfflineProgram = function updateOfflineProgram(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/program/update"), params);
}; //删除频道


exports.updateOfflineProgram = updateOfflineProgram;

var copyOfflineProgram = function copyOfflineProgram(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/program/copy"), params);
}; //删除频道


exports.copyOfflineProgram = copyOfflineProgram;

var addOfflineProgram = function addOfflineProgram(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/program/add"), params);
}; //删除频道


exports.addOfflineProgram = addOfflineProgram;

var delOfflineProgram = function delOfflineProgram(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/program/del"), params);
}; //删除频道


exports.delOfflineProgram = delOfflineProgram;

var syncOfflineProgram = function syncOfflineProgram(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/sync/offline"), {
    params: params
  });
}; //删除频道
//风险设备


exports.syncOfflineProgram = syncOfflineProgram;

var getRiskConfig = function getRiskConfig(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/offline/program/risk/config"), {
    params: params
  });
}; //删除频道


exports.getRiskConfig = getRiskConfig;

var editRiskConfig = function editRiskConfig(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/offline/program/risk/config"), params);
}; //删除频道
//支付成功页面


exports.editRiskConfig = editRiskConfig;

var getAdSPList = function getAdSPList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/adSP/list"), params);
}; //查看支付成功列表


exports.getAdSPList = getAdSPList;

var addAdSPList = function addAdSPList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/adSP/create"), params);
}; //查看支付成功列表


exports.addAdSPList = addAdSPList;

var updateAdSPList = function updateAdSPList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/ad/adSP/update"), params);
}; //查看支付成功列表


exports.updateAdSPList = updateAdSPList;

var delAdSPList = function delAdSPList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/ad/adSP/del"), {
    params: params
  });
}; //查看支付成功列表


exports.delAdSPList = delAdSPList;

var syncAdSPList = function syncAdSPList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/sync/ad"), {
    params: params
  });
}; //查看支付成功列表
//tv菜单配置


exports.syncAdSPList = syncAdSPList;

var getMenuList = function getMenuList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/menu/list"), params);
}; //菜单配置列表


exports.getMenuList = getMenuList;

var addMenuList = function addMenuList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/menu/create"), params);
}; //菜单配置列表


exports.addMenuList = addMenuList;

var updateMenuList = function updateMenuList(params) {
  return _request2["default"].put("".concat(baseUrl, "/mms/tv/menu/").concat(params.id), params);
}; //菜单配置列表


exports.updateMenuList = updateMenuList;

var delMenuList = function delMenuList(params) {
  return _request2["default"]["delete"]("".concat(baseUrl, "/mms/tv/menu/").concat(params.id), params);
}; //菜单配置列表


exports.delMenuList = delMenuList;

var syncMenuList = function syncMenuList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/menu/syncCache"), {
    params: params
  });
}; //菜单配置列表
//apk配置


exports.syncMenuList = syncMenuList;

var requestApkConfigAdd = function requestApkConfigAdd(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/apk/add"), params);
}; //新增apk


exports.requestApkConfigAdd = requestApkConfigAdd;

var requestApkConfigSync = function requestApkConfigSync(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/apk/sync"), params);
}; //同步apk配置


exports.requestApkConfigSync = requestApkConfigSync;

var requestApkConfigDelete = function requestApkConfigDelete(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/apk/delete"), {
    params: params
  });
}; //删除apk配置


exports.requestApkConfigDelete = requestApkConfigDelete;

var requestApkConfigList = function requestApkConfigList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/apk/list"), {
    params: params
  });
}; //apk配置列表
//芒果专区


exports.requestApkConfigList = requestApkConfigList;

var getMangoList = function getMangoList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/config/common/list"), {
    params: params
  });
}; //芒果专区-相关模块数据-获取


exports.getMangoList = getMangoList;

var addMangoList = function addMangoList(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/config/common/add?key=").concat(params.key), params);
}; //芒果专区-相关模块数据-新建


exports.addMangoList = addMangoList;

var addMangoUpdate = function addMangoUpdate(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/config/common/update?key=").concat(params.key, "&id=").concat(params.indexId), params);
}; //芒果专区-相关模块数据-更新


exports.addMangoUpdate = addMangoUpdate;

var delMango = function delMango(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/config/common/delete?key=").concat(params.key, "&id=").concat(params.id), params);
}; //芒果专区-相关模块数据-删除


exports.delMango = delMango;

var getMangoSync = function getMangoSync(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/config/common/syn_slice?key=").concat(params.key));
}; //芒果专区-相关模块数据-缓存同步 ,{params:params}


exports.getMangoSync = getMangoSync;

var addMangosearch = function addMangosearch(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/mgtv/video/searchAll"), params);
}; //媒资库视频模糊搜索


exports.addMangosearch = addMangosearch;

var updateMangoSort = function updateMangoSort(type, params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/config/common/set?key=").concat(type), params);
}; //芒果专区-相关模块数据-新建


exports.updateMangoSort = updateMangoSort;

var getSortList = function getSortList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/config/common/get"), {
    params: params
  });
}; //芒果专区-相关模块数据-获取


exports.getSortList = getSortList;

var getMangoSyncTab = function getMangoSyncTab(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/config/common/syn_config?key=").concat(params.key));
}; //芒果专区-相关模块数据-tab排序缓存同步 ,{params:params}
// 获取用户相册照片


exports.getMangoSyncTab = getMangoSyncTab;

var getlistPhoto = function getlistPhoto(params) {
  return _request["default"].post("".concat(baseUrl, "/mms/album/listPhoto"), params);
}; // 解锁配置更新
//tv专题页配置


exports.getlistPhoto = getlistPhoto;

var getTopic = function getTopic(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/tvspecial/list"), {
    params: params
  });
}; // 解锁配置更新


exports.getTopic = getTopic;

var addTopic = function addTopic(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/tvspecial/add"), params);
}; // 解锁配置更新


exports.addTopic = addTopic;

var updateTopic = function updateTopic(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/tvspecial/update"), params);
}; // 解锁配置更新


exports.updateTopic = updateTopic;

var delTopic = function delTopic(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/tvspecial/del"), {
    params: params
  });
}; // 解锁配置更新


exports.delTopic = delTopic;

var syncTopic = function syncTopic(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/tvspecial/sync"), {
    params: params
  });
}; // 解锁配置更新
//我的配置


exports.syncTopic = syncTopic;

var getMine = function getMine(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/myCenter/grid/list"), params);
}; // 我的配置列表


exports.getMine = getMine;

var addMine = function addMine(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/myCenter/grid/add"), params);
}; // 我的配置增加


exports.addMine = addMine;

var editMine = function editMine(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/myCenter/grid/edit"), params);
}; // 我的配置编辑


exports.editMine = editMine;

var delMine = function delMine(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/myCenter/grid/del"), params);
}; // 我的配置删除


exports.delMine = delMine;

var getMineGrid = function getMineGrid(params, query) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/myCenter/grid/second/").concat(query.id, "/list"), params);
}; // 我的配置删除


exports.getMineGrid = getMineGrid;

var addMineGrid = function addMineGrid(params, query) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/myCenter/grid/second/").concat(query.id, "/add"), params);
}; // 我的配置删除


exports.addMineGrid = addMineGrid;

var editMineGrid = function editMineGrid(params, query) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/myCenter/grid/second/").concat(query.id, "/edit"), params);
}; // 我的配置删除


exports.editMineGrid = editMineGrid;

var copyMineGrid = function copyMineGrid(params, query) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/myCenter/grid/second/").concat(query.id, "/copy"), params);
}; // 我的配置删除


exports.copyMineGrid = copyMineGrid;

var delMineGrid = function delMineGrid(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/myCenter/grid/second/del"), params);
}; // 我的配置删除


exports.delMineGrid = delMineGrid;

var syncMineGrid = function syncMineGrid(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/myCenter/grid/second/sync"), {
    params: params
  });
}; // 我的配置删除
//退出登录


exports.syncMineGrid = syncMineGrid;

var getLogout = function getLogout(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/logout/list"), {
    params: params
  });
}; // 我的配置删除


exports.getLogout = getLogout;

var addLogout = function addLogout(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/logout/add"), params);
}; // 我的配置删除


exports.addLogout = addLogout;

var updateLogout = function updateLogout(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/channel/logout/update"), params);
}; // 我的配置删除


exports.updateLogout = updateLogout;

var delLogout = function delLogout(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/logout/del"), {
    params: params
  });
}; // 我的配置删除


exports.delLogout = delLogout;

var syncLogout = function syncLogout(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/logout/sync"), {
    params: params
  });
}; // 我的配置删除


exports.syncLogout = syncLogout;

var changeLogoutState = function changeLogoutState(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/channel/logout/status"), {
    params: params
  });
}; // 我的配置删除
//频道搜索-->热门搜索


exports.changeLogoutState = changeLogoutState;

var getHotChannel = function getHotChannel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/hotRecommend/list"), params);
}; // 频道搜索列表


exports.getHotChannel = getHotChannel;

var addHotChannel = function addHotChannel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/hotRecommend/add"), params);
}; // 频道搜索增加


exports.addHotChannel = addHotChannel;

var editHotChannel = function editHotChannel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/hotRecommend/edit"), params);
}; // 频道搜索编辑


exports.editHotChannel = editHotChannel;

var delHotChannel = function delHotChannel(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/tv/hotRecommend/del"), params);
}; // 频道搜索删除


exports.delHotChannel = delHotChannel;

var syncHotChannel = function syncHotChannel(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/tv/hotRecommend/sync"), {
    params: params
  });
}; // 频道搜索列表
// 私域小程序配置


exports.syncHotChannel = syncHotChannel;

var signGoodsList = function signGoodsList(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/pd/integral/goods"), {
    params: params
  });
}; // 商品列表


exports.signGoodsList = signGoodsList;

var signGoodsDelete = function signGoodsDelete(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/pd/integral/goodsDel"), {
    params: params
  });
}; // 删除商


exports.signGoodsDelete = signGoodsDelete;

var signGoodsAdd = function signGoodsAdd(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/pd/integral/goodsAdd"), params);
}; // 新增商品


exports.signGoodsAdd = signGoodsAdd;

var signGoodsEdit = function signGoodsEdit(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/pd/integral/goodsEdit"), params);
}; // 编辑商品


exports.signGoodsEdit = signGoodsEdit;

var signCategory = function signCategory(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/pd/integral/category"), {
    params: params
  });
}; // 获取商品分类


exports.signCategory = signCategory;

var signCategoryAdd = function signCategoryAdd(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/pd/integral/categoryAdd"), params);
}; // 添加商品分类


exports.signCategoryAdd = signCategoryAdd;

var signCategoryEdit = function signCategoryEdit(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/pd/integral/categoryEdit"), params);
}; // 编辑商品分类


exports.signCategoryEdit = signCategoryEdit;

var signCategoryDel = function signCategoryDel(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/pd/integral/categoryDel"), {
    params: params
  });
}; // 删除商品分类(检测下分类下是否有商品


exports.signCategoryDel = signCategoryDel;

var signRuleInfo = function signRuleInfo(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/pd/integral/ruleInfo"), {
    params: params
  });
}; // 规则配置


exports.signRuleInfo = signRuleInfo;

var signRuleEdit = function signRuleEdit(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/pd/integral/rule"), params);
}; // 修改规则配置


exports.signRuleEdit = signRuleEdit;

var signExtra = function signExtra(params) {
  return _request2["default"].get("".concat(baseUrl, "/mms/pd/integral/extra"), {
    params: params
  });
}; // 获取额外配置


exports.signExtra = signExtra;

var signExtraEdit = function signExtraEdit(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/pd/integral/extraEdit"), params);
}; // 编辑额外配置


exports.signExtraEdit = signExtraEdit;

var signSync = function signSync(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/pd/integral/sync"), params);
}; // 同步缓存


exports.signSync = signSync;

var signCalendarList = function signCalendarList(params) {
  return _request["default"].get("".concat(baseUrl, "/mms/pd/calendar/list"), {
    params: params
  });
}; // 指定月份的热点事件


exports.signCalendarList = signCalendarList;

var signCalendarSave = function signCalendarSave(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/pd/calendar/save"), params);
}; // 增加/更新指定日期的热点事件配置


exports.signCalendarSave = signCalendarSave;

var signCalendarClear = function signCalendarClear(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/pd/calendar/clear?day=").concat(params.day), params);
}; // 清空指定日期的热点数据


exports.signCalendarClear = signCalendarClear;

var signCalendarSync = function signCalendarSync(params) {
  return _request2["default"].post("".concat(baseUrl, "/mms/pd/calendar/sync?month=").concat(params.month), params);
}; // 同步缓存
//广告-二维码套餐类型
//========== 基础数据 老CMS平台中数据整理 ==========
//二维码类型


exports.signCalendarSync = signCalendarSync;

var requestQrcodeTypes = function requestQrcodeTypes() {
  return new Promise(function (resolve, reject) {
    var params = [{
      key: 1,
      value: '静态广告'
    }, {
      key: 2,
      value: 'gif广告'
    }, {
      key: 3,
      value: '支付'
    }, {
      key: 4,
      value: '到期不支付'
    }, {
      key: 5,
      value: '到期支付'
    }, {
      key: 6,
      value: '红包'
    }, {
      key: 7,
      value: '优惠券'
    }, {
      key: 8,
      value: '宣传内容'
    }, {
      key: 9,
      value: '家庭号'
    }, {
      key: 10,
      value: '登录'
    }, {
      key: 11,
      value: '小程序登录'
    }, {
      key: 12,
      value: 'TV端尝鲜版专属'
    }];
    resolve(params);
  });
}; //跳转类型


exports.requestQrcodeTypes = requestQrcodeTypes;

var requestJumpTypes = function requestJumpTypes() {
  return new Promise(function (resolve, reject) {
    var params = [{
      key: 1,
      value: '跳转到频道'
    }, {
      key: 2,
      value: '跳转到下载'
    }, {
      key: 3,
      value: '跳转到商品'
    }, {
      key: 4,
      value: '跳转到活动'
    }, {
      key: 5,
      value: '跳转到任务'
    }, {
      key: 6,
      value: '跳转到菜单'
    }, //对应接口 requestJumpMenuTypes
    {
      key: 7,
      value: '跳转到二维码'
    }, {
      key: 8,
      value: '跳转到好看分类'
    } //对应接口 requestGoodLookTypes
    ];
    resolve(params);
  });
}; //跳转目录类型 跳转菜单类型 对应接口requestJumpTypes:6


exports.requestJumpTypes = requestJumpTypes;

var requestJumpMenuTypes = function requestJumpMenuTypes() {
  return new Promise(function (resolve, reject) {
    var params = [{
      key: 1,
      value: '跳转到金币'
    }, {
      key: 2,
      value: '跳转到手机'
    }, {
      key: 3,
      value: '跳转到自建'
    }, {
      key: 4,
      value: '跳转到设置'
    }, {
      key: 5,
      value: '跳转到联系'
    }, {
      key: 6,
      value: '跳转到语音'
    }, {
      key: 7,
      value: '跳转到套餐'
    } // { key: 8, value: '跳转到小剧场列表页' },
    // { key: 100, value: '跳转到小剧场播放页' },
    ];
    resolve(params);
  });
}; //好看类型 关联接口requestJumpTypes:8


exports.requestJumpMenuTypes = requestJumpMenuTypes;

var requestGoodLookTypes = function requestGoodLookTypes() {
  return new Promise(function (resolve, reject) {
    var params = [{
      key: 1,
      value: '点歌台'
    }, {
      key: 2,
      value: '电视相册'
    }, {
      key: 3,
      value: '公共相册'
    }];
    resolve(params);
  });
}; //投放类型


exports.requestGoodLookTypes = requestGoodLookTypes;

var requestDeliveryTypes = function requestDeliveryTypes() {
  return new Promise(function (resolve, reject) {
    var params = [// { key: 0, value: '不选择' },
    {
      key: 1,
      value: '定向'
    }, {
      key: 2,
      value: '非定向'
    }];
    resolve(params);
  });
}; //字典 状态


exports.requestDeliveryTypes = requestDeliveryTypes;

var requestDictStatus = function requestDictStatus() {
  return new Promise(function (resolve, reject) {
    var params = [{
      key: 1,
      value: '有效'
    }, {
      key: 2,
      value: '无效'
    }];
    resolve(params);
  });
};

exports.requestDictStatus = requestDictStatus;