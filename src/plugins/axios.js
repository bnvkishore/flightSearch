import axios from 'axios'
import Vue from 'vue'

export default ({ store, app, redirect, isMobile }, inject) => {
  const instance = axios.create({
    // withCredentials: true,
    baseURL:
      'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices',
    headers: {
      'x-rapidapi-key': 'dbfea365edmsh3d3b5f922a7f34fp11cccajsn5d2f1db29a93',
      'x-rapidapi-host':
        'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
    },
    // adapter: cache.adapter
  })

  let loader = null
  instance.interceptors.request.use(
    function (config) {
      if (!loader) {
        loader = Vue.$loading.show({
          color: '#009ca6',
        })
      }

      return config
    },
    function (err) {
      return Promise.reject(err)
    }
  )

  instance.interceptors.response.use(
    function (response) {
      loader && loader.hide()
      loader = null
      return response
    },
    function (err) {
      loader && loader.hide()
      loader = null
      return Promise.reject(err)
    }
  )

  inject('axios', instance)
}
