import Provider from 'models/provider';
import api from 'utils/clientApi';
interface providersPagedResponse {
  pagination_metadata: {
    page: number,
    per_page: number,
    page_count: number,
    total_count: number,
    links: object
  },
  records: Provider[]
}

const providerService = {
  async list(): Promise<Provider[]> {
    let providerList:Provider[] = []
    try {
      const result = await api.get('/providers');
      providerList = result.data.records;
      return providerList;
    } catch(error) {
      throw new Error(error);
    }
  },

  async fetch(
    {
      page,
      pageSize,
      name,
    }: { page: number; pageSize: number; name?: string } = {
      page: 1,
      pageSize: 20
    }
  ): Promise<providersPagedResponse> {
    page = page === 0 ? 1 : page + 1;
    try {
      const result = await api.get(`/providers/page/${page}`, {
        params: { per_page: pageSize, name: name },
      });
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  async getOne(providerId: number): Promise<Provider> {
    try {
      const result = await api.get<Provider>(`/providers/${providerId}`);
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },
  
  async insert(provider: Provider) {
    try {
      console.log(provider, 'ProviderUpdate');
      // return;
      const newProvider: Provider = provider.id ? 
      await api.patch(`/providers/${provider.id}`, provider) :
      await api.post('/providers', provider);
      return newProvider;
    } catch(error) {
      console.error(error)
    }
  },

  async delete(provider: Provider) {
    try {
      const result = await api.delete(`/providers/${provider.id}`);
      return result.data;
    } catch(error) {
      console.error(error)
    }
  }
}

export default providerService