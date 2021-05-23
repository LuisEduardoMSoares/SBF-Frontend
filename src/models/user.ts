import metaData from "./metadata";
export default interface User {
  id?: number
  first_name: string
  last_name: string
  email: string
  admin: boolean
  password?: string
  metadatetime?: metaData
}