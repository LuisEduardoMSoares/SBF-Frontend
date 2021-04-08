import Provider from 'models/provider';
import api from 'utils/clientApi'

const providerService = {
  async list() {
    let providerList:Provider[] = []
    try {
      const result = await api.get('/providers')
      providerList = result.data
      return providerList
    } catch(error) {
      console.error(error)
    }
  },
  
  async insert(provider: Provider) {
    try {
      await api.post('/providers', provider)
    } catch(error) {
      console.error(error)
    }
  }
}

export default providerService