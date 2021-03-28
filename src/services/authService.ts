import api from 'utils/clientApi'
import Cookie from 'js-cookie'
import addMinutes from 'date-fns/addMinutes'

const authService = {
  async signIn(username: string, password: string) {
    const result = await api.post('api/auth/login', {
      username,
      password
    })
    .then(response => {
      const accessToken = response.data?.access_token
      Cookie.set("accessToken", accessToken ? accessToken : null, {
        expires: addMinutes(new Date(), 1)
      })
    })

    return result
  },

  async signOut() {
    Cookie.remove("accessToken")
  }
}

export default authService