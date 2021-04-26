import React, {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, TextField } from '@material-ui/core';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withGuard from 'utils/withGuard';

import Paper from '@material-ui/core/Paper';
import { RowDetailState } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui';

const RowDetail = ({ row }) => {
  console.log(row);
  return (
  <div>
    Details for
    {' '}
    {row.name}
    {' '}
    from
    {' '}
    {row.city}
  </div>
)};

function Estoque() {  
  const [columns] = useState([
    { name: 'name', title: 'Produto' },
    { name: 'quantity', title: 'Quantidade Disponível' },
    { name: 'update_date', title: 'Últ. Atualização'}
  ]);
  const [rows] = useState([
    { name: "Camisa Preta P", quantity: 20, update_date: null },
    { name: "Camisa Preta M", quantity: 50, update_date: null },
    { name: "Camisa Preta G", quantity: 30, update_date: null },
    { name: "Camisa Preta GG", quantity: 50, update_date: null },
    { name: "Camisa Preta XGG", quantity: 60, update_date: null }
  ]);
  const [expandedRowIds, setExpandedRowIds] = useState<(string|number)[]>([2, 5]);
  
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
        <Paper>
          <Grid
            rows={rows}
            columns={columns}
          >
            <RowDetailState
              defaultExpandedRowIds={[2, 5]}
            />
            <Table />
            <TableHeaderRow />
            <TableRowDetail
              contentComponent={RowDetail}
            />
          </Grid>
        </Paper>
      </Box>
    </>
  );
}

export default withGuard(Estoque)