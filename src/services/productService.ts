import Product from 'models/product';
import api from 'utils/clientApi'

const productService = {
  async list() {
    let productList:Product[] = []
    try {
      const result = await api.get('/products')
      productList = result.data
      return productList
    } catch(error) {
      console.error(error)
    }
  },
  
  async insert(product: Product) {
    try {
      await api.post('/products', product)
    } catch(error) {
      console.error(error)
    }
  }
}

export default productService