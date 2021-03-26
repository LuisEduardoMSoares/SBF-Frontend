import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, TextField } from '@material-ui/core';
import { faTruckMoving } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListaFornecedores from './ListaFornecedores';
import withAuth from 'utils/withAuth';

function Fornecedores() {  
  return (
    <>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4" component="h1" color="primary">
          <FontAwesomeIcon size="lg" icon={faTruckMoving} />&nbsp;
          Fornecedores
        </Typography>
        <Button variant="contained" size="large" color="secondary">
          + Adicionar Fornecedor
        </Button>
      </Box>

      <TextField
        id="filled-full-width"
        label="Pesquisar"
        placeholder="Pesquisar por Nome do Fornecedor, Contatos, E-mail etc."
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
      />

      <Box my={4}>
        <ListaFornecedores />
      </Box>
    </>
  );
}

export default withAuth(Fornecedores);
