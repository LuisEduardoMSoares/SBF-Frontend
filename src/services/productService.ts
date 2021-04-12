import Product from "models/product";
import api from "utils/clientApi";
interface productsPagedResponse {
  pagination_metadata: {
    page: number,
    per_page: number,
    page_count: number,
    total_count: number,
    links: object
  },
  records: Product[]
}

const productService = {
  async list(): Promise<Product[]> {
    let productList: Product[] = [];
    try {
      const result = await api.get("/products");
      productList = result.data.records;
      return productList;
    } catch (error) {
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
  ): Promise<productsPagedResponse> {
    if(page === 0) page = 1;
    try {
      const result = await api.get(`/products/page/${page}`, {
        params: { per_page: pageSize, name: name },
      });
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  async getOne(productId: number): Promise<Product> {
    try {
      const result = await api.get<Product>(`/products/${productId}`);
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  async save(product: Product): Promise<Product> {
    try {
      const newProduct: Product = product.id
        ? await api.patch(`/products/${product.id}`, product)
        : await api.post("/products", product);
      return newProduct;
    } catch (error) {
      throw new Error(error);
    }
  },

  async delete(product: Product): Promise<Product> {
    try {
      return await api.delete(`/products/${product.id}`);
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default productService;
