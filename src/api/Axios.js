import axios from 'axios'

const Axios = axios.create({

  baseURL: 'http://175.24.198.84:2999/api/private/v1',
  timeout: 10000,
  responseType: 'json',
  // withCredentials: true,
  method: 'get',
  headers: {
    'Content-Type': 'application/json'
  },

})

export default Axios