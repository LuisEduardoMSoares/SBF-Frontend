import Product from "models/product";
import { NextApiRequest, NextApiResponse } from "next";
import api, { applyHeaders } from "utils/serverApi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if(!applyHeaders(req)) {
    res.status(400).json({'details':'Requisição não permitida'})
    return false
  }

  switch(req.method) {
    case 'GET':
      api.get('/products')
      .then(response => {
        const productList:Product[] = response.data
        res.status(response.status).json(productList)
      })
      .catch(error => {
        res.status(error.response.status).json(error.response.data)
      })
    break;
    case 'POST':
      const newProduct:Product = req.body;
      api.post('/products', newProduct)
      .then(response => {
        res.status(response.status).json(response.data)
      })
      .catch(error => {
        res.status(error.response.status).json(error.response.data)
      })
    break;
  }
}