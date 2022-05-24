import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import HouseDetail from './pages/HouseDetail'
import Login from './pages/Login'
import Register from './pages/Register'

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <Router>
          <Switch>
            <Route path='/home' component={Home} />
            <Route path='/citylist' component={CityList} />
            <Route path='/map' component={Map} />
            <Route path='/detail/:id' component={HouseDetail} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />

            <Redirect exact from='/' to='/home' />
          </Switch>
        </Router>
      </div>
    )
  }
}
