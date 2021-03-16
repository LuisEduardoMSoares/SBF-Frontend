import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, IconButton, Paper, TextField } from '@material-ui/core';
import { faBox, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ComponentTable from 'components/Table';

export default function Index() {  
  return (
    <>
      <Box sx={{ my: 4 }} display="flex" justifyContent="space-between">
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

      <Box sx={{ my: 4 }}>
        <ComponentTable />
      </Box>
    </>
  );
}
