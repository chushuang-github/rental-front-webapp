import React, { Component } from 'react'
import FilterFooter from '../../../../components/FilterFooter'
import { Spring, animated } from 'react-spring'
import './index.scss'

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue,
  }

  onTagClick = (value) => {
    const { selectedValues } = this.state
    const newSelectedValues = [...selectedValues]

    const index = selectedValues.indexOf(value)
    if (index === -1) {
      newSelectedValues.push(value)
    } else {
      newSelectedValues.splice(index, 1)
    }
    this.setState({
      selectedValues: newSelectedValues,
    })
  }

  renderFilters = (data) => {
    const { selectedValues } = this.state
    return data.map((item) => (
      <span
        key={item.value}
        className={[
          'tag',
          selectedValues.includes(item.value) ? 'tagActive' : '',
        ].join(' ')}
        onClick={() => this.onTagClick(item.value)}
      >
        {item.label}
      </span>
    ))
  }

  // 清除
  onClear = () => {
    this.setState({
      selectedValues: [],
    })
  }

  // 渲染遮罩层
  renderMask = () => {
    const { openType } = this.state
    if (!openType === 'more') return null

    return (
      // 使用react-spring库里面Spring组件包裹需要动画的dom元素
      // 需要动画的元素在Spring组件里面的回调函数的返回值展示
      // render-props:组件里面传一个回调函数，Spring组件里面调用该回调函数并传递参数
      // 需要动画的dom元素是div元素，现在需要写成animated.div这种形式
      <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
        {(styles) => (
          <animated.div
            className="mask"
            style={styles}
            onClick={() => this.props.onCancel(null, openType)}
          ></animated.div>
        )}
      </Spring>
    )
  }

  render() {
    const { selectedValues } = this.state
    const { openType, onOk, data } = this.props
    return (
      <div className="filter-more">
        {/* 遮罩层 */}
        {this.renderMask()}

        <>
          <div className="tagss">
            <dl className="dl">
              <dt className="dt">户型</dt>
              <dd className="dd">{this.renderFilters(data.roomType)}</dd>

              <dt className="dt">朝向</dt>
              <dd className="dd">{this.renderFilters(data.oriented)}</dd>

              <dt className="dt">楼层</dt>
              <dd className="dd">{this.renderFilters(data.floor)}</dd>

              <dt className="dt">房屋亮点</dt>
              <dd className="dd">
                {this.renderFilters(data.characteristic)}
              </dd>
            </dl>
          </div>
          <FilterFooter
            className="footer"
            cancelText="清除"
            onCancel={() => this.onClear()}
            onOk={() => onOk(selectedValues, openType)}
          />
        </>
      </div>
    )
  }
}
