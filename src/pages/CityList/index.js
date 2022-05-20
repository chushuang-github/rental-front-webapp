import React, { Component } from 'react'
import { NavBar } from 'antd-mobile'
import axios from 'axios'
import { IndexBar, List } from 'antd-mobile'
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
    // 获取所有城市数据
    const res = await axios.get('/area/city?level=1')
    const { cityList, cityIndex } = formatCityData(res.body)
    // 获取热门城市数据
    const hotRes = await axios.get('/area/hot')
    cityIndex.unshift('hot')
    cityList['hot'] = hotRes.body
    // 获取当前城市数据
    const currCity = await getCurrentCity()
    cityIndex.unshift('#')
    cityList['#'] = [currCity]

    this.setState({
      cityList,
      cityIndex
    })
  }

  render() {
    const { cityList, cityIndex } = this.state
    return (
      <div style={{ paddingTop: '45px' }}>
        <NavBar onBack={() => {this.props.history.go(-1)}}>城市选择</NavBar>
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
                        key={item.value}
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
