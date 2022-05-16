"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _icons = require("@ant-design/icons");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var NoPermission = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/NoPermission/index.jsx'));
  });
});
var WinningNews = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/ayh/winningNews/index.jsx'));
  });
});
var MedalList = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/ayh/medalList/index.jsx'));
  });
});
var EventList = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/ayh/eventList/index.jsx'));
  });
});
var SpecialList = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/ayh/specialList/index.jsx'));
  });
});
var Equity = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/level/equity/index.jsx'));
  });
});
var LevelConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/level/levelConfig/index.jsx'));
  });
});
var GrowConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/level/growConfig/index.jsx'));
  });
});
var UserDemote = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/level/userDemote/index.jsx'));
  });
});
var BonusPayment = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/ayh/bonusPayment/index.jsx'));
  });
});
var AddressList = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/level/addressList/index.jsx'));
  });
});
var ServiceLog = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/service/serviceLog/index.jsx'));
  });
});
var ManageTag = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/service/manageTag/index.jsx'));
  });
});
var MiniInput = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/service/miniInput/index.jsx'));
  });
});
var Recommend = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/adManage/recommend/recommend.jsx'));
  });
});
var MenuImage = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/adManage/menuImage/menuImage.jsx'));
  });
});
var CustomAdTag = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/adManage/customAdTag/index.jsx'));
  });
});
var AdGroup = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/adManage/adGroup/adGroup.jsx'));
  });
});
var MaterialLibrary = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/adManage/materialLibrary/index.jsx'));
  });
});
var PaySuccess = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/adManage/paySuccess/index.jsx'));
  });
});
var Voting = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/activeManagement/voting/index.jsx'));
  });
});
var ChannelLock = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/channelManage/channelLock/index.jsx'));
  });
});
var AddressNews = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/configManage/addressNews/index.jsx'));
  });
});
var MarsBootIn = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/channelManage/marsBootIn/index.jsx'));
  });
});
var SourceFailure = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/channelManage/sourceFailure/index.jsx'));
  });
});
var ChannelSearch = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/channelManage/channelSearch/index.jsx'));
  });
});
var WxReply = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/wechart/autoReply/wxReply.jsx'));
  });
});
var wxTemplateMsg = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/wechart/templateMsg/wxTemplateMsg.jsx'));
  });
});
var LoginManage = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/adManage/loginManage/index.jsx'));
  });
});
var SvScreenConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/configManage/svScreenConfig/svScreenConfig.jsx'));
  });
});
var WxMsg = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/weChatManage/WxMsg/index.jsx'));
  });
});
var WechatMenu = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/weChatManage/wechatMenu/index.jsx'));
  });
});
var FansTag = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/weChatManage/fansTag/index.jsx'));
  });
});
var PersonalSend = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/weChatManage/personalSend/index.jsx'));
  });
});
var LoginVipConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/weChatManage/loginVipConfig/index.jsx'));
  });
});
var WechatAutoReply = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/weChatManage/wechatAutoReply/index.jsx'));
  });
});
var WechatTag = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/weChatManage/wechatTag/index.jsx'));
  });
});
var LockPersonConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/weChatManage/lockPersonConfig/index.jsx'));
  });
});
var EarnIncentiveTask = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/earnManage/earnIncentiveTask/index.jsx'));
  });
});
var WithdrawalGoodsList = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/earnManage/withdrawalGoodsList/index.jsx'));
  });
});
var RefreshInventory = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/earnManage/refreshInventory/index.jsx'));
  });
});
var WithdrawalConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/earnManage/withdrawalConfig/index.jsx'));
  });
});
var Notice = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/earnManage/notice/index.jsx'));
  });
});
var BlackList = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/earnManage/blackList/index.jsx'));
  });
});
var TimeLimitedTask = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/earnManage/timeLimitedTask/index.jsx'));
  });
});
var ChannelShortVideoList = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/configManage/channelShortVideoList/index.jsx'));
  });
});
var ShortListConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/configManage/shortListConfig/index.jsx'));
  });
});
var SportsIndexBanner = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/configManage/sportsIndexBanner/index.jsx'));
  });
});
var RecommendConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/configManage/recommendConfig/index.jsx'));
  });
});
var WordsSwiperConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/configManage/wordsSwiperConfig/index.jsx'));
  });
});
var HomeBroadcast = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/configManage/homeBroadcast/index.jsx'));
  });
});
var ChannelShield = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/configManage/channelShield/index.jsx'));
  });
});
var ProgrammeManage = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/configManage/programmeManage/index.jsx'));
  });
});
var LuckyDraw = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/activeManagement/luckyDraw/index.jsx'));
  });
});
var GoodsConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/activeManagement/goodsConfig/index.jsx'));
  });
});
var mobileChannel = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/mobileSubject/channel/index.jsx'));
  });
});
var mobileSportsProgram = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/mobileSubject/sportsProgram/index.jsx'));
  });
});
var mobileShortVideo = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/mobileSubject/shortVideo/index.jsx'));
  });
});
var mobileChannelSubject = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/mobileSubject/channelSubject/index.jsx'));
  });
});
var mobileChannelSubjectNew = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/mobileSubject/channelSubjectNew/index.jsx'));
  });
});
var mobileEditSubject = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/mobileSubject/editSubject/index.jsx'));
  });
});
var mobileEditSubjectNew = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/mobileSubject/editSubjectNew/index.jsx'));
  });
});
var mobileGoodPlay = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/mobileSubject/goodPlay/index.jsx'));
  });
});
var ConfigDoc = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/generalConfig/wenanconfig/doc.jsx'));
  });
});
var OffineConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/generalConfig/offlineConfig/offlineConfig.jsx'));
  });
});
var RiskAreaConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/generalConfig/riskAreaConfig/riskAreaConfig.jsx'));
  });
});
var TagConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/generalConfig/tagConfig/tagConfig.jsx'));
  });
});
var MiniConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/generalConfig/miniConfig/index.jsx'));
  });
});
var PuzzleRobot = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/generalConfig/puzzleRobot/index.jsx'));
  });
});
var ApkConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/generalConfig/apkConfig/apkConfig.jsx'));
  });
});
var WhiteList = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/TVConfig/whiteList/index.jsx'));
  });
});
var EnterChannelConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/TVConfig/enterChannelConfig/index.jsx'));
  });
});
var EnterImageConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/TVConfig/enterImageConfig/index.jsx'));
  });
});
var GoodLooking = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/TVConfig/goodLooking/index.jsx'));
  });
});
var ProgramAppConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/TVConfig/ProgramAppConfig/index.jsx'));
  });
}); //电视节目单配置

var TvRecommendConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/TVConfig/tvRecommendConfig/tvRecommendConfig.jsx'));
  });
}); //Tv推荐配置

var MenuConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/TVConfig/menuConfig/index.jsx'));
  });
}); //Tv菜单配置

var TopicConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/TVConfig/topicConfig/index.jsx'));
  });
}); //Tv专题页配置

var Mine = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/TVConfig/mine/index.jsx'));
  });
}); //tv我的页面

var MineDetail = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/TVConfig/mine/detail.jsx'));
  });
}); //tv我的页面

var Logout = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/TVConfig/logout/index.jsx'));
  });
}); //tv退出登录

var Simple = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/TVConfig/simple/index.jsx'));
  });
}); //tv退出登录

var ChannelRiskRegion = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/currencyChannel/channelRiskRegion/index.jsx'));
  });
}); //风险地域

var OfflineProgram = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/offlineManage/program/index.jsx'));
  });
}); //下线节目

var OfflineProgramDetail = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/offlineManage/program/detailIndex.jsx'));
  });
}); //下线节目

var RiskControl = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/offlineManage/riskControl/index.jsx'));
  });
}); //风险设备控制

var ArmourList = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/armourPackage/armourList/index.jsx'));
  });
}); //马甲包管理

var LivePreview = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/configManage/livePreview/index.jsx'));
  });
});
var MangoConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/configManage/MangoConfig/index.jsx'));
  });
}); //用户权限相关

