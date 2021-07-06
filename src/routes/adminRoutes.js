// import DashBoard from 'pages/DashBoard'
// import ArtLists from 'pages/ArtLists'
// import ArtEdit from 'pages/ArtEdit'
// import ArtAdd from 'pages/ArtAdd'
// import MsgLists from 'pages/MsgLists'
// import Settings from 'pages/Settings'
// import NoPermission from 'pages/NoPermission'
import {lazy} from 'react'
import { UnorderedListOutlined, LineChartOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons'
const DashBoard = lazy(()=>import('pages/DashBoard/index.jsx'))
const ArtLists = lazy(()=>import('pages/ArtLists/index.jsx'))
const ArtEdit = lazy(()=>import('pages/ArtEdit/index.jsx'))
const ArtAdd = lazy(()=>import('pages/ArtAdd/index.jsx'))
const MsgLists = lazy(()=>import('pages/MsgLists/index.jsx'))
const Settings = lazy(()=>import('pages/Settings/index.jsx'))
const NoPermission = lazy(()=>import('pages/NoPermission/index.jsx'))

const adminRoutes = [
  {
    path: '/mms/dashBoard',
    component: DashBoard,
    name: '仪表盘',
    meta: {
      isNav: true,
      roles: ['admin', 'superAdmin', 'editor']
    },
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
    path: '/admin/artEdit/:artId',
    component: ArtEdit,
    name: '编辑文章',
    meta: {
      isNav: false,
      roles: ['admin', 'superAdmin', 'editor']
    }
  },
  {
    path: '/admin/artAdd',
    component: ArtAdd,
    name: '增加文章',
    meta: {
      isNav: false,
      roles: ['admin', 'superAdmin', 'editor']
    }
  },
  {
    path: '/admin/msgLists',
    component: MsgLists,
    name: '消息中心',
    meta: {
      isNav: true,
      roles: ['admin', 'superAdmin', 'editor']
    },
    icon: MessageOutlined
  },
  {
    path: '/admin/settings',
    component: Settings,
    name: '设置',
    meta: {
      isNav: true,
      roles: [ 'superAdmin', 'editor']
    },
    icon: SettingOutlined
  },
  {
    path: '/admin/noPermission',
    component: NoPermission,
    name: '没有权限',
    meta: {
      isNav: false,
      roles: '*'
    }
  }
  // {
  //   code: "SourceManage",
  //   children:[
  //     {
  //       code: "streamNet",
  //       createTime: 0,
  //       deleted: 2,
  //       id: 31,
  //       level: 2,
  //       name: "网络源",
  //       parentId: 2,
  //       path: "/admin/artLists",
  //       sortOrder: 31,
  //       status: 1,
  //       updateTime: 1563779334,
  //     }
  //   ],
  //   createTime: 0,
  //   deleted: 2,
  //   id: 2,
  //   level: 1,
  //   name: "源管理",
  //   parentId: 0,
  //   // path: "/admin/dashBoard",
  //   sortOrder: 2,
  //   status: 1,
  //   updateTime: 1563779666,
  //   icon: SettingOutlined,
  // }

]

export default adminRoutes