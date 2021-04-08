import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, TextField } from '@material-ui/core';
import { faTshirt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withGuard from 'utils/withGuard';
import Provider from 'models/provider';
import providerService from 'services/providerService';
import useModal from 'hooks/useModal';

const Lista = dynamic(
  () => import('components/fornecedores/Lista'),
  { ssr: false }
)

const Cadastro = dynamic(
  () => import('components/fornecedores/Cadastro'),
  { ssr: false }
)

function Produtos() {
  const { toggleModal } = useModal();
  const [providerList, setProviderList] = useState([] as Provider[])

  function insertProvider() {
    toggleModal(
      { 
        title: "Cadastro de Fornecedores",
        content: (
          <Cadastro />
        )
      }
    )
  }

  useEffect(() => {
    providerService.list()
    .then(response => {
      if(response) setProviderList(response.records)
    })
  }, [])

  return (
    <>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4" component="h1" color="primary">
          <FontAwesomeIcon size="lg" icon={faTshirt} />&nbsp;
          Fornecedores
        </Typography>
        <Button variant="contained" size="large" color="secondary" onClick={insertProvider}>
          + Adicionar Fornecedor
        </Button>
      </Box>

      <TextField
        id="filled-full-width"
        label="Pesquisar"
        placeholder="Pesquisar por Nome do Fornecedor, E-mail, CNPJ, etc."
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
      />

      <Box my={4}>
        <Lista list={providerList}></Lista>
      </Box>
    </>
  );
}

export default withGuard(Produtos)
