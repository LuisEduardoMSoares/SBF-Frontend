interface productMetaDateTime {
  created_on: string
  updated_on: string
}

export default interface Provider {
  id?: number
  name: string
  cnpj: string
  phone_number: string
  email: string,
  contact_name: string,
  metadatetime?: productMetaDateTime
}