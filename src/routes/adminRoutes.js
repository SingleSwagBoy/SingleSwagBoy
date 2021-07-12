// import DashBoard from 'pages/DashBoard'
// import ArtLists from 'pages/ArtLists'
// import ArtEdit from 'pages/ArtEdit'
// import ArtAdd from 'pages/ArtAdd'
// import MsgLists from 'pages/MsgLists'
// import Settings from 'pages/Settings'
// import NoPermission from 'pages/NoPermission'
import {lazy} from 'react'
import { UnorderedListOutlined, LineChartOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons'
const AyhChannel = lazy(()=>import('pages/ayh/channel/index.jsx'))
const ArtLists = lazy(()=>import('pages/ArtLists/index.jsx'))
const ArtAdd = lazy(()=>import('pages/ArtAdd/index.jsx'))
const MsgLists = lazy(()=>import('pages/MsgLists/index.jsx'))
const Settings = lazy(()=>import('pages/Settings/index.jsx'))
const NoPermission = lazy(()=>import('pages/NoPermission/index.jsx'))
const WinningNews = lazy(()=>import('pages/ayh/winningNews/index.jsx'))
const SportsProgram = lazy(()=>import('pages/ayh/sportsProgram/index.jsx'))
const MedalList = lazy(()=>import('pages/ayh/medalList/index.jsx'))
const EventList = lazy(()=>import('pages/ayh/eventList/index.jsx'))
const SpecialList = lazy(()=>import('pages/ayh/specialList/index.jsx'))
const ShortVideo = lazy(()=>import('pages/ayh/shortVideo/index.jsx'))

const adminRoutes = [
  {
    path: '/mms/Ayh/channel',
    component: AyhChannel,
    name: '奥运会节目单',
    icon: LineChartOutlined
  },
  {
    path: '/mms/Ayh/winningNews',
    component: WinningNews,
    name: '夺奖快讯',
    icon: LineChartOutlined
  },
  {
    path: '/mms/Ayh/sportsProgram',
    component: SportsProgram,
    name: '夺奖快讯',
    icon: LineChartOutlined
  },
  {
    path: '/mms/Ayh/medalList',
    component: MedalList,
    name: '奖牌榜',
    icon: LineChartOutlined
  },
  {
    path: '/mms/Ayh/eventList',
    component: EventList,
    name: '赛事列表',
    icon: LineChartOutlined
  },
  {
    path: '/mms/Ayh/specialList',
    component: SpecialList,
    name: '赛事列表',
    icon: LineChartOutlined
  },
  {
    path: '/mms/Ayh/shortVideo',
    component: ShortVideo,
    name: '短视频搜索',
    icon: LineChartOutlined
  },
  {
    path: '/mms/artLists',
    component: ArtLists,
    name: '文章管理',
    meta: {
      isNav: true,
      roles: ['admin', 'superAdmin', 'editor']
    },
    icon: UnorderedListOutlined
  },
  {
    path: '/mms/artAdd',
    component: ArtAdd,
    name: '增加文章',
    meta: {
      isNav: false,
      roles: ['mms', 'superAdmin', 'editor']
    }
  },
  {
    path: '/admin/msgLists',
    component: MsgLists,
    name: '消息中心',
    meta: {
      isNav: true,
      roles: ['mms', 'superAdmin', 'editor']
    },
    icon: MessageOutlined
  },
  {
    path: '/mms/settings',
    component: Settings,
    name: '设置',
    meta: {
      isNav: true,
      roles: [ 'superAdmin', 'editor']
    },
    icon: SettingOutlined
  },
  {
    path: '/mms/noPermission',
    component: NoPermission,
    name: '没有权限',
    meta: {
      isNav: false,
      roles: '*'
    }
  }

]

export default adminRoutes