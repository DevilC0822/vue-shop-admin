import Axios from "./Axios";
import vue from "vue"


Axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
vue.prototype.$http = Axios
