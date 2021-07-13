import React, { Component } from 'react'
import {getMenu} from "../../api/index"
import { Layout, Menu, Avatar, Dropdown, message, Badge } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';

import './style.css'
import adminRoutes from '../../routes/adminRoutes.js'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../store/user/actionCreators'

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const mapStateToProps = (state)=>{
  return {
    userInfo: state.user.userInfo
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    logout: ()=>{
      dispatch(logout())
    }
  }
}

// 装饰器
@connect(mapStateToProps,mapDispatchToProps)
@withRouter
class MyLayout extends Component {
  state = {
    collapsed: false,
    navRoutes:[]
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  componentDidMount(){
    if(window.localStorage.getItem("routesList_tmp")){
      this.setState({
        navRoutes : JSON.parse(window.localStorage.getItem("routesList_tmp")).filter(route => route.parentId === 0 && route.code === "OlympicGames")
      })
    }else{
      this.getMenu()
    }
  }
  getMenu(){
    getMenu({id:1}).then(res=>{
      if(res.data.errCode === 0){
        let tmp = res.data.data;
        let list = []
        let tmpChild = [];
        for (let i in tmp) {
            let t = tmp[i];
            if (t.level == 1) {
                list.push(t)
            } else if (t.level == 2) {
                tmpChild.push(t)
            }
        }
        for (let j in list) {
            list[j].children = [];
            for (let i in tmpChild) {
                if (list[j].id == tmpChild[i].parentId) {
                    list[j].children.push(tmpChild[i])
                }
            }
        }
        console.log(list,"list")
        window.localStorage.setItem("routesList_tmp",JSON.stringify(list))
        this.setState({
          navRoutes:list.filter(item=>item.code === "OlympicGames")
        })
      }
    })
  }
  render() {
    const menu = (
      <Menu>
        <Menu.Item onClick={()=>{
          this.props.history.push('/admin/msgLists')
        }}>消息中心</Menu.Item>
        <Menu.Item onClick={this.loginOut}>退出登录</Menu.Item>
      </Menu>
    );
    return (
      <div id="admin">
        <Layout>
          <Sider
           trigger={null} 
           collapsible 
           collapsed={this.state.collapsed}
          >
            <div className="logo">
              电视家CMS
            </div>
            <Menu 
             theme="dark" 
             mode="inline" 
             onClick = { ({key}) => {
              // 点击导航跳转
              console.log(key)
              this.props.history.push(key)
             } }
            //  defaultSelectedKeys={this.props.location.pathname}
            //  selectedKeys={this.selectKeys()}
             >
              {
                this.state.navRoutes.map(nav => {
                  return (
                    nav.children.length>0?
                    <SubMenu icon={<UserOutlined />} title={nav.name} key={nav.name}>
                      {
                        nav.children.map(child => {
                          return(
                            <Menu.Item key={child.path}>{child.name}</Menu.Item>
                          )
                        })
                      }
                    </SubMenu>
                    :
                    <Menu.Item icon={<nav.icon />}>
                      {nav.name}
                    </Menu.Item>
                    
                  )
                })
              }
            </Menu>
          </Sider>
          <Layout className="site-layout" style={{minHeight: "100vh", overflow: "auto"}}>
            <Header className="site-layout-background" style={{ padding: 0 }}>
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
              })}
              <div style={{float: 'right', marginRight: 50}}>
                <Badge count={0}>
                  <Dropdown overlay={menu}>
                  <div style={{color: "#555"}}>
                    <Avatar
                      src="http://test.cdn.dianshihome.com/test/ic_launcher.png"
                    />
                    <span style={{marginLeft: 10}}>{decodeURI(this.props.userInfo.userName)}</span>
                  </div>
                  </Dropdown>
                </Badge>
              </div>
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280
                ,height: "88vh"
                ,overflowY: "auto"
              }}
            >
              { this.props.children }
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }
  loginOut = ()=>{
    this.props.logout();
    message.success('退出成功', 1, ()=>{
      this.props.history.push("/login")
    })
  }
  selectKeys = ()=>{
    const pathName = this.props.location.pathname;
    if(['/admin/artLists', '/admin/artAdd', '/admin/artEdit'].findIndex((value) => {
      return pathName.startsWith(value)
    }) !== -1){
      return '/admin/artLists'
    } else {
      return pathName
    }
  }
}

export default MyLayout