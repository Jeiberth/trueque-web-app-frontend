// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import i18n from './i18n';

// // Import Laravel Echo and Pusher
// import Echo from 'laravel-echo'
// import Pusher from 'pusher-js'

// // Make sure Pusher is available globally
// window.Pusher = Pusher

// const token = localStorage.getItem('access_token') || store.state.token || null;
// console.log("Token loaded:", token);

// // Initialize Echo globally
// window.Echo = new Echo({
//   broadcaster: 'pusher',  // or 'redis' or 'socket.io'
//   key: import.meta.env.VITE_PUSHER_APP_KEY,
//   cluster: 'us2', // or your cluster
//   forceTLS: true,
//   authEndpoint: 'http://localhost:8000/broadcasting/auth', // This should point to your Laravel backend
//   auth: {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   },
// });

// console.log(window.Echo);

// Create and mount the Vue app
createApp(App)
  .use(store)
  .use(i18n)
  .use(router)
  .mount('#app')
