import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import HousePackage from '../../components/HousePackage'
import { List, ImageUploader, TextArea, Grid, Picker, Toast } from 'antd-mobile'
import axios from 'axios'
import './index.scss'

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' },
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' },
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' },
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)
    const { state } = props.location
    const community = {
      name: '',
      id: '',
    }
    if (state) {
      // 有小区信息数据，存储到状态中
      community.name = state.name
      community.id = state.id
    }

    this.state = {
      // 临时图片地址
      tempSlides: [],
      // 小区的名称和id
      community,
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: '',

      // 房屋类型
      roomTypeVisible: false,
      // 楼层
      floorVisible: false,
      // 朝向
      orientedVisible: false,
    }
  }

  getValue = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  // 图片上传
  imageUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await axios.post('/houses/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    let houseImg = `${this.state.houseImg}|${res.body[0]}`
    if(houseImg.substr(0, 1) === "|") {
      houseImg = houseImg.substr(1)
    }
    this.setState({
      houseImg
    })
    return {
      url: URL.createObjectURL(file),
    }
  }

  // 发布房源
  addHouse = async () => {
    const { 
      title, 
      description,
      houseImg,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community
    } = this.state
    const body = {
      title, 
      description,
      houseImg,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community: community.id
    }
    const res = await axios.post('/user/houses', body)
    console.log(res)
    if(res.status === 200) {
      Toast.show({
        content: '房源发布成功',
        duration: 1000,
      })
      this.props.history.push('/rent')
    }else {
      Toast.show({
        content: '登录超时，请重新登录',
        duration: 1000,
      })
      this.props.history.replace({
        pathname: '/login',
        state: { from: this.props.location }
      })
    }
  }

  render() {
    const {
      community,
      tempSlides,
      roomType,
      price,
      size,
      title,
      description,
      floor,
      oriented,
      roomTypeVisible,
      orientedVisible,
      floorVisible,
    } = this.state
    const { history } = this.props
    return (
      <div className="rent-add">
        <NavHeader title="发布房源" />

        <List header="房源信息">
          <List.Item
            extra={community.name || '请选择所在小区'}
            clickable
            onClick={() => history.push('/rent/search')}
          >
            小区名称
          </List.Item>
          <List.Item extra="￥/月" clickable>
            <span>租<i /> <i />金</span>
            <input
              placeholder="请输入租金/月"
              value={price}
              onChange={(e) => this.getValue('price', e.target.value)}
            />
          </List.Item>
          <List.Item extra="㎡" clickable>
            <span>建筑面积</span>
            <input 
              placeholder="请输入建筑面积"
              value={size}
              onChange={(e) => this.getValue('size', e.target.value)}
            />
          </List.Item>
          <List.Item
            extra={roomTypeData.find(v => v.value === roomType)?.label || "请选择"}
            clickable
            onClick={() => this.setState({ roomTypeVisible: true })}
          >
            <span>户<i /><i />型</span>
          </List.Item>
          <List.Item
            extra={floorData.find(v => v.value === floor)?.label || "请选择"}
            clickable
            onClick={() => this.setState({ floorVisible: true })}
          >
            所在楼层
          </List.Item>
          <List.Item
            extra={orientedData.find(v => v.value === oriented)?.label || "请选择"}
            clickable
            onClick={() => this.setState({ orientedVisible: true })}
          >
            <span>朝<i /><i />向</span>
          </List.Item>
        </List>

        <List header="房屋标题" className="house-title">
          <List.Item>
            <input 
              placeholder="请输入标题 (例如：整租 小区名 2室 5000元)"
              value={title}
              onChange={(e) => this.getValue('title', e.target.value)}
            />
          </List.Item>
        </List>

        <List header="房屋图像" className="house-picture">
          <ImageUploader
            className='upload-img'
            deletable={false}
            value={tempSlides}
            onChange={(picArr) => this.setState({ tempSlides: picArr })}
            upload={this.imageUpload}
          />
        </List>

        <List header="房屋配置">
          <List.Item>
            <HousePackage 
              select={true} 
              onSelect={(arr) => this.getValue('supporting', arr.join('|'))}
            />
          </List.Item>
        </List>

        <List header="房屋描叙" className="house-desc">
          <List.Item>
            <TextArea 
              placeholder="请输入房屋描叙信息"
              value={description}
              onChange={(value) => this.getValue('description', value)}
            />
          </List.Item>
        </List>

        <Grid columns={2} className="house-btn">
          <Grid.Item className="cancel" onClick={this.onCancel}>
            取消
          </Grid.Item>
          <Grid.Item className="confirm" onClick={this.addHouse}>
            提交
          </Grid.Item>
        </Grid>

        {/* 户型弹窗 */}
        <Picker
          columns={[roomTypeData]}
          visible={roomTypeVisible}
          onClose={() => {
            this.setState({ roomTypeVisible: false })
          }}
          value={[roomType]}
          onConfirm={(v) => {
            this.getValue('roomType', v[0])
          }}
        />
        {/* 楼层弹窗 */}
        <Picker
          columns={[floorData]}
          visible={floorVisible}
          onClose={() => {
            this.setState({ floorVisible: false })
          }}
          value={[floor]}
          onConfirm={(v) => {
            this.getValue('floor', v[0])
          }}
        />
        {/* 朝向弹窗 */}
        <Picker
          columns={[orientedData]}
          visible={orientedVisible}
          onClose={() => {
            this.setState({ orientedVisible: false })
          }}
          value={[oriented]}
          onConfirm={(v) => {
            this.getValue('oriented', v[0])
          }}
        />
      </div>
    )
  }
}
