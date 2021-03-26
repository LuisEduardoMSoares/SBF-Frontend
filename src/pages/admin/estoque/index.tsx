import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, TextField } from '@material-ui/core';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ComponentTable from 'components/Table';
import withAuth from 'utils/withAuth';

function Estoque() {  
  return (
    <>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4" component="h1" color="primary">
          <FontAwesomeIcon size="lg" icon={faBox} />&nbsp;
          Estoque
        </Typography>
        <Button variant="contained" size="large" color="secondary">
          + Movimentação
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
        <ComponentTable />
      </Box>
    </>
  );
}

export default withAuth(Estoque)