import React, { Component } from 'react'
import { Swiper, Image, Grid  } from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import axios from 'axios'
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
import { getCurrentCity } from '../../utils/get-current-city'
import { BASE_URL } from '../../utils/url'
import './index.scss'

const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent'
  }
]

export default class Index extends Component {
  state = {
    swipers: [],
    groups: [],
    news: [],
    currentCityName: '上海'
  }
  componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()
    getCurrentCity().then(res => {
      this.setState({
        currentCityName: res.label
      })
    })
  }
  // 获取轮播图数据
  getSwipers = async () => {
    const res = await axios.get('/home/swiper')
    this.setState({
      swipers: res.body
    })
  }
  // 获取租房小组数据
  getGroups = async () => {
    const res = await axios.get('/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState({
      groups: res.body
    })
  }
  // 获取最新咨询数据
  getNews = async () => {
    const res = await axios.get('/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    this.setState({
      news: res.body
    })
  }

  render() {
    const { swipers, groups, news, currentCityName } = this.state
    const { history } = this.props
    return (
      <div>
        <div style={{ position: 'relative' }}>
          <SearchHeader cityName={currentCityName} />
          {
            swipers.length > 0 && (
              <Swiper loop autoplay autoplayInterval={5000}>
                {
                  swipers.map(item => (
                    <Swiper.Item key={item.id}>
                      <Image src={`${BASE_URL}${item.imgSrc}`} alt={item.alt} fit="cover" />
                    </Swiper.Item>
                  ))
                }
              </Swiper>
            )
          }
        </div>

        <Grid columns={4} className="nav">
          {
            navs.map(item => (
              <Grid.Item key={item.id} onClick={() => history.push(item.path)}>
                <img src={item.img} alt="" />
                <h2>{item.title}</h2>
              </Grid.Item>
            ))
          }
        </Grid>

        <div className='group'>
          <h3 className='group-title'>
            租房小组 <span className='more'>更多</span>
          </h3>
          <Grid columns={2} gap={8}>
            {
              groups.map(item => (
                <Grid.Item key={item.id}>
                  <div className='group-item'>
                    <div>
                      <div className='title'>{item.title}</div>
                      <div className='desc'>{item.desc}</div>
                    </div>
                  </div>
                  <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
                </Grid.Item>
              ))
            }
          </Grid>
        </div>

        <div className='news'>
          <h3 className='news-title'>
            最新咨询
          </h3>
          {
            news.map(item => (
              <div key={item.id} className='news-item'>
                <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
                <div className='news-info'>
                  <h2 className='title'>{item.title}</h2>
                  <div className='content'>
                    <span>{item.from}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}
