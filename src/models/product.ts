interface productMetaDateTime {
  created_on: Date
  updated_on: Date
}

export default interface Product {
  id?: number
  name: string
  size: number | string
  inventory: number
  weight?: number
  metadatetime?: productMetaDateTime
}