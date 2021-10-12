/*
 * @Description: 
 * @Author: HuangQS
 * @Date: 2021-08-20 16:06:46
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-12 11:57:10
 */
import { lazy } from 'react'
import { UnorderedListOutlined, LineChartOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons'
const AyhChannel = lazy(() => import('pages/ayh/channel/index.jsx'))
const NoPermission = lazy(() => import('pages/NoPermission/index.jsx'))
const WinningNews = lazy(() => import('pages/ayh/winningNews/index.jsx'))
const SportsProgram = lazy(() => import('pages/ayh/sportsProgram/index.jsx'))
const MedalList = lazy(() => import('pages/ayh/medalList/index.jsx'))
const EventList = lazy(() => import('pages/ayh/eventList/index.jsx'))
const SpecialList = lazy(() => import('pages/ayh/specialList/index.jsx'))
const ShortVideo = lazy(() => import('pages/ayh/shortVideo/index.jsx'))
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
const Voting = lazy(() => import('pages/activeManagement/voting/index.jsx'))
const ChannelLock = lazy(() => import('pages/channelManage/channelLock/index.jsx'))
const LivePreview = lazy(() => import('pages/channelManage/livePreview/index.jsx'))
const AddressNews = lazy(() => import('pages/configManage/addressNews/index.jsx'))
const ChannelSubject = lazy(() => import('pages/channelManage/channelSubject/index.jsx'))
const EditSubject = lazy(() => import('pages/channelManage/editSubject/index.jsx'))
const ConfigDoc = lazy(() => import('pages/config/doc.jsx'));
const WxReply = lazy(() => import('pages/wechart/autoReply/wxReply.jsx'));
const wxTemplateMsg = lazy(() => import('pages/wechart/templateMsg/wxTemplateMsg.jsx'));
const LoginManage = lazy(() => import('pages/adManage/loginManage/index.jsx'));
const MiniConfig = lazy(() => import('pages/configManage/miniConfig/index.jsx'));
const SvScreenConfig = lazy(() => import('pages/configManage/svScreenConfig/svScreenConfig.jsx'));
const OffineConfig = lazy(() => import('pages/configManage/offlineConfig/offlineConfig.jsx'));

const WxMsg = lazy(() => import('pages/weChatManage/WxMsg/index.jsx'))

//用户权限相关
const SysRole = lazy(() => import('pages/sys/role/role.jsx'));
const SysUser = lazy(() => import('pages/sys/user/user.jsx'));
const SysMenu = lazy(() => import('pages/sys/menu/menu.jsx'));
const SysPermission = lazy(() => import('pages/sys/permission/permission.jsx'));


// advertising management
// const Test = lazy(() =>import('pages/test/test.jsx'));
const adminRoutes = [

    { name: '奥运会节目单', icon: LineChartOutlined, path: '/mms/ayh/channel', component: AyhChannel, code: "OlympicGames", sub_code: 'ayhProgramList' },
    { name: '夺奖快讯', icon: LineChartOutlined, path: '/mms/ayh/winningNews', component: WinningNews, code: "OlympicGames", sub_code: 'winningNews' },
    { name: '体育节目', icon: LineChartOutlined, path: '/mms/ayh/sportsProgram', component: SportsProgram, code: "OlympicGames", sub_code: 'sportsProgram' },
    { name: '奖牌榜', icon: LineChartOutlined, path: '/mms/ayh/medalList', component: MedalList, code: "OlympicGames", sub_code: 'medalList' },
    { name: '赛事列表', icon: LineChartOutlined, path: '/mms/ayh/eventList', component: EventList, code: "OlympicGames", sub_code: 'EventList' },
    { name: '专题', icon: LineChartOutlined, path: '/mms/ayh/specialList', component: SpecialList, code: "OlympicGames", sub_code: 'SpecialList' },
    { name: '短视频搜索', icon: LineChartOutlined, path: '/mms/ayh/shortVideo', component: ShortVideo, code: "OlympicGames", sub_code: 'AyhShortVideo' },
    { name: '奖金发放', icon: LineChartOutlined, path: '/mms/ayh/bonusPayment', component: BonusPayment, code: "OlympicGames", sub_code: 'BonusPayment' },

    { name: '权益配置', icon: UnorderedListOutlined, path: '/mms/level/equity', component: Equity, code: "LevelManage", sub_code: 'EquityConfig' },
    { name: '等级配置', icon: UnorderedListOutlined, path: '/mms/level/levelConfig', component: LevelConfig, code: "LevelManage", sub_code: 'LevelConfig' },
    { name: '成长值配置', icon: UnorderedListOutlined, path: '/mms/level/growConfig', component: GrowConfig, code: "LevelManage", sub_code: 'GrowConfig' },
    { name: '用户降级', icon: UnorderedListOutlined, path: '/mms/level/userDemote', component: UserDemote, code: "LevelManage", sub_code: 'UserDemote' },
    { name: '用户降级', icon: UnorderedListOutlined, path: '/mms/level/addressList', component: AddressList, code: "LevelManage", sub_code: 'UserAddressList' },

    //生活服务
    { name: '管理类别', icon: UnorderedListOutlined, path: '/mms/service/manageTag/:categoryId', component: ManageTag, code: "LifeService" },                   //?????????????????
    { name: '服务分类', icon: UnorderedListOutlined, path: '/mms/service/serviceLog', component: ServiceLog, code: "LifeService", sub_code: 'ServiceLog' },
    { name: '小程序录入', icon: UnorderedListOutlined, path: '/mms/service/miniInput', component: MiniInput, code: "LifeService", sub_code: 'MiniInput' },

    //活动管理
    { name: '投票活动', icon: UnorderedListOutlined, path: '/mms/activeManagement/voting', component: Voting, code: "ActiveManagement", sub_code: 'Voting' },

    { name: '专享台解锁', icon: UnorderedListOutlined, path: '/mms/channelManage/channelLock', component: ChannelLock, code: "channelManage", sub_code: 'ChannelLock' },
    { name: '直播预告', icon: UnorderedListOutlined, path: '/mms/channel/livePreview', component: LivePreview, code: "channelManage", sub_code: 'livePreview' },
    { name: '频道专题', icon: UnorderedListOutlined, path: '/mms/channelManage/channelSubject', component: ChannelSubject, code: "channelManage", sub_code: 'ChannelSubject' },
    { name: '编辑专题', icon: UnorderedListOutlined, path: '/mms/channelManage/editSubject/:id', component: EditSubject, code: "channelManage" }, //频道专题二级页面


    { name: '尝鲜版', path: '/mms/adManage/recommend', component: Recommend, icon: UnorderedListOutlined, code: "adManage", sub_code: 'Recommend' },
    { name: '个人中心登录', path: '/mms/adManage/LoginManage', component: LoginManage, icon: UnorderedListOutlined, code: "adManage", sub_code: 'LoginManage' },
    { name: '菜单栏图片配置', path: '/mms/adManage/menuImage', component: MenuImage, icon: UnorderedListOutlined, code: "adManage", sub_code: 'menuImage' },
    { name: '自定义规则便签', path: '/mms/ad/customAdTag', component: CustomAdTag, icon: UnorderedListOutlined, code: "adManage", sub_code: 'customAdTag' },

    //todo 正式环境临时注释
    // //用户权限相关
    // { name: '角色列表', icon: UnorderedListOutlined, path: '/mms/sys/role', component: SysRole, code: "sessionManage", sub_code: 'sysRole' },
    // { name: '用户列表', icon: UnorderedListOutlined, path: '/mms/sys/user', component: SysUser, code: "sessionManage", sub_code: 'sysUser' },
    // { name: '功能列表', icon: UnorderedListOutlined, path: '/mms/sys/menu', component: SysMenu, code: "sessionManage", sub_code: 'sysMenu' },
    // { name: '权限列表', icon: UnorderedListOutlined, path: '/mms/sys/permission', component: SysPermission, code: "sessionManage", sub_code: 'sysPermission' },

    //配置管理
    { name: '文案管理', icon: UnorderedListOutlined, path: '/mms/doc', component: ConfigDoc, code: "configManage", sub_code: 'DocManager' },
    { name: '地域新闻', icon: UnorderedListOutlined, path: '/mms/configManage/addressNews', component: AddressNews, code: "configManage", sub_code: 'AddressNews' },
    { name: '小程序配置', icon: UnorderedListOutlined, path: '/mms/config/miniConfig', component: MiniConfig, code: "configManage", sub_code: 'MiniConfig' },
    { name: '短视频首屏配置', icon: UnorderedListOutlined, path: '/mms/config/svScreenConfig', component: SvScreenConfig, code: "configManage", sub_code: 'svScreenConfig' },
    { name: '停服下线通知配置', icon: UnorderedListOutlined, path: '/mms/config/offlineConfig', component: OffineConfig, code: "configManage", sub_code: 'offlineConfig' },



    //微信公众号管理
    { name: '自动回复', icon: UnorderedListOutlined, path: '/mms/wxReply', component: WxReply, code: "WeChatManage", sub_code: 'wxReply' },
    { name: '支付模板', icon: UnorderedListOutlined, path: '/mms/wx/tmplMsg', component: wxTemplateMsg, code: "WeChatManage", sub_code: 'TmplMsgTag' },
    { name: '客服消息', icon: UnorderedListOutlined, path: '/mms/wx/msg', component: WxMsg, code: "WeChatManage", sub_code: 'wxMsg' },

    //其他
    { name: '没有权限', icon: UnorderedListOutlined, path: '/mms/noPermission', component: NoPermission, meta: { isNav: false, roles: '*' } }



]

export default adminRoutes