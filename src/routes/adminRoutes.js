import {lazy} from 'react'
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
    path: '/mms/level/equity',
    component: Equity,
    name: '权益配置',
    icon: UnorderedListOutlined
  },
  {
    path: '/mms/level/levelConfig',
    component: LevelConfig,
    name: '等级配置',
    icon: UnorderedListOutlined
  },
  {
    path: '/mms/level/growConfig',
    component: GrowConfig,
    name: '等级配置',
    icon: UnorderedListOutlined
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