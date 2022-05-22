import React, { Component } from 'react'
import { Popup } from 'antd-mobile'
import FilterFooter from '../../../../components/FilterFooter'
import './index.scss'

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue
  }

  onTagClick = (value) => {
    const { selectedValues } = this.state
    const newSelectedValues = [...selectedValues]

    const index = selectedValues.indexOf(value)
    if(index === -1) {
      newSelectedValues.push(value)
    }else {
      newSelectedValues.splice(index, 1)
    }
    this.setState({
      selectedValues: newSelectedValues
    })
  }

  renderFilters = (data) => {
    const { selectedValues } = this.state
    return (
      data.map(item => (
        <span
          key={item.value}
          className={['tag', selectedValues.includes(item.value) ? 'tagActive' : ''].join(' ')}
          onClick={() => this.onTagClick(item.value)}
        >{item.label}</span>
      ))
    )
  }

  // 清除
  onClear = () => {
    this.setState({
      selectedValues: []
    })
  }

  render() {
    const { selectedValues } = this.state
    const { openType, onCancel, onOk, data } = this.props
    return (
      <Popup
        visible={openType === 'more'}
        position="right"
        bodyStyle={{ width: '80vw' }}
        onMaskClick={() => onCancel(null, openType)}
      >
        <div className="tags">
          <dl className="dl">
            <dt className="dt">户型</dt>
            <dd className="dd">{this.renderFilters(data.roomType)}</dd>

            <dt className="dt">朝向</dt>
            <dd className="dd">{this.renderFilters(data.oriented)}</dd>

            <dt className="dt">楼层</dt>
            <dd className="dd">{this.renderFilters(data.floor)}</dd>

            <dt className="dt">房屋亮点</dt>
            <dd className="dd">{this.renderFilters(data.characteristic)}</dd>
          </dl>
        </div>
        <FilterFooter
          className="footer"
          cancelText="清除"
          onCancel={() => this.onClear()}
          onOk={() => onOk(selectedValues, openType)}
        />
      </Popup>
    )
  }
}
