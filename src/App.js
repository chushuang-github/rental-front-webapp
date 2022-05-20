import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <Router>
          <Switch>
            <Route path='/home' component={Home} />
            <Route path='/citylist' component={CityList} />
            <Route path='/map' component={Map} />
            <Redirect exact from='/' to='/home' />
          </Switch>
        </Router>
      </div>
    )
  }
}
