/*
 * @Description: 
 * @Author: HuangQS
 * @Date: 2021-08-20 16:06:46
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-12-23 14:42:56
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
const Voting = lazy(() => import('pages/activeManagement/voting/index.jsx'))
const ChannelLock = lazy(() => import('pages/channelManage/channelLock/index.jsx'))
const AddressNews = lazy(() => import('pages/configManage/addressNews/index.jsx'))
const MarsBootIn= lazy(() => import('pages/channelManage/marsBootIn/index.jsx'))
const SourceFailure= lazy(() => import('pages/channelManage/sourceFailure/index.jsx'))
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
const TvRecommendConfig = lazy(() => import('pages/configManage/tvRecommendConfig/tvRecommendConfig.jsx'))      //Tv推荐配置
//const ProgramAppConfig = lazy(() => import('pages/programApp/ProgramAppConfig/index.jsx')); //电视节目单配置
const LuckyDraw = lazy(() => import('pages/activeManagement/luckyDraw/index.jsx'))
const GoodsConfig = lazy(() => import('pages/activeManagement/goodsConfig/index.jsx'))
const mobileChannel = lazy(() => import('pages/mobileSubject/channel/index.jsx'))
const mobileSportsProgram = lazy(() => import('pages/mobileSubject/sportsProgram/index.jsx'))
const mobileShortVideo = lazy(() => import('pages/mobileSubject/shortVideo/index.jsx'))
const mobileChannelSubject = lazy(() => import('pages/mobileSubject/channelSubject/index.jsx'))
const mobileChannelSubjectNew = lazy(() => import('pages/mobileSubject/channelSubjectNew/index.jsx'))
const mobileEditSubject = lazy(() => import('pages/mobileSubject/editSubject/index.jsx'))
const mobileEditSubjectNew = lazy(() => import('pages/mobileSubject/editSubjectNew/index.jsx'))

const ConfigDoc = lazy(() => import('pages/generalConfig/wenanconfig/doc.jsx'));
const OffineConfig = lazy(() => import('pages/generalConfig/offlineConfig/offlineConfig.jsx'));
const RiskAreaConfig = lazy(() => import('pages/generalConfig/riskAreaConfig/riskAreaConfig.jsx'));
const TagConfig = lazy(() => import('pages/generalConfig/tagConfig/tagConfig.jsx'));
const MiniConfig = lazy(() => import('pages/generalConfig/miniConfig/index.jsx'));
const PuzzleRobot = lazy(() => import('pages/generalConfig/puzzleRobot/index.jsx'));

const WhiteList = lazy(() => import('pages/TVConfig/whiteList/index.jsx'))
const EnterChannelConfig = lazy(() => import('pages/TVConfig/enterChannelConfig/index.jsx'));
const EnterImageConfig = lazy(() => import('pages/TVConfig/enterImageConfig/index.jsx'));
const GoodLooking = lazy(() => import('pages/TVConfig/goodLooking/index.jsx'));
const ProgramAppConfig = lazy(() => import('pages/TVConfig/ProgramAppConfig/index.jsx')); //电视节目单配置

const LivePreview = lazy(() => import('pages/configManage/livePreview/index.jsx'))


//用户权限相关
const SysRole = lazy(() => import('pages/sys/role/role.jsx'));
const SysUser = lazy(() => import('pages/sys/user/user.jsx'));
const SysMenu = lazy(() => import('pages/sys/menu/menu.jsx'));
const SysPermission = lazy(() => import('pages/sys/permission/permission.jsx'));
//家庭相册
const ActivityConfig = lazy(() => import('pages/album/activityConfig/index.jsx'));


// advertising management
// const Test = lazy(() =>import('pages/test/test.jsx'));
const adminRoutes = [

    { name: '夺奖快讯', icon: LineChartOutlined, path: '/mms/ayh/winningNews', component: WinningNews, code: "OlympicGames", sub_code: 'winningNews' },
    { name: '奖牌榜', icon: LineChartOutlined, path: '/mms/ayh/medalList', component: MedalList, code: "OlympicGames", sub_code: 'medalList' },
    { name: '赛事列表', icon: LineChartOutlined, path: '/mms/ayh/eventList', component: EventList, code: "OlympicGames", sub_code: 'EventList' },
    { name: '专题', icon: LineChartOutlined, path: '/mms/ayh/specialList', component: SpecialList, code: "OlympicGames", sub_code: 'SpecialList' },
    { name: '奖金发放', icon: LineChartOutlined, path: '/mms/ayh/bonusPayment', component: BonusPayment, code: "OlympicGames", sub_code: 'BonusPayment' },

    { name: '权益配置', icon: UnorderedListOutlined, path: '/mms/level/equity', component: Equity, code: "LevelManage", sub_code: 'EquityConfig' },
    { name: '等级配置', icon: UnorderedListOutlined, path: '/mms/level/levelConfig', component: LevelConfig, code: "LevelManage", sub_code: 'LevelConfig' },
    { name: '成长值配置', icon: UnorderedListOutlined, path: '/mms/level/growConfig', component: GrowConfig, code: "LevelManage", sub_code: 'GrowConfig' },
    { name: '用户降级', icon: UnorderedListOutlined, path: '/mms/level/userDemote', component: UserDemote, code: "LevelManage", sub_code: 'UserDemote' },
    { name: '实体奖励发货列表', icon: UnorderedListOutlined, path: '/mms/level/addressList', component: AddressList, code: "LevelManage", sub_code: 'UserAddressList' },

    //生活服务
    { name: '管理类别', icon: UnorderedListOutlined, path: '/mms/service/manageTag/:categoryId', component: ManageTag, code: "LifeService" },                   //?????????????????
    { name: '服务分类', icon: UnorderedListOutlined, path: '/mms/service/serviceLog', component: ServiceLog, code: "LifeService", sub_code: 'ServiceLog' },
    { name: '小程序录入', icon: UnorderedListOutlined, path: '/mms/service/miniInput', component: MiniInput, code: "LifeService", sub_code: 'MiniInput' },

    //活动管理
    { name: '投票活动', icon: UnorderedListOutlined, path: '/mms/activeManagement/voting', component: Voting, code: "ActiveManagement", sub_code: 'Voting' },
    { name: '抽奖活动', icon: UnorderedListOutlined, path: '/mms/activeManagement/luckyDraw', component: LuckyDraw, code: "ActiveManagement", sub_code: 'LuckyDraw' },
    { name: '商品配置', icon: UnorderedListOutlined, path: '/mms/activeManagement/goodsConfig', component: GoodsConfig, code: "ActiveManagement", sub_code: 'GoodsConfig' },
    //频道管理
    { name: '专享台解锁', icon: UnorderedListOutlined, path: '/mms/channelManage/channelLock', component: ChannelLock, code: "channelManage", sub_code: 'channelLock' },
    { name: '火星开机进入', icon: UnorderedListOutlined, path: '/mms/channelManage/marsBootIn', component: MarsBootIn, code: "channelManage", sub_code: 'marsBootIn' },
    { name: '源失效推荐', icon: UnorderedListOutlined, path: '/mms/channelManage/sourceFailure', component: SourceFailure, code: "channelManage", sub_code: 'sourceFailure' },

    //TV端-广告管理
    { name: '尝鲜版', component: Recommend, path: '/mms/adManage/recommend', icon: UnorderedListOutlined, code: "adManage", sub_code: 'Recommend' },
    { name: '个人中心登录', component: LoginManage, path: '/mms/adManage/LoginManage', icon: UnorderedListOutlined, code: "adManage", sub_code: 'LoginManage' },
    { name: '菜单栏图片配置', component: MenuImage, path: '/mms/adManage/menuImage', icon: UnorderedListOutlined, code: "adManage", sub_code: 'menuImage' },
    { name: '自定义规则标签', component: CustomAdTag, path: '/mms/ad/customAdTag', icon: UnorderedListOutlined, code: "adManage", sub_code: 'customAdTag' },
    { name: '广告组', component: AdGroup, path: '/mms/adManage/adGroup', icon: UnorderedListOutlined, code: "adManage", sub_code: 'adGroup' },
    { name: '素材库', component: MaterialLibrary, path: '/mms/adManage/materialLibrary', icon: UnorderedListOutlined, code: "adManage", sub_code: 'adGroup' },

    //用户权限相关
    { name: '角色列表', icon: UnorderedListOutlined, path: '/mms/sys/role', component: SysRole, code: "sessionManage", sub_code: 'sysRole' },
    { name: '用户列表', icon: UnorderedListOutlined, path: '/mms/sys/user', component: SysUser, code: "sessionManage", sub_code: 'sysUser' },
    { name: '功能列表', icon: UnorderedListOutlined, path: '/mms/sys/menu', component: SysMenu, code: "sessionManage", sub_code: 'sysMenu' },
    { name: '权限列表', icon: UnorderedListOutlined, path: '/mms/sys/permission', component: SysPermission, code: "sessionManage", sub_code: 'sysPermission' },

    //移动端-配置管理
    { name: '地域新闻', icon: UnorderedListOutlined, path: '/mms/configManage/addressNews', component: AddressNews, code: "configManage", sub_code: 'AddressNews' },
    { name: '短视频首屏配置', icon: UnorderedListOutlined, path: '/mms/config/svScreenConfig', component: SvScreenConfig, code: "configManage", sub_code: 'svScreenConfig' },
    { name: '节目单视频集配置', icon: UnorderedListOutlined, path: '/mms/config/channelShortVideoList', component: ChannelShortVideoList, code: "configManage", sub_code: 'channelShortVideoList' },
    { name: '短视频集配置', icon: UnorderedListOutlined, path: '/mms/config/shortListConfig', component: ShortListConfig, code: "configManage", sub_code: 'shortListConfig' },
    { name: '体育频道视频集配置', icon: UnorderedListOutlined, path: '/mms/config/sportsIndexBanner', component: SportsIndexBanner, code: "configManage", sub_code: 'sportsIndexBanner' },
    { name: '首页为你推荐配置', icon: UnorderedListOutlined, path: '/mms/config/recommendConfig', component: RecommendConfig, code: "configManage", sub_code: 'recommendConfig' },
    { name: '文字轮播配置', icon: UnorderedListOutlined, path: '/mms/config/wordsSwiperConfig', component: WordsSwiperConfig, code: "configManage", sub_code: 'wordsSwiperConfig' },
    { name: '首页直播配置', icon: UnorderedListOutlined, path: '/mms/config/homeBroadcast', component: HomeBroadcast, code: "configManage", sub_code: 'homeBroadcast' },
    { name: '移动端节目单屏蔽', icon: UnorderedListOutlined, path: '/mms/config/channelShield', component: ChannelShield, code: "configManage", sub_code: 'channelShield' },
    { name: 'TV推荐配置', icon: UnorderedListOutlined, path: '/mms/config/tvRecommendConfig', component: TvRecommendConfig, code: "configManage", sub_code: 'tvRecommendConfig' },
    { name: '直播预告', icon: UnorderedListOutlined, path: '/mms/config/livePreview', component: LivePreview, code: "configManage", sub_code: 'livePreview' },



    //微信公众号管理
    { name: '自动回复', icon: UnorderedListOutlined, path: '/mms/wxReply', component: WxReply, code: "WeChatManage", sub_code: 'wxReply' },
    { name: '支付模板', icon: UnorderedListOutlined, path: '/mms/wx/tmplMsg', component: wxTemplateMsg, code: "WeChatManage", sub_code: 'TmplMsgTag' },
    { name: '客服消息', icon: UnorderedListOutlined, path: '/mms/wx/msg', component: WxMsg, code: "WeChatManage", sub_code: 'wxMsg' },
    { name: '微信菜单', icon: UnorderedListOutlined, path: '/mms/wx/wechatMenu', component: WechatMenu, code: "WeChatManage", sub_code: 'wechatMenu' },
    { name: '粉丝标签', icon: UnorderedListOutlined, path: '/mms/wx/fansTag', component: FansTag, code: "WeChatManage", sub_code: 'fansTag' },
    { name: '个性化群发', icon: UnorderedListOutlined, path: '/mms/wx/personalSend', component: PersonalSend, code: "WeChatManage", sub_code: 'personalSend' },
    { name: '登录(专享)配置', icon: UnorderedListOutlined, path: '/mms/wx/loginVipConfig', component: LoginVipConfig, code: "WeChatManage", sub_code: 'loginVipConfig' },
    { name: '企业自动回复', icon: UnorderedListOutlined, path: '/mms/wx/wechatAutoReply', component: WechatAutoReply, code: "WeChatManage", sub_code: 'wechatAutoReply' },
    { name: '企微标签', icon: UnorderedListOutlined, path: '/mms/wx/wechatTag', component: WechatTag, code: "WeChatManage", sub_code: 'wechatTag' },

    //  赚赚管理
    { name: '赚赚激励任务', icon: UnorderedListOutlined, path: '/mms/earnManage/earnIncentiveTask', component: EarnIncentiveTask, code: "earnManage", sub_code: 'earnIncentiveTask' },
    { name: '提现商品列表', icon: UnorderedListOutlined, path: '/mms/earnManage/withdrawalGoodsList', component: WithdrawalGoodsList, code: "earnManage", sub_code: 'withdrawalGoodsList' },
    { name: '刷新库存', icon: UnorderedListOutlined, path: '/mms/earnManage/refreshInventory', component: RefreshInventory, code: "earnManage", sub_code: 'refreshInventory' },
    { name: '随机提现配置', icon: UnorderedListOutlined, path: '/mms/earnManage/withdrawalConfig', component: WithdrawalConfig, code: "earnManage", sub_code: 'withdrawalConfig' },
    { name: '公告', icon: UnorderedListOutlined, path: '/mms/earnManage/notice', component: Notice, code: "earnManage", sub_code: 'notice' },
    { name: '提现黑名单', icon: UnorderedListOutlined, path: '/mms/earnManage/blackList', component: BlackList, code: "earnManage", sub_code: 'blackList' },
    { name: '限时任务', icon: UnorderedListOutlined, path: '/mms/earnManage/timeLimitedTask', component: TimeLimitedTask, code: "earnManage", sub_code: 'timeLimitedTask' },



    //家庭相册
    { name: '传照片活动配置', icon: UnorderedListOutlined, path: '/mms/album/activityConfig', component: ActivityConfig, code: "Album", sub_code: 'activityConfig' },
    //套餐管理
    // { name: 'VIP会员套餐', icon: UnorderedListOutlined, path: '/mms/comboManage/vipCombo', component: VipCombo, code: "comboManage", sub_code: 'vipCombo' },

    // 移动端-专题管理
    { name: '节目单配置', icon: LineChartOutlined, path: '/mms/mobileSubject/channel', component: mobileChannel, code: "mobileProject", sub_code: 'ayhProgramList' },
    { name: '专题节目配置', icon: LineChartOutlined, path: '/mms/mobileSubject/sportsProgram', component: mobileSportsProgram, code: "mobileProject", sub_code: 'sportsProgram' },
    { name: '短视频搜索', icon: LineChartOutlined, path: '/mms/mobileSubject/shortVideo', component: mobileShortVideo, code: "mobileProject", sub_code: 'AyhShortVideo' },
    { name: '频道专题', icon: UnorderedListOutlined, path: '/mms/mobileSubject/channelSubject', component: mobileChannelSubject, code: "mobileProject", sub_code: 'channelSubject' },
    { name: '新频道专题', icon: UnorderedListOutlined, path: '/mms/mobileSubject/channelSubjectNew', component: mobileChannelSubjectNew, code: "mobileProject", sub_code: 'channelSubjectNew' },
    { name: '编辑专题', icon: UnorderedListOutlined, path: '/mms/mobileSubject/editSubject/:id', component: mobileEditSubject, code: "mobileProject" }, //频道专题二级页面
    { name: '新编辑专题', icon: UnorderedListOutlined, path: '/mms/mobileSubject/editSubjectNew/:id', component: mobileEditSubjectNew, code: "mobileProject" }, //频道专题二级页面

    // 通用-配置管理
    { name: '文案管理', icon: UnorderedListOutlined, path: '/mms/generalConfig/doc', component: ConfigDoc, code: "generalMangement", sub_code: 'DocManager' },
    { name: '停服下线通知配置', icon: UnorderedListOutlined, path: '/mms/generalConfig/offlineConfig', component: OffineConfig, code: "generalMangement", sub_code: 'offlineConfig' },
    { name: '风险地域配置', icon: UnorderedListOutlined, path: '/mms/generalConfig/riskAreaConfig', component: RiskAreaConfig, code: "generalMangement", sub_code: 'riskAreaConfig' },
    { name: '标签配置', icon: UnorderedListOutlined, path: '/mms/generalConfig/tagConfig', component: TagConfig, code: "generalMangement", sub_code: 'tagConfig' },
    { name: '小程序配置', icon: UnorderedListOutlined, path: '/mms/generalConfig/miniConfig', component: MiniConfig, code: "generalMangement", sub_code: 'MiniConfig' },
    { name: '拼团机器人', icon: UnorderedListOutlined, path: '/mms/generalConfig/puzzleRobot', component: PuzzleRobot, code: "generalMangement", sub_code: 'puzzleRobot' },

    // TV端-配置管理
    { name: '白名单配置', icon: UnorderedListOutlined, path: '/mms/TVConfig/whiteList', component: WhiteList, code: "tvConfigManagement", sub_code: 'MiniConfig' },
    { name: '开机进入频道配置', icon: UnorderedListOutlined, path: '/mms/TVConfig/enterChannelConfig', component: EnterChannelConfig, code: "tvConfigManagement", sub_code: 'enterChannelConfig' },
    { name: '开机启动图配置', icon: UnorderedListOutlined, path: '/mms/TVConfig/enterImageConfig', component: EnterImageConfig, code: "tvConfigManagement", sub_code: 'enterImageConfig' },
    { name: '好看分类', icon: UnorderedListOutlined, path: '/mms/TVConfig/goodLooking', component: GoodLooking, code: "tvConfigManagement", sub_code: 'goodLooking' },
    { name: '电视节目单配置', icon: UnorderedListOutlined, path: '/mms/TVConfig/programAppConfig', component: ProgramAppConfig, code: "tvConfigManagement", sub_code: 'programAppConfig' },

    //电视节目单配置
    //{ name: '电视节目单配置', icon: UnorderedListOutlined, path: '/mms/programApp/programAppConfig', component: ProgramAppConfig, code: "programApp", sub_code: 'programAppConfig' },
    //其他
    { name: '没有权限', icon: UnorderedListOutlined, path: '/mms/noPermission', component: NoPermission, meta: { isNav: false, roles: '*' } }



]

export default adminRoutes