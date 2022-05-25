import React, { Component } from 'react'
import { BASE_URL } from '../../utils/url'
import { Grid, Button, Modal } from 'antd-mobile'
import { isAuth, removeToken } from '../../utils/auth'
import axios from 'axios'
import './index.scss'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  { id: 4, name: '成为房主', iconfont: 'icon-identity' },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' },
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

export default class Profile extends Component {
  state = {
    // 是否登录
    isLogin: isAuth(),
    // 用户信息
    userInfo: {
      avatar: '',
      nickname: '',
    },
    visible: false
  }

  componentDidMount() {
    this.getUserInfo()
  }

  getUserInfo = async () => {
    if(!this.state.isLogin) {
      // 未登录
      return
    }
    // 获取用户信息
    const res = await axios.get('/user')
    if(res.status === 200) {
      const { avatar, nickname } = res.body
      this.setState({
        userInfo: {
          avatar: `${BASE_URL}${avatar}`,
          nickname
        },
        isLogin: true
      })
    }else {
      this.setState({
        isLogin: false
      })
    }
  }

  // 退出登录
  logout = () => {
    this.setState({
      visible: true
    })
  }
  confirmLogout = () => {
    axios.post('/user/logout')
    removeToken()
    this.props.history.replace('/login')
    this.setState({
      visible: false
    })
  }

  render() {
    const {
      isLogin,
      userInfo: { avatar, nickname },
      visible
    } = this.state
    const { history } = this.props

    return (
      <div className="profile">
        <div className="title">
          <img
            className="bg"
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className="info">
            <div className="myIcon">
              <img
                className="avatar"
                src={avatar || DEFAULT_AVATAR}
                alt="icon"
              />
            </div>
            <div className="user">
              <div className="name">{nickname || '游客'}</div>
              {isLogin ? (
                <>
                  <div className="auth">
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div className="edit">
                    编辑个人资料
                    <span className="arrow">
                      <i className="iconfont icon-arrow" />
                    </span>
                  </div>
                </>
              ) : (
                <div className="edit">
                  <Button
                    color="success"
                    size="small"
                    onClick={() => history.push('/login')}
                  >
                    去登录
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Grid
          columns={3}
          style={{ '--gap-vertical': '30px' }}
          className="memus"
        >
          {menus.map((item) => (
            <Grid.Item key={item.id}>
              <div
                className="menuItem"
                onClick={() => item.to && history.push(item.to)}
              >
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            </Grid.Item>
          ))}
        </Grid>

        <div className="ad">
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>

        <Modal
          visible={visible}
          content='您是否退出登录？'
          closeOnMaskClick={true}
          onClose={() => {
            this.setState({
              visible: false
            })
          }}
          actions={[
            {
              key: 'confirm',
              text: '退出登录',
              onClick: this.confirmLogout
            },
          ]}
        />
      </div>
    )
  }
}
