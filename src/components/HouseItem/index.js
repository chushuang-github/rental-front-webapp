import React, { Component } from 'react'
import { BASE_URL } from '../../utils/url'
import './index.scss'

export default class HouseItem extends Component {
  render() {
    const { item, style } = this.props
    return (
      <div className='house' key={item.houseCode} style={style}>
        <div className='imgWrap'>
          <img
            className='img'
            src={`${BASE_URL}${item.houseImg}`}
            alt=""
          />
        </div>
        <div className='content'>
          <h3 className='title'>{item.title}</h3>
          <div className='desc'>{item.desc}</div>
          <div>
            {
              item.tags.map((tag, index) => (
                <span
                  key={tag}
                  className={['tag' + (index + 1), 'tag'].join(' ')}
                >{tag}</span>
              ))
            }
          </div>
          <div className='price'>
            <span className='priceNum'>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    )
  }
}
