import api from 'utils/clientApi'
import Cookie from 'js-cookie'
import { addDays } from 'date-fns'

const authService = {
  async signIn(username: string, password: string) {
    const result = await api.post('/login', {
      username,
      password
    })
    .then(response => {
      const { access_token: accessToken } = response.data
      Cookie.set("accessToken", accessToken ? accessToken : null, {
        expires: addDays(new Date(), 1)
      })

      return response.data
    })

    return result
  },

  async signOut() {
    Cookie.remove("accessToken")
  }
}

export default authService