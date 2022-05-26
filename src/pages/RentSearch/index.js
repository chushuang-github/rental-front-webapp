import React, { Component } from 'react'
import { SearchBar } from 'antd-mobile'
import axios from 'axios'
import './index.scss'

export default class RentSearch extends Component {
  state = {
    cityId: '',
    searchText: '',
    list: [],
  }
  timerId = null
  componentDidMount() {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    this.setState({
      cityId: value,
    })
  }
  // 输入框值发生变化
  onChange = (value) => {
    const { cityId } = this.state
    this.setState({ searchText: value })
    if (value.trim() === '') {
      this.setState({ list: [] })
      return
    }
    // 清除上一次的定时器
    clearTimeout(this.timerId)
    this.timerId = setTimeout(async () => {
      const res = await axios.get('/area/community', {
        params: {
          name: value,
          id: cityId,
        },
      })
      this.setState({
        list: res.body,
      })
    }, 500)
  }

  changeCity = (item) => {
    this.props.history.replace({
      pathname: '/rent/add',
      state: {
        id: item.community,
        name: item.communityName
      }
    })
  }

  render() {
    const { searchText, list } = this.state
    return (
      <div className="rent-search">
        <div className="search-bar">
          <SearchBar
            placeholder="请输入内容"
            value={searchText}
            showCancelButton={() => true}
            onChange={this.onChange}
          />
        </div>
        <ul className="search-list">
          {list.map((item) => (
            <li className="tip" key={item.community} onClick={() => this.changeCity(item)}>
              {item.communityName}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
