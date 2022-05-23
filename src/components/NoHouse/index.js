import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BASE_URL } from '../../utils/url'
import './index.scss'

export default class NoHouse extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }
  render() {
    return (
      <div className='no-house'>
        <img
          className='img'
          src={BASE_URL + '/img/not-found.png'}
          alt="暂无数据"
        />
        <p className='msg'>{this.props.children}</p>
      </div>
    )
  }
}

