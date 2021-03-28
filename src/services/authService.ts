import api from 'utils/clientApi'
import Cookie from 'js-cookie'
import { addMinutes } from 'date-fns'

const authService = {
  async signIn(username: string, password: string) {
    await api.post('api/auth/login', {
      username,
      password
    })
    .then(response => {
      const accessToken = response.data?.access_token
      Cookie.set("accessToken", accessToken ? accessToken : null, {
        expires: addMinutes(new Date(), 5)
      })
    })
    .catch(error => {
      throw new Error(error.response.data.detail)
    })
  },

  async signOut() {
    Cookie.remove("accessToken")
  }
}

export default authService