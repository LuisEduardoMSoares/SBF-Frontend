import metaData from "./metadata";

export default interface Transaction {
  id?: number
  type: transactionType
  date: Date
  products: transactionProduct[]
  description?: string
  provider_id?: number|string
  provider_name?: string
  metadatetime?: metaData
}

export type transactionType = "ENTRADA" | "SAIDA"

export interface transactionProduct {
  product_id?: number|string,
  product_name?: string,
  product_size?: string,
  quantity?: number|string
}