import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './index.scss'

class SearchHeader extends Component {
  static propTypes = {
    cityName: PropTypes.string.isRequired,
    className: PropTypes.string
  }
  render() {
    const { cityName, history, className } = this.props
    return (
      <div className={'navbar ' + className || ''}>
        <div className='search'>
          <div className="location" onClick={() => history.push('/citylist')}>
            <span className="name">{cityName}</span>
            <i className="iconfont icon-arrow" />
          </div>
          <div className="form" onClick={() => history.push('/search')}>
            <i className="iconfont icon-seach" />
            <span className="text">请输入小区或地址</span>
          </div>
        </div>
        <i
          className="iconfont icon-map"
          onClick={() => history.push('/map')}
        />
      </div>
    )
  }
}

export default withRouter(SearchHeader)