import axios from 'axios';
import Swal from 'sweetalert2';
import NProgress from 'nprogress';
import Cookie from 'js-cookie'

const api = axios.create({ baseURL: 'https://sbf-api.herokuapp.com/v1/' })

api.interceptors.request.use(async (config) => {
  config.headers.Authorization =  `Bearer ${Cookie.get('accessToken')}`;
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
        title: "Acesso negado!",
        text: "Você não possui permissão para acessar o recurso solicitado. Em caso de dúvidas, contate o administrador do sistema.",
        icon: "warning",
        confirmButtonText: "OK"
      })
    }
  }

  return Promise.reject(error);
})

export default api