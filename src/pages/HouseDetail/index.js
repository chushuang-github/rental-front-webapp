import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import HousePackage from '../../components/HousePackage'
import HouseItem from '../../components/HouseItem'
import { Swiper, Image, Grid, Modal, Toast } from 'antd-mobile'
import { BASE_URL } from '../../utils/url'
import axios from 'axios'
import { isAuth } from '../../utils/auth'
import './index.scss'

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    houseImg: '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房', '近地铁'],
  },
  {
    id: 2,
    houseImg: '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁', '集中供暖', '随时看房'],
  },
  {
    id: 3,
    houseImg: '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖'],
  },
]

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none',
}

export default class HouseDetail extends Component {
  state = {
    // 房屋详情
    houseInfo: {
      // 房屋图片
      houseImg: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '',
      // 房屋面积
      size: 0,
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466',
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: '',
    },
    // 是否收藏
    isFavorite: false,
    visible: false
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.getHouseDetail()
    this.checkFavorite()
  }

  // 查看房源是否收藏
  checkFavorite = async () => {
    if(!isAuth()) return
    const { id } = this.props.match.params
    const res = await axios.get(`/user/favorites/${id}`)
    if(res.status === 200) {
      const { isFavorite } = res.body
      this.setState({
        isFavorite
      })
    }
  }

  // 获取房源数据
  getHouseDetail = async () => {
    const { id } = this.props.match.params
    const res = await axios.get(`/houses/${id}`)
    this.setState({
      houseInfo: res.body,
    })
    const { community, coord } = res.body
    // 渲染地图
    this.renderMap(community, coord)
  }

  // 渲染标签
  renderTags() {
    const {
      houseInfo: { tags },
    } = this.state
    return tags.map((item, index) => {
      // 如果标签数量超过3个，后面的标签就都展示位第三个标签的样式
      let tagClass = ''
      if (index > 2) {
        tagClass = 'tag3'
      } else {
        tagClass = 'tag' + (index + 1)
      }
      return (
        <span key={item} className={'tag ' + tagClass}>
          {item}
        </span>
      )
    })
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new window.BMapGL.Map('map')
    const point = new window.BMapGL.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new window.BMapGL.Label('', {
      position: point,
      offset: new window.BMapGL.Size(0, -36),
    })

    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="mapArrow"></div>
    `)
    map.addOverlay(label)
  }

  handleFavorite = async () => {
    if(!isAuth()) {
      // 未登录
      this.setState({ visible: true })
      return
    }
    // 已经登录
    const { isFavorite } = this.state
    const { id } = this.props.match.params
    if(isFavorite) {
      // 已收藏，调用取消收藏接口
      const res = await axios.delete(`/user/favorites/${id}`)
      this.setState({ isFavorite: false })
      if(res.status === 200) {
        Toast.show({
          content: '已取消收藏',
          duration: 1000
        })
      }else {
        Toast.show({
          content: '登录超时，请重新登录',
          duration: 1000
        })
      }
    }else {
      // 未收藏，调用收藏接口
      const res = await axios.post(`/user/favorites/${id}`)
      if(res.status === 200) {
        this.setState({ isFavorite: true })
        Toast.show({
          content: '收藏成功',
          duration: 1000
        })
      }else {
        Toast.show({
          content: '登录超时，请重新登录',
          duration: 1000
        })
      }
    }
  }

  render() {
    const { houseInfo, isFavorite, visible } = this.state
    return (
      <div className="house-detail">
        {/* 导航栏 */}
        <NavHeader
          className="nav-header"
          right={<i className="iconfont icon-share"></i>}
          title={houseInfo.community}
          isShow={true}
        />

        {/* 轮播图 */}
        {houseInfo.houseImg.length > 0 && (
          <Swiper loop autoplay autoplayInterval={5000} className="swiper">
            {houseInfo.houseImg.map((src) => (
              <Swiper.Item key={src} className="swiper-item">
                <Image src={`${BASE_URL}${src}`} alt="" fit="cover" />
              </Swiper.Item>
            ))}
          </Swiper>
        )}

        {/* 房屋基础信息 */}
        <div className="info">
          <h3 className="infoTitle">{houseInfo.title}</h3>
          <div className="tags">
            <div>{this.renderTags()}</div>
          </div>

          <Grid columns={3} className="infoPrice">
            <Grid.Item className="infoPriceItem">
              <div>
                {houseInfo.price}
                <span className="month">/月</span>
              </div>
              <div>租金</div>
            </Grid.Item>
            <Grid.Item className="infoPriceItem">
              <div>{houseInfo.roomType}</div>
              <div>房型</div>
            </Grid.Item>
            <Grid.Item className="infoPriceItem">
              <div>{houseInfo.size}平米</div>
              <div>面积</div>
            </Grid.Item>
          </Grid>

          <Grid columns={2} className="infoBasic">
            <Grid.Item>
              <div>
                <span className="title">装修：</span>
                精装
              </div>
              <div>
                <span className="title">楼层：</span>
                {houseInfo.floor}
              </div>
            </Grid.Item>
            <Grid.Item>
              <div>
                <span className="title">朝向：</span>
                {houseInfo.oriented.join('、')}
              </div>
              <div>
                <span className="title">类型：</span>普通住宅
              </div>
            </Grid.Item>
          </Grid>
        </div>

        {/* 地图位置 */}
        <div className="mapp">
          <div className="mapTitle">
            小区：
            <span>{houseInfo.community}</span>
          </div>
          <div className="mapContainer" id="map">
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className="about">
          <div className="houseTitle">房屋配套</div>
          {houseInfo.supporting.length === 0 ? (
            <div className="titleEmpty">暂无数据</div>
          ) : (
            <HousePackage list={houseInfo.supporting} />
          )}
        </div>

        {/* 房屋概况 */}
        <div className="set">
          <div className="houseTitle">房源概况</div>
          <div>
            <div className="contact">
              <div className="user">
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className="useInfo">
                  <div>王女士</div>
                  <div className="userAuth">
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className="userMsg">发消息</span>
            </div>

            <div className="descText">
              {houseInfo.description || '暂无房屋描述'}
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className="recommend">
          <div className="houseTitle">猜你喜欢</div>
          <div className="items">
            {recommendHouses.map((item) => (
              <HouseItem item={item} key={item.id} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <Grid columns={3} className="fixedBottom">
          <Grid.Item onClick={this.handleFavorite}>
            <img 
              src={isFavorite ? `${BASE_URL}/img/star.png` : `${BASE_URL}/img/unstar.png`} 
              className='favoriteImg' 
              alt='收藏'
            />
            <span className='favorite'>{isFavorite ? '已收藏' : '收藏'}</span>
          </Grid.Item>
          <Grid.Item>在线咨询</Grid.Item>
          <Grid.Item>
            <span className="telephone">电话预约</span>
          </Grid.Item>
        </Grid>

        <Modal
          visible={visible}
          content='登录后才能收藏房源，是否去登录？'
          closeOnMaskClick={true}
          onClose={() => {
            this.setState({
              visible: false
            })
          }}
          actions={[
            {
              key: 'confirm',
              text: '去登录',
              onClick: () => {
                this.props.history.push({
                  pathname: '/login',
                  state: { from: this.props.location }
                })
              }
            },
          ]}
        />
      </div>
    )
  }
}
