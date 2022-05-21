import React, { Component } from 'react'
import { NavBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import PropsTypes from 'prop-types'
import './index.scss'

class NavHeader extends Component {
  static propTypes = {
    title: PropsTypes.string,
    onLeftClick: PropsTypes.func
  }
  static defaultProps = {
    title: '默认标题'
  }
  onBack = () => {
    const { onLeftClick } = this.props
    onLeftClick ? onLeftClick() : this.props.history.go(-1)
  }
  render() {
    return (
      <div style={{ height: '45px' }}>
        <NavBar onBack={this.onBack}>{this.props.title}</NavBar>
      </div>
    )
  }
}

export default withRouter(NavHeader)