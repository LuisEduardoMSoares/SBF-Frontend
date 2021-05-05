import metaData from "./metadata";

export default interface Transaction {
  id?: number
  type: transactionType
  date: Date
  products: transactionProduct[]
  description?: string
  provider_id?: number|string
  metadatetime?: metaData
}

export type transactionType = "ENTRADA" | "SAIDA"

export interface transactionProduct {
  product_id?: number|string,
  quantity?: number|string
}