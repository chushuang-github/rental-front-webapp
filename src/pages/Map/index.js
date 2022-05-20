import React, { Component } from 'react'
import './index.scss'

export default class Map extends Component {
  componentDidMount() {
    // 下面配置在百度地图开发平台中都可以查到
    // 初始化地图实例
    // index.html文件中通过script标签引入了一个js文件，所以全局是有BMapGL对象的
    // 全局对象是挂载在window身上的，react脚手架里面全局对象需要通过window使用
    const map = new window.BMapGL.Map("container")
    // 设置中心点坐标
    const point = new window.BMapGL.Point(116.404, 39.915)
    // 地图初始化，同时设置地图展示级别
    map.centerAndZoom(point, 15)
    // 开启鼠标滚轮缩放
    map.enableScrollWheelZoom(true)
    // 添加比例尺控件
    const scaleCtrl = new window.BMapGL.ScaleControl()
    map.addControl(scaleCtrl)
    // 添加缩放控件
    const zoomCtrl = new window.BMapGL.ZoomControl()
    map.addControl(zoomCtrl)
    // 添加城市列表控件
    const cityCtrl = new window.BMapGL.CityListControl()
    map.addControl(cityCtrl)
  }

  render() {
    return (
      <div className='map'>
        <div id="container"></div>
      </div>
    )
  }
}
