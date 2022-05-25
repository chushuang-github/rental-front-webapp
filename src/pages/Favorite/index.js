import React, { Component } from 'react'
import HouseItem from '../../components/HouseItem'
import NavHeader from '../../components/NavHeader'
import NoHouse from '../../components/NoHouse'
import { Toast } from 'antd-mobile'
import axios from 'axios'
import './index.scss'

export default class Favorite extends Component {
  state = {
    list: [],
  }
  componentDidMount() {
    this.getFavoriteList()
  }
  getFavoriteList = async () => {
    Toast.show({
      duration: 0,
      icon: 'loading',
      content: '加载中…',
    })
    const res = await axios.get('/user/favorites')
    Toast.clear()
    if (res.status === 200) {
      this.setState({
        list: res.body,
      })
    } else {
      Toast.show({
        content: '登录超时，请重新登录',
        duration: 1000,
      })
    }
  }

  render() {
    const { list } = this.state
    const { history } = this.props
    return (
      <div className="favorite">
        <NavHeader title="我的收藏" />
        <div className="favorite-list">
          {list.length > 0 ? (
            list.map((item) => (
              <HouseItem
                key={item.houseCode}
                item={item}
                onClick={() => history.push(`/detail/${item.houseCode}`)}
              />
            ))
          ) : (
            <NoHouse>
              暂无数据，去
              <span
                className="find-house"
                onClick={() => {
                  history.push('/home/list')
                }}
              >
                找房子
              </span>
              吧~
            </NoHouse>
          )}
        </div>
      </div>
    )
  }
}
