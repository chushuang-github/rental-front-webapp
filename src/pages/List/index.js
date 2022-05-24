import React, { Component } from 'react'
import SearchHeader from '../../components/SearchHeader'
import HouseItem from '../../components/HouseItem'
import Filter from './components/Filter'
import Sticky from '../../components/sticky'
import NoHouse from '../../components/NoHouse'
import { getCurrentCity } from '../../utils/get-current-city'
import { Toast, Skeleton } from 'antd-mobile'
import axios from 'axios'

// 网址：https://github.com/bvaughn/react-virtualized
// react-virtualized：实现长列表渲染(这个库里面有很多内置组件，自己去学习)
// List列表：默认情况下面，列表只能在List组件内部进行滚动
// WindowScroller：让列表可以跟随页面进行滚动(看需求决定使不使用)
// AutoSizer：自动计算出当前页面可用的width和height给List组件使用
// InfiniteLoader：无限加载组件(实现上拉加载更多的效果)
import {
  List,
  WindowScroller,
  AutoSizer,
  InfiniteLoader,
} from 'react-virtualized'
// 引入react-virtualized样式
import 'react-virtualized/styles.css'

import './index.scss'

export default class HouseList extends Component {
  state = {
    currentCityName: '上海',
    currentCityId: '',
    list: [],
    count: 0,
    isLoading: false,
  }
  // 城市列表的查询条件
  filters = {}
  componentDidMount() {
    getCurrentCity().then((res) => {
      this.setState(
        {
          currentCityName: res.label,
          currentCityId: res.value,
        },
        () => {
          this.searchHouseList()
        }
      )
    })
  }

  onFilter = (filters) => {
    this.filters = filters
    this.searchHouseList()
    // 页面回到顶部
    window.scrollTo(0, 0)
  }

  searchHouseList = async () => {
    this.setState({ isLoading: true })
    Toast.show({
      duration: 0,
      icon: 'loading',
      content: '加载中…',
    })
    const { currentCityId } = this.state
    const res = await axios.get('/houses', {
      params: {
        cityId: currentCityId,
        ...this.filters,
        start: 1,
        end: 20,
      },
    })
    const { count, list } = res.body
    this.setState({
      count,
      list,
      isLoading: false,
    })
    Toast.clear()
    if (count > 0) {
      Toast.show({
        content: `共找到${count}套房源`,
        duration: 1500,
      })
    }
  }

  // 判断城市列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }
  // 用来获取更多房屋列表的数据
  // ({ startIndex: number, stopIndex: number }): Promise
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise((resolve, reject) => {
      // 数据加载完成时，调用resolve方法
      axios
        .get('/houses', {
          params: {
            cityId: this.state.currentCityId,
            ...this.filters,
            start: startIndex,
            end: stopIndex,
          },
        })
        .then((res) => {
          this.setState({
            list: [...this.state.list, ...res.body.list],
          })
          // 调用resolve，表示数据加载完成
          // 回去调用List组件里面传入的rowRenderer方法
          resolve()
        })
    })
  }

  rowRenderer = ({
    key, // 每一行的key
    index, // 索引
    isScrolling, // 列表是否在滚动
    isVisible, // 当前行在列表中是否可见
    style, // 重点属性，指定每一行的位置(每一行一定要添加该样式)
  }) => {
    const { list } = this.state
    const house = list[index]
    // house值如果不存在，就使用骨架屏组件进行占位
    if (!house) {
      return (
        <div key={key} style={style}>
          <Skeleton.Title animated className="loading" />
        </div>
      )
    }
    // 传给HouseItem组件的style属性，在HouseItem组件的根标签上面要使用一下
    return (
      <HouseItem 
        key={key} 
        style={style} 
        item={house} 
        onClick={() => this.props.history.push(`/detail/${house.houseCode}`)} 
      />
    )
  }

  renderList = () => {
    const { count, isLoading } = this.state
    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }

    // List：默认只能在List组件设置的height高度区域进行滚动
    // 使用WindowScroller，可以让List跟随页面滚动
    // WindowScroller组件没有提供width，所以使用AutoSizer组件提供
    return (
      <InfiniteLoader
        // 表示每一行数据是否加载完成
        isRowLoaded={this.isRowLoaded}
        // 加载更多数据的方法(这个方法的返回值是一个Promise对象)
        loadMoreRows={this.loadMoreRows}
        // 列表数据总条数
        rowCount={count}
        // 每次加载多少条数据(默认是10条)
        minimumBatchSize={20}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    // 让List组件高度变成WindowScroller提供的整个页面的高度
                    // 页面的高度是会发生变化的，所以高度要跟随页面变化
                    autoHeight
                    // react-virtualized里面List组件只渲染视口中的出现的元素
                    // width和height设置当前视口的高度和宽度
                    width={width}
                    height={height}
                    // isScrolling：是否滚动中，用来覆盖List组件自身的滚动状态
                    isScrolling={isScrolling}
                    // scrollTop：滚动的距离，用来同步List组件的滚动距离
                    scrollTop={scrollTop}
                    rowCount={count} // List列表项的总函数
                    rowHeight={120} // List列表每一行的高度
                    rowRenderer={this.rowRenderer} // List列表渲染每一行的方法
                    onRowsRendered={onRowsRendered} // 当前这一行是否渲染完成
                    ref={registerChild} // 让InfiniteLoader组件获取List组件实例
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }

  render() {
    const { currentCityName } = this.state
    const { history } = this.props
    return (
      <div className="list">
        <div className="list-search">
          <i className="iconfont icon-back" onClick={() => history.go(-1)}></i>
          <SearchHeader cityName={currentCityName} className="searchHeader" />
        </div>
        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        <div className="houseItems">{this.renderList()}</div>
      </div>
    )
  }
}
