import React, { Component } from 'react'
import HouseItem from '../../components/HouseItem'
import NavHeader from '../../components/NavHeader'
import NoHouse from '../../components/NoHouse'
import { Toast } from 'antd-mobile'
import axios from 'axios'
import './index.scss'

export default class Rent extends Component {
  state = {
    list: [],
  }
  componentDidMount() {
    this.getRentList()
  }
  getRentList = async () => {
    Toast.show({
      duration: 0,
      icon: 'loading',
      content: '加载中…',
    })
    const res = await axios.get('/user/houses')
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
      this.props.history.replace({
        pathname: '/login',
        state: { from: this.props.location }
      })
    }
  }

  render() {
    const { list } = this.state
    const { history } = this.props
    return (
      <div className="rent">
        <NavHeader title="房屋管理" />
        <div className="rent-list">
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
              您还没有房源，
              <span
                className="find-house"
                onClick={() => {
                  history.push('/rent/add')
                }}
              >
                去发布房源
              </span>
              吧~
            </NoHouse>
          )}
        </div>
      </div>
    )
  }
}
