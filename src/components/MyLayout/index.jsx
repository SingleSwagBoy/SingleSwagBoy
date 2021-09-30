/*
 * @Author: HuangQS
 * @Date: 2021-09-29 18:13:44
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-30 15:15:21
 * @Description: 目录文件配置(改)
 */
import React, { Component } from 'react'
import { getMenu } from "../../api/index"
import { Layout, Menu, Avatar, Dropdown, message, Badge } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';


import './style.css'
// import adminRoutes from '../../routes/adminRoutes.js'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../store/user/actionCreators'
import admintRouter from "../../routes/adminRoutes"
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            dispatch(logout())
        }
    }
}

// 装饰器
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class MyLayout extends Component {
    state = {
        collapsed: false,
        navRoutes: []
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    componentDidMount() {
        if (window.localStorage.getItem("routesList_tmp")) {
            let router = JSON.parse(window.localStorage.getItem("routesList_tmp"))
            this.setState({
                navRoutes: this.getLocalMenu(router)
            })
        } else {
            this.initMenu()
        }
    }

    //初始化目录
    initMenu() {
        let base = "http://" + window.location.host;
        let that = this;
        let id;
        if (base.indexOf("localhost") !== -1) id = 1
        else if (window.location.host === "cms.tvplus.club") id = 61
        else if (window.location.host === "cms2.tvplus.club") id = 61
        else if (window.location.host === "bak04.tvplus.club") id = 61
        else if (window.location.host === "bak03.tvplus.club") id = 61
        else if (window.location.host === "test2.cms.tvplus.club") id = 1
        else id = 1

        getMenu({ id: id }).then(res => {
            if (res.data.errCode === 0) {
                let tmp = res.data.data;
                let list = []
                let tmpChild = [];
                for (let i in tmp) {
                    let t = tmp[i];
                    if (t.level === 1) list.push(t)
                    else if (t.level === 2) tmpChild.push(t)
                }
                for (let j in list) {
                    list[j].children = [];
                    for (let i in tmpChild) {
                        if (list[j].id === tmpChild[i].parentId) {
                            list[j].children.push(tmpChild[i])
                        }
                    }
                }
                window.localStorage.setItem("routesList_tmp", JSON.stringify(list))
                that.setState({
                    navRoutes: that.getLocalMenu(list)
                })
            }
        })
    }

    getLocalMenu(root_router) { //获取本地存在的路径
        //转换本地路由列表
        let local_router = [];
        for (let key in admintRouter) {
            let router = admintRouter[key];
            local_router.push(router);
        }

        let newst_router = [];

        //筛选出本地存在的根目录
        for (let r = 0, rlen = root_router.length; r < rlen; r++) {
            let outer_router = root_router[r];

            for (let l = 0, llen = local_router.length; l < llen; l++) {
                let inter_router = local_router[l];

                //存在当前目录 更新子目录
                if (outer_router.code === inter_router.code) {
                    outer_router.icon = <UserOutlined />;       //目录Logo
                    // outer_router.children = [];
                    newst_router.push(outer_router);
                    break;
                }
            }
        }

        //填充本地存在的子目录 更新目录为网络副本
        for (let n = 0, nlen = newst_router.length; n < nlen; n++) {
            let new_children = [];
            let temp_router = newst_router[n];
            let children = temp_router.children;

            for (let c = 0, clen = children.length; c < clen; c++) {
                let child = children[c];
                for (let l = 0, llen = local_router.length; l < llen; l++) {
                    let inter_router = local_router[l];
                    if (child.code === inter_router.sub_code) {
                        new_children.push(child);
                        break;
                    }
                }
            }
            temp_router.children = new_children;
        }
        return newst_router;



        // let localList = []
        // admintRouter.filter(item => item.code).forEach(r => {
        //     localList.push(r.code)
        // })
        // let array = [...new Set(localList)]
        // let newRouter = root_router.filter(x => array.some(y => y === x.code))
        // newRouter.forEach(r => { //过滤已存在的一级菜单下面的老二级菜单
        //     r.children = r.children.filter(x => admintRouter.some(y => y.path === x.path))
        // })
        // return newRouter
    }
    render() {
        let that = this;

        let menu = (
            <Menu>
                <Menu.Item onClick={() => { that.props.history.push('/mms/transition') }}>首页</Menu.Item>
                <Menu.Item onClick={this.loginOut}>退出登录</Menu.Item>
            </Menu>
        );
        let { navRoutes } = that.state;

        return (
            <div id="admin">
                <Layout>
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed}   >
                        <div className="logo">电视家CMS</div>
                        {/*  点击导航跳转 */}
                        <Menu theme="dark" mode="inline" defaultselectedkeys={this.props.location.pathname} selectedKeys={this.selectKeys()} key={this.defaultOpenKeys()} defaultOpenKeys={this.defaultOpenKeys()}
                            onClick={({ key }) => {this.props.history.push({ pathname: key }) }}>
                            {navRoutes.map(nav => {
                                return (
                                    nav.children.length > 0 ?
                                        <SubMenu icon={nav.icon} title={nav.name} key={nav.path} defaultselectedkeys={[nav.children[0].path]}>
                                            {nav.children.map((child) => {
                                                return (<Menu.Item key={child.path}>{child.name}</Menu.Item>)
                                            })}
                                        </SubMenu>
                                        :
                                        <Menu.Item icon={<UserOutlined />} key={nav.path}>
                                            {nav.name}
                                        </Menu.Item>
                                )
                            })}
                        </Menu>
                    </Sider>
                    <Layout className="site-layout" style={{ minHeight: "100vh", overflow: "auto" }}>
                        <Header className="site-layout-background" style={{ padding: 0 }}>
                            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: this.toggle,
                            })}
                            <div style={{ float: 'right', marginRight: 50 }}>
                                <Badge count={0}>
                                    <Dropdown overlay={menu}>
                                        <div style={{ color: "#555" }}>
                                            <Avatar src="http://test.cdn.dianshihome.com/test/ic_launcher.png" />
                                            <span style={{ marginLeft: 10 }}>{decodeURI(this.props.userInfo.userName)}</span>
                                        </div>
                                    </Dropdown>
                                </Badge>
                            </div>
                        </Header>
                        <Content className="site-layout-background" style={{ margin: '24px 16px', padding: 24, minHeight: 280, height: "88vh", overflowY: "auto", position: "relative" }}   >
                            <div key='children'> {this.props.children}</div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
    loginOut = () => {
        this.props.logout();
        message.success('退出成功', 1, () => {
            this.props.history.push("/login")
            window.localStorage.removeItem("routesList_tmp")
            window.localStorage.removeItem("user")
        })
    }
    selectKeys = () => {
        let pathName = this.props.location.pathname;
        return pathName
    }
    defaultOpenKeys() {
        let a = this.state.navRoutes.filter(item => this.props.location.pathname.indexOf(item.path) !== -1)
        // console.log(this.state.navRoutes,this.props.location.pathname,"a------------------aaaaaaa")
        if (a.length > 0) {
            return [a[0].path]
        } else {
            // return ["/mms/level"]
            return []
        }
    }
}

export default MyLayout