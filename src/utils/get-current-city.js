import axios from "axios"
function getCurrentCity() {
  return new Promise((resolve, reject) => {
    let hkzf_city = JSON.parse(localStorage.getItem('hkzf_city'))
    if(hkzf_city) {
      resolve(hkzf_city)
    } else {
      // 获取当前位置信息 (IP定位的方式获取位置信息)
      const myCity = new window.BMapGL.LocalCity()
      myCity.get(async res => {
        // 获取城市房源信息：百度地图的位置信息 -> 换取项目中的位置信息
        // 如果百度地图返回的当前城市有房源，我们服务器就返回该城市的信息
        // 如果百度地图返回的当前城市没有房源，我们服务器就返回一个有房源的城市的信息
        // 我们的服务器只有北京、上海、广州、深圳这4个城市的房源数据信息
        // 如果当前定位的城市，不是这4个城市，服务器默认返回上海的信息
        try {
          const cityInfo = await axios.get(`/area/info?name=${res.name}`)
          localStorage.setItem('hkzf_city', JSON.stringify(cityInfo.body))
          resolve(cityInfo.body)
        } catch(err) {
          reject(err)
        }
      })
    }
  })
}

export {
  getCurrentCity
}