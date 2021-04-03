import axios from 'axios';
import { NextApiRequest } from 'next';

const api = axios.create({ baseURL: process.env.API_URL })

export function applyHeaders(req: NextApiRequest) {
  let authHeader = ''
  if(req.headers?.authorization) {
    authHeader = req.headers?.authorization
  }
  else {
    let accessToken = req.headers?.cookie?.replace('accessToken=','')
    authHeader = `Bearer ${accessToken}`
  }
  api.defaults.headers.common.Authorization = authHeader  
  return !!authHeader
}

export default api