import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, TextField } from '@material-ui/core';
import { faTshirt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListaProdutos from './ListaProdutos';
import withGuard from 'utils/withGuard';

function Produtos() {  
  return (
    <>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4" component="h1" color="primary">
          <FontAwesomeIcon size="lg" icon={faTshirt} />&nbsp;
          Produtos
        </Typography>
        <Button variant="contained" size="large" color="secondary">
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
        <ListaProdutos></ListaProdutos>
      </Box>
    </>
  );
}

export default withGuard(Produtos)
