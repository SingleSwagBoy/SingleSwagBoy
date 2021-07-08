import React, { Component, Suspense } from 'react'
import MyLayout from 'components/MyLayout'
import { Switch, Route, Redirect,Router } from 'react-router-dom'

import adminRoutes from '../../routes/adminRoutes.js'
import NotFound from 'pages/NotFound'
import { Spin } from 'antd';
export default class Admin extends Component {
  render() {
    // console.log('/admin')
    return (
      <div>
        <MyLayout>
          <Suspense fallback={ <Spin size='largne'/> }>
          <Switch>
            {
              adminRoutes.map(route => {
                return (
                  <Route 
                    key={route.path}
                    path={route.path}
                    render={
                      (routeProps)=>{
                        /*
                        判断用户角色 是否可以访问当前路由
                        */
                        return <route.component {...routeProps} />
                      //  if(route.meta.roles === '*'){
                      //    return <route.component {...routeProps} />
                      //  }
                      //  const role = localStorage.getItem('role');
                      //  const roles = route.meta.roles;
                      //  // includes
                      //  const hasPermission = roles.includes(role)
                      //  if(hasPermission){
                      //   // 可以访问
                      //   return <route.component {...routeProps} />
                      //  }else{
                      //   //  return <Redirect to="/admin/noPermission"/>
                      //    return <route.component {...routeProps} />
                      //  }
                      }
                    }
                  />
                )
              })
            }
            <Route path="/mms/404" component={NotFound} />
            <Redirect to="/mms/dashBoard" from="/mms" exact />
            <Redirect to="/mms/404" from="/mms" />
          </Switch>
          </Suspense>
        </MyLayout>
      </div>
    )
  }
}
