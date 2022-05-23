import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import axios from 'axios'
import { BASE_URL } from '../../utils/url'
import './index.scss'

// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class Map extends Component {
  state = {
    houseList: [],
    isShowList: false
  }
  componentDidMount() {
    this.initMap()
  }
  componentWillUnmount() {
    Toast.clear()
  }

  // 初始化地图
  initMap = () => {
    // 获取当前城市
    const { label: position, value: areaId } = JSON.parse(localStorage.getItem('hkzf_city'))
    // 下面配置在百度地图开发平台中都可以查到
    // 初始化地图实例
    // index.html文件中通过script标签引入了一个js文件，所以全局是有BMapGL对象的
    // 全局对象是挂载在window身上的，react脚手架里面全局对象需要通过window使用
    const map = new window.BMapGL.Map("container")
    this.map = map
    // 设置中心点坐标
    // const point = new window.BMapGL.Point(116.404, 39.915)
    // 地图初始化，同时设置地图展示级别
    // map.centerAndZoom(point, 15)

    // 创建地址解析器实例 (正/逆地址解析)
    const myGeo = new window.BMapGL.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(position, async (point) => {
      if(point){
        map.centerAndZoom(point, 11)

        // 添加地图控件
        // 开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true)
        // 添加比例尺控件
        const scaleCtrl = new window.BMapGL.ScaleControl()
        map.addControl(scaleCtrl)
        // 添加缩放控件
        const zoomCtrl = new window.BMapGL.ZoomControl()
        map.addControl(zoomCtrl)

        // 调用renderOverlays方法
        this.renderOverlays(areaId)
      }
    }, position)

    // 监听地图moveStart事件，在地图移动的时候，隐藏房源列表
    this.map.addEventListener('movestart', () => {
      if(this.state.isShowList) {
        this.setState({
          houseList: [],
          isShowList: false
        })
      }
    })
  }

  // 渲染覆盖物方法
  // 1).接收区域id参数，根据该参数获取房源数据
  // 2).获取房源类型以及下级地图缩放级别
  renderOverlays = async (id) => {
    try {
      Toast.show({
        duration: 0,
        icon: 'loading',
        content: '加载中…',
      })
      const res = await axios.get(`/area/map?id=${id}`)
      Toast.clear()
      const data = res.body
  
      // 获取地图的缩放级别和类型
      const { nextZoom, type } = this.getTypeAndZoom()
  
      data.forEach(item => {
        // 创建覆盖物
        this.createOverlays(item, nextZoom, type)
      })
    } catch(err) {
      Toast.clear()
    }
  }

  // 计算要绘制的覆盖物类型和下一个缩放级别(第一次的时候缩放级别是11)
  // 区   -> 11 ，范围：>=10 <12
  // 镇   -> 13 ，范围：>=12 <14
  // 小区 -> 15 ，范围：>=14 <16
  getTypeAndZoom = () => {
    // 调用地图的getZoom()获取当前的缩放级别
    const zoom = this.map.getZoom()
    // 下一级的缩放级别 和 当前级别的类型
    let nextZoom, type

    if(zoom >= 10 && zoom < 12) {
      // 区
      nextZoom = 13
      type = 'circle'
    }else if(zoom >= 12 && zoom < 14) {
      // 镇
      nextZoom = 15
      type = 'circle'
    } else if(zoom >= 14 && zoom < 16) {
      // 小区
      type = 'rect'
    }

    return {
      nextZoom,
      type
    }
  }

  // 创建覆盖物：根据传入的类型等相关的数据，调用相应的方法创建覆盖物，并提供参数
  createOverlays = (data, nextZoom, type) => {
    // 数据：longitude经度，latitude纬度
    const { 
      coord: { longitude, latitude },
      label: areaName,
      count,
      value: areaId
    } = data
    // 地图坐标
    const areaPoint = new window.BMapGL.Point(longitude, latitude)

    if(type === 'circle') {
      // 区、镇
      this.createCircle(areaPoint, areaName, count, areaId, nextZoom)
    }else {
      // 小区
      this.createRect(areaPoint, areaName, count, areaId)
    }
  }

  // 创建区、镇覆盖物
  createCircle = (areaPoint, areaName, count, areaId, nextZoom) => {
    // 创建文本标注对象
    const opts = {
      // 指定文本标注所在的地理位置
      position: areaPoint,
      // 设置文本偏移量
      offset: new window.BMapGL.Size(-35, -35)
    }
    const label = new window.BMapGL.Label('', opts)
    // 给label对象添加一个唯一标识(后面点击的时候需要区分点击的是哪一个)
    label.id = areaId
    // 设置文本标注的内容，支持HTML(设置的是纯html，使用class，不要使用className)
    label.setContent(`
      <div class='bubble'>
        <p class='name'>${areaName}</p>
        <p>${count}套</p>
      </div>
    `)
    // 自定义文本标注样式
    label.setStyle(labelStyle)
    // 文本标注添加点击事件(点击的时候，获取该区域的房源信息并添加新的标注，放大地图)
    label.addEventListener('click', (e) => {
      // 设置新的中心点，并且放大地图
      this.map.centerAndZoom(areaPoint, nextZoom)
      // 清除标注物
      this.map.clearOverlays()
      this.renderOverlays(e.target.id)
    })
    this.map.addOverlay(label)
  }

  // 创建小区覆盖物
  createRect = (areaPoint, areaName, count, areaId) => {
    // 创建文本标注对象
    const opts = {
      // 指定文本标注所在的地理位置
      position: areaPoint,
      // 设置文本偏移量
      offset: new window.BMapGL.Size(-50, -28)
    }
    const label = new window.BMapGL.Label('', opts)
    // 给label对象添加一个唯一标识(后面点击的时候需要区分点击的是哪一个)
    label.id = areaId
    // 设置文本标注的内容，支持HTML(设置的是纯html，使用class，不要使用className)
    label.setContent(`
      <div class='rect'>
        <span class='housename'>${areaName}</span>
        <span class='housenum'>${count}套</span>
        <i class='arrow'></i>
      </div>
    `)
    // 自定义文本标注样式
    label.setStyle(labelStyle)
    // 文本标注添加点击事件(点击的时候，获取该区域的房源信息并添加新的标注，放大地图)
    label.addEventListener('click', (e) => {
      // 获取房源数据，展示房源数据列表
      this.getHouseList(areaId)

      // 调用地图panBy()方法，移动标注到地图中心位置
      // panBy(x: Number, y: Number)
      // 将地图在水平位置上移动x像素，垂直位置上移动y像素
      // 如果指定的像素大于可视区域范围或者在配置中指定没有动画效果，则不执行滑动效果
      // 水平x：window.innerHeight / 2 - targetDOM.clientX
      // 垂直y：(window.innerHeight - 330) / 2 - targetDOM.clientY
      const { clientX, clientY } = e.domEvent.changedTouches[0]
      const x = window.innerWidth / 2 - clientX
      const y = (window.innerHeight - 330) / 2 - clientY
      this.map.panBy(x, y)
    })
    this.map.addOverlay(label)
  }

  // 获取小区房源数据
  getHouseList = async (id) => {
    try {
      Toast.show({
        duration: 0,
        icon: 'loading',
        content: '加载中…',
      })
      const res = await axios.get(`houses?cityId=${id}`)
      Toast.clear()
      this.setState({
        houseList: res.body.list,
        isShowList: true
      })
    } catch(err) {
      Toast.clear()
    }
  }


  render() {
    const { houseList, isShowList} = this.state
    return (
      <div className='map'>
        <NavHeader title="地图找房" />
        <div id="container"></div>

        {/* 房源列表 */}
        <div className={['houseList', isShowList ? 'show' : ''].join(' ')}>
          <div className='titleWrap'>
            <h1 className='listTitle'>房屋列表</h1>
            <Link className='titleMore' to='/home/list'>更多房源</Link>
          </div>

          <div className='houseItems'>
            {
              houseList.map(item => (
                <HouseItem item={item} />
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}
