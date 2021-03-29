import api from 'utils/clientApi'
import Cookie from 'js-cookie'
import addMinutes from 'date-fns/addMinutes'

const authService = {
  async signIn(username: string, password: string) {
    const result = await api.post('/auth/login', {
      username,
      password
    })
    .then(response => {
      const { access_token: accessToken } = response.data
      Cookie.set("accessToken", accessToken ? accessToken : null, {
        expires: addMinutes(new Date(), 15)
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