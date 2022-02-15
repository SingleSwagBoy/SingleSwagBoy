import React, { Component } from 'react'
import { Layout, Menu, Avatar, Select, Dropdown, message, Badge } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import {
    getMenu,
} from "../../api/index"

import './style.css'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../store/user/actionCreators'
import adminRoutes from "../../routes/adminRoutes"

let { Option } = Select;
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
        navRoutes: [],
        searchRouters: [],  //用于快捷搜索的路由列表
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    componentDidMount() {
        let that = this;

        //使用本地路由地址
        if (window.localStorage.getItem("routesList_tmp")) {
            let router = JSON.parse(window.localStorage.getItem("routesList_tmp"))
            let localRouter = that.getLocalMenu(router);

            that.setState({
                navRoutes: localRouter
            }, () => {
                that.parseSearchRouterList(localRouter);
            })
        }
        //使用
        else {
            that.getMenu()
        }
    }
    getLocalMenu(arr) { //获取本地存在的路径
        let localList = []
        adminRoutes.filter(item => item.code).forEach(r => {
            localList.push(r.code)
        })
        let array = [...new Set(localList)]
        let newRouter = arr.filter(x => array.some(y => y === x.code))
        newRouter.forEach(r => { //过滤已存在的一级菜单下面的老二级菜单
            r.children = r.children.filter(x => adminRoutes.some(y => y.path === x.path))
        })
        console.log('=-===============')
        console.log(newRouter)
        return newRouter
    }
    getMenu() {
        let that = this;
        let base = "http://" + window.location.host;
        let id = 1
        if (base.indexOf("localhost") !== -1) {
            id = 1
        } else if (window.location.host === "cms.tvplus.club") {
            id = 61
        } else if (window.location.host === "test2.cms.tvplus.club") {
            id = 1
        } else if (window.location.host === "cms2.tvplus.club") {
            id = 61
        } else if (window.location.host === "bak04.tvplus.club") {
            id = 61
        } else if (window.location.host === "bak03.tvplus.club") {
            id = 61
        } else {
            id = 1
        }
        getMenu({ id: id }).then(res => {
            if (res.data.errCode === 0) {
                let tmp = res.data.data;
                let list = []
                let tmpChild = [];
                for (let i in tmp) {
                    let t = tmp[i];
                    if (t.level === 1) {
                        list.push(t)
                    } else if (t.level === 2) {
                        tmpChild.push(t)
                    }
                }
                for (let j in list) {
                    list[j].children = [];
                    for (let i in tmpChild) {
                        if (list[j].id === tmpChild[i].parentId) {
                            list[j].children.push(tmpChild[i])
                        }
                    }
                }

                let localRouter = that.getLocalMenu(list);
                console.log(list, "list")
                window.localStorage.setItem("routesList_tmp", JSON.stringify(list))
                that.setState({
                    navRoutes: localRouter
                } ,()=>{
                    that.parseSearchRouterList(localRouter);
                })
            }
        })
       

    }
    render() {
        let that = this;
        let { searchRouters } = that.state;

        const menu = (
            <Menu>
                <Menu.Item onClick={() => {
                    that.props.history.push('/mms/transition')
                }}>首页</Menu.Item>
                <Menu.Item onClick={that.clearStore}>清除缓存</Menu.Item>
                <Menu.Item onClick={that.loginOut}>退出登录</Menu.Item>
            </Menu>
        );
        return (
            <div id="admin">
                <Layout>
                    <Sider trigger={null} collapsible collapsed={that.state.collapsed}   >
                        <div className="logo">电视家CMS</div>

                        {/* 路径的快速跳转入口 */}
                        <Select style={{ width: '100%' }} placeholder='快速搜索' showSearch onChange={(val) => that.props.history.push(val)}
                            filterOption={(input, option) => {
                                if (!input) return true;
                                let children = option.children;
                                if (children) {
                                    let key = children[1];
                                    let isFind = false;
                                    isFind = `${key}`.indexOf(`${input}`) >= 0;
                                    return isFind;
                                }
                            }}>
                            {
                                searchRouters.map((item, index) => {
                                    return <Option value={item.path} key={item.path} >  {item.name}</Option>
                                })
                            }
                        </Select>
                        {/*  点击导航跳转 */}
                        <Menu theme="dark" mode="inline"
                            onClick={({ key }) => {
                                console.log(key)
                                this.props.history.push(key)
                            }}
                            defaultselectedkeys={this.props.location.pathname}
                            selectedKeys={this.selectKeys()}
                            key={this.defaultOpenKeys()}
                            defaultOpenKeys={this.defaultOpenKeys()}   >
                            {
                                this.state.navRoutes.map(nav => {
                                    return (
                                        nav.children.length > 0 ?
                                            <SubMenu icon={<UserOutlined />} title={nav.name} key={nav.path} defaultselectedkeys={[nav.children[0].path]}     >
                                                {
                                                    nav.children.map(child => {
                                                        return (
                                                            <Menu.Item key={child.path}>{child.name}</Menu.Item>
                                                        )
                                                    })
                                                }
                                            </SubMenu>
                                            :
                                            <Menu.Item icon={<UserOutlined />} key={nav.path}>
                                                {nav.name}
                                            </Menu.Item>
                                    )
                                })
                            }
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
                                            <Avatar src="http://test.cdn.mydianshijia.com/test/ic_launcher.png" />
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

    //解析搜索路由列表
    parseSearchRouterList(router) {
        let that = this;
        let newRouter = [...router];


        //过滤筛选出 本地路由地址
        let locRouters = [];
        for (let path in newRouter) {
            let item = newRouter[path];
            let children = item.children;
            if (children) {
                for (let cpath in children) {
                    let childrenItem = children[cpath];
                    locRouters.push(childrenItem);
                }
            }
            // delete item.children;
            locRouters.push(item);
        }

        //和来着网络的权限列表比对 过滤出真实存在的路由
        let netRouters = [...adminRoutes];
        let searchRouters = [];
        for (let i = 0, ilen = locRouters.length; i < ilen; i++) {
            let currLocRouter = locRouters[i];
            let locPath = currLocRouter.path;

            for (let j = 0, jlen = netRouters.length; j < jlen; j++) {
                let currNetRouter = netRouters[j];

                let netPath = currNetRouter.path;
                if (locPath == netPath) {
                    searchRouters.push(currLocRouter);
                    break;
                }
            }
        }

        that.setState({
            searchRouters: searchRouters,
        })


    }

    clearStore = () => {

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
        const pathName = this.props.location.pathname;
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