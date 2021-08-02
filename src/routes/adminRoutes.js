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
const UserDemote = lazy(()=>import('pages/level/userDemote/index.jsx'))
const BonusPayment = lazy(()=>import('pages/ayh/bonusPayment/index.jsx'))
const AddressList = lazy(()=>import('pages/level/addressList/index.jsx'))
const ServiceLog = lazy(()=>import('pages/service/serviceLog/index.jsx'))
const ManageTag = lazy(()=>import('pages/service/manageTag/index.jsx'))
const MiniInput = lazy(()=>import('pages/service/miniInput/index.jsx'))

const adminRoutes = [
  {
    path: '/mms/ayh/channel',
    component: AyhChannel,
    name: '奥运会节目单',
    icon: LineChartOutlined
  },
  {
    path: '/mms/ayh/winningNews',
    component: WinningNews,
    name: '夺奖快讯',
    icon: LineChartOutlined
  },
  {
    path: '/mms/ayh/sportsProgram',
    component: SportsProgram,
    name: '夺奖快讯',
    icon: LineChartOutlined
  },
  {
    path: '/mms/ayh/medalList',
    component: MedalList,
    name: '奖牌榜',
    icon: LineChartOutlined
  },
  {
    path: '/mms/ayh/eventList',
    component: EventList,
    name: '赛事列表',
    icon: LineChartOutlined
  },
  {
    path: '/mms/ayh/specialList',
    component: SpecialList,
    name: '赛事列表',
    icon: LineChartOutlined
  },
  {
    path: '/mms/ayh/shortVideo',
    component: ShortVideo,
    name: '短视频搜索',
    icon: LineChartOutlined
  },
  {
    path: '/mms/ayh/bonusPayment',
    component: BonusPayment,
    name: '奖金发放',
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
    path: '/mms/level/userDemote',
    component: UserDemote,
    name: '用户降级',
    icon: UnorderedListOutlined
  },
  {
    path: '/mms/level/addressList',
    component: AddressList,
    name: '用户降级',
    icon: UnorderedListOutlined
  },
  {
    path: '/mms/service/serviceLog',
    component: ServiceLog,
    name: '服务分类',
    icon: UnorderedListOutlined
  },
  {
    path: '/mms/service/manageTag/:categoryId',
    component: ManageTag,
    name: '管理类别',
    icon: UnorderedListOutlined
  },
  {
    path: '/mms/service/miniInput',
    component: MiniInput,
    name: '小程序录入',
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