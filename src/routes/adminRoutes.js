/*
 * @Description: 
 * @Author: HuangQS
 * @Date: 2021-08-20 16:06:46
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-10 15:55:29
 */
import { lazy } from 'react'
import { UnorderedListOutlined, LineChartOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons'
const AyhChannel = lazy(()=>import('pages/ayh/channel/index.jsx'))
const NoPermission = lazy(()=>import('pages/NoPermission/index.jsx'))
const WinningNews = lazy(()=>import('pages/ayh/winningNews/index.jsx'))
const SportsProgram = lazy(()=>import('pages/ayh/sportsProgram/index.jsx'))
const MedalList = lazy(()=>import('pages/ayh/medalList/index.jsx'))
const EventList = lazy(()=>import('pages/ayh/eventList/index.jsx'))
const SpecialList = lazy(()=>import('pages/ayh/specialList/index.jsx'))
const ShortVideo = lazy(()=>import('pages/ayh/shortVideo/index.jsx'))
const Equity = lazy(()=>import('pages/level/equity/index.jsx'))
const LevelConfig = lazy(()=>import('pages/level/levelConfig/index.jsx'))
const GrowConfig = lazy(()=>import('pages/level/growConfig/index.jsx'))
const UserDemote = lazy(()=>import('pages/level/userDemote/index.jsx'))
const BonusPayment = lazy(()=>import('pages/ayh/bonusPayment/index.jsx'))
const AddressList = lazy(()=>import('pages/level/addressList/index.jsx'))
const ServiceLog = lazy(()=>import('pages/service/serviceLog/index.jsx'))
const ManageTag = lazy(()=>import('pages/service/manageTag/index.jsx'))
const MiniInput = lazy(()=>import('pages/service/miniInput/index.jsx'))
const Recommend= lazy (()=>import ('pages/adManage/recommend/recommend.jsx'));
const MenuImage= lazy (()=>import ('pages/adManage/menuImage/menuImage.jsx'));
const Voting = lazy(()=>import('pages/activeManagement/voting/index.jsx'))
const ChannelLock = lazy(()=>import('pages/channelManage/channelLock/index.jsx'))
const LivePreview = lazy(()=>import('pages/channelManage/livePreview/index.jsx'))
const AddressNews = lazy(()=>import('pages/configManage/addressNews/index.jsx'))
const ChannelSubject = lazy(()=>import('pages/channelManage/channelSubject/index.jsx'))
const EditSubject = lazy(()=>import('pages/channelManage/editSubject/index.jsx'))
const ConfigDoc = lazy(()=>import('pages/config/doc.jsx'));
const WxReply =  lazy(()=>import('pages/wechart/autoReply/wxReply.jsx'));  
const wxPayTemplate =  lazy(()=>import('pages/wechart/wxPayTemplate.jsx'));

const WxMsg = lazy(()=>import('pages/weChatManage/WxMsg/index.jsx'))
// advertising management
// const Test = lazy(() =>import('pages/test/test.jsx'));
const adminRoutes = [

  {path:'/mms/ayh/channel',component:AyhChannel,name:'奥运会节目单',icon:LineChartOutlined,code:"OlympicGames"},
  {path:'/mms/ayh/winningNews',component:WinningNews,name:'夺奖快讯',icon:LineChartOutlined,code:"OlympicGames"},
  {path:'/mms/ayh/sportsProgram',component:SportsProgram,name:'夺奖快讯',icon:LineChartOutlined,code:"OlympicGames"},
  {path:'/mms/ayh/medalList',component:MedalList,name:'奖牌榜',icon:LineChartOutlined,code:"OlympicGames"},
  {path:'/mms/ayh/eventList',component:EventList,name:'赛事列表',icon:LineChartOutlined,code:"OlympicGames"},
  {path:'/mms/ayh/specialList',component:SpecialList,name:'赛事列表',icon:LineChartOutlined,code:"OlympicGames"},
  {path:'/mms/ayh/shortVideo',component:ShortVideo,name:'短视频搜索',icon:LineChartOutlined,code:"OlympicGames"},
  {path:'/mms/ayh/bonusPayment',component:BonusPayment,name:'奖金发放',icon:LineChartOutlined,code:"OlympicGames"},

  {path:'/mms/level/equity',component:Equity,name:'权益配置',icon:UnorderedListOutlined,code:"LevelManage"},
  {path:'/mms/level/levelConfig',component:LevelConfig,name:'等级配置',icon:UnorderedListOutlined,code:"LevelManage"},
  {path:'/mms/level/growConfig',component:GrowConfig,name:'等级配置',icon:UnorderedListOutlined,code:"LevelManage"},
  {path:'/mms/level/userDemote',component:UserDemote,name:'用户降级',icon:UnorderedListOutlined,code:"LevelManage"},
  {path:'/mms/level/addressList',component:AddressList,name:'用户降级',icon:UnorderedListOutlined,code:"LevelManage"},

  {path:'/mms/service/serviceLog',component:ServiceLog,name:'服务分类',icon:UnorderedListOutlined,code:"LifeService"},
  {path:'/mms/service/manageTag/:categoryId',component:ManageTag,name:'管理类别',icon:UnorderedListOutlined,code:"LifeService"},
  {path:'/mms/service/miniInput',component:MiniInput,name:'小程序录入',icon:UnorderedListOutlined,code:"LifeService"},

  {path:'/mms/activeManagement/voting',component:Voting,name:'投票活动',icon:UnorderedListOutlined,code:"ActiveManagement"},
  {path:'/mms/channelManage/channelLock',component:ChannelLock,name:'专享台解锁',icon:UnorderedListOutlined,code:"channelManage"},
  {path:'/mms/channel/livePreview',component:LivePreview,name:'直播预告',icon:UnorderedListOutlined,code:"channelManage"},

  {path:'/mms/configManage/addressNews',component:AddressNews,name:'地域新闻',icon:UnorderedListOutlined,code:"configManage"},
  { path: '/mms/config/miniConfig', component: MiniConfig, name: '小程序配置', icon: UnorderedListOutlined, code: "configManage" },

  {path:'/mms/channelManage/channelSubject',component:ChannelSubject,name:'频道专题',icon:UnorderedListOutlined,code:"channelManage"},
  {path:'/mms/channelManage/editSubject/:id',component:EditSubject,name:'编辑专题',icon:UnorderedListOutlined,code:"channelManage"},


  {path:'/mms/adManage/recommend',component:Recommend,name:'尝鲜版',icon:UnorderedListOutlined,code:"adManage"},
  { path: '/mms/adManage/LoginManage', component: LoginManage, name: '个人中心登录', icon: UnorderedListOutlined, code: "adManage" },
  {path:'/mms/adManage/menuImage',component:MenuImage,name:'菜单栏图片配置',icon:UnorderedListOutlined,code:"adManage"},
 
 
  //配置管理
  {path:'/mms/doc',component:ConfigDoc,name:'文案管理',icon:UnorderedListOutlined,code:"configManage"},
 
  //微信公众号管理
  {path:'/mms/wxReply',component:WxReply,name:'自动回复',icon:UnorderedListOutlined,code:"WeChatManage"},
  {path:'/mms/wxPayTemplate',component:wxPayTemplate,name:'支付模板消息',icon:UnorderedListOutlined,code:"WeChatManage"},
 
  {path:'/mms/wx/msg',component:WxMsg,name:'客服消息',icon:UnorderedListOutlined,code:"WeChatManage"},
  {path:'/mms/noPermission',component:NoPermission,name:'没有权限',meta:{isNav:false,roles:'*'}}



]

export default adminRoutes