/*
 * @Description: 
 * @Author: HuangQS
 * @Date: 2021-08-20 16:06:46
 * @LastEditors: HuangQS
 * @LastEditTime: 2022-03-14 16:46:48
 */
import { lazy } from 'react'
import { UnorderedListOutlined, LineChartOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons'
const NoPermission = lazy(() => import('pages/NoPermission/index.jsx'))
const WinningNews = lazy(() => import('pages/ayh/winningNews/index.jsx'))
const MedalList = lazy(() => import('pages/ayh/medalList/index.jsx'))
const EventList = lazy(() => import('pages/ayh/eventList/index.jsx'))
const SpecialList = lazy(() => import('pages/ayh/specialList/index.jsx'))
const Equity = lazy(() => import('pages/level/equity/index.jsx'))
const LevelConfig = lazy(() => import('pages/level/levelConfig/index.jsx'))
const GrowConfig = lazy(() => import('pages/level/growConfig/index.jsx'))
const UserDemote = lazy(() => import('pages/level/userDemote/index.jsx'))
const BonusPayment = lazy(() => import('pages/ayh/bonusPayment/index.jsx'))
const AddressList = lazy(() => import('pages/level/addressList/index.jsx'))
const ServiceLog = lazy(() => import('pages/service/serviceLog/index.jsx'))
const ManageTag = lazy(() => import('pages/service/manageTag/index.jsx'))
const MiniInput = lazy(() => import('pages/service/miniInput/index.jsx'))
const Recommend = lazy(() => import('pages/adManage/recommend/recommend.jsx'));
const MenuImage = lazy(() => import('pages/adManage/menuImage/menuImage.jsx'));
const CustomAdTag = lazy(() => import('pages/adManage/customAdTag/index.jsx'));
const AdGroup = lazy(() => import('pages/adManage/adGroup/adGroup.jsx'));
const MaterialLibrary = lazy(() => import('pages/adManage/materialLibrary/index.jsx'));
const PaySuccess = lazy(() => import('pages/adManage/paySuccess/index.jsx'));
const Voting = lazy(() => import('pages/activeManagement/voting/index.jsx'))
const ChannelLock = lazy(() => import('pages/channelManage/channelLock/index.jsx'))
const AddressNews = lazy(() => import('pages/configManage/addressNews/index.jsx'))
const MarsBootIn= lazy(() => import('pages/channelManage/marsBootIn/index.jsx'))
const SourceFailure= lazy(() => import('pages/channelManage/sourceFailure/index.jsx'))
const ChannelSearch= lazy(() => import('pages/channelManage/channelSearch/index.jsx'))
const WxReply = lazy(() => import('pages/wechart/autoReply/wxReply.jsx'));
const wxTemplateMsg = lazy(() => import('pages/wechart/templateMsg/wxTemplateMsg.jsx'));
const LoginManage = lazy(() => import('pages/adManage/loginManage/index.jsx'));
const SvScreenConfig = lazy(() => import('pages/configManage/svScreenConfig/svScreenConfig.jsx'));

const WxMsg = lazy(() => import('pages/weChatManage/WxMsg/index.jsx'))
const WechatMenu = lazy(() => import('pages/weChatManage/wechatMenu/index.jsx'))
const FansTag = lazy(() => import('pages/weChatManage/fansTag/index.jsx'))
const PersonalSend = lazy(() => import('pages/weChatManage/personalSend/index.jsx'))
const LoginVipConfig = lazy(() => import('pages/weChatManage/loginVipConfig/index.jsx'))
const WechatAutoReply = lazy(() => import('pages/weChatManage/wechatAutoReply/index.jsx'))
const WechatTag = lazy(() => import('pages/weChatManage/wechatTag/index.jsx'))
const LockPersonConfig = lazy(() => import('pages/weChatManage/lockPersonConfig/index.jsx'))

const EarnIncentiveTask = lazy(() => import('pages/earnManage/earnIncentiveTask/index.jsx'))
const WithdrawalGoodsList = lazy(() => import('pages/earnManage/withdrawalGoodsList/index.jsx'))
const RefreshInventory = lazy(() => import('pages/earnManage/refreshInventory/index.jsx'))
const WithdrawalConfig = lazy(() => import('pages/earnManage/withdrawalConfig/index.jsx'))
const Notice = lazy(() => import('pages/earnManage/notice/index.jsx'))
const BlackList = lazy(() => import('pages/earnManage/blackList/index.jsx'))
const TimeLimitedTask = lazy(() => import('pages/earnManage/timeLimitedTask/index.jsx'))
const ChannelShortVideoList = lazy(() => import('pages/configManage/channelShortVideoList/index.jsx'));
const ShortListConfig = lazy(() => import('pages/configManage/shortListConfig/index.jsx'));
const SportsIndexBanner = lazy(() => import('pages/configManage/sportsIndexBanner/index.jsx'));
const RecommendConfig = lazy(() => import('pages/configManage/recommendConfig/index.jsx'));
const WordsSwiperConfig = lazy(() => import('pages/configManage/wordsSwiperConfig/index.jsx'));
const HomeBroadcast = lazy(() => import('pages/configManage/homeBroadcast/index.jsx'));
const ChannelShield = lazy(() => import('pages/configManage/channelShield/index.jsx'));
const ProgrammeManage = lazy(() => import('pages/configManage/programmeManage/index.jsx'));
const LuckyDraw = lazy(() => import('pages/activeManagement/luckyDraw/index.jsx'))
const GoodsConfig = lazy(() => import('pages/activeManagement/goodsConfig/index.jsx'))
const mobileChannel = lazy(() => import('pages/mobileSubject/channel/index.jsx'))
const mobileSportsProgram = lazy(() => import('pages/mobileSubject/sportsProgram/index.jsx'))
const mobileShortVideo = lazy(() => import('pages/mobileSubject/shortVideo/index.jsx'))
const mobileChannelSubject = lazy(() => import('pages/mobileSubject/channelSubject/index.jsx'))
const mobileChannelSubjectNew = lazy(() => import('pages/mobileSubject/channelSubjectNew/index.jsx'))
const mobileEditSubject = lazy(() => import('pages/mobileSubject/editSubject/index.jsx'))
const mobileEditSubjectNew = lazy(() => import('pages/mobileSubject/editSubjectNew/index.jsx'))
const mobileGoodPlay = lazy(() => import('pages/mobileSubject/goodPlay/index.jsx'))

const ConfigDoc = lazy(() => import('pages/generalConfig/wenanconfig/doc.jsx'));
const OffineConfig = lazy(() => import('pages/generalConfig/offlineConfig/offlineConfig.jsx'));
const RiskAreaConfig = lazy(() => import('pages/generalConfig/riskAreaConfig/riskAreaConfig.jsx'));
const TagConfig = lazy(() => import('pages/generalConfig/tagConfig/tagConfig.jsx'));
const MiniConfig = lazy(() => import('pages/generalConfig/miniConfig/index.jsx'));
const PuzzleRobot = lazy(() => import('pages/generalConfig/puzzleRobot/index.jsx'));
const ApkConfig = lazy(() => import('pages/generalConfig/apkConfig/apkConfig.jsx'));

const WhiteList = lazy(() => import('pages/TVConfig/whiteList/index.jsx'))
const EnterChannelConfig = lazy(() => import('pages/TVConfig/enterChannelConfig/index.jsx'));
const EnterImageConfig = lazy(() => import('pages/TVConfig/enterImageConfig/index.jsx'));
const GoodLooking = lazy(() => import('pages/TVConfig/goodLooking/index.jsx'));
const ProgramAppConfig = lazy(() => import('pages/TVConfig/ProgramAppConfig/index.jsx')); //?????????????????????
const TvRecommendConfig = lazy(() => import('pages/TVConfig/tvRecommendConfig/tvRecommendConfig.jsx'))      //Tv????????????
const MenuConfig = lazy(() => import('pages/TVConfig/menuConfig/index.jsx'))      //Tv????????????
const TopicConfig = lazy(() => import('pages/TVConfig/topicConfig/index.jsx'))      //Tv???????????????
const Mine = lazy(() => import('pages/TVConfig/mine/index.jsx'))      //tv????????????
const MineDetail = lazy(() => import('pages/TVConfig/mine/detail.jsx'))      //tv????????????
const Logout = lazy(() => import('pages/TVConfig/logout/index.jsx'))      //tv????????????
const Simple = lazy(() => import('pages/TVConfig/simple/index.jsx'))      //tv????????????
const ChannelRiskRegion = lazy(() => import('pages/currencyChannel/channelRiskRegion/index.jsx'))      //????????????
const OfflineProgram = lazy(() => import('pages/offlineManage/program/index.jsx'))      //????????????
const OfflineProgramDetail = lazy(() => import('pages/offlineManage/program/detailIndex.jsx'))      //????????????
const RiskControl = lazy(() => import('pages/offlineManage/riskControl/index.jsx'))      //??????????????????
const ArmourList = lazy(() => import('pages/armourPackage/armourList/index.jsx'))      //???????????????
const ArmourInstall = lazy(() => import('pages/armourPackage/armourInstall/index.jsx'))      //?????????????????????

const LivePreview = lazy(() => import('pages/configManage/livePreview/index.jsx'))
const MangoConfig = lazy(() => import('pages/configManage/MangoConfig/index.jsx'));

//??????????????????
const SysRole = lazy(() => import('pages/sys/role/role.jsx'));
const SysUser = lazy(() => import('pages/sys/user/user.jsx'));
const SysMenu = lazy(() => import('pages/sys/menu/menu.jsx'));
const SysPermission = lazy(() => import('pages/sys/permission/permission.jsx'));
//????????????
const ActivityConfig = lazy(() => import('pages/album/activityConfig/index.jsx'));
const ViewPhotos = lazy(() => import('pages/album/photos/index.jsx'));
const ActivityManage = lazy(() => import('pages/album/activityManage/index.jsx'));
const CheckAblum = lazy(() => import('pages/album/checkAblum/index.jsx'));

//?????????????????????
const ScoreShop = lazy(() => import('pages/privateDomain/scoreShop/index.jsx'));
const HotDay = lazy(() => import('pages/privateDomain/hotDay/index.jsx'));
const Statistical = lazy(() => import('pages/privateDomain/statistical/index.jsx'));

// ???????????????-?????????
const Task = lazy(() => import('pages/activeManagement/task/index.jsx'));
const Coupons = lazy(() => import('pages/activeManagement/coupons/index.jsx'));
const GroupCoupons = lazy(() => import('pages/activeManagement/groupCoupons/index.jsx'));
const TaskActivity = lazy(() => import('pages/activeManagement/taskActivity/index.jsx'));

// advertising management
// const Test = lazy(() =>import('pages/test/test.jsx'));
const adminRoutes = [

    { name: '????????????', icon: LineChartOutlined, path: '/mms/ayh/winningNews', component: WinningNews, code: "OlympicGames", sub_code: 'winningNews' },
    { name: '?????????', icon: LineChartOutlined, path: '/mms/ayh/medalList', component: MedalList, code: "OlympicGames", sub_code: 'medalList' },
    { name: '????????????', icon: LineChartOutlined, path: '/mms/ayh/eventList', component: EventList, code: "OlympicGames", sub_code: 'EventList' },
    { name: '??????', icon: LineChartOutlined, path: '/mms/ayh/specialList', component: SpecialList, code: "OlympicGames", sub_code: 'SpecialList' },
    { name: '????????????', icon: LineChartOutlined, path: '/mms/ayh/bonusPayment', component: BonusPayment, code: "OlympicGames", sub_code: 'BonusPayment' },

    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/level/equity', component: Equity, code: "LevelManage", sub_code: 'EquityConfig' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/level/levelConfig', component: LevelConfig, code: "LevelManage", sub_code: 'LevelConfig' },
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/level/growConfig', component: GrowConfig, code: "LevelManage", sub_code: 'GrowConfig' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/level/userDemote', component: UserDemote, code: "LevelManage", sub_code: 'UserDemote' },
    { name: '????????????????????????', icon: UnorderedListOutlined, path: '/mms/level/addressList', component: AddressList, code: "LevelManage", sub_code: 'UserAddressList' },

    //????????????
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/service/manageTag/:categoryId', component: ManageTag, code: "LifeService" },                   //?????????????????
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/service/serviceLog', component: ServiceLog, code: "LifeService", sub_code: 'ServiceLog' },
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/service/miniInput', component: MiniInput, code: "LifeService", sub_code: 'MiniInput' },

    //????????????
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/activeManagement/voting', component: Voting, code: "ActiveManagement", sub_code: 'Voting' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/activeManagement/luckyDraw', component: LuckyDraw, code: "ActiveManagement", sub_code: 'LuckyDraw' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/activeManagement/goodsConfig', component: GoodsConfig, code: "ActiveManagement", sub_code: 'GoodsConfig' },
    // ???????????????-?????????  
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/activeManagement/task', component: Task, code: "ActiveManagement", sub_code: 'task' },
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/activeManagement/coupons', component: Coupons, code: "ActiveManagement", sub_code: 'coupons' },
    { name: '?????????????????????', icon: UnorderedListOutlined, path: '/mms/activeManagement/groupCoupons', component: GroupCoupons, code: "ActiveManagement", sub_code: 'groupCoupons' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/activeManagement/taskActivity', component: TaskActivity, code: "ActiveManagement", sub_code: 'taskActivity' },


    //????????????
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/channelManage/channelLock', component: ChannelLock, code: "channelManage", sub_code: 'channelLock' },
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/channelManage/marsBootIn', component: MarsBootIn, code: "channelManage", sub_code: 'marsBootIn' },
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/channelManage/sourceFailure', component: SourceFailure, code: "channelManage", sub_code: 'sourceFailure' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/channelManage/channelSearch', component: ChannelSearch, code: "channelManage", sub_code: 'channelSearch' },

    //TV???-????????????
    { name: '?????????', component: Recommend, path: '/mms/adManage/recommend', icon: UnorderedListOutlined, code: "adManage", sub_code: 'Recommend' },
    { name: '??????????????????', component: LoginManage, path: '/mms/adManage/LoginManage', icon: UnorderedListOutlined, code: "adManage", sub_code: 'LoginManage' },
    { name: '?????????????????????', component: MenuImage, path: '/mms/adManage/menuImage', icon: UnorderedListOutlined, code: "adManage", sub_code: 'menuImage' },
    { name: '?????????????????????', component: CustomAdTag, path: '/mms/ad/customAdTag', icon: UnorderedListOutlined, code: "adManage", sub_code: 'customAdTag' },
    { name: '?????????', component: AdGroup, path: '/mms/adManage/adGroup', icon: UnorderedListOutlined, code: "adManage", sub_code: 'adGroup' },
    { name: '?????????', component: MaterialLibrary, path: '/mms/adManage/materialLibrary', icon: UnorderedListOutlined, code: "adManage", sub_code: 'materialLibrary' },
    { name: '???????????????', component: PaySuccess, path: '/mms/adManage/paySuccess', icon: UnorderedListOutlined, code: "adManage", sub_code: 'paySuccess' },

    //??????????????????
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/sys/role', component: SysRole, code: "sessionManage", sub_code: 'sysRole' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/sys/user', component: SysUser, code: "sessionManage", sub_code: 'sysUser' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/sys/menu', component: SysMenu, code: "sessionManage", sub_code: 'sysMenu' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/sys/permission', component: SysPermission, code: "sessionManage", sub_code: 'sysPermission' },

    //?????????-????????????
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/configManage/addressNews', component: AddressNews, code: "configManage", sub_code: 'AddressNews' },
    { name: '?????????????????????', icon: UnorderedListOutlined, path: '/mms/config/svScreenConfig', component: SvScreenConfig, code: "configManage", sub_code: 'svScreenConfig' },
    { name: '????????????????????????', icon: UnorderedListOutlined, path: '/mms/config/channelShortVideoList', component: ChannelShortVideoList, code: "configManage", sub_code: 'channelShortVideoList' },
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/config/shortListConfig', component: ShortListConfig, code: "configManage", sub_code: 'shortListConfig' },
    { name: '???????????????????????????', icon: UnorderedListOutlined, path: '/mms/config/sportsIndexBanner', component: SportsIndexBanner, code: "configManage", sub_code: 'sportsIndexBanner' },
    { name: '????????????????????????', icon: UnorderedListOutlined, path: '/mms/config/recommendConfig', component: RecommendConfig, code: "configManage", sub_code: 'recommendConfig' },
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/config/wordsSwiperConfig', component: WordsSwiperConfig, code: "configManage", sub_code: 'wordsSwiperConfig' },
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/config/homeBroadcast', component: HomeBroadcast, code: "configManage", sub_code: 'homeBroadcast' },
    { name: '????????????????????????', icon: UnorderedListOutlined, path: '/mms/config/channelShield', component: ChannelShield, code: "configManage", sub_code: 'channelShield' },
    // { name: 'TV????????????', icon: UnorderedListOutlined, path: '/mms/config/tvRecommendConfig', component: TvRecommendConfig, code: "configManage", sub_code: 'tvRecommendConfig' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/config/livePreview', component: LivePreview, code: "configManage", sub_code: 'livePreview' },
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/configManage/programmeManage', component: ProgrammeManage, code: "configManage", sub_code: 'programmeManage' },
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/configManage/MangoConfig', component: MangoConfig, code: "configManage", sub_code: 'mangoConfig' },



    //?????????????????????
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/wxReply', component: WxReply, code: "WeChatManage", sub_code: 'wxReply' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/wx/tmplMsg', component: wxTemplateMsg, code: "WeChatManage", sub_code: 'TmplMsgTag' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/wx/msg', component: WxMsg, code: "WeChatManage", sub_code: 'wxMsg' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/wx/wechatMenu', component: WechatMenu, code: "WeChatManage", sub_code: 'wechatMenu' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/wx/fansTag', component: FansTag, code: "WeChatManage", sub_code: 'fansTag' },
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/wx/personalSend', component: PersonalSend, code: "WeChatManage", sub_code: 'personalSend' },
    { name: '??????(??????)??????', icon: UnorderedListOutlined, path: '/mms/wx/loginVipConfig', component: LoginVipConfig, code: "WeChatManage", sub_code: 'loginVipConfig' },
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/wx/wechatAutoReply', component: WechatAutoReply, code: "WeChatManage", sub_code: 'wechatAutoReply' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/wx/wechatTag', component: WechatTag, code: "WeChatManage", sub_code: 'wechatTag' },
    { name: '????????????????????????', icon: UnorderedListOutlined, path: '/mms/wx/lockPersonConfig', component: LockPersonConfig, code: "WeChatManage", sub_code: 'lockPersonConfig' },

    //  ????????????
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/earnManage/earnIncentiveTask', component: EarnIncentiveTask, code: "earnManage", sub_code: 'earnIncentiveTask' },
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/earnManage/withdrawalGoodsList', component: WithdrawalGoodsList, code: "earnManage", sub_code: 'withdrawalGoodsList' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/earnManage/refreshInventory', component: RefreshInventory, code: "earnManage", sub_code: 'refreshInventory' },
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/earnManage/withdrawalConfig', component: WithdrawalConfig, code: "earnManage", sub_code: 'withdrawalConfig' },
    { name: '??????', icon: UnorderedListOutlined, path: '/mms/earnManage/notice', component: Notice, code: "earnManage", sub_code: 'notice' },
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/earnManage/blackList', component: BlackList, code: "earnManage", sub_code: 'blackList' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/earnManage/timeLimitedTask', component: TimeLimitedTask, code: "earnManage", sub_code: 'timeLimitedTask' },



    //????????????
    { name: '?????????????????????', icon: UnorderedListOutlined, path: '/mms/album/activityConfig', component: ActivityConfig, code: "Album", sub_code: 'activityConfig' },
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/album/photos', component: ViewPhotos, code: "Album", sub_code: 'viewPhotos' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/album/activityManage', component: ActivityManage, code: "Album", sub_code: 'activityManage' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/album/checkAblum', component: CheckAblum, code: "Album", sub_code: 'checkAblum' },
    //????????????
    // { name: 'VIP????????????', icon: UnorderedListOutlined, path: '/mms/comboManage/vipCombo', component: VipCombo, code: "comboManage", sub_code: 'vipCombo' },

    // ?????????-????????????
    { name: '???????????????', icon: LineChartOutlined, path: '/mms/mobileSubject/channel', component: mobileChannel, code: "mobileProject", sub_code: 'ayhProgramList' },
    { name: '??????????????????', icon: LineChartOutlined, path: '/mms/mobileSubject/sportsProgram', component: mobileSportsProgram, code: "mobileProject", sub_code: 'sportsProgram' },
    { name: '???????????????', icon: LineChartOutlined, path: '/mms/mobileSubject/shortVideo', component: mobileShortVideo, code: "mobileProject", sub_code: 'AyhShortVideo' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/mobileSubject/channelSubject', component: mobileChannelSubject, code: "mobileProject", sub_code: 'channelSubject' },
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/mobileSubject/channelSubjectNew', component: mobileChannelSubjectNew, code: "mobileProject", sub_code: 'channelSubjectNew' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/mobileSubject/editSubject/:id', component: mobileEditSubject, code: "mobileProject" }, //????????????????????????
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/mobileSubject/editSubjectNew/:id', component: mobileEditSubjectNew, code: "mobileProject" }, //???????????????????????????
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/mobileSubject/goodPlay', component: mobileGoodPlay, code: "mobileProject", sub_code: 'channelGoodPlay' },

    // ??????-????????????
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/generalConfig/doc', component: ConfigDoc, code: "generalMangement", sub_code: 'DocManager' },
    { name: '????????????????????????', icon: UnorderedListOutlined, path: '/mms/generalConfig/offlineConfig', component: OffineConfig, code: "generalMangement", sub_code: 'offlineConfig' },
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/generalConfig/riskAreaConfig', component: RiskAreaConfig, code: "generalMangement", sub_code: 'riskAreaConfig' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/generalConfig/tagConfig', component: TagConfig, code: "generalMangement", sub_code: 'tagConfig' },
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/generalConfig/miniConfig', component: MiniConfig, code: "generalMangement", sub_code: 'MiniConfig' },
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/generalConfig/puzzleRobot', component: PuzzleRobot, code: "generalMangement", sub_code: 'puzzleRobot' },
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/generalConfig/apkConfig', component: ApkConfig, code: "generalMangement", sub_code: 'apkConfig' },

    // TV???-????????????
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/TVConfig/whiteList', component: WhiteList, code: "tvConfigManagement", sub_code: 'MiniConfig' },
    { name: '????????????????????????', icon: UnorderedListOutlined, path: '/mms/TVConfig/enterChannelConfig', component: EnterChannelConfig, code: "tvConfigManagement", sub_code: 'enterChannelConfig' },
    { name: '?????????????????????', icon: UnorderedListOutlined, path: '/mms/TVConfig/enterImageConfig', component: EnterImageConfig, code: "tvConfigManagement", sub_code: 'enterImageConfig' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/TVConfig/goodLooking', component: GoodLooking, code: "tvConfigManagement", sub_code: 'goodLooking' },
    { name: '?????????????????????', icon: UnorderedListOutlined, path: '/mms/TVConfig/programAppConfig', component: ProgramAppConfig, code: "tvConfigManagement", sub_code: 'programAppConfig' },
    { name: 'TV????????????', icon: UnorderedListOutlined, path: '/mms/TVConfig/tvRecommendConfig', component: TvRecommendConfig, code: "tvConfigManagement", sub_code: 'tvRecommendConfig' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/TVConfig/menuConfig', component: MenuConfig, code: "tvConfigManagement", sub_code: 'menuConfig' },
    { name: 'TV???????????????', icon: UnorderedListOutlined, path: '/mms/TVConfig/topicConfig', component: TopicConfig, code: "tvConfigManagement", sub_code: 'topicConfig' },
    { name: '??????', icon: UnorderedListOutlined, path: '/mms/TVConfig/mine', component: Mine, code: "tvConfigManagement", sub_code: 'mine' },
    { name: '????????????????????????', icon: UnorderedListOutlined, path: '/mms/TVConfig/detail', component: MineDetail, code: "tvConfigManagement", sub_code: 'mineDetail' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/TVConfig/logout', component: Logout, code: "tvConfigManagement", sub_code: 'logout' },
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/TVConfig/simple', component: Simple, code: "tvConfigManagement", sub_code: 'simple' },



    //??????-????????????
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/currencyChannel/channelRiskRegion', component: ChannelRiskRegion, code: "currencyChannel", sub_code: 'channelRiskRegion' },
    //??????-????????????
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/offline/program', component: OfflineProgram, code: "offlineManage", sub_code: 'offlineProgram' },
    { name: '????????????????????????', icon: UnorderedListOutlined, path: '/mms/offline/detail', component: OfflineProgramDetail, code: "offlineManage", sub_code: 'detail' },
    { name: '??????????????????', icon: UnorderedListOutlined, path: '/mms/offline/riskControl', component: RiskControl, code: "offlineManage", sub_code: 'riskControl' },
    //???????????????
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/armourPackage/armourList', component: ArmourList, code: "armourPackage", sub_code: 'armourList' },
    { name: '???????????????', icon: UnorderedListOutlined, path: '/mms/armourPackage/armourInstall', component: ArmourInstall, code: "armourPackage", sub_code: 'armourInstall' },
    //?????????????????????
    //{ name: '?????????????????????', icon: UnorderedListOutlined, path: '/mms/programApp/programAppConfig', component: ProgramAppConfig, code: "programApp", sub_code: 'programAppConfig' },
    //??????

    //  ?????????????????????
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/privateDomain/scoreShop', component: ScoreShop, code: "signConfig", sub_code: 'scoreShop' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/privateDomain/hotDay', component: HotDay, code: "signConfig", sub_code: 'hotDay' },
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/privateDomain/statistical', component: Statistical, code: "signConfig", sub_code: 'statistical' },


    
    { name: '????????????', icon: UnorderedListOutlined, path: '/mms/noPermission', component: NoPermission, meta: { isNav: false, roles: '*' } }



]

export default adminRoutes