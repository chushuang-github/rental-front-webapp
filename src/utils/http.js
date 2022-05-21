import axios from "axios";
import { BASE_URL } from './url'

axios.defaults.baseURL = BASE_URL

axios.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(res => {
  return res.data
}, err => {
  return Promise.reject(err)
})