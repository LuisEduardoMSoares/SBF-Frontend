import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, TextField } from '@material-ui/core';
import { faTshirt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withGuard from 'utils/withGuard';
import Product from 'models/product';
import productService from 'services/productService';
import useModal from 'hooks/useModal';

const Lista = dynamic(
  () => import('components/Produtos/Lista'),
  { ssr: false }
)

const Cadastro = dynamic(
  () => import('components/Produtos/Cadastro'),
  { ssr: false }
)

function Produtos() {
  const { toggleModal } = useModal();
  const [productList, setProductList] = useState([] as Product[])

  function insertProduct() {
    toggleModal(
      { 
        title: "Cadastro de Produto",
        content: (
          <Cadastro />
        )
      }
    )
  }

  useEffect(() => {
    productService.list()
    .then(response => {
      if(response) setProductList(response)
    })
  }, [])

  return (
    <>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4" component="h1" color="primary">
          <FontAwesomeIcon size="lg" icon={faTshirt} />&nbsp;
          Produtos
        </Typography>
        <Button variant="contained" size="large" color="secondary" onClick={insertProduct}>
          + Adicionar Produto
        </Button>
      </Box>

      <TextField
        id="filled-full-width"
        label="Pesquisar"
        placeholder="Pesquisar por Nome do Produto, Quantidade, Fornecedor, etc."
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
      />

      <Box my={4}>
        <Lista list={productList}></Lista>
      </Box>
    </>
  );
}

export default withGuard(Produtos)
