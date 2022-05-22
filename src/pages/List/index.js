import React, { Component } from 'react'
import SearchHeader from '../../components/SearchHeader'
import { getCurrentCity } from '../../utils/get-current-city'
import Filter from './components/Filter'
import './index.scss'

export default class List extends Component {
  state = {
    currentCityName: '上海'
  }
  componentDidMount() {
    getCurrentCity().then(res => {
      this.setState({
        currentCityName: res.label
      })
    })
  }
  render() {
    const { currentCityName } = this.state
    const { history } = this.props
    return (
      <div className='list'>
        <div className='list-search'>
          <i className='iconfont icon-back' onClick={() => history.go(-1)}></i>
          <SearchHeader cityName={currentCityName} className='searchHeader' />
        </div>
        <Filter />
      </div>
    )
  }
}
