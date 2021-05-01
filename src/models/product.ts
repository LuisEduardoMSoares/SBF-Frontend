import metaData from './metadata';

export default interface Product {
  id?: number
  name: string
  size: number | string
  inventory: number
  weight?: number
  metadatetime?: metaData
}