import React, { Component } from 'react'
import axios from 'axios'
import { IndexBar, List, Toast } from 'antd-mobile'
import NavHeader from '../../components/NavHeader'
import { formatCityData } from '../../utils/format-city-data'
import { getCurrentCity } from '../../utils/get-current-city'
import './index.scss'

export default class CityList extends Component {
  state = {
    cityList: {},
    cityIndex: []
  }
  componentDidMount() {
    this.getCityList()
  }
  // 获取城市列表数据：当前城市 + 热门城市 + 所有城市
  getCityList = async () => {
    Toast.show({
      duration: 0,
      icon: 'loading',
      content: '加载中…',
    })
    // 获取所有城市数据
    const res = await axios.get('/area/city?level=1')
    const { cityList, cityIndex } = formatCityData(res.body)
    // 获取热门城市数据
    const hotRes = await axios.get('/area/hot')
    cityIndex.unshift('热门城市')
    cityList['热门城市'] = hotRes.body
    // 获取当前城市数据
    const currCity = await getCurrentCity()
    cityIndex.unshift('当前城市')
    cityList['当前城市'] = [currCity]

    this.setState({
      cityList,
      cityIndex
    })
    Toast.clear()
  }
  // 切换城市
  changeCity = ({ label, value }) => {
    // 有房源的城市
    const arr = ['北京', '广州', '上海', '深圳']
    if(arr.includes(label)) {
      localStorage.setItem('hkzf_city', JSON.stringify({label, value}))
      this.props.history.replace('/home')
    }else {
      Toast.show({
        content: "该城市暂无房源数据",
        duration: 1000
      })
    }
  }

  render() {
    const { cityList, cityIndex } = this.state
    return (
      <div>
        <NavHeader title="城市选择" />

        <div style={{ height: window.innerHeight - 45 }}>
          <IndexBar sticky={false}>
            {cityIndex.map(group => {
              const list = cityList[group]
              return (
                <IndexBar.Panel
                  index={group}
                  title={`${group}`}
                  key={`${group}`}
                >
                  <List>
                    {list.map((item, index) => (
                      <List.Item
                        arrow={false}
                        key={item.value}
                        onClick={() => this.changeCity(item)}
                      >{item.label}</List.Item>
                    ))}
                  </List>
                </IndexBar.Panel>
              )
            })}
          </IndexBar>
        </div>
      </div>
    )
  }
}
