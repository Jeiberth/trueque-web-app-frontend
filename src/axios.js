// src/axios.js

import axios from 'axios'
import store from '/src/store'  // Make sure to import the Vuex store
import router from '/src/router';  // Vue Router

const axiosInstance = axios.create({
  baseURL: 'https://5838-70-50-249-144.ngrok-free.app/api/',  // Example base URL
  headers: {
    'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": true,
  }
})

// Add a request interceptor to add the token (if any) to the headers
axiosInstance.interceptors.request.use((config) => {
  // Access the token from the Vuex store state
  const token = store.state.token || localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Add a response interceptor to return only the data part of the response
axiosInstance.interceptors.response.use((response) => {
    return response.data;  // Here we return only the `data` part of the response
  }, (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');  // Remove token from localStorage

      router.push('/login');  // Adjust to your login route path
      return Promise.reject(error);  // Optionally handle rejection for other parts of the app
    }
    return Promise.reject(error);
  });

export default axiosInstance;


/*

  <meta name="robots" content="noindex,nofollow">


in-feed add

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2219376995096244"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="+5y+s5-1j-50+eq"
     data-ad-client="ca-pub-2219376995096244"
     data-ad-slot="6240019370"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

-----------------------
display add

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2219376995096244"
     crossorigin="anonymous"></script>
<!-- vertial-display-ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2219376995096244"
     data-ad-slot="7745126010"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>


script
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2219376995096244"
     crossorigin="anonymous"></script>







*/