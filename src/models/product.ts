interface productMetaDateTime {
  created_on: string
  updated_on: string
}

export default interface Product {
  id?: number
  name: string
  size: number | string
  inventory: number
  weight?: number
  metadatetime?: productMetaDateTime
}