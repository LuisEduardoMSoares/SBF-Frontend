import axios from 'axios';
import Swal from 'sweetalert2';
import NProgress from 'nprogress';

const api = axios.create({ baseURL: 'https://sbf-frontend.herokuapp.com/api' })

api.interceptors.request.use(async (config) => {
  NProgress.start()
  return config
}, (error) => {
  NProgress.done()
  return Promise.reject(error);
})

api.interceptors.response.use((response) => {
  NProgress.done()
  return response
}, (error) => {
  NProgress.done()
  if(error.response.status === 401) {
    const requestConfig = error.config;
    if(!requestConfig.url.endsWith('login')) {
      Swal.fire({
        title: "Sessão Expirada!",
        text: "Sua sessão expirou, por favor, efetue login novamente",
        icon: "warning",
        confirmButtonText: "OK"
      })
    }
  }

  return Promise.reject(error);
})

export default api