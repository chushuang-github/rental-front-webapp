import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path='/home' component={Home} />
            <Route path='/citylist' component={CityList} />
            <Redirect exact from='/' to='/home' />
          </Switch>
        </div>
      </Router>
    )
  }
}
