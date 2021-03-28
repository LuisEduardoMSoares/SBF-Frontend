import { NextApiRequest, NextApiResponse } from "next";
import api from 'utils/serverApi';

interface loginResponse {
  status: number
  data: loginResponseData
}
interface loginResponseData {
  access_token?: string|null
  detail?: string
}

const loginResponse: loginResponse = {} as loginResponse

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await api.post('/login', req.body)
  .then((response:loginResponse) => {
    res.status(response.status).json(response.data)
  })
  .catch(error => {
    res.status(error.response.status).json(error.response.data)
  })
}