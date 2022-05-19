import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Index from '../Index'
import List from '../List'
import News from '../News'
import Profile from '../Profile'

import { TabBar } from 'antd-mobile'
import {
  AppOutline,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import './index.css'

export default class Home extends Component {

  // 切换tabbar
  changeTabbar = (key) => {
    this.props.history.push(key)
  }
  // tabbar配置项
  tabs = [
    {
      key: '/home',
      title: '首页',
      icon: <AppOutline />
    },
    {
      key: '/home/list',
      title: '找房',
      icon: <UnorderedListOutline />
    },
    {
      key: '/home/news',
      title: '咨讯',
      icon: <MessageOutline />
    },
    {
      key: '/home/profile',
      title: '我的',
      icon: <UserOutline />,
    },
  ]
  render() {
    return (
      <div style={{ paddingBottom: '50px' }}>
        <Switch>
          <Route path='/home' exact component={Index} />
          <Route path='/home/list' component={List} />
          <Route path='/home/news' component={News} />
          <Route path='/home/profile' component={Profile} />
        </Switch>

        <TabBar className='tabbar' activeKey={this.props.location.pathname} onChange={this.changeTabbar}>
          {this.tabs.map(item => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    )
  }
}
