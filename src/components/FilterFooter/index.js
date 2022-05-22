import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'

export default class FilterFooter extends Component {
  static propTypes = {
    cancelText: PropTypes.string,
    okText: PropTypes.string,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    className: PropTypes.string,
  }
  static defaultProps = {
    cancelText: '取消',
    okText: '确定',
  }
  render() {
    const { cancelText, okText, onCancel, onOk, className } = this.props
    return (
      <div className={['filter-footer', className || ''].join(' ')}>
        <span className='btn cancel' onClick={onCancel}>
          {cancelText}
        </span>

        <span className='btn ok' onClick={onOk}>
          {okText}
        </span>
      </div>
    )
  }
}
