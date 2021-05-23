import api from 'utils/clientApi'
import Cookie from 'js-cookie'
import { addDays } from 'date-fns'

interface loginResponse {
  access_token: string,
  token_type: string,
  admin: boolean
}

const authService = {
  async signIn(username: string, password: string): Promise<loginResponse> {
    const result = await api.post('/login', {
      username,
      password
    })
    .then(response => {
      const { access_token: accessToken, admin: isAdmin } = response.data
      Cookie.set("accessToken", accessToken ? accessToken : null, {
        expires: addDays(new Date(), 1)
      })
      if(isAdmin) {
        Cookie.set("isAdmin", isAdmin, {
          expires: addDays(new Date(), 1)
        })
      } else {
        Cookie.remove("isAdmin");
      }

      return response.data
    })

    return result
  },

  async signOut() {
    Cookie.remove("accessToken")
    Cookie.remove("isAdmin")
  }
}

export default authService