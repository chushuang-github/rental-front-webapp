// list: [{label: '南宁', value: 'AREA|2bc437ca-b3d2-5c3c', pinyin: 'nanning', short: 'nn'}, {}, {}...]
function formatCityData(list) {
  const cityList = {}
  list.forEach(item => {
    const first = item.short.substr(0, 1).toUpperCase()
    if(cityList[first]) {
      cityList[first].push(item)
    }else {
      cityList[first] = [item]
    }
  })
  const cityIndex = Object.keys(cityList).sort()
  
  return {
    cityList,
    cityIndex
  }
}

export {
  formatCityData
}