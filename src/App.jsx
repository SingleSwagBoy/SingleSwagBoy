import React, { Component } from 'react'
import { Route, Switch, Redirect,Router } from 'react-router-dom'
import Login from 'pages/Login'
import NotFound from 'pages/NotFound'
import Admin from 'pages/Admin'
// import { createBrowserHistory } from "history";
// const browserHistory = createBrowserHistory();
export default class App extends Component {
  render() {
    return (
      // <Router >
        <Switch>
          <Route  path="/mms" render={(routeProps)=>{
            // 判断是否登录，登录了可以访问，否则补鞥呢访问
            const token = localStorage.getItem('token')
            return <Admin {...routeProps}/>
            // if(token) {
            //   // console.log('/App')
            //   return <Admin {...routeProps}/>
            // }else {
            //   return <Redirect to="/login" />
            
            // }
          }} />
          <Route path="/login" component={Login} />
          <Route path="/404" component={NotFound} />
          <Redirect to="/mms" from="/" exact />
          <Redirect to="/404" />
        </Switch>
      // </Router>
      
    )
  }
}
