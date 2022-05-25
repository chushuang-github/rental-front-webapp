import axios from "axios";
import { BASE_URL } from './url'
import { getToken, removeToken } from '../utils/auth'

axios.defaults.baseURL = BASE_URL

axios.interceptors.request.use(config => {
  const { url } = config
  if(url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/registered')) {
    config.headers.authorization = getToken()
  }
  return config
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(res => {
  if(res.data.status === 400) {
    // token失效，移除token
    removeToken()
  }
  return res.data
}, err => {
  return Promise.reject(err)
})