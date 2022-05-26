import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import HouseDetail from './pages/HouseDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorite from './pages/Favorite'
import AuthRoute from './components/AuthRoute'
import RentAdd from './pages/RentAdd'
import Rent from './pages/Rent'
import RentSearch from './pages/RentSearch'

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
            {/* /favorite路由页面需要登录后才能进入的，使用封装的AuthRoute鉴权路由 */}
            <AuthRoute path='/favorite' component={Favorite} />
            <AuthRoute exact path='/rent' component={Rent} />
            <AuthRoute path='/rent/add' component={RentAdd} />
            <AuthRoute path='/rent/search' component={RentSearch} />

            <Redirect exact from='/' to='/home' />
          </Switch>
        </Router>
      </div>
    )
  }
}
