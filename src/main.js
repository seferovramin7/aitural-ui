import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import axios from 'axios'

// Configure Axios globally
axios.interceptors.request.use(config => {
  // Replace all headers with only the ones we need
  config.headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  return config;
}, error => {
  return Promise.reject(error);
});

// Create and mount the Vue app
createApp(App).mount('#app') 