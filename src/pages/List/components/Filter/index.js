import React, { Component } from 'react'
import FilterTitle from '../FilterTitle'
import FilterMore from '../FilterMore'
import FilterPicker from '../FilterPicker'
import { Spring, animated } from 'react-spring'
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
    this.htmlBody = document.body
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
    this.htmlBody.classList.add('body-fixed')
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
    this.htmlBody.classList.remove('body-fixed')
    // 菜单高亮逻辑处理
    const { selectedValues, titleSelectedStatus } = this.state
    // 创建新的标题
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedValue = selectedValues[type]
    if (type === 'area') {
      newTitleSelectedStatus[type] =
        selectedValue[0] === 'area' && selectedValue[1] === 'null'
          ? false
          : true
    } else if (type === 'mode' || type === 'price') {
      newTitleSelectedStatus[type] = selectedValue[0] === 'null' ? false : true
    } else if (type === 'more') {
      newTitleSelectedStatus[type] = selectedValue.length > 0 ? 'true' : false
    }
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus,
    })
  }

  // 确定
  onSave = (value, type) => {
    this.htmlBody.classList.remove('body-fixed')
    // 菜单高亮逻辑处理
    const { titleSelectedStatus } = this.state
    // 创建新的标题
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedValue = value
    if (type === 'area') {
      newTitleSelectedStatus[type] =
        selectedValue[0] === 'area' && selectedValue[1] === 'null'
          ? false
          : true
    } else if (type === 'mode' || type === 'price') {
      newTitleSelectedStatus[type] = selectedValue[0] === 'null' ? false : true
    } else if (type === 'more') {
      newTitleSelectedStatus[type] = selectedValue.length > 0 ? 'true' : false
    }
    // 最新的筛选数据
    const newSelectedValues = {
      ...this.state.selectedValues,
      [type]: value,
    }
    // 接口需要的筛选条件数据
    const { area, mode, price, more } = newSelectedValues
    const filters = {}
    // 区域
    let newArea = area.filter((item) => item !== null && item !== 'null')
    const areaKey = area[0]
    const areaValue =
      newArea.length === 1 ? 'null' : newArea[newArea.length - 1]
    filters[areaKey] = areaValue
    // 方式+组件
    filters.mode = mode[0]
    filters.price = price[0]
    // 更多筛选
    filters.more = more.join()
    this.props.onFilter(filters)

    this.setState({
      openType: '',
      selectedValues: newSelectedValues,
      titleSelectedStatus: newTitleSelectedStatus,
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

  // 渲染遮罩层
  renderMask = () => {
    const { openType } = this.state
    if(!['area', 'mode', 'price'].includes(openType)) return null

    return (
      // 使用react-spring库里面Spring组件包裹需要动画的dom元素
      // 需要动画的元素在Spring组件里面的回调函数的返回值展示
      // render-props:组件里面传一个回调函数，Spring组件里面调用该回调函数并传递参数
      // 需要动画的dom元素是div元素，现在需要写成animated.div这种形式
      <Spring
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
      >
        {(styles) => (
          <animated.div
            className="mask"
            style={styles}
            onClick={() => this.onCancel(null, openType)}
          ></animated.div>
        )}
      </Spring>
    )
  }

  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className="filter">
        {this.renderMask()}

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
