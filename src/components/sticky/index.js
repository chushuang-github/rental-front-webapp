import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import './index.scss'

// DOM元素.getBoundingClientRect()方法获取DOM元素的大小和位置
export default class Sticky extends Component {
  static propTypes = {
    height: PropTypes.number.isRequired
  }

  placeholder = createRef()
  content = createRef()

  handleScorll = () => {
    const placeholderEl = this.placeholder.current
    const contentEl = this.content.current
    const { top } = placeholderEl.getBoundingClientRect()
    if(top <= 0) {
      // 通过元素dom的方法，修改样式，好久没使用了，顺便学习一下
      // 吸顶：使用dom元素的classList.add给元素增加类名
      contentEl.classList.add('stycky-fixed')
      placeholderEl.style.height = this.props.height + 'px'
    }else {
      // 取消吸顶
      contentEl.classList.remove('stycky-fixed')
      placeholderEl.style.height = '0px'
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScorll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScorll)
  }
  render() {
    return (
      <React.Fragment>
        {/* 占位元素 */}
        <div ref={this.placeholder}></div>
        {/* 内容元素 */}
        <div ref={this.content}>{this.props.children}</div>
      </React.Fragment>
    )
  }
}