var SysRole = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/sys/role/role.jsx'));
  });
});
var SysUser = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/sys/user/user.jsx'));
  });
});
var SysMenu = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/sys/menu/menu.jsx'));
  });
});
var SysPermission = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/sys/permission/permission.jsx'));
  });
}); //家庭相册

var ActivityConfig = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/album/activityConfig/index.jsx'));
  });
});
var ViewPhotos = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/album/photos/index.jsx'));
  });
}); //私域签到小程序

var ScoreShop = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/privateDomain/scoreShop/index.jsx'));
  });
});
var HotDay = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/privateDomain/hotDay/index.jsx'));
  });
});
var Statistical = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/privateDomain/statistical/index.jsx'));
  });
}); // 端午节活动-优惠券

var Task = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/activeManagement/task/index.jsx'));
  });
});
var Coupons = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/activeManagement/coupons/index.jsx'));
  });
});
var GroupCoupons = (0, _react.lazy)(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('pages/activeManagement/groupCoupons/index.jsx'));
  });
}); // advertising management
// const Test = lazy(() =>import('pages/test/test.jsx'));

var adminRoutes = [{
  name: '夺奖快讯',
  icon: _icons.LineChartOutlined,
  path: '/mms/ayh/winningNews',
  component: WinningNews,
  code: "OlympicGames",
  sub_code: 'winningNews'
}, {
  name: '奖牌榜',
  icon: _icons.LineChartOutlined,
  path: '/mms/ayh/medalList',
  component: MedalList,
  code: "OlympicGames",
  sub_code: 'medalList'
}, {
  name: '赛事列表',
  icon: _icons.LineChartOutlined,
  path: '/mms/ayh/eventList',
  component: EventList,
  code: "OlympicGames",
  sub_code: 'EventList'
}, {
  name: '专题',
  icon: _icons.LineChartOutlined,
  path: '/mms/ayh/specialList',
  component: SpecialList,
  code: "OlympicGames",
  sub_code: 'SpecialList'
}, {
  name: '奖金发放',
  icon: _icons.LineChartOutlined,
  path: '/mms/ayh/bonusPayment',
  component: BonusPayment,
  code: "OlympicGames",
  sub_code: 'BonusPayment'
}, {
  name: '权益配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/level/equity',
  component: Equity,
  code: "LevelManage",
  sub_code: 'EquityConfig'
}, {
  name: '等级配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/level/levelConfig',
  component: LevelConfig,
  code: "LevelManage",
  sub_code: 'LevelConfig'
}, {
  name: '成长值配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/level/growConfig',
  component: GrowConfig,
  code: "LevelManage",
  sub_code: 'GrowConfig'
}, {
  name: '用户降级',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/level/userDemote',
  component: UserDemote,
  code: "LevelManage",
  sub_code: 'UserDemote'
}, {
  name: '实体奖励发货列表',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/level/addressList',
  component: AddressList,
  code: "LevelManage",
  sub_code: 'UserAddressList'
}, //生活服务
{
  name: '管理类别',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/service/manageTag/:categoryId',
  component: ManageTag,
  code: "LifeService"
}, //?????????????????
{
  name: '服务分类',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/service/serviceLog',
  component: ServiceLog,
  code: "LifeService",
  sub_code: 'ServiceLog'
}, {
  name: '小程序录入',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/service/miniInput',
  component: MiniInput,
  code: "LifeService",
  sub_code: 'MiniInput'
}, //活动管理
{
  name: '投票活动',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/activeManagement/voting',
  component: Voting,
  code: "ActiveManagement",
  sub_code: 'Voting'
}, {
  name: '抽奖活动',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/activeManagement/luckyDraw',
  component: LuckyDraw,
  code: "ActiveManagement",
  sub_code: 'LuckyDraw'
}, {
  name: '商品配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/activeManagement/goodsConfig',
  component: GoodsConfig,
  code: "ActiveManagement",
  sub_code: 'GoodsConfig'
}, // 端午节活动-优惠券  
{
  name: '任务配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/activeManagement/task',
  component: Task,
  code: "ActiveManagement",
  sub_code: 'task'
}, {
  name: '优惠券配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/activeManagement/coupons',
  component: Coupons,
  code: "ActiveManagement",
  sub_code: 'coupons'
}, {
  name: '组合优惠券配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/activeManagement/groupCoupons',
  component: GroupCoupons,
  code: "ActiveManagement",
  sub_code: 'groupCoupons'
}, //频道管理
{
  name: '专享台解锁',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/channelManage/channelLock',
  component: ChannelLock,
  code: "channelManage",
  sub_code: 'channelLock'
}, {
  name: '火星开机进入',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/channelManage/marsBootIn',
  component: MarsBootIn,
  code: "channelManage",
  sub_code: 'marsBootIn'
}, {
  name: '源失效推荐',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/channelManage/sourceFailure',
  component: SourceFailure,
  code: "channelManage",
  sub_code: 'sourceFailure'
}, {
  name: '频道搜索',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/channelManage/channelSearch',
  component: ChannelSearch,
  code: "channelManage",
  sub_code: 'channelSearch'
}, //TV端-广告管理
{
  name: '尝鲜版',
  component: Recommend,
  path: '/mms/adManage/recommend',
  icon: _icons.UnorderedListOutlined,
  code: "adManage",
  sub_code: 'Recommend'
}, {
  name: '个人中心登录',
  component: LoginManage,
  path: '/mms/adManage/LoginManage',
  icon: _icons.UnorderedListOutlined,
  code: "adManage",
  sub_code: 'LoginManage'
}, {
  name: '菜单栏图片配置',
  component: MenuImage,
  path: '/mms/adManage/menuImage',
  icon: _icons.UnorderedListOutlined,
  code: "adManage",
  sub_code: 'menuImage'
}, {
  name: '自定义规则标签',
  component: CustomAdTag,
  path: '/mms/ad/customAdTag',
  icon: _icons.UnorderedListOutlined,
  code: "adManage",
  sub_code: 'customAdTag'
}, {
  name: '广告组',
  component: AdGroup,
  path: '/mms/adManage/adGroup',
  icon: _icons.UnorderedListOutlined,
  code: "adManage",
  sub_code: 'adGroup'
}, {
  name: '素材库',
  component: MaterialLibrary,
  path: '/mms/adManage/materialLibrary',
  icon: _icons.UnorderedListOutlined,
  code: "adManage",
  sub_code: 'materialLibrary'
}, {
  name: '支付成功页',
  component: PaySuccess,
  path: '/mms/adManage/paySuccess',
  icon: _icons.UnorderedListOutlined,
  code: "adManage",
  sub_code: 'paySuccess'
}, //用户权限相关
{
  name: '角色列表',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/sys/role',
  component: SysRole,
  code: "sessionManage",
  sub_code: 'sysRole'
}, {
  name: '用户列表',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/sys/user',
  component: SysUser,
  code: "sessionManage",
  sub_code: 'sysUser'
}, {
  name: '功能列表',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/sys/menu',
  component: SysMenu,
  code: "sessionManage",
  sub_code: 'sysMenu'
}, {
  name: '权限列表',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/sys/permission',
  component: SysPermission,
  code: "sessionManage",
  sub_code: 'sysPermission'
}, //移动端-配置管理
{
  name: '地域新闻',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/configManage/addressNews',
  component: AddressNews,
  code: "configManage",
  sub_code: 'AddressNews'
}, {
  name: '短视频首屏配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/config/svScreenConfig',
  component: SvScreenConfig,
  code: "configManage",
  sub_code: 'svScreenConfig'
}, {
  name: '节目单视频集配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/config/channelShortVideoList',
  component: ChannelShortVideoList,
  code: "configManage",
  sub_code: 'channelShortVideoList'
}, {
  name: '短视频集配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/config/shortListConfig',
  component: ShortListConfig,
  code: "configManage",
  sub_code: 'shortListConfig'
}, {
  name: '体育频道视频集配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/config/sportsIndexBanner',
  component: SportsIndexBanner,
  code: "configManage",
  sub_code: 'sportsIndexBanner'
}, {
  name: '首页为你推荐配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/config/recommendConfig',
  component: RecommendConfig,
  code: "configManage",
  sub_code: 'recommendConfig'
}, {
  name: '文字轮播配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/config/wordsSwiperConfig',
  component: WordsSwiperConfig,
  code: "configManage",
  sub_code: 'wordsSwiperConfig'
}, {
  name: '首页直播配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/config/homeBroadcast',
  component: HomeBroadcast,
  code: "configManage",
  sub_code: 'homeBroadcast'
}, {
  name: '移动端节目单屏蔽',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/config/channelShield',
  component: ChannelShield,
  code: "configManage",
  sub_code: 'channelShield'
}, // { name: 'TV推荐配置', icon: UnorderedListOutlined, path: '/mms/config/tvRecommendConfig', component: TvRecommendConfig, code: "configManage", sub_code: 'tvRecommendConfig' },
{
  name: '直播预告',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/config/livePreview',
  component: LivePreview,
  code: "configManage",
  sub_code: 'livePreview'
}, {
  name: '节目单管理',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/configManage/programmeManage',
  component: ProgrammeManage,
  code: "configManage",
  sub_code: 'programmeManage'
}, {
  name: '芒果专区配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/configManage/MangoConfig',
  component: MangoConfig,
  code: "configManage",
  sub_code: 'mangoConfig'
}, //微信公众号管理
{
  name: '自动回复',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/wxReply',
  component: WxReply,
  code: "WeChatManage",
  sub_code: 'wxReply'
}, {
  name: '支付模板',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/wx/tmplMsg',
  component: wxTemplateMsg,
  code: "WeChatManage",
  sub_code: 'TmplMsgTag'
}, {
  name: '客服消息',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/wx/msg',
  component: WxMsg,
  code: "WeChatManage",
  sub_code: 'wxMsg'
}, {
  name: '微信菜单',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/wx/wechatMenu',
  component: WechatMenu,
  code: "WeChatManage",
  sub_code: 'wechatMenu'
}, {
  name: '粉丝标签',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/wx/fansTag',
  component: FansTag,
  code: "WeChatManage",
  sub_code: 'fansTag'
}, {
  name: '个性化群发',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/wx/personalSend',
  component: PersonalSend,
  code: "WeChatManage",
  sub_code: 'personalSend'
}, {
  name: '登录(专享)配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/wx/loginVipConfig',
  component: LoginVipConfig,
  code: "WeChatManage",
  sub_code: 'loginVipConfig'
}, {
  name: '企业自动回复',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/wx/wechatAutoReply',
  component: WechatAutoReply,
  code: "WeChatManage",
  sub_code: 'wechatAutoReply'
}, {
  name: '企微标签',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/wx/wechatTag',
  component: WechatTag,
  code: "WeChatManage",
  sub_code: 'wechatTag'
}, {
  name: '专享解锁人群配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/wx/lockPersonConfig',
  component: LockPersonConfig,
  code: "WeChatManage",
  sub_code: 'lockPersonConfig'
}, //  赚赚管理
{
  name: '赚赚激励任务',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/earnManage/earnIncentiveTask',
  component: EarnIncentiveTask,
  code: "earnManage",
  sub_code: 'earnIncentiveTask'
}, {
  name: '提现商品列表',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/earnManage/withdrawalGoodsList',
  component: WithdrawalGoodsList,
  code: "earnManage",
  sub_code: 'withdrawalGoodsList'
}, {
  name: '刷新库存',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/earnManage/refreshInventory',
  component: RefreshInventory,
  code: "earnManage",
  sub_code: 'refreshInventory'
}, {
  name: '随机提现配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/earnManage/withdrawalConfig',
  component: WithdrawalConfig,
  code: "earnManage",
  sub_code: 'withdrawalConfig'
}, {
  name: '公告',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/earnManage/notice',
  component: Notice,
  code: "earnManage",
  sub_code: 'notice'
}, {
  name: '提现黑名单',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/earnManage/blackList',
  component: BlackList,
  code: "earnManage",
  sub_code: 'blackList'
}, {
  name: '限时任务',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/earnManage/timeLimitedTask',
  component: TimeLimitedTask,
  code: "earnManage",
  sub_code: 'timeLimitedTask'
}, //家庭相册
{
  name: '传照片活动配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/album/activityConfig',
  component: ActivityConfig,
  code: "Album",
  sub_code: 'activityConfig'
}, {
  name: '查看用户照片',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/album/photos',
  component: ViewPhotos,
  code: "Album",
  sub_code: 'viewPhotos'
}, //套餐管理
// { name: 'VIP会员套餐', icon: UnorderedListOutlined, path: '/mms/comboManage/vipCombo', component: VipCombo, code: "comboManage", sub_code: 'vipCombo' },
// 移动端-专题管理
{
  name: '节目单配置',
  icon: _icons.LineChartOutlined,
  path: '/mms/mobileSubject/channel',
  component: mobileChannel,
  code: "mobileProject",
  sub_code: 'ayhProgramList'
}, {
  name: '专题节目配置',
  icon: _icons.LineChartOutlined,
  path: '/mms/mobileSubject/sportsProgram',
  component: mobileSportsProgram,
  code: "mobileProject",
  sub_code: 'sportsProgram'
}, {
  name: '短视频搜索',
  icon: _icons.LineChartOutlined,
  path: '/mms/mobileSubject/shortVideo',
  component: mobileShortVideo,
  code: "mobileProject",
  sub_code: 'AyhShortVideo'
}, {
  name: '频道专题',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/mobileSubject/channelSubject',
  component: mobileChannelSubject,
  code: "mobileProject",
  sub_code: 'channelSubject'
}, {
  name: '新频道专题',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/mobileSubject/channelSubjectNew',
  component: mobileChannelSubjectNew,
  code: "mobileProject",
  sub_code: 'channelSubjectNew'
}, {
  name: '编辑专题',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/mobileSubject/editSubject/:id',
  component: mobileEditSubject,
  code: "mobileProject"
}, //频道专题二级页面
{
  name: '新编辑专题',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/mobileSubject/editSubjectNew/:id',
  component: mobileEditSubjectNew,
  code: "mobileProject"
}, //新频道专题二级页面
{
  name: '好剧专题',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/mobileSubject/goodPlay',
  component: mobileGoodPlay,
  code: "mobileProject",
  sub_code: 'channelGoodPlay'
}, // 通用-配置管理
{
  name: '文案管理',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/generalConfig/doc',
  component: ConfigDoc,
  code: "generalMangement",
  sub_code: 'DocManager'
}, {
  name: '停服下线通知配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/generalConfig/offlineConfig',
  component: OffineConfig,
  code: "generalMangement",
  sub_code: 'offlineConfig'
}, {
  name: '风险地域配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/generalConfig/riskAreaConfig',
  component: RiskAreaConfig,
  code: "generalMangement",
  sub_code: 'riskAreaConfig'
}, {
  name: '标签配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/generalConfig/tagConfig',
  component: TagConfig,
  code: "generalMangement",
  sub_code: 'tagConfig'
}, {
  name: '小程序配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/generalConfig/miniConfig',
  component: MiniConfig,
  code: "generalMangement",
  sub_code: 'MiniConfig'
}, {
  name: '拼团机器人',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/generalConfig/puzzleRobot',
  component: PuzzleRobot,
  code: "generalMangement",
  sub_code: 'puzzleRobot'
}, {
  name: 'APK配置管理',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/generalConfig/apkConfig',
  component: ApkConfig,
  code: "generalMangement",
  sub_code: 'apkConfig'
}, // TV端-配置管理
{
  name: '白名单配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/TVConfig/whiteList',
  component: WhiteList,
  code: "tvConfigManagement",
  sub_code: 'MiniConfig'
}, {
  name: '开机进入频道配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/TVConfig/enterChannelConfig',
  component: EnterChannelConfig,
  code: "tvConfigManagement",
  sub_code: 'enterChannelConfig'
}, {
  name: '开机启动图配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/TVConfig/enterImageConfig',
  component: EnterImageConfig,
  code: "tvConfigManagement",
  sub_code: 'enterImageConfig'
}, {
  name: '好看分类',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/TVConfig/goodLooking',
  component: GoodLooking,
  code: "tvConfigManagement",
  sub_code: 'goodLooking'
}, {
  name: '电视节目单配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/TVConfig/programAppConfig',
  component: ProgramAppConfig,
  code: "tvConfigManagement",
  sub_code: 'programAppConfig'
}, {
  name: 'TV推荐配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/TVConfig/tvRecommendConfig',
  component: TvRecommendConfig,
  code: "tvConfigManagement",
  sub_code: 'tvRecommendConfig'
}, {
  name: '菜单配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/TVConfig/menuConfig',
  component: MenuConfig,
  code: "tvConfigManagement",
  sub_code: 'menuConfig'
}, {
  name: 'TV专题页配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/TVConfig/topicConfig',
  component: TopicConfig,
  code: "tvConfigManagement",
  sub_code: 'topicConfig'
}, {
  name: '我的',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/TVConfig/mine',
  component: Mine,
  code: "tvConfigManagement",
  sub_code: 'mine'
}, {
  name: '我的栅格配置列表',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/TVConfig/detail',
  component: MineDetail,
  code: "tvConfigManagement",
  sub_code: 'mineDetail'
}, {
  name: '退出登录',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/TVConfig/logout',
  component: Logout,
  code: "tvConfigManagement",
  sub_code: 'logout'
}, {
  name: '简单模式配置',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/TVConfig/simple',
  component: Simple,
  code: "tvConfigManagement",
  sub_code: 'simple'
}, //通用-频道管理
{
  name: '频道风险地域',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/currencyChannel/channelRiskRegion',
  component: ChannelRiskRegion,
  code: "currencyChannel",
  sub_code: 'channelRiskRegion'
}, //通用-频道管理
{
  name: '下线节目',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/offline/program',
  component: OfflineProgram,
  code: "offlineManage",
  sub_code: 'offlineProgram'
}, {
  name: '下线节目详情列表',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/offline/detail',
  component: OfflineProgramDetail,
  code: "offlineManage",
  sub_code: 'detail'
}, {
  name: '风险设备控制',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/offline/riskControl',
  component: RiskControl,
  code: "offlineManage",
  sub_code: 'riskControl'
}, //马甲包管理
{
  name: '马甲包管理',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/armourPackage/armourList',
  component: ArmourList,
  code: "armourPackage",
  sub_code: 'armourList'
}, //电视节目单配置
//{ name: '电视节目单配置', icon: UnorderedListOutlined, path: '/mms/programApp/programAppConfig', component: ProgramAppConfig, code: "programApp", sub_code: 'programAppConfig' },
//其他
//  私域签到小程序
{
  name: '积分商城',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/privateDomain/scoreShop',
  component: ScoreShop,
  code: "signConfig",
  sub_code: 'scoreShop'
}, {
  name: '热点日历',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/privateDomain/hotDay',
  component: HotDay,
  code: "signConfig",
  sub_code: 'hotDay'
}, {
  name: '统计兑换',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/privateDomain/statistical',
  component: Statistical,
  code: "signConfig",
  sub_code: 'statistical'
}, {
  name: '没有权限',
  icon: _icons.UnorderedListOutlined,
  path: '/mms/noPermission',
  component: NoPermission,
  meta: {
    isNav: false,
    roles: '*'
  }
}];
var _default = adminRoutes;
exports["default"] = _default;