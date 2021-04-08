import React, {useEffect, useState} from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Nome', width: 300 },
  { field: 'cnpj', headerName: 'CNPJ', width: 180 },
  { field: 'phone_number', headerName: 'Telefone', width: 150 },
  { field: 'email', headerName: 'E-mail', width: 300 },
  { field: 'contact_name', headerName: 'Contato', width: 300 },
];

async function getAllProviders(setProviders) {
  var axios = require('axios');

  var config = {
    method: 'get',
    url: 'https://sbf-api.herokuapp.com/v1/providers/',
    headers: {
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmdWxhbm9Ac2JmLmNvbSIsImV4cCI6MTYxNzY3MDI3Mn0.c2mm0-gnTVjnxk_oBUzMzPrNgqfHtTEGb1VeCH2NUWU'
    }
  };

  axios(config)
    .then(function (response) {
      console.log(response.data);
      setProviders(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

}

export default function ListaFornecedores() {
  const [providers, setProviders] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    async function getProviders() {
      const localProviders = await getAllProviders(setProviders);
      console.log('P', localProviders);
    }
    getProviders();
  }, []);

  useEffect(() => {
    renderProviders();
  }, [providers]);

  const renderProviders = () => {
    const localRows = [];
    providers.forEach(({name, contact_name, email, id, cnpj, phone_number}) => {
      localRows.push(
        { id, name, cnpj, phone_number, email, contact_name }
      );
    });
    console.log('Local rows', localRows);
    setRows(localRows);
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
}
