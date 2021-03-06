import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
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
        <Route path="/mms" render={(routeProps) => {
          // 判断是否登录，登录了可以访问，否则不能访问
          const token = localStorage.getItem('user')
          if (token) {
            if (JSON.parse(token).authorization) {
              return <Admin {...routeProps} />
            } else {
              return <Redirect to="/login" />
            }
          } else {
            return <Redirect to="/login" />

          }
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
