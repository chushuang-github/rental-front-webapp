import React, { Component } from 'react'
import './index.scss'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' },
]

export default class FilterTitle extends Component {
  render() {
    const { titleSelectedStatus, onClick } = this.props
    return (
      <div className="filter-title">
        {titleList.map((item) => (
          <div key={item.type} className="filter-title-item">
            <span
              className={'dropdown ' + (titleSelectedStatus[item.type] ? 'selected' : '')}
              onClick={() => onClick(item.type)}
            >
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </div>
        ))}
      </div>
    )
  }
}
