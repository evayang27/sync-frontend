import axios from 'axios'
import _ from 'lodash'

import firebaseAuth from '@/utils/firebase'
import store from '@/store'

export function getBaseURL() {
  return process.env.VUE_APP_BASE_URL + process.env.VUE_APP_API_URL
}

export function getToken() {
  return firebaseAuth.token
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 5000
})

api.interceptors.request.use(
  (config) => {
    if (config.method !== 'post' && config.method !== 'put') return config

    if (!_.has(config, 'data')) {
      config.data = {}
    }
    config.data.token = getToken()

    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

api.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response

    // download file
    if (!response.headers['content-type'].includes('application/json')) {
      return res
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.status === 508 || res.status === 512 || res.status === 514) {
        // to re-login
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(new Error(res.data.message))
    } else {
      return Promise.resolve(res)
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export { axios, api }
