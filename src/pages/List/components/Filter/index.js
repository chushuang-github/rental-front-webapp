import React, { Component } from 'react'
import FilterTitle from '../FilterTitle'
import FilterMore from '../FilterMore'
import FilterPicker from '../FilterPicker'
import axios from 'axios'
import './index.scss'

export default class Filter extends Component {
  state = {
    titleSelectedStatus: {
      area: false,
      mode: false,
      price: false,
      more: false,
    },
    // openType值为area/mode/price，展示FilterPicker组件和遮罩层；值为more，展示FilterMore组件
    openType: '',
    // 所有筛选条件数据
    filterData: {},
    // 筛选条件的选中值
    selectedValues: {
      area: ['area', 'null', null, null],
      mode: ['null'],
      price: ['null'],
      more: [],
    },
  }

  componentDidMount() {
    this.getFiltersData()
  }
  // 获取所有筛选条件的方法
  getFiltersData = async () => {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await axios.get(`/houses/condition?id=${value}`)
    this.setState({
      filterData: res.body,
    })
  }

  // 点击标题菜单实现高亮
  onTitleClick = (type) => {
    const { selectedValues, titleSelectedStatus } = this.state
    // 创建新的标题
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    Object.keys(titleSelectedStatus).forEach((item) => {
      if (item === type) {
        newTitleSelectedStatus[item] = true
        return
      }

      const selectedValue = selectedValues[item]
      if (item === 'area') {
        newTitleSelectedStatus[item] =
          selectedValue[0] === 'area' && selectedValue[1] === 'null'
            ? false
            : true
      } else if (item === 'mode' || item === 'price') {
        newTitleSelectedStatus[item] =
          selectedValue[0] === 'null' ? false : true
      } else if (item === 'more') {
        newTitleSelectedStatus[item] = selectedValue.length > 0 ? 'true' : false
      }
    })

    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: type,
    })
  }

  // 取消
  onCancel = (value, type) => {
    // 菜单高亮逻辑处理
    const { selectedValues, titleSelectedStatus } = this.state
    // 创建新的标题
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedValue = selectedValues[type]
    if (type === 'area') {
      newTitleSelectedStatus[type] =
      selectedValue[0] === 'area' && selectedValue[1] === 'null' ? false : true
    } else if (type === 'mode' || type === 'price') {
      newTitleSelectedStatus[type] = selectedValue[0] === 'null' ? false : true
    } else if (type === 'more') {
      newTitleSelectedStatus[type] = selectedValue.length > 0 ? 'true' : false
    }
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  // 确定
  onSave = (value, type) => {
    // 菜单高亮逻辑处理
    const { titleSelectedStatus } = this.state
    // 创建新的标题
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedValue = value
    if (type === 'area') {
      newTitleSelectedStatus[type] =
      selectedValue[0] === 'area' && selectedValue[1] === 'null' ? false : true
    } else if (type === 'mode' || type === 'price') {
      newTitleSelectedStatus[type] = selectedValue[0] === 'null' ? false : true
    } else if (type === 'more') {
      newTitleSelectedStatus[type] = selectedValue.length > 0 ? 'true' : false
    }

    this.setState({
      openType: '',
      selectedValues: {
        ...this.state.selectedValues,
        [type]: value,
      },
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  // 渲染FilterPicker组件的方法
  renderFilterPicker = () => {
    const {
      openType,
      filterData: { area, subway, rentType, price },
      selectedValues,
    } = this.state

    if (!['area', 'mode', 'price'].includes(openType)) {
      return null
    }
    // 根据openType获取当前筛选数据
    let data = []
    let defaultValue = selectedValues[openType]

    switch (openType) {
      case 'area':
        data = [area, subway]
        break
      case 'mode':
        data = rentType
        break
      case 'price':
        data = price
        break
      default:
        break
    }

    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onOk={this.onSave}
        data={data}
        openType={openType}
        defaultValue={defaultValue}
      />
    )
  }

  // 渲染FilterMore组件的方法
  renderFilterMore = () => {
    const {
      openType,
      selectedValues,
      filterData: { roomType, oriented, floor, characteristic },
    } = this.state
    if (openType !== 'more') {
      return null
    }

    const data = { roomType, oriented, floor, characteristic }
    const defaultValue = selectedValues[openType]
    return (
      <FilterMore
        data={data}
        openType={openType}
        defaultValue={defaultValue}
        onCancel={this.onCancel}
        onOk={this.onSave}
      />
    )
  }

  render() {
    const { titleSelectedStatus, openType } = this.state
    return (
      <div className="filter">
        <div
          className="mask"
          style={{
            display: ['area', 'mode', 'price'].includes(openType) ? '' : 'none',
          }}
          onClick={() => this.onCancel(null, openType)}
        ></div>

        <div className="content">
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {this.renderFilterPicker()}

          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
