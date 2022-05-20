import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080'

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